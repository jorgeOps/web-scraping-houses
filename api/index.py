from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .scraper import get_properties, Property, get_property_detail
from typing import List

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/hello")
def read_root():
    return {"message": "Hello from Python Backend!"}

@app.get("/api/properties", response_model=List[Property])
async def list_properties(mode: str = "limited"):
    try:
        data = await get_properties()
        
        if mode == "all":
            return data

        # TEMPORARY: Filter specific properties by Request
        ALLOWED_NUMBERS = {
            "3450", "3492", "3239", "3282", "3377", 
            "3351", "3533", "3528", "3514", "3008", "1735"
        }
        
        filtered_data = []
        for prop in data:
            # Check if property ID (e.g., 'ref-3450') ends with any of the allowed numbers
            # This handles both 'ref-3450' and potentially '3450' formats
            if any(prop.id.endswith(num) for num in ALLOWED_NUMBERS):
                filtered_data.append(prop)
                
        return filtered_data
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"CRITICAL ERROR in list_properties: {e}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@app.get("/api/properties/{prop_id}")
async def property_detail(prop_id: str):
    try:
        data = await get_property_detail(prop_id)
        if not data:
            raise HTTPException(status_code=404, detail="Property not found")
        return data
    except Exception as e:
        print(f"Error fetching detail: {e}")
        raise HTTPException(status_code=500, detail=str(e))
