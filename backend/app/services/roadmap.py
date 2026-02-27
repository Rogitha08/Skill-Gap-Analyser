# backend/app/services/roadmap.py
# Full corrected roadmap generator:
# - Track detection based on JOB ROLE NAME first (AI/ML, Design, Cloud/DevOps, Data, Web)
# - Fallback track detection based on skills if role name is unclear
# - Phase-based roadmap (Foundations → Core Skills → Applied Projects → Capstone & Interview)
# - Non-repeating weeks with realistic deliverables + unique mini projects
# - Curated free resources for common skills + safe defaults

from typing import Dict, List
import math


# Curated free resources for common skills (expand anytime)
RESOURCE_MAP = {
    "Python": [
        {"title": "Python Full Course (freeCodeCamp)", "url": "https://www.youtube.com/watch?v=rfscVS0vtbw", "type": "YouTube"},
        {"title": "Official Python Docs", "url": "https://docs.python.org/3/", "type": "Docs"},
    ],
    "SQL": [
        {"title": "SQLBolt Interactive Lessons", "url": "https://sqlbolt.com/", "type": "Practice"},
        {"title": "Khan Academy SQL", "url": "https://www.khanacademy.org/computing/computer-programming/sql", "type": "Course"},
    ],
    "Statistics": [
        {"title": "StatQuest (Statistics)", "url": "https://www.youtube.com/@statquest", "type": "YouTube"},
        {"title": "Khan Academy Statistics", "url": "https://www.khanacademy.org/math/statistics-probability", "type": "Course"},
    ],
    "Machine Learning": [
        {"title": "Machine Learning (Andrew Ng) - Audit", "url": "https://www.coursera.org/learn/machine-learning", "type": "Course"},
        {"title": "scikit-learn Tutorials", "url": "https://scikit-learn.org/stable/tutorial/", "type": "Docs"},
    ],
    "Deep Learning": [
        {"title": "Deep Learning Specialization (Audit)", "url": "https://www.coursera.org/specializations/deep-learning", "type": "Course"},
        {"title": "DeepLearning.AI YouTube", "url": "https://www.youtube.com/@DeepLearningAI", "type": "YouTube"},
    ],
    "Scikit-learn": [
        {"title": "scikit-learn User Guide", "url": "https://scikit-learn.org/stable/user_guide.html", "type": "Docs"},
        {"title": "Model Selection & Evaluation", "url": "https://scikit-learn.org/stable/model_selection.html", "type": "Docs"},
    ],
    "PyTorch": [
        {"title": "PyTorch Tutorials", "url": "https://pytorch.org/tutorials/", "type": "Docs"},
        {"title": "PyTorch Crash Course", "url": "https://www.youtube.com/results?search_query=pytorch+crash+course", "type": "YouTube"},
    ],
    "TensorFlow": [
        {"title": "TensorFlow Tutorials", "url": "https://www.tensorflow.org/tutorials", "type": "Docs"},
        {"title": "TensorFlow Crash Course", "url": "https://www.youtube.com/results?search_query=tensorflow+crash+course", "type": "YouTube"},
    ],
    "MLOps": [
        {"title": "MLOps (Google) intro", "url": "https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning", "type": "Docs"},
        {"title": "MLOps YouTube search", "url": "https://www.youtube.com/results?search_query=mlops+introduction", "type": "YouTube"},
    ],
    "Docker": [
        {"title": "Docker Docs", "url": "https://docs.docker.com/", "type": "Docs"},
        {"title": "Docker Crash Course", "url": "https://www.youtube.com/results?search_query=docker+crash+course", "type": "YouTube"},
    ],
    "Kubernetes": [
        {"title": "Kubernetes Basics", "url": "https://kubernetes.io/docs/tutorials/kubernetes-basics/", "type": "Docs"},
        {"title": "Kubernetes Crash Course", "url": "https://www.youtube.com/results?search_query=kubernetes+crash+course", "type": "YouTube"},
    ],
    "Terraform": [
        {"title": "Terraform Tutorials", "url": "https://developer.hashicorp.com/terraform/tutorials", "type": "Docs"},
        {"title": "Terraform Crash Course", "url": "https://www.youtube.com/results?search_query=terraform+crash+course", "type": "YouTube"},
    ],
    "CI/CD": [
        {"title": "GitHub Actions Docs", "url": "https://docs.github.com/en/actions", "type": "Docs"},
        {"title": "CI/CD Crash Course", "url": "https://www.youtube.com/results?search_query=ci%2Fcd+crash+course", "type": "YouTube"},
    ],
    "AWS": [
        {"title": "AWS Skill Builder (Free)", "url": "https://explore.skillbuilder.aws/learn", "type": "Course"},
        {"title": "AWS Getting Started", "url": "https://aws.amazon.com/getting-started/", "type": "Docs"},
    ],
    "Azure": [
        {"title": "Microsoft Learn - Azure", "url": "https://learn.microsoft.com/en-us/training/azure/", "type": "Course"},
        {"title": "Azure Docs", "url": "https://learn.microsoft.com/en-us/azure/", "type": "Docs"},
    ],
    "Power BI": [
        {"title": "Microsoft Learn - Power BI", "url": "https://learn.microsoft.com/en-us/training/powerplatform/power-bi/", "type": "Course"},
        {"title": "Power BI YouTube search", "url": "https://www.youtube.com/results?search_query=power+bi+dashboard+tutorial", "type": "YouTube"},
    ],
    "Figma": [
        {"title": "Figma Learn", "url": "https://help.figma.com/hc/en-us/categories/360002051613", "type": "Docs"},
        {"title": "Figma for Beginners", "url": "https://www.youtube.com/results?search_query=figma+for+beginners", "type": "YouTube"},
    ],
    "UX Research": [
        {"title": "Nielsen Norman Group: Research Methods", "url": "https://www.nngroup.com/topic/research-methods/", "type": "Articles"},
        {"title": "UX Research basics (YouTube)", "url": "https://www.youtube.com/results?search_query=ux+research+basics", "type": "YouTube"},
    ],
    "Prototyping": [
        {"title": "Prototyping in Figma (YouTube)", "url": "https://www.youtube.com/results?search_query=figma+prototyping+tutorial", "type": "YouTube"},
        {"title": "Prototype best practices", "url": "https://www.nngroup.com/articles/prototyping/", "type": "Articles"},
    ],
}


