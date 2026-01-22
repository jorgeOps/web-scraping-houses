
import asyncio
from api.scraper import get_properties

async def main():
    print("Fetching properties with html.parser...")
    try:
        props = await get_properties()
        print(f"Found {len(props)} properties.")
        for p in props:
            print(f"ID: {p.id}, Title: {p.title}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(main())
