import json
from pathlib import Path
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.agreement import router as agreement_router
from app.routers.stamp_duty import router as stamp_duty_router


FEEDBACK_FILE = Path(__file__).resolve().parent.parent / "feedback.json"


@asynccontextmanager
async def lifespan(app: FastAPI):
    FEEDBACK_FILE.touch(exist_ok=True)
    if FEEDBACK_FILE.stat().st_size == 0:
        FEEDBACK_FILE.write_text("[]")
    yield


app = FastAPI(
    title="RentBanao API",
    description="Free Rent Agreement Generator for India",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(agreement_router, prefix="/api")
app.include_router(stamp_duty_router, prefix="/api")


@app.get("/health")
async def health():
    return {"status": "ok", "service": "RentBanao API"}


@app.post("/api/feedback")
async def submit_feedback(data: dict):
    message = data.get("message", "").strip()
    page = data.get("page", "")
    if not message:
        return {"error": "Message is required"}

    FEEDBACK_FILE.touch(exist_ok=True)
    content = FEEDBACK_FILE.read_text().strip()
    feedbacks = json.loads(content) if content else []
    feedbacks.append({"message": message, "page": page})
    FEEDBACK_FILE.write_text(json.dumps(feedbacks, indent=2))
    return {"status": "ok"}
