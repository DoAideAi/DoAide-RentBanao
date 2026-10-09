import pytest
from app.data.stamp_duty import STAMP_DUTY_DATA, calculate_stamp_duty


def test_all_states_have_required_fields():
    required = {"name", "stamp_duty_rate", "stamp_duty_fixed", "stamp_duty_percent",
                "registration_fee", "registration_required", "e_stamp_available",
                "max_lease_without_registration", "notes"}
    for key, state in STAMP_DUTY_DATA.items():
        missing = required - set(state.keys())
        assert not missing, f"{key} is missing fields: {missing}"


def test_calculate_maharashtra():
    result = calculate_stamp_duty("maharashtra", 25000, 100000, 11)
    assert result["state"] == "Maharashtra"
    assert result["stamp_duty"] > 0
    assert result["registration_required"] is False


def test_calculate_maharashtra_long_lease():
    result = calculate_stamp_duty("maharashtra", 25000, 100000, 24)
    assert result["registration_required"] is True
    assert result["registration_fee"] == 1000


def test_calculate_delhi():
    result = calculate_stamp_duty("delhi", 30000, 90000, 11)
    assert result["state"] == "Delhi (NCT)"
    assert result["stamp_duty"] >= 100


def test_calculate_karnataka():
    result = calculate_stamp_duty("karnataka", 20000, 60000, 11)
    assert result["state"] == "Karnataka"
    assert result["stamp_duty"] >= 200


def test_invalid_state():
    result = calculate_stamp_duty("invalid_state", 10000, 0, 11)
    assert "error" in result


def test_zero_deposit():
    result = calculate_stamp_duty("delhi", 15000, 0, 11)
    assert result["stamp_duty"] > 0
    assert result["total_cost"] == result["stamp_duty"]


def test_all_states_calculable():
    for key in STAMP_DUTY_DATA:
        result = calculate_stamp_duty(key, 10000, 50000, 11)
        assert "error" not in result
        assert result["stamp_duty"] >= 0
        assert result["total_cost"] >= 0
