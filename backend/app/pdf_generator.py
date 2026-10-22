import io
from datetime import datetime

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, mm
from reportlab.lib.colors import HexColor
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, KeepTogether,
)
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from num2words import num2words

from app.models import AgreementInput
from app.safe_paragraph import SafeParagraph as Paragraph
from app.data.stamp_duty import calculate_stamp_duty


def _amount_in_words(amount: float) -> str:
    whole = int(amount)
    return num2words(whole, lang="en_IN").replace(",", "").title()


def _parse_date(date_str: str) -> datetime:
    for fmt in ("%Y-%m-%d", "%d-%m-%Y", "%d/%m/%Y"):
        try:
            return datetime.strptime(date_str, fmt)
        except ValueError:
            continue
    return datetime.now()


def _format_date(dt: datetime) -> str:
    return dt.strftime("%d %B %Y")


def _add_end_date(start: datetime, months: int) -> datetime:
    year = start.year + (start.month + months - 1) // 12
    month = (start.month + months - 1) % 12 + 1
    day = min(start.day, 28)
    return datetime(year, month, day)


def generate_agreement_pdf(data: AgreementInput) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        leftMargin=25 * mm,
        rightMargin=25 * mm,
        topMargin=20 * mm,
        bottomMargin=20 * mm,
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "AgreementTitle",
        parent=styles["Title"],
        fontSize=16,
        spaceAfter=6,
        textColor=HexColor("#1a1a1a"),
        alignment=TA_CENTER,
    )
    subtitle_style = ParagraphStyle(
        "Subtitle",
        parent=styles["Normal"],
        fontSize=10,
        spaceAfter=12,
        textColor=HexColor("#666666"),
        alignment=TA_CENTER,
    )
    heading_style = ParagraphStyle(
        "ClauseHeading",
        parent=styles["Heading2"],
        fontSize=11,
        spaceBefore=14,
        spaceAfter=6,
        textColor=HexColor("#1a1a1a"),
        fontName="Helvetica-Bold",
    )
    body_style = ParagraphStyle(
        "Body",
        parent=styles["Normal"],
        fontSize=10,
        leading=15,
        spaceAfter=6,
        alignment=TA_JUSTIFY,
    )
    bold_body = ParagraphStyle(
        "BoldBody",
        parent=body_style,
        fontName="Helvetica-Bold",
    )
    small_style = ParagraphStyle(
        "Small",
        parent=styles["Normal"],
        fontSize=8,
        textColor=HexColor("#999999"),
        alignment=TA_CENTER,
        spaceBefore=20,
    )

    elements = []

    start_dt = _parse_date(data.start_date)
    end_dt = _add_end_date(start_dt, data.duration_months)
    stamp_info = calculate_stamp_duty(
        data.state, data.monthly_rent, data.security_deposit, data.duration_months
    )

    property_type_label = data.property_type
    if data.furnishing != "Unfurnished":
        property_type_label = f"{data.furnishing} {property_type_label}"

    elements.append(Paragraph(
        "RENT AGREEMENT" if data.property_type == "Residential" else "COMMERCIAL LEASE AGREEMENT",
        title_style,
    ))
    if data.state in ("maharashtra",):
        elements.append(Paragraph("(Leave and Licence Agreement)", subtitle_style))

    elements.append(Paragraph(
        f"Executed on this <b>{_format_date(start_dt)}</b> at <b>{data.city or stamp_info.get('state', '')}</b>",
        ParagraphStyle("DateLine", parent=body_style, alignment=TA_CENTER, spaceBefore=6, spaceAfter=12),
    ))
    elements.append(HRFlowable(width="100%", thickness=1, color=HexColor("#cccccc"), spaceAfter=10))

    elements.append(Paragraph("BETWEEN", bold_body))
    landlord_text = (
        f"<b>{data.landlord_name}</b>"
        + (f", S/o D/o {data.landlord_father_name}" if data.landlord_father_name else "")
        + f", residing at {data.landlord_address}"
        + (f" (Aadhar: XXXX-XXXX-{data.landlord_aadhar[-4:]})" if len(data.landlord_aadhar) >= 4 else "")
        + ', hereinafter referred to as the <b>"LANDLORD / LICENSOR"</b> (which expression shall, unless excluded by or repugnant to the context, include his/her heirs, successors, and assigns) of the FIRST PART;'
    )
    elements.append(Paragraph(landlord_text, body_style))

    elements.append(Paragraph("AND", bold_body))
    tenant_text = (
        f"<b>{data.tenant_name}</b>"
        + (f", S/o D/o {data.tenant_father_name}" if data.tenant_father_name else "")
        + f", residing at {data.tenant_address}"
        + (f" (Aadhar: XXXX-XXXX-{data.tenant_aadhar[-4:]})" if len(data.tenant_aadhar) >= 4 else "")
        + ', hereinafter referred to as the <b>"TENANT / LICENSEE"</b> (which expression shall, unless excluded by or repugnant to the context, include his/her heirs, successors, and assigns) of the SECOND PART.'
    )
    elements.append(Paragraph(tenant_text, body_style))

    elements.append(Spacer(1, 8))
    elements.append(Paragraph(
        "WHEREAS the Landlord is the lawful owner of the property described herein and has agreed to "
        "let out the said premises to the Tenant, and the Tenant has agreed to take the same on rent, "
        "subject to the terms and conditions mentioned below.",
        body_style,
    ))

    elements.append(Paragraph("NOW THIS AGREEMENT WITNESSETH AS FOLLOWS:", bold_body))

    clause_num = 1

    elements.append(Paragraph(f"{clause_num}. PROPERTY DESCRIPTION", heading_style))
    clause_num += 1
    elements.append(Paragraph(
        f"The Landlord hereby lets out and the Tenant hereby takes on rent the {property_type_label} "
        f"premises situated at: <b>{data.property_address}</b>, "
        f"for the purpose of <b>{data.purpose}</b>.",
        body_style,
    ))

    elements.append(Paragraph(f"{clause_num}. TERM OF AGREEMENT", heading_style))
    clause_num += 1
    elements.append(Paragraph(
        f"This agreement shall be valid for a period of <b>{data.duration_months} months</b>, "
        f"commencing from <b>{_format_date(start_dt)}</b> and ending on <b>{_format_date(end_dt)}</b>, "
        "unless terminated earlier by either party as per the terms herein.",
        body_style,
    ))

    elements.append(Paragraph(f"{clause_num}. RENT", heading_style))
    clause_num += 1
    rent_words = _amount_in_words(data.monthly_rent)
    elements.append(Paragraph(
        f"The Tenant shall pay a monthly rent of <b>₹{data.monthly_rent:,.0f}/- ({rent_words} Rupees Only)</b> "
        f"to the Landlord on or before the 5th of every calendar month.",
        body_style,
    ))
    if data.maintenance_charges > 0:
        maint_words = _amount_in_words(data.maintenance_charges)
        elements.append(Paragraph(
            f"In addition, the Tenant shall pay maintenance charges of "
            f"<b>₹{data.maintenance_charges:,.0f}/- ({maint_words} Rupees Only)</b> per month.",
            body_style,
        ))
    if data.rent_increment_percent > 0:
        elements.append(Paragraph(
            f"The rent shall be increased by <b>{data.rent_increment_percent}%</b> annually upon renewal.",
            body_style,
        ))

    elements.append(Paragraph(f"{clause_num}. SECURITY DEPOSIT", heading_style))
    clause_num += 1
    if data.security_deposit > 0:
        deposit_words = _amount_in_words(data.security_deposit)
        elements.append(Paragraph(
            f"The Tenant has paid a refundable security deposit of "
            f"<b>₹{data.security_deposit:,.0f}/- ({deposit_words} Rupees Only)</b> "
            "to the Landlord. This deposit shall be refunded to the Tenant at the time of vacating "
            "the premises, after deducting any outstanding dues, damages, or unpaid rent/bills.",
            body_style,
        ))
    else:
        elements.append(Paragraph("No security deposit is payable under this agreement.", body_style))

    elements.append(Paragraph(f"{clause_num}. NOTICE PERIOD & LOCK-IN", heading_style))
    clause_num += 1
    elements.append(Paragraph(
        f"Either party may terminate this agreement by giving <b>{data.notice_period_months} month(s)</b> "
        "written notice to the other party.",
        body_style,
    ))
    if data.lock_in_months > 0:
        elements.append(Paragraph(
            f"There shall be a lock-in period of <b>{data.lock_in_months} months</b> from the commencement "
            "date, during which neither party can terminate this agreement.",
            body_style,
        ))

    elements.append(Paragraph(f"{clause_num}. LANDLORD'S OBLIGATIONS", heading_style))
    clause_num += 1
    obligations = [
        "The Landlord shall ensure the premises are in a habitable and tenantable condition.",
        "The Landlord shall be responsible for major structural repairs and maintenance of the building.",
        "The Landlord or his/her representative may inspect the premises with prior notice of 24 hours.",
        "The Landlord shall not interfere with the peaceful enjoyment of the premises by the Tenant.",
    ]
    for ob in obligations:
        elements.append(Paragraph(f"• {ob}", body_style))

    elements.append(Paragraph(f"{clause_num}. TENANT'S OBLIGATIONS", heading_style))
    clause_num += 1
    t_obligations = [
        "The Tenant shall use the premises solely for the agreed purpose and shall not sublet or assign.",
        "The Tenant shall pay electricity, water, gas, internet, and other utility bills on time.",
        "The Tenant shall maintain the premises in good condition and shall be responsible for minor repairs.",
        "The Tenant shall not make any structural alterations without the written consent of the Landlord.",
        "The Tenant shall not engage in any illegal or immoral activities on the premises.",
        "The Tenant shall allow the Landlord to show the premises to prospective tenants during the last month.",
    ]
    for ob in t_obligations:
        elements.append(Paragraph(f"• {ob}", body_style))

    elements.append(Paragraph(f"{clause_num}. TERMINATION & EVICTION", heading_style))
    clause_num += 1
    elements.append(Paragraph(
        "The Landlord may terminate this agreement and evict the Tenant if: "
        "(a) Rent is unpaid for two consecutive months; "
        "(b) The Tenant breaches any material term of this agreement; "
        "(c) The Tenant uses the premises for any purpose other than the agreed purpose; "
        "(d) The Tenant causes damage to the property beyond normal wear and tear.",
        body_style,
    ))

    elements.append(Paragraph(f"{clause_num}. DISPUTE RESOLUTION", heading_style))
    clause_num += 1
    elements.append(Paragraph(
        f"Any dispute arising out of this agreement shall first be resolved through mutual negotiation. "
        f"If unresolved, the matter shall be referred to arbitration in accordance with the Arbitration "
        f"and Conciliation Act, 1996. The jurisdiction shall be the courts of "
        f"<b>{data.city or stamp_info.get('state', 'the appropriate jurisdiction')}</b>.",
        body_style,
    ))

    elements.append(Paragraph(f"{clause_num}. GENERAL PROVISIONS", heading_style))
    clause_num += 1
    general = [
        "This agreement constitutes the entire understanding between the parties.",
        "Any amendment to this agreement must be in writing and signed by both parties.",
        "The Tenant shall complete police verification/registration within 15 days of moving in.",
        "The Tenant shall vacate and hand over the premises in the same condition as received, subject to normal wear and tear.",
    ]
    for g in general:
        elements.append(Paragraph(f"• {g}", body_style))

    if data.additional_clauses.strip():
        elements.append(Paragraph(f"{clause_num}. ADDITIONAL CLAUSES", heading_style))
        clause_num += 1
        for line in data.additional_clauses.strip().split("\n"):
            if line.strip():
                elements.append(Paragraph(f"• {line.strip()}", body_style))

    elements.append(Spacer(1, 6))
    if stamp_info and not stamp_info.get("error"):
        elements.append(Paragraph(f"{clause_num}. STAMP DUTY & REGISTRATION", heading_style))
        stamp_table_data = [
            ["Stamp Duty", f"₹{stamp_info['stamp_duty']:,}"],
            ["Registration Fee", f"₹{stamp_info['registration_fee']:,}" if stamp_info["registration_required"] else "Not Required"],
            ["Total Cost", f"₹{stamp_info['total_cost']:,}"],
            ["E-Stamp Available", "Yes" if stamp_info["e_stamp_available"] else "No"],
        ]
        stamp_table = Table(stamp_table_data, colWidths=[3 * inch, 3 * inch])
        stamp_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (0, -1), HexColor("#f5f5f5")),
            ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, -1), 9),
            ("PADDING", (0, 0), (-1, -1), 6),
            ("GRID", (0, 0), (-1, -1), 0.5, HexColor("#cccccc")),
        ]))
        elements.append(stamp_table)
        elements.append(Spacer(1, 4))
        elements.append(Paragraph(f"<i>Note: {stamp_info['notes']}</i>", body_style))

    elements.append(Spacer(1, 30))
    elements.append(Paragraph(
        "IN WITNESS WHEREOF, the parties have signed this agreement on the date first written above.",
        body_style,
    ))

    elements.append(Spacer(1, 40))
    sig_data = [
        ["LANDLORD / LICENSOR", "", "TENANT / LICENSEE"],
        ["", "", ""],
        ["", "", ""],
        ["Signature: ___________________", "", "Signature: ___________________"],
        [f"Name: {data.landlord_name}", "", f"Name: {data.tenant_name}"],
        ["Date: ___________________", "", "Date: ___________________"],
    ]
    sig_table = Table(sig_data, colWidths=[2.5 * inch, 1 * inch, 2.5 * inch])
    sig_table.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("ALIGN", (0, 0), (-1, -1), "LEFT"),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
    ]))
    elements.append(sig_table)

    elements.append(Spacer(1, 30))
    elements.append(Paragraph("WITNESSES", heading_style))
    witness_data = [
        ["Witness 1:", "", "Witness 2:"],
        ["Signature: ___________________", "", "Signature: ___________________"],
        ["Name: ___________________", "", "Name: ___________________"],
        ["Address: ___________________", "", "Address: ___________________"],
    ]
    witness_table = Table(witness_data, colWidths=[2.5 * inch, 1 * inch, 2.5 * inch])
    witness_table.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
    ]))
    elements.append(witness_table)

    elements.append(Spacer(1, 20))
    elements.append(HRFlowable(width="100%", thickness=0.5, color=HexColor("#cccccc")))
    elements.append(Paragraph(
        "Generated by RentBanao (rent.doaide.com) — Free Rent Agreement Generator for India. "
        "This is a computer-generated document. Please affix appropriate stamp paper and get it "
        "notarized/registered as per your state's requirements.",
        small_style,
    ))

    doc.build(elements)
    return buffer.getvalue()
