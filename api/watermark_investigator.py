import requests
import time

base_img = "https://media.mobiliagestion.es/Portals/inmothewellcomehome/Images/1052/9018052.jpg"
# Also seen: 9018052-large.jpg, 9018052-thumb.jpg

# Break it down
base_path = "https://media.mobiliagestion.es/Portals/inmothewellcomehome/Images/1052/"
filename_no_ext = "9018052"
ext = ".jpg"

patterns = [
    f"{filename_no_ext}{ext}", # The one we have (baseline)
    f"{filename_no_ext}-large{ext}",
    f"{filename_no_ext}-thumb{ext}",
    f"{filename_no_ext}-original{ext}",
    f"{filename_no_ext}-orig{ext}",
    f"{filename_no_ext}_original{ext}",
    f"{filename_no_ext}_orig{ext}",
    f"{filename_no_ext}-master{ext}",
    f"{filename_no_ext}-full{ext}",
    f"{filename_no_ext}-sinmarca{ext}",
    f"{filename_no_ext}-clean{ext}",
    f"{filename_no_ext}-raw{ext}",
    f"original/{filename_no_ext}{ext}",
    f"master/{filename_no_ext}{ext}",
]

# Add a check for simply removing "-large" if the input had it, but here input doesn't have it.

print(f"Investigating {base_img}...")
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

for url in patterns:
    full_url = url if url.startswith("http") else f"{base_path}{url}"
    try:
        r = requests.head(full_url, headers=headers)
        if r.status_code == 200:
            size = r.headers.get('Content-Length', '0')
            print(f"[FOUND] {full_url} (Size: {size})")
        else:
            # print(f"[404] {full_url}")
            pass
    except Exception as e:
        print(f"[ERR] {e}")
    time.sleep(0.1)
