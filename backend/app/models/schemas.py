from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field

SkillLevel = Literal[1, 2, 3]

class SkillIn(BaseModel):
    name: str
    level: SkillLevel = 1

class RoleSkill(BaseModel):
    name: str
    required_level: SkillLevel

class RoleOut(BaseModel):
    role: str
    skills: List[RoleSkill]

class SkillBreakdown(BaseModel):
    skill: str
    required_level: int
    user_level: int
    gap: int
    skill_score: float
    contribution_pct: float

class CareerRec(BaseModel):
    role: str
    similarity_pct: float
    why: List[str]

class RoadmapWeek(BaseModel):
    week: int
    focus_skills: List[str]
    resources: List[Dict[str, str]]  # {title,url,type}
    mini_project: str

class AnalyzeResponse(BaseModel):
    job_role: str
    readiness_score: float
    breakdown: List[SkillBreakdown]
    gaps: Dict[str, List[Dict[str, Any]]]  # critical/moderate/ready
    recommendations: List[CareerRec]
    roadmap: List[RoadmapWeek]
    explainability: Dict[str, Any]
    history_id: int