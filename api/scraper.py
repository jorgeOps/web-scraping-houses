import httpx
from bs4 import BeautifulSoup
from typing import List, Optional, Dict
from pydantic import BaseModel
import re
from .utils import clean_description

class Property(BaseModel):
    id: str
    title: str
    price: str
    location: str
    image_url: str
    detail_url: str
    size: Optional[str] = None
    bedrooms: Optional[str] = None
    bathrooms: Optional[str] = None

class PropertyDetail(BaseModel):
    id: str
    title: str
    description: str
    price: str
    images: List[str]
    features: Dict[str, str]
    size: Optional[str] = None
    bedrooms: Optional[str] = None
    bathrooms: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

BASE_URL = "https://www.thewellcomehome.com"
LISTING_URL = f"{BASE_URL}/es/venta_o_alquiler"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

def get_clean_image_url(src: str) -> str:
    if not src: return ""
    
    # Ensure absolute URL
    if not src.startswith("http"):
        src = f"https:{src}" if src.startswith("//") else f"{BASE_URL}{src}"
    
    # Watermark Removal Logic
    # 1. Strip common suffixes to get to the base filename
    src = src.replace("-large.jpg", ".jpg")
    src = src.replace("-thumb.jpg", ".jpg")
    src = src.replace("-large.png", ".png")
    src = src.replace("-thumb.png", ".png")
    
    # 2. Inject -original to access the clean version
    # Avoid double -original
    if "-original" not in src:
         if src.lower().endswith(".jpg"):
             src = src[:-4] + "-original.jpg"
         elif src.lower().endswith(".jpeg"):
             src = src[:-5] + "-original.jpeg"
         elif src.lower().endswith(".png"):
             src = src[:-4] + "-original.png"
             
    return src

async def get_properties() -> List[Property]:
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.get(LISTING_URL, headers=HEADERS)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'lxml')
        properties = []
        
        rows = soup.select("table#infoListado tbody tr")
        
        for row in rows:
            try:
                foto_td = row.find("td", attrs={"data-info": "foto"})
                if not foto_td:
                    continue

                def get_data(key: str) -> str:
                    td = row.find("td", attrs={"data-info": key})
                    if td:
                        return td.get_text(strip=True)
                    return ""

                img_tag = foto_td.find("img")
                link_tag = foto_td.find("a")
                
                if not img_tag or not link_tag:
                    continue
                    
                raw_img = img_tag.get("data-src") or img_tag.get("src")
                image_url = get_clean_image_url(raw_img)
                
                detail_url = link_tag.get("href")
                
                if detail_url and not detail_url.startswith("http"):
                    detail_url = f"{BASE_URL}{detail_url}"
                
                prop_type = row.find("span", attrs={"data-info": "tipo"})
                prop_type = prop_type.get_text(strip=True) if prop_type else ""
                
                loc_span = row.find("span", attrs={"data-info": "localizacion"})
                location = loc_span.get_text(strip=True) if loc_span else ""
                
                price_span = row.find("span", attrs={"data-info": "precioVenta"})
                price = price_span.get_text(strip=True) if price_span else ""
                
                size = get_data("superficie")
                bedrooms = get_data("dormitorios")
                bathrooms = get_data("banos")
                
                prop_id = detail_url.split("/")[-1] if detail_url else "unknown"

                properties.append(Property(
                    id=prop_id,
                    title=f"{prop_type} en {location}",
                    price=price,
                    location=location,
                    image_url=image_url or "",
                    detail_url=detail_url or "",
                    size=size,
                    bedrooms=bedrooms,
                    bathrooms=bathrooms
                ))
            except Exception as e:
                # print(f"Skipping row due to error: {e}")
                continue
                
        return properties

