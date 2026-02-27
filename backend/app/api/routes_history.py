import json
from fastapi import APIRouter, Depends, Header, HTTPException
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.db import get_session
from app.models.tables import AnalysisHistory
from app.api.routes_auth import get_current_user_id  # ✅ JWT helper

router = APIRouter(prefix="/history", tags=["history"])


@router.get("")
async def list_history(
    session: AsyncSession = Depends(get_session),
    authorization: str | None = Header(default=None, alias="Authorization"),
):
    user_id = str(get_current_user_id(authorization))

    stmt = (
        select(AnalysisHistory)
        .where(AnalysisHistory.user_id == user_id)
        .order_by(AnalysisHistory.created_at.desc())
    )
    rows = (await session.exec(stmt)).all()

    # return small summary list
    out = []
    for r in rows:
        out.append(
            {
                "id": r.id,
                "job_role": r.job_role,
                "readiness_score": r.readiness_score,
                "input_mode": r.input_mode,
                "created_at": r.created_at.isoformat() if r.created_at else None,
            }
        )
    return out


@router.get("/{history_id}")
async def get_history_item(
    history_id: int,
    session: AsyncSession = Depends(get_session),
    authorization: str | None = Header(default=None, alias="Authorization"),
):
    user_id = str(get_current_user_id(authorization))

    stmt = select(AnalysisHistory).where(
        AnalysisHistory.id == history_id,
        AnalysisHistory.user_id == user_id,
    )
    row = (await session.exec(stmt)).first()

    if not row:
        raise HTTPException(status_code=404, detail="History item not found")

    # expand full report
    return {
        "id": row.id,
        "job_role": row.job_role,
        "input_mode": row.input_mode,
        "user_skills": json.loads(row.user_skills_json or "{}"),
        "resume_text": row.resume_text,
        "readiness_score": row.readiness_score,
        "gaps": json.loads(row.gaps_json or "[]"),
        "breakdown": json.loads(row.breakdown_json or "[]"),
        "recommendations": json.loads(row.recommendations_json or "[]"),
        "roadmap": json.loads(row.roadmap_json or "[]"),
        "explainability": json.loads(row.explainability_json or "{}"),
        "created_at": row.created_at.isoformat() if row.created_at else None,
    }