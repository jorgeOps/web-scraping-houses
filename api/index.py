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
async def list_properties():
    try:
        data = await get_properties()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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