async def get_property_detail(prop_id: str) -> Optional[PropertyDetail]:
    # Construct URL. Assuming prop_id matches the end of the url
    # e.g. ref-1052 -> https://www.thewellcomehome.com/es/venta_o_alquiler/ref-1052
    url = f"{LISTING_URL}/{prop_id}"
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.get(url, headers=HEADERS)
        if response.status_code == 404:
            return None
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'lxml')
        
        # Description
        description = ""
        desc_div = soup.find("div", class_="IDDescripcionBig")
        if desc_div:
            ps = desc_div.find_all("p")
            raw_desc = "\n\n".join([p.get_text(strip=True) for p in ps if p.get_text(strip=True)])
            description = clean_description(raw_desc)
        
        # Images
        images = []
        # 1. Primary Method: LightSlider
        slider_items = soup.select("ul#lightSlider li.sliderImage")
        if slider_items:
             for li in slider_items:
                 src = li.get("data-src")
                 clean_src = get_clean_image_url(src)
                 if clean_src and clean_src not in images:
                     images.append(clean_src)
        
        # 2. Fallback: Any large images if slider not found
        if not images:
            candidate_imgs = soup.find_all("img")
            for img in candidate_imgs:
                src = img.get("data-src") or img.get("src")
                if not src: continue
                
                # Filter logic
                if (".jpg" in src or ".png" in src) and "logo" not in src.lower() and "icon" not in src.lower():
                     clean_src = get_clean_image_url(src)
                     if clean_src not in images and ("large" in src or "original" in clean_src): 
                        images.append(clean_src)
        
        # Remove duplicates preserving order
        seen = set()
        unique_images = []
        for x in images:
            if x not in seen:
                unique_images.append(x)
                seen.add(x)

        # Title & Price Extraction (Improved)
        title = soup.title.string if soup.title else "Propiedad"
        title = clean_description(title) # Apply the new cleaning function
        title = title.replace("Mobiliaria", "")
        title = re.sub(r'(?i)Ref\s*[:.]?\s*\d+', '', title)
        if "|" in title: title = title.split("|")[0]
        elif " - " in title: 
            parts = title.split(" - ")
            if len(parts) > 1: title = parts[0]
        title = title.strip(" .-|")

        # Price Strategy: IDPrecioBig
        price = "Consultar"
        price_div = soup.find(class_="IDPrecioBig")
        if price_div:
            price = price_div.get_text(strip=True)
        else:
            # Fallback
            price_tags = soup.find_all(string=re.compile(r"[\d\.]+\s*€"))
            if price_tags:
                for pt in price_tags:
                    text = pt.strip()
                    if any(c.isdigit() for c in text):
                         price = text
                         break
        
        # Specific Details (Size, Beds, Baths) from .bloqueIconosBig
        size = None
        bedrooms = None
        bathrooms = None
        
        icon_block = soup.find("div", class_="bloqueIconosBig")
        if icon_block:
            items = icon_block.find_all("div", class_="spanIconosInmuebleBig")
            for item in items:
                text = item.get_text(strip=True)
                lower_text = text.lower()
                
                if "m2" in lower_text or "m²" in lower_text:
                    size = text
                elif "habitaciones" in lower_text or "dormitorios" in lower_text:
                     # Extract number
                     nums = re.findall(r'\d+', text)
                     if nums: bedrooms = nums[0]
                elif "baños" in lower_text or "aseos" in lower_text:
                     nums = re.findall(r'\d+', text)
                     if nums: bathrooms = nums[0]

        # Features Extraction
        features = {}
        features_container = soup.find("div", class_="IDOtrosDatosBig2Columnas")
        if features_container:
            props = features_container.find_all("div", class_="IDPropiedadBig")
            for p in props:
                full_text = p.get_text(strip=True)
                key_text = ""
                value_text = ""
                pull_right = p.find("span", class_="pull-right")
                if pull_right:
                    if pull_right.find("span", class_="fa-check"):
                        value_text = "Sí"
                    else:
                        value_text = pull_right.get_text(strip=True)
                
                key_text = p.find(string=True, recursive=False)
                if not key_text:
                     if pull_right:
                         val_in_dom = pull_right.get_text(strip=True)
                         key_text = full_text.replace(val_in_dom, "")
                     else:
                         key_text = full_text
                
                if key_text:
                    k = key_text.strip()
                    v = value_text.strip()
                    if k and v:
                        features[k] = v

        # Coordinate Extraction
        latitude = None
        longitude = None
        
        # Look for coordinates in script tags
        scripts = soup.find_all("script")
        for script in scripts:
            if script.string:
                # 1. Google Maps style (legacy checks)
                coords_match = re.search(r'LatLng\s*\(\s*([-+]?\d*\.\d+|\d+)\s*,\s*([-+]?\d*\.\d+|\d+)\s*\)', script.string)
                if coords_match:
                     try:
                        latitude = float(coords_match.group(1))
                        longitude = float(coords_match.group(2))
                        break
                     except ValueError:
                        pass
                
                # 2. OpenLayers style: ol.proj.fromLonLat([-3.688, 40.425]) -> [lon, lat]
                ol_match = re.search(r'fromLonLat\s*\(\s*\[\s*([-+]?\d*\.\d+|\d+)\s*,\s*([-+]?\d*\.\d+|\d+)\s*\]', script.string)
                if ol_match:
                     try:
                        # OpenLayers uses [lon, lat] order in fromLonLat
                        longitude = float(ol_match.group(1))
                        latitude = float(ol_match.group(2))
                        break
                     except ValueError:
                        pass
                
                # 3. Generic variable assignments (lat = ..., lon = ...)
                # Case insensitive math for lat/lon variables
                lat_match = re.search(r'(?:var|let|const)?\s*(?:lat|latitude)\s*[:=]\s*([-+]?\d*\.\d+|\d+)', script.string, re.IGNORECASE)
                lng_match = re.search(r'(?:var|let|const)?\s*(?:lng|lon|longitude)\s*[:=]\s*([-+]?\d*\.\d+|\d+)', script.string, re.IGNORECASE)
                    
                if lat_match and lng_match:
                    try:
                        latitude = float(lat_match.group(1))
                        longitude = float(lng_match.group(1))
                        break
                    except ValueError:
                        continue

        return PropertyDetail(
            id=prop_id,
            title=title,
            description=description,
            price=price,
            images=unique_images,
            features=features,
            size=size,
            bedrooms=bedrooms,
            bathrooms=bathrooms,
            latitude=latitude,
            longitude=longitude
        )
