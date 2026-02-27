from typing import Dict, List, Tuple
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

def build_vocab(roles: Dict[str, Dict[str, int]], user_skills: Dict[str, int]) -> List[str]:
    vocab = set()
    for rskills in roles.values():
        vocab.update(rskills.keys())
    vocab.update(user_skills.keys())
    return sorted(vocab)

def vectorize(vocab: List[str], skills: Dict[str, int]) -> np.ndarray:
    return np.array([float(skills.get(k, 0)) for k in vocab], dtype=float).reshape(1, -1)

def top_k_recommendations(roles: Dict[str, Dict[str, int]], user_skills: Dict[str, int], k: int = 2) -> List[dict]:
    if not roles:
        return []

    vocab = build_vocab(roles, user_skills)
    uvec = vectorize(vocab, user_skills)

    items = []
    for role, rskills in roles.items():
        rvec = vectorize(vocab, rskills)
        sim = float(cosine_similarity(uvec, rvec)[0][0]) * 100.0
        items.append((role, sim, rskills))

    items.sort(key=lambda x: x[1], reverse=True)
    top = items[:k]

    recs = []
    for role, sim, rskills in top:
        overlap = [s for s in rskills.keys() if user_skills.get(s, 0) > 0]
        why = []
        if overlap:
            why.append(f"Strong overlap in: {', '.join(overlap[:5])}" + ("..." if len(overlap) > 5 else ""))
        missing = [s for s in rskills.keys() if user_skills.get(s, 0) == 0]
        if missing:
            why.append(f"Clear growth path via: {', '.join(missing[:5])}" + ("..." if len(missing) > 5 else ""))
        recs.append({
            "role": role,
            "similarity_pct": round(sim, 2),
            "why": why or ["Similarity computed from your skill vector vs role skill vector."]
        })
    return recs