import json
from fastapi import APIRouter, Depends, File, Form, Header, UploadFile, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.db import get_session
from app.models.tables import AnalysisHistory
from app.services.role_store import get_role_skills, load_roles
from app.services.resume_parser import extract_text_from_pdf, extract_text_from_docx
from app.services.skill_extractor import load_synonyms, extract_skills_keyword, canon
from app.services.scoring import readiness, classify_gaps
from app.services.recommender import top_k_recommendations
from app.services.roadmap import generate_roadmap

from app.api.routes_auth import get_current_user_id  # ✅ JWT helper

router = APIRouter(prefix="/analyze", tags=["analyze"])


@router.post("")
async def analyze(
    job_role: str = Form(...),
    manual_skills_json: str = Form(default="[]"),   # [{"name":"Python","level":2}]
    resume_text: str = Form(default=""),
    resume_file: UploadFile | None = File(default=None),
    session: AsyncSession = Depends(get_session),

    # ✅ JWT token comes here
    authorization: str | None = Header(default=None, alias="Authorization"),
):
    # ✅ Get user_id from JWT token
    user_id = str(get_current_user_id(authorization))

    required = get_role_skills(job_role)
    all_roles = load_roles()

    # Parse manual skills
    try:
        manual_list = json.loads(manual_skills_json or "[]")
    except Exception:
        raise HTTPException(status_code=400, detail="manual_skills_json must be valid JSON")

    synonyms = load_synonyms()

    # If resume file exists, extract text
    extracted_resume_text = ""
    if resume_file is not None:
        b = await resume_file.read()
        fn = (resume_file.filename or "").lower()
        if fn.endswith(".pdf"):
            extracted_resume_text = extract_text_from_pdf(b)
        elif fn.endswith(".docx"):
            extracted_resume_text = extract_text_from_docx(b)
        else:
            # allow plain text upload too
            try:
                extracted_resume_text = b.decode("utf-8", errors="ignore")
            except Exception:
                extracted_resume_text = ""

    combined_resume = (resume_text or "").strip()
    if extracted_resume_text:
        combined_resume = (combined_resume + "\n" + extracted_resume_text).strip()

    # Build user skill dict (canonical names)
    user_skills: dict[str, int] = {}

    # 1) from manual
    for s in manual_list:
        name = canon(str(s.get("name", "")).strip(), synonyms)
        try:
            lvl = int(s.get("level", 1))
        except Exception:
            lvl = 1
        lvl = 1 if lvl < 1 else 3 if lvl > 3 else lvl  # clamp 1..3

        if name:
            user_skills[name] = max(user_skills.get(name, 0), lvl)

    # 2) from resume extraction (default level = 1)
    input_mode = (
        "manual" if user_skills and not combined_resume
        else ("resume" if combined_resume and not user_skills else "mixed")
    )

    if combined_resume:
        known_skill_vocab = sorted(
            {k for r in all_roles.values() for k in r.keys()} | set(required.keys())
        )
        extracted = extract_skills_keyword(combined_resume, known_skill_vocab, synonyms)
        for name in extracted:
            user_skills[name] = max(user_skills.get(name, 0), 1)

    # Score + gaps
    score, breakdown = readiness(required, user_skills)
    gaps = classify_gaps(required, user_skills)

    # Recommendations (top 2)
    recs = top_k_recommendations(all_roles, user_skills, k=2)

    # Roadmap 4–12 weeks
    roadmap = generate_roadmap(gaps)

    # Explainability
    explainability = {
        "readiness_formula": "For each required skill: skill_score = (min(user_level, required_level) / required_level) * 100. Final readiness score = average(skill_scores).",
        "cosine_similarity": "We convert skills into vectors across a shared skill vocabulary, then compute cosine similarity between your vector and each role’s vector.",
        "notes": [
            "Resume-extracted skills default to level 1 unless manually changed.",
            "Skill synonyms are mapped (e.g., ML → Machine Learning)."
        ]
    }

    # Save history
    row = AnalysisHistory(
        user_id=user_id,
        job_role=job_role,
        input_mode=input_mode,
        user_skills_json=json.dumps(user_skills, ensure_ascii=False),
        resume_text=combined_resume or None,
        readiness_score=float(score),
        gaps_json=json.dumps(gaps, ensure_ascii=False),
        breakdown_json=json.dumps(breakdown, ensure_ascii=False),
        recommendations_json=json.dumps(recs, ensure_ascii=False),
        roadmap_json=json.dumps(roadmap, ensure_ascii=False),
        explainability_json=json.dumps(explainability, ensure_ascii=False),
    )
    session.add(row)
    await session.commit()
    await session.refresh(row)

    return {
        "job_role": job_role,
        "readiness_score": score,
        "breakdown": breakdown,
        "gaps": gaps,
        "recommendations": recs,
        "roadmap": roadmap,
        "explainability": explainability,
        "history_id": row.id
    }