def _default_resources(skill: str) -> List[dict]:
    s = skill.replace(" ", "+")
    return [
        {"title": f"{skill} crash course (YouTube)", "url": f"https://www.youtube.com/results?search_query={s}+course", "type": "YouTube"},
        {"title": f"{skill} documentation (search)", "url": f"https://www.google.com/search?q={s}+documentation", "type": "Docs"},
    ]


def _get_resources_for_skills(skills: List[str], limit: int = 4) -> List[dict]:
    out: List[dict] = []
    for s in skills:
        out.extend(RESOURCE_MAP.get(s, _default_resources(s)))

    # remove duplicates by url
    seen = set()
    uniq = []
    for r in out:
        u = r.get("url", "")
        if not u or u in seen:
            continue
        seen.add(u)
        uniq.append(r)

    return uniq[:limit]


def _roadmap_length(gaps: Dict[str, list]) -> int:
    crit = len(gaps.get("critical", []))
    mod = len(gaps.get("moderate", []))
    weeks = 4 + (crit * 2) + math.ceil(mod * 0.75)
    return max(4, min(12, weeks))


def _gap_skills(gaps: Dict[str, list]) -> List[str]:
    ordered = [x["skill"] for x in gaps.get("critical", [])] + [x["skill"] for x in gaps.get("moderate", [])]
    seen = set()
    out = []
    for s in ordered:
        if s not in seen:
            seen.add(s)
            out.append(s)
    return out


def _detect_track_from_role(job_role: str) -> str:
    r = (job_role or "").strip().lower()

    # ML / AI
    if any(k in r for k in ["machine learning", "ml engineer", "ml", "ai engineer", "artificial intelligence", "deep learning", "nlp"]):
        return "ml"

    # UI/UX / design
    if any(k in r for k in ["ui/ux", "ui ux", "ux", "ui designer", "product designer", "ux designer", "designer"]):
        return "design"

    # Cloud / DevOps / SRE
    if any(k in r for k in ["cloud", "devops", "site reliability", "sre", "platform engineer", "infra", "infrastructure"]):
        return "cloud"

    # Data
    if any(k in r for k in ["data analyst", "business analyst", "bi developer", "power bi", "data engineer", "analytics"]):
        return "data"

    # Web dev
    if any(k in r for k in ["frontend", "front end", "backend", "back end", "full stack", "fullstack", "software engineer", "web developer"]):
        return "web"

    return "general"


def _detect_track_from_skills(skills: List[str]) -> str:
    s = set([x.lower() for x in skills])

    if any(x in s for x in ["terraform", "kubernetes", "ci/cd", "aws", "azure", "devops", "docker", "linux", "networking"]):
        return "cloud"
    if any(x in s for x in ["figma", "ui design", "ux research", "wireframing", "prototyping", "user testing", "design systems", "typography"]):
        return "design"
    if any(x in s for x in ["machine learning", "deep learning", "scikit-learn", "pytorch", "tensorflow", "feature engineering", "model evaluation", "mlops"]):
        return "ml"
    if any(x in s for x in ["power bi", "excel", "statistics", "sql", "data visualization"]):
        return "data"
    if any(x in s for x in ["react", "node.js", "express.js", "rest apis", "javascript", "html", "css"]):
        return "web"

    return "general"


