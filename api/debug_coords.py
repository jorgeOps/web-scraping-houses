import asyncio
from scraper import get_property_detail

# Use a known property ID that should have a map
# If the user mentioned a specific one, I'd use it. Otherwise, I'll pick one from previous logs if available, or just a generic one.
# Looking at previous logs, "ref-1655" was mentioned in an error. Let's try that or just get_properties list first.

async def main():
    print("Fetching property detail...")
    # I'll try to fetch a property detail directly. I need an ID.
    # Let's first get the list to find a valid ID.
    from scraper import get_properties
    props = await get_properties()
    if not props:
        print("No properties found to test.")
        return

    prop_id = props[0].id
    print(f"Testing with Property ID: {prop_id}")
    
    detail = await get_property_detail(prop_id)
    if not detail:
        print("Failed to fetch detail.")
        return
        
    print(f"Title: {detail.title}")
    print(f"Lat: {detail.latitude}")
    print(f"Lng: {detail.longitude}")
    
    if detail.latitude is None or detail.longitude is None:
        print("COORDINATES MISSING!")
    else:
        print("Coordinates found.")

if __name__ == "__main__":
    asyncio.run(main())
