import requests
from bs4 import BeautifulSoup
import re

url = "https://www.thewellcomehome.com/es/venta_o_alquiler/ref-1052"
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

response = requests.get(url, headers=headers)
soup = BeautifulSoup(response.text, 'lxml')

print("--- RAW TITLE ---")
print(soup.title.string)

# Simulation of current logic
title = soup.title.string if soup.title else "Detalle"
title = title.split(".")[0]
title = re.sub(r'(?i)Ref\s*[:.]?\s*\d+', '', title).strip()
print(f"--- CLEANED TITLE (Current) ---\n'{title}'")

print("\n--- PRICE SEARCH ---")
# Current logic
price_candidates = soup.find_all(string=lambda text: "€" in text if text else False)
for i, p in enumerate(price_candidates):
    print(f"Match {i}: '{p.strip()}' parent: {p.parent.name} class={p.parent.get('class')}")
