import pytest
from unittest.mock import MagicMock
from app.services.ai_evaluator import AIEvaluator

@pytest.fixture(autouse=True)
def mock_ai_evaluator(monkeypatch):
    """
    Globally mock the encoder and genai client in AIEvaluator to avoid
    loading heavy models or making real API calls during tests.
    """
    # Create a mock encoder
    mock_encoder = MagicMock()
    # Return a dummy embedding (list of floats)
    mock_encoder.encode.return_value.tolist.return_value = [0.1] * 384
    mock_encoder.encode.return_value = MagicMock() # For sklearn fallback
    
    # Mock the _encoder attribute directly to prevent lazy loading
    monkeypatch.setattr(AIEvaluator, "encoder", mock_encoder)
    
    # Also mock the genai.Client
    mock_client = MagicMock()
    mock_client.models.generate_content.return_value.text = '{"score": 8, "feedback": "Good job!", "strengths": "Clear code", "weakness": "Needs comments", "follow_up_question": "Explain O(N)"}'
    monkeypatch.setattr("google.genai.Client", lambda **kwargs: mock_client)
    
    return mock_encoder, mock_client
