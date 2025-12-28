"""
TIS-IntelliMat ESG Navigator - MLflow AI Governance
"""
import mlflow
import json
import uuid
import hashlib
import os
import tempfile
from datetime import datetime
from typing import Dict, Any, List

MLFLOW_URI = "https://mlflow-governance-production.up.railway.app"

AGENTS = {
    "ESG_COMPLIANCE": {"name": "ESG Compliance Agent", "standards": ["GRI", "SASB", "TCFD", "CDP", "JSE"]},
    "SUPPLIER_RISK": {"name": "Supplier Risk Assessment Agent", "standards": ["ISO 20400", "SA8000"]},
    "PARTNERSHIP_EVAL": {"name": "Partnership Evaluation Agent", "standards": ["TIS Framework"]},
    "DATA_ENRICHMENT": {"name": "Data Enrichment Agent", "standards": ["Data Quality"]},
    "BUSINESS_INTELLIGENCE": {"name": "Business Intelligence Agent", "standards": ["BI Best Practices"]},
    "ISO_STANDARDS": {"name": "ISO Standards Agent", "standards": ["ISO 14001", "ISO 45001", "ISO 50001", "ISO 27001"]},
    "GISTM_TAILINGS": {"name": "GISTM Tailings Agent", "standards": ["GISTM", "ICMM"]},
    "ISSB_CLIMATE": {"name": "ISSB Climate Disclosure Agent", "standards": ["IFRS S1", "IFRS S2", "ISSB"]}
}

class ESGTracker:
    def __init__(self, tracking_uri: str = MLFLOW_URI):
        mlflow.set_tracking_uri(tracking_uri)
        self.session = str(uuid.uuid4())[:8]
        self._run = None
        self._start = None
        
    def start(self, agent: str, company: str, user: str = "system"):
        self._agent = agent
        self._company = company
        self._user = user
        return self
    
    def __enter__(self):
        self._start = datetime.utcnow()
        mlflow.set_experiment(f"TIS_ESG_Navigator/{self._agent}")
        self._run = mlflow.start_run(run_name=f"{self._company.replace(' ', '_')}_{self._start.strftime('%H%M%S')}")
        mlflow.set_tag("company", self._company)
        mlflow.set_tag("agent", self._agent)
        mlflow.set_tag("user", self._user)
        mlflow.set_tag("session", self.session)
        mlflow.set_tag("timestamp", self._start.isoformat())
        mlflow.set_tag("platform", "TIS-IntelliMat ESG Navigator")
        mlflow.log_param("model", "claude-sonnet-4-20250514")
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        duration = (datetime.utcnow() - self._start).total_seconds()
        mlflow.log_metric("duration_sec", round(duration, 2))
        mlflow.set_tag("status", "FAILED" if exc_type else "SUCCESS")
        if exc_type:
            mlflow.set_tag("error", str(exc_val)[:200])
        mlflow.end_run()
        return False
    
    def log_score(self, score: int, breakdown: Dict[str, int] = None):
        mlflow.log_metric("esg_score", score)
        arch = "SOPHISTICATED" if score >= 75 else "OPERATIONAL" if score >= 50 else "TRUE_LAGGARD"
        mlflow.set_tag("archetype", arch)
        if breakdown:
            for k, v in breakdown.items():
                mlflow.log_metric(f"score_{k.lower()}", v)
        return self
    
    def log_confidence(self, score: float):
        mlflow.log_metric("confidence", round(score, 3))
        if score < 0.7:
            mlflow.set_tag("requires_review", "true")
        return self
    
    def log_sector(self, sector: str):
        mlflow.set_tag("sector", sector)
        return self
    
    def log_standards(self, standards: List[str]):
        mlflow.log_param("standards", ", ".join(standards))
        mlflow.log_metric("standards_count", len(standards))
        return self
    
    def log_gaps(self, gaps: List[Dict]):
        mlflow.log_metric("gaps_count", len(gaps))
        return self
    
    def log_recommendations(self, recs: List[Dict]):
        mlflow.log_metric("recs_count", len(recs))
        return self
    
    def log_tokens(self, input_t: int, output_t: int):
        mlflow.log_metric("tokens_in", input_t)
        mlflow.log_metric("tokens_out", output_t)
        mlflow.log_metric("tokens_total", input_t + output_t)
        cost = (input_t * 0.003 + output_t * 0.015) / 1000
        mlflow.log_metric("cost_usd", round(cost, 4))
        return self
    
    def log_lineage(self, source: str, transform: str):
        mlflow.log_param("lineage_src", source)
        mlflow.log_param("lineage_xform", transform)
        return self

def track(agent: str, company: str, user: str = "system") -> ESGTracker:
    return ESGTracker().start(agent, company, user)

def quick_log(agent: str, company: str, score: int, sector: str = None, confidence: float = 0.85) -> str:
    with track(agent, company) as t:
        t.log_score(score).log_confidence(confidence)
        if sector:
            t.log_sector(sector)
        return mlflow.active_run().info.run_id

def setup_experiments():
    mlflow.set_tracking_uri(MLFLOW_URI)
    print("Creating experiments for 8 ESG Navigator agents...")
    for key, info in AGENTS.items():
        try:
            mlflow.set_experiment(f"TIS_ESG_Navigator/{key}")
            print(f"  ✅ {info['name']}")
        except Exception as e:
            print(f"  ⚠️ {info['name']}: {e}")
    print(f"\n✅ Done! View at: {MLFLOW_URI}")

def test_with_companies():
    print("\nTesting with ESG Navigator company data...\n")
    companies = [
        ("Ivanhoe Mines Ltd", "Mining", 78),
        ("Anglo American Platinum", "Mining", 81),
        ("Tiger Brands Limited", "Food", 45),
        ("Sasol Limited", "Chemicals", 58),
        ("Standard Bank Group", "Financial", 82),
    ]
    for name, sector, score in companies:
        with track("ESG_COMPLIANCE", name) as t:
            t.log_score(score).log_sector(sector).log_confidence(0.85)
            t.log_standards(["GRI", "SASB", "TCFD", "JSE"])
            t.log_lineage("neon_postgresql", "test_verification")
        arch = "SOPHISTICATED" if score >= 75 else "OPERATIONAL" if score >= 50 else "TRUE_LAGGARD"
        print(f"  ✅ {name}: {score} ({arch})")
    print(f"\n🎉 SUCCESS! View at: {MLFLOW_URI}")

if __name__ == "__main__":
    setup_experiments()
    test_with_companies()
