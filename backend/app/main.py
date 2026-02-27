from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.db import init_db
from app.api.routes_auth import router as auth_router
from app.api.routes_roles import router as roles_router
from app.api.routes_analyze import router as analyze_router
from app.api.routes_history import router as history_router

app = FastAPI(title="SkillGap AI", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def on_startup():
    await init_db()

app.include_router(auth_router)
app.include_router(roles_router)
app.include_router(analyze_router)
app.include_router(history_router)