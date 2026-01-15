import asyncio
import sys
# Mocking httpx/etc not needed if we just test the import, 
# but effectively we want to test that 'scraper' can be imported and clean_description is present.
# Since the error happened at runtime during a request, just importing scraper.py successfully is a good first step.
# But we can try to call clean_description directly from scraper.

try:
    from scraper import clean_description, get_properties
    print("Successfully imported clean_description from scraper.")
except ImportError as e:
    print(f"ImportError: {e}")
except NameError as e:
    print(f"NameError during import: {e}")
except Exception as e:
    print(f"Other error: {e}")

# Also verify utils logic is accessible
from utils import clean_description as utils_clean
print(f"Utils clean check: {utils_clean('The Well Come Home test')}")
