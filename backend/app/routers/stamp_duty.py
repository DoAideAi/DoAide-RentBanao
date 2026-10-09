from fastapi import APIRouter

from app.models import StampDutyInput
from app.data.stamp_duty import STAMP_DUTY_DATA, calculate_stamp_duty

router = APIRouter(tags=["Stamp Duty"])


@router.get("/stamp-duty/states")
async def list_states():
    return [
        {"key": key, "name": info["name"]}
        for key, info in sorted(STAMP_DUTY_DATA.items(), key=lambda x: x[1]["name"])
    ]


@router.get("/stamp-duty/{state_key}")
async def get_state_info(state_key: str):
    state = STAMP_DUTY_DATA.get(state_key)
    if not state:
        return {"error": "State not found"}
    return state


@router.post("/stamp-duty/calculate")
async def calc_stamp_duty(data: StampDutyInput):
    result = calculate_stamp_duty(
        data.state, data.monthly_rent, data.security_deposit, data.duration_months
    )
    return result


@router.get("/stamp-duty/compare/all")
async def compare_all_states():
    results = []
    for key, info in sorted(STAMP_DUTY_DATA.items(), key=lambda x: x[1]["name"]):
        results.append({
            "key": key,
            "name": info["name"],
            "stamp_duty_rate": info["stamp_duty_rate"],
            "registration_required": info["registration_required"],
            "e_stamp_available": info["e_stamp_available"],
            "stamp_duty_fixed": info["stamp_duty_fixed"],
            "stamp_duty_percent": info["stamp_duty_percent"],
            "registration_fee": info["registration_fee"],
        })
    return results
