from dotenv import load_dotenv
from pathlib import Path

# Load .env from repository root if present
root = Path(__file__).resolve().parents[1]
env_path = root / ".env"
load_dotenv(env_path)

__all__ = []
