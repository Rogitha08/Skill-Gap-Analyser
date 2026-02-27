import json
from pathlib import Path
from typing import Dict, List, Tuple

DATA_DIR = Path(__file__).resolve().parents[1] / "data"
ROLES_PATH = DATA_DIR / "roles.json"

def load_roles() -> Dict[str, Dict[str, int]]:
    return json.loads(ROLES_PATH.read_text(encoding="utf-8"))

def list_roles() -> List[str]:
    return sorted(load_roles().keys())

def get_role_skills(role: str) -> Dict[str, int]:
    roles = load_roles()
    # allow “any job role”: if unknown, return empty required set
    return roles.get(role, {})