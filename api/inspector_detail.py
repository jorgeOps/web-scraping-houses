import requests
from bs4 import BeautifulSoup
import sys

# Example detail URL (ref-1052)
url = "https://www.thewellcomehome.com/es/venta_o_alquiler/ref-1052"
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

try:
    print(f"Inspecting {url}...")
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, 'lxml')
    
    # 1. Look for Description
    print("\n--- DESCRIPTION SEARCH ---")
    # Heuristics: large blocks of text, classes like 'descripcion', 'detalle'
    # Checking generic 'p' tags with significant length
    for p in soup.find_all('p'):
        text = p.get_text(strip=True)
        if len(text) > 200:
            print(f"Found candidate P ({len(text)} chars):\n{text[:100]}...")
            print(f"  Parent: {p.parent.name} class={p.parent.get('class')}")
            
    # 2. Look for Images
    print("\n--- IMAGE SEARCH ---")
    # Look for galleries
    imgs = soup.find_all('img')
    print(f"Found {len(imgs)} images total.")
    
    # Filter for likely property photos (usually large or in slider)
    candidates = []
    for img in imgs:
        src = img.get('src') or img.get('data-src')
        if not src: continue
        
        # Heuristic: exclude logos, icons
        if 'logo' in src.lower() or 'icon' in src.lower(): continue
        
        # Check parent for gallery hints
        parent_cls = str(img.parent.get('class'))
        grandparent_cls = str(img.parent.parent.get('class'))
        
        if 'owl' in parent_cls or 'slide' in parent_cls or 'gallery' in grandparent_cls:
             candidates.append(src)
             
    print(f"Found {len(candidates)} candidate gallery images.")
    for c in candidates[:5]:
        print(f"  {c}")

    # Specific Inspection based on common layouts
    # Check for 'owl-carousel' commonly used in real estate
    carousel = soup.find(class_='owl-carousel')
    if carousel:
        print("\nFound .owl-carousel!")
        
except Exception as e:
    print(f"Error: {e}")