def generate_roadmap(gaps: Dict[str, list], job_role: str = "") -> List[dict]:
    weeks = _roadmap_length(gaps)
    targets = _gap_skills(gaps)

    # If no gaps, still produce a realistic plan
    if not targets:
        targets = ["Portfolio", "Project", "Interview Prep", "System Thinking"]

    # Role-based track first, skill-based fallback
    track = _detect_track_from_role(job_role)
    if track == "general":
        track = _detect_track_from_skills(targets)

    plan = []
    idx = 0

    def take(n: int) -> List[str]:
        nonlocal idx
        if idx >= len(targets):
            return []
        chunk = targets[idx: idx + n]
        idx += n
        return chunk

    for w in range(1, weeks + 1):
        # phases
        if w <= 2:
            phase = "Foundations"
        elif w <= max(3, weeks - 3):
            phase = "Core Skills"
        elif w <= weeks - 1:
            phase = "Applied Projects"
        else:
            phase = "Capstone & Interview"

        # Focus skills selection:
        # - early: 2 skills/week
        # - later: 1 skill/week + more project focus
        focus = take(2) if w <= 4 else take(1)

        # If skills ran out, use phase defaults (avoid repeating the same pair)
        if not focus:
            if phase == "Applied Projects":
                focus = ["Project Implementation"]
            elif phase == "Capstone & Interview":
                focus = ["Portfolio", "Interview Prep"]
            else:
                focus = ["Revision & Practice"]

        resources = _get_resources_for_skills(focus, limit=4)

        # deliverable text
        deliverable = {
            "Foundations": "Outcome: setup complete + fundamentals practiced.",
            "Core Skills": "Outcome: core competency improved with notes + practice artifacts.",
            "Applied Projects": "Outcome: a project increment you can show on GitHub/portfolio.",
            "Capstone & Interview": "Outcome: portfolio-ready deliverable + interview-ready explanations."
        }[phase]

        # Track-specific mini projects
        if track == "cloud":
            if phase == "Foundations":
                mini = "Set up a GitHub repo, Dockerize a simple app, and write a clean README."
            elif phase == "Core Skills":
                mini = "Create a CI pipeline (GitHub Actions) that runs tests and builds a Docker image."
            elif phase == "Applied Projects":
                mini = "Provision infra with Terraform (network + compute), deploy app, and document architecture."
            else:
                mini = "Capstone: Deploy a small service using CI/CD + Terraform, include an architecture diagram."

        elif track == "design":
            if phase == "Foundations":
                mini = "Choose an app and redesign one screen with better hierarchy, spacing, and typography."
            elif phase == "Core Skills":
                mini = "Create a clickable Figma prototype and run a usability test with 3 users."
            elif phase == "Applied Projects":
                mini = "Build a UX case study: problem → research → wireframes → UI → testing → iteration."
            else:
                mini = "Capstone: Full UX case study + polished portfolio page + interview story points."

        elif track == "ml":
            if phase == "Foundations":
                mini = "Clean a dataset and build a baseline model. Track metrics and write observations."
            elif phase == "Core Skills":
                mini = "Train 2 models, compare metrics, and write evaluation + improvement plan."
            elif phase == "Applied Projects":
                mini = "Build an ML pipeline: preprocessing → training → evaluation → inference script."
            else:
                mini = "Capstone: Deploy a model as a small API and create a demo + short report."

        elif track == "data":
            if phase == "Foundations":
                mini = "Create a dataset in Excel/CSV and write 5 useful SQL queries (filters, joins, aggregations)."
            elif phase == "Core Skills":
                mini = "Build a Power BI dashboard with KPIs, slicers, and one insights page."
            elif phase == "Applied Projects":
                mini = "End-to-end analytics project: clean data → analyze → visualize → write findings."
            else:
                mini = "Capstone: Full analytics case study with dashboard screenshots + written insights."

        elif track == "web":
            if phase == "Foundations":
                mini = "Build a responsive landing page with reusable UI components and clean layout."
            elif phase == "Core Skills":
                mini = "Build a CRUD app with proper forms, validation, and error handling."
            elif phase == "Applied Projects":
                mini = "Connect frontend to backend API and add loading states, retries, and empty-state UX."
            else:
                mini = "Capstone: Deploy a full-stack app and write a clear README + demo link."

        else:
            if phase == "Foundations":
                mini = "Build a small project demonstrating fundamentals and write documentation."
            elif phase == "Core Skills":
                mini = "Implement features with tests and refactor for clean structure."
            elif phase == "Applied Projects":
                mini = "Ship a real mini app with UI + API integration + strong error handling."
            else:
                mini = "Capstone: Polish project, add portfolio notes, and practice interview Q&A."

        plan.append({
            "week": w,
            "phase": phase,
            "focus_skills": focus,
            "resources": resources,
            "mini_project": mini,
            "deliverable": deliverable
        })

    return plan