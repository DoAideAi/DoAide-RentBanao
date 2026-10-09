from pydantic import BaseModel, Field
from typing import Optional


class AgreementInput(BaseModel):
    landlord_name: str = Field(..., min_length=2, max_length=200)
    landlord_father_name: str = Field("", max_length=200)
    landlord_address: str = Field(..., min_length=5, max_length=500)
    landlord_aadhar: str = Field("", max_length=12)

    tenant_name: str = Field(..., min_length=2, max_length=200)
    tenant_father_name: str = Field("", max_length=200)
    tenant_address: str = Field(..., min_length=5, max_length=500)
    tenant_aadhar: str = Field("", max_length=12)

    property_address: str = Field(..., min_length=5, max_length=500)
    property_type: str = Field("Residential", pattern=r"^(Residential|Commercial)$")
    furnishing: str = Field("Unfurnished", pattern=r"^(Unfurnished|Semi-Furnished|Fully Furnished)$")

    monthly_rent: float = Field(..., gt=0, le=10000000)
    security_deposit: float = Field(0, ge=0, le=100000000)
    maintenance_charges: float = Field(0, ge=0, le=1000000)
    rent_increment_percent: float = Field(0, ge=0, le=100)

    start_date: str = Field(...)
    duration_months: int = Field(11, ge=1, le=120)

    state: str = Field(...)
    city: str = Field("", max_length=100)

    notice_period_months: int = Field(1, ge=1, le=6)
    lock_in_months: int = Field(0, ge=0, le=60)

    purpose: str = Field("Residential", max_length=200)
    additional_clauses: str = Field("", max_length=2000)

    language: str = Field("english", pattern=r"^(english|bilingual)$")


class StampDutyInput(BaseModel):
    state: str
    monthly_rent: float = Field(..., gt=0)
    security_deposit: float = Field(0, ge=0)
    duration_months: int = Field(11, ge=1, le=120)


class StampDutyResult(BaseModel):
    state: str
    stamp_duty: int
    stamp_duty_rate: str
    registration_fee: int
    registration_required: bool
    total_cost: int
    e_stamp_available: bool
    notes: str
    annual_rent: float
    total_rent: float


class FeedbackInput(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    page: str = Field("", max_length=100)
