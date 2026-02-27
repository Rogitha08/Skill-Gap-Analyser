import re, json
from pathlib import Path
from typing import Dict, List, Tuple

DATA_DIR = Path(__file__).resolve().parents[1] / "data"
SYN_PATH = DATA_DIR / "synonyms.json"

def load_synonyms() -> Dict[str, str]:
    return json.loads(SYN_PATH.read_text(encoding="utf-8"))

def normalize_token(t: str) -> str:
    t = t.strip().lower()
    t = re.sub(r"[^a-z0-9\+\#\.\- ]+", " ", t)
    t = re.sub(r"\s+", " ", t).strip()
    return t

def canon(skill: str, synonyms: Dict[str, str]) -> str:
    k = normalize_token(skill).replace(" ", "")
    if k in synonyms:
        return synonyms[k]
    # also try exact normalized token
    k2 = normalize_token(skill)
    if k2 in synonyms:
        return synonyms[k2]
    # title-case fallback
    return skill.strip()

def extract_skills_keyword(text: str, known_skills: List[str], synonyms: Dict[str, str]) -> List[str]:
    """
    Keyword extraction (simple + effective):
    - match known skill phrases in resume text
    - map synonyms like "ml" -> "Machine Learning"
    """
    text_norm = normalize_token(text)
    found = set()

    # match canonical known skills
    for s in known_skills:
        s_norm = normalize_token(s)
        if s_norm and re.search(rf"\b{re.escape(s_norm)}\b", text_norm):
            found.add(s)

    # match synonyms keys (ml, js, reactjs)
    for k, v in synonyms.items():
        k_norm = normalize_token(k)
        if k_norm and re.search(rf"\b{re.escape(k_norm)}\b", text_norm):
            found.add(v)

    return sorted(found)