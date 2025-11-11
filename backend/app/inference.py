import os
from typing import Dict, Any


class ModelService:
    """Simple model service that will try to load a serialized model (joblib).
    If no model artifact is present, it falls back to a deterministic dummy.
    """

    def __init__(self):
        self.model_version = "v0.0-dummy"
        self.expected_features = []
        self.model = None
        self._load_model()

    def _load_model(self):
        try:
            import joblib

            model_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "model.joblib"))
            if os.path.exists(model_path):
                self.model = joblib.load(model_path)
                # try to get version attribute from model if present
                self.model_version = getattr(self.model, "version", "v1")
        except Exception:
            # leave model as None (will use dummy predict)
            self.model = None

    def preprocess(self, features: Dict[str, Any]) -> Dict[str, Any]:
        # Placeholder: real preprocessing must match training
        # For now, pass-through
        return features or {}

    def predict(self, features: Dict[str, Any]) -> float:
        x = self.preprocess(features)
        if self.model is None:
            # Dummy deterministic behaviour: compute probability from numeric fields
            nums = [v for v in x.values() if isinstance(v, (int, float))]
            if nums:
                avg = sum(nums) / len(nums)
                prob = max(0.0, min(1.0, avg / (avg + 1)))
            else:
                prob = 0.5
            return float(prob)
        else:
            # Assume model has predict_proba and expects DataFrame-like input
            import pandas as pd

            df = pd.DataFrame([x])
            probs = self.model.predict_proba(df)
            return float(probs[0, 1])
