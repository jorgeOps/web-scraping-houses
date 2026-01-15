import asyncio
from scraper import get_properties

async def main():
    print("Testing Scraper...")
    try:
        props = await get_properties()
        print(f"\nSuccessfully scraped {len(props)} properties!")
        for p in props[:3]:
            print(f"\nID: {p.id}")
            print(f"Title: {p.title}")
            print(f"Price: {p.price}")
            print(f"Image: {p.image_url}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(main())
