from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    body = r.json()
    assert body.get("status") == "ok"


def test_predict_dummy_numeric():
    payload = {"features": {"age": 40, "balance": 1000.0}}
    r = client.post("/predict", json=payload)
    assert r.status_code == 200
    j = r.json()
    assert "probability" in j
    assert 0.0 <= j["probability"] <= 1.0
    assert j["score"] == int(round(j["probability"] * 100))


def test_predict_dummy_nonnumeric():
    payload = {"features": {"job": "admin", "marital": "married"}}
    r = client.post("/predict", json=payload)
    assert r.status_code == 200
    j = r.json()
    assert j["probability"] == 0.5
