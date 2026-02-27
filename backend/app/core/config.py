from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "SkillGap AI Backend"
    cors_list: str = "http://localhost:5173,http://127.0.0.1:5173"
    db_url: str = "sqlite+aiosqlite:///./skillgap.db"

settings = Settings()