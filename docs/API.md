# Backend API Documentation

## Endpoints
- GET `/health`: Service health check
- POST `/predict`: Lead scoring prediction
- GET `/metadata`: Model metadata

## Request Example
```
POST /predict
{
  "features": {
    "age": 40,
    "balance": 1000.0
  }
}
```

## Response Example
```
{
  "probability": 0.87,
  "score": 87,
  "model_version": "1.0.0"
}
```
