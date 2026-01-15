import requests
from bs4 import BeautifulSoup
import re

url = "https://www.thewellcomehome.com/es/venta_o_alquiler/ref-1052"
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

response = requests.get(url, headers=headers)
soup = BeautifulSoup(response.text, 'lxml')

print("--- PRICE ANALYSIS ---")
# Look for 'euros' class seen in previous debug
euro_spans = soup.find_all("span", class_="euros")
for span in euro_spans:
    print(f"Euro Span Parent: {span.parent}")
    print(f"Euro Span Previous Sibling: {span.previous_sibling}")
    print(f"Euro Span Parent Text: {span.parent.get_text(strip=True)}")

# Look for generic price classes
price_classes = soup.select("[class*='precio'], [class*='Price']")
for el in price_classes:
    print(f"Class match '{el.get('class')}': {el.get_text(strip=True)}")

print("\n--- ICON BLOCK ANALYSIS (.bloqueIconosBig) ---")
block = soup.find("div", class_="bloqueIconosBig")
if block:
    print(block.prettify())
    items = block.find_all("div", class_="spanIconosInmuebleBig")
    for item in items:
        print(f"Item: {item.get_text(strip=True)}")
else:
    print("Block .bloqueIconosBig NOT FOUND")
