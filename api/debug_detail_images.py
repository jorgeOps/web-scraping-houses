import requests
from bs4 import BeautifulSoup

url = "https://www.thewellcomehome.com/es/venta_o_alquiler/ref-1052"
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

response = requests.get(url, headers=headers)
soup = BeautifulSoup(response.text, 'lxml')

print("--- RAW IMAGE CANDIDATES ---")
imgs = soup.find_all("img")
for img in imgs:
    src = img.get("data-src") or img.get("src")
    if src and "Images" in src:
        print(f"SRC: {src}")

print("\n--- CHECKING LIGHTSLIDER ---")
slider = soup.select("ul#lightSlider li")
print(f"Found {len(slider)} slider items.")
for li in slider:
    print(f"Slide Data-Src: {li.get('data-src')}")
