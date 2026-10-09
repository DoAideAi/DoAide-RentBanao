import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_list_states():
    r = client.get("/api/stamp-duty/states")
    assert r.status_code == 200
    states = r.json()
    assert len(states) > 30
    assert any(s["key"] == "maharashtra" for s in states)


def test_get_state_info():
    r = client.get("/api/stamp-duty/maharashtra")
    assert r.status_code == 200
    data = r.json()
    assert data["name"] == "Maharashtra"


def test_get_invalid_state():
    r = client.get("/api/stamp-duty/fakeland")
    assert r.status_code == 200
    assert r.json().get("error") == "State not found"


def test_calculate_stamp_duty():
    r = client.post("/api/stamp-duty/calculate", json={
        "state": "delhi",
        "monthly_rent": 25000,
        "security_deposit": 75000,
        "duration_months": 11,
    })
    assert r.status_code == 200
    data = r.json()
    assert data["state"] == "Delhi (NCT)"
    assert data["stamp_duty"] > 0


def test_compare_all():
    r = client.get("/api/stamp-duty/compare/all")
    assert r.status_code == 200
    data = r.json()
    assert len(data) > 30


def test_generate_agreement():
    r = client.post("/api/generate-agreement", json={
        "landlord_name": "Rajesh Kumar",
        "landlord_address": "123, MG Road, Mumbai",
        "tenant_name": "Priya Sharma",
        "tenant_address": "456, Park Street, Delhi",
        "property_address": "789, Bandra West, Mumbai 400050",
        "monthly_rent": 25000,
        "security_deposit": 100000,
        "start_date": "2026-01-01",
        "duration_months": 11,
        "state": "maharashtra",
        "city": "Mumbai",
    })
    assert r.status_code == 200
    assert r.headers["content-type"] == "application/pdf"
    assert len(r.content) > 1000


def test_generate_agreement_bilingual():
    r = client.post("/api/generate-agreement", json={
        "landlord_name": "Amit Singh",
        "landlord_address": "A-1, Sector 62, Noida",
        "tenant_name": "Neha Gupta",
        "tenant_address": "B-2, Vasant Kunj, Delhi",
        "property_address": "C-3, Greater Kailash, Delhi 110048",
        "monthly_rent": 35000,
        "security_deposit": 200000,
        "start_date": "2026-02-01",
        "duration_months": 11,
        "state": "delhi",
        "city": "Delhi",
        "language": "bilingual",
    })
    assert r.status_code == 200
    assert r.headers["content-type"] == "application/pdf"


def test_preview_agreement():
    r = client.post("/api/preview-agreement", json={
        "landlord_name": "Rajesh Kumar",
        "landlord_address": "123, MG Road, Mumbai",
        "tenant_name": "Priya Sharma",
        "tenant_address": "456, Park Street, Delhi",
        "property_address": "789, Bandra West, Mumbai 400050",
        "monthly_rent": 25000,
        "security_deposit": 100000,
        "start_date": "2026-01-01",
        "duration_months": 11,
        "state": "maharashtra",
        "city": "Mumbai",
    })
    assert r.status_code == 200
    data = r.json()
    assert data["landlord_name"] == "Rajesh Kumar"
    assert data["stamp_duty"]["state"] == "Maharashtra"


def test_generate_commercial_agreement():
    r = client.post("/api/generate-agreement", json={
        "landlord_name": "Vikram Patel",
        "landlord_address": "Office No. 5, FC Road, Pune",
        "tenant_name": "ABC Solutions Pvt Ltd",
        "tenant_address": "MG Road, Bengaluru",
        "property_address": "Shop No. 12, Market Yard, Pune 411001",
        "property_type": "Commercial",
        "monthly_rent": 50000,
        "security_deposit": 300000,
        "maintenance_charges": 5000,
        "rent_increment_percent": 10,
        "start_date": "2026-03-01",
        "duration_months": 36,
        "state": "maharashtra",
        "city": "Pune",
        "notice_period_months": 3,
        "lock_in_months": 12,
        "purpose": "Commercial Office Space",
        "additional_clauses": "Signage rights on building exterior\nParking space included",
    })
    assert r.status_code == 200
    assert r.headers["content-type"] == "application/pdf"


def test_feedback():
    r = client.post("/api/feedback", json={
        "message": "Great tool!",
        "page": "home",
    })
    assert r.status_code == 200
