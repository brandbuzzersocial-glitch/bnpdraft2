import json
import re
from bs4 import BeautifulSoup

def slugify(text):
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text

# 1. Load HTML
with open(r"c:\BNP RESOURCE 2\projects.html", "r", encoding="utf-8") as f:
    html = f.read()

soup = BeautifulSoup(html, "html.parser")
cards = soup.find_all("div", class_="project-card")

# 2. Extract base data from HTML
new_data = {}

for card in cards:
    name_el = card.find("h3", class_="project-name")
    loc_el = card.find("p", class_="project-loc")
    
    if not name_el: continue
    
    name = name_el.get_text(strip=True)
    loc_text = loc_el.get_text(strip=True) if loc_el else ""
    
    parts = [p.strip() for p in loc_text.split("·")]
    location = parts[0] if len(parts) > 0 else ""
    scope = parts[1] if len(parts) > 1 else ""
    
    slug = slugify(name)
    
    # Base image from HTML
    img = card.find("img")
    images = [img.get("src")] if img else []
    
    new_data[slug] = {
        "id": slug,
        "name": name,
        "category": card.get("data-cat", ""),
        "location": location,
        "scope": scope,
        "images": images
    }

# 3. Re-inject images from slider_images.json
# Let's map slider_images keys to the correct slugs

mapping = {
    "COURTYARD BY MARRIOT, RANCHI, JHARKHAND": "courtyard-by-marriot",
    "DISTRICT 150, HYDERABAD": "district-150",
    "FAIRFIELD, CHENNAI, TAMIL NADU": "novotel-hotel-chennai",  # Because earlier we appended "Novotel Hotel" to the one in Chennai, wait! The original HTML said "Chennai... Fairfield"? No, original HTML said "Novotel Hotel" for Chennai! Let's check Fairfield.
    "HYATT PLACE, GURUGRAM, HARYANA": "hyatt-place",
    "HYATT REGENCY, PUNE, MAHARASHTRA": "hyatt-regency-pune",
    "INDIAN ACCENT, NMACC, BKC, MUMBAI, MAHARASHTRA": "indian-accent",
    "NOVOTAL HOTEL, SUITES AND RESORT, , PUNE, MAHARASHTRA": "novotel-hotel-pune",
    "PIRAMAL CLUBHOUSE, MUMBAI, MAHARSTHRA": "piramal-clubhouse",
    "QUORUM CLUB, HYDERABAD": "quorum-club",
    "RADISSON, JAMHSHEDPUR, JHARKHAND": "radisson-hotel-jamshedpur", # Wait, I didn't see Jamshedpur in HTML for Radisson. Let me use fuzzy matching or just check.
    "SHERATON, HYDERABAD, TELANGANA": "sheraton",
    "TAJ AMER, JAIPUR, RAJASTHAN": "taj-amer",
    "TAJ CHAMBERS, TAJ MAHAL PALACE MUMBAI, MAHARASHTRA": "the-chambers-taj-mahal-palace",
    "TAJ CIADADE DE, GOA": "seleqtions-by-taj-cidade-de-goa",
    "TAJ GANGA KUTIR, RAICHAK, WEST BENGAL": "taj-ganga-kutir",
    "TAJ GORBANDH PALACE, JAISALMER, RAJASTHAN": "taj-gorbandh-palace",
    "TAJ THE TREES, VIKHROLI, MAHARASHTRA": "taj-the-trees",
    "VIVANTA, BHUBANESHWAR, ODISHA": "vivanta"
}

# Wait, let's just use the previous projects-data.json to grab the consolidated scopes!
# Because my previous script merged "Taj Amer" scopes perfectly.
with open(r"c:\BNP RESOURCE 2\assets\js\projects-data.json", "r", encoding="utf-8") as f:
    old_data = json.load(f)

# If an old key matches a new key exactly (like taj-amer == taj-amer), we keep its scope and images.
# If an old key was novotel-hotel but we have novotel-hotel-pune, we shouldn't copy all images, 
# instead we inject from slider_images.json.

with open(r"c:\BNP RESOURCE 2\slider_images.json", "r", encoding="utf-8") as f:
    slider_data = json.load(f)

# Restore consolidated scopes and images from old data (only for unambiguous ones)
for slug, new_item in new_data.items():
    if slug in old_data:
        # Avoid restoring corrupted ones like novotel-hotel or radisson-hotel
        if "novotel" not in slug and "radisson" not in slug and "marriott" not in slug:
            # Preserve consolidated scope and images
            if len(old_data[slug]["scope"]) > len(new_item["scope"]):
                new_item["scope"] = old_data[slug]["scope"]
            
            # Merge images, removing duplicates
            for img in old_data[slug]["images"]:
                if img not in new_item["images"]:
                    new_item["images"].append(img)

# Now inject from slider_images
for key, mapping_slug in mapping.items():
    if mapping_slug in new_data:
        imgs = slider_data[key]["images"]
        for img in imgs:
            if img not in new_data[mapping_slug]["images"]:
                new_data[mapping_slug]["images"].append(img)

# Save
with open(r"c:\BNP RESOURCE 2\assets\js\projects-data.json", "w", encoding="utf-8") as f:
    json.dump(new_data, f, indent=2)

print("Rebuilt projects-data.json successfully.")
