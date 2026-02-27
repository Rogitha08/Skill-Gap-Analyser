from fastapi import APIRouter
from app.services.role_store import list_roles, get_role_skills

router = APIRouter(prefix="/roles", tags=["roles"])

@router.get("")
def roles_list():
    return {"roles": list_roles()}

@router.get("/{role_name}")
def role_detail(role_name: str):
    skills = get_role_skills(role_name)
    return {"role": role_name, "skills": [{"name": k, "required_level": v} for k, v in skills.items()]}