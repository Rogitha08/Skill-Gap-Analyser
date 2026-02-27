from typing import Dict, List, Tuple

def readiness(required: Dict[str, int], user: Dict[str, int]) -> Tuple[float, List[dict]]:
    """
    For each required skill:
      skill_score = (min(user_level, required_level) / required_level) * 100
    final readiness = average of skill_scores
    """
    if not required:
        return 0.0, []

    breakdown = []
    total = 0.0

    # compute raw scores
    raw = []
    for skill, req_level in required.items():
        u = int(user.get(skill, 0))
        score = (min(u, req_level) / req_level) * 100.0 if req_level > 0 else 0.0
        gap = int(req_level - u)
        raw.append((skill, req_level, u, gap, score))
        total += score

    final = total / len(raw)

    # contribution: normalize scores
    denom = sum([r[4] for r in raw]) or 1.0
    for skill, req_level, u, gap, score in raw:
        breakdown.append({
            "skill": skill,
            "required_level": req_level,
            "user_level": u,
            "gap": gap,
            "skill_score": round(score, 2),
            "contribution_pct": round((score / denom) * 100.0, 2)
        })

    return round(final, 2), breakdown

def classify_gaps(required: Dict[str, int], user: Dict[str, int]) -> Dict[str, list]:
    out = {"critical": [], "moderate": [], "ready": []}
    for skill, req in required.items():
        u = int(user.get(skill, 0))
        gap = int(req - u)
        item = {"skill": skill, "required_level": req, "user_level": u, "gap": gap}
        if gap >= 2:
            out["critical"].append(item)
        elif gap == 1:
            out["moderate"].append(item)
        else:
            out["ready"].append(item)
    return out