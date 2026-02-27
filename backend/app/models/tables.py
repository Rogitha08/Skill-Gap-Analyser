from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, DateTime, Text
from sqlalchemy.sql import func

class AnalysisHistory(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)

    job_role: str = Field(index=True)
    input_mode: str  # "manual" | "resume" | "mixed"

    user_skills_json: str = Field(sa_column=Column(Text, nullable=False))
    resume_text: Optional[str] = Field(default=None, sa_column=Column(Text))

    readiness_score: float
    gaps_json: str = Field(sa_column=Column(Text, nullable=False))
    breakdown_json: str = Field(sa_column=Column(Text, nullable=False))
    recommendations_json: str = Field(sa_column=Column(Text, nullable=False))
    roadmap_json: str = Field(sa_column=Column(Text, nullable=False))
    explainability_json: str = Field(sa_column=Column(Text, nullable=False))

    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column=Column(DateTime(timezone=True), server_default=func.now())
    )