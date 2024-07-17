import os

from dotenv import load_dotenv

print("Before loading .env:")
print("LOCAL_PASS (os.getenv):", os.getenv("LOCAL_PASS"))
print("LOCAL_PASS (os.environ):", os.environ.get("LOCAL_PASS"))

load_dotenv()

print("\nAfter loading .env:")
print("LOCAL_PASS (os.getenv):", os.getenv("LOCAL_PASS"))
print("LOCAL_PASS (os.environ):", os.environ.get("LOCAL_PASS"))
