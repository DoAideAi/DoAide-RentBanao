from fastapi import APIRouter
from fastapi.responses import StreamingResponse
import io

from app.models import AgreementInput
from app.pdf_generator import generate_agreement_pdf

router = APIRouter(tags=["Agreement"])


@router.post("/generate-agreement")
async def generate_agreement(data: AgreementInput):
    pdf_bytes = generate_agreement_pdf(data)

    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="RentAgreement_{data.landlord_name.replace(" ", "_")}_{data.tenant_name.replace(" ", "_")}.pdf"',
            "Content-Length": str(len(pdf_bytes)),
        },
    )


@router.post("/preview-agreement")
async def preview_agreement(data: AgreementInput):
    from app.data.stamp_duty import calculate_stamp_duty

    stamp_info = calculate_stamp_duty(
        data.state, data.monthly_rent, data.security_deposit, data.duration_months
    )

    return {
        "landlord_name": data.landlord_name,
        "tenant_name": data.tenant_name,
        "property_address": data.property_address,
        "monthly_rent": data.monthly_rent,
        "security_deposit": data.security_deposit,
        "duration_months": data.duration_months,
        "start_date": data.start_date,
        "state": stamp_info.get("state", data.state),
        "stamp_duty": stamp_info,
    }
