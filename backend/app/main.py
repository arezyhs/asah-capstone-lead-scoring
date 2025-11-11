import time
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .schemas import PredictRequest, PredictResponse, HealthResponse, MetadataResponse
from .inference import ModelService

app = FastAPI(title="Lead Scoring Inference API", version="0.1.0")

# Allow all origins for PoC; tighten in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model_service = ModelService()
_start_time = time.time()


@app.get("/health", response_model=HealthResponse)
def health():
    return HealthResponse(status="ok", uptime=int(time.time() - _start_time))


@app.post("/predict", response_model=PredictResponse)
def predict(payload: PredictRequest):
    try:
        prob = model_service.predict(payload.features)
        score = int(round(prob * 100))
        return PredictResponse(probability=prob, score=score, model_version=model_service.model_version)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/metadata", response_model=MetadataResponse)
def metadata():
    return MetadataResponse(model_version=model_service.model_version, features=list(model_service.expected_features))
