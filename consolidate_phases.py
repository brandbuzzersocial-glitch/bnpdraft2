import json
from bs4 import BeautifulSoup
import re

# Load projects data
with open(r"c:\BNP RESOURCE 2\assets\js\projects-data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Load HTML
with open(r"c:\BNP RESOURCE 2\projects.html", "r", encoding="utf-8") as f:
    html = f.read()

soup = BeautifulSoup(html, "html.parser")
cards = soup.find_all("div", class_="project-card")

# 1. Identify main projects and phases
main_projects = {}
cards_to_remove = []

for card in cards:
    name_el = card.find("h3", class_="project-name")
    if not name_el:
        continue
    name = name_el.get_text(strip=True)
    
    # Check if it's a phase
    is_phase = False
    main_name = name
    if "(Phase" in name or "(Spa & Retail)" in name:
        is_phase = True
        main_name = re.sub(r'\s*\(.*?\)', '', name).strip()
    
    if not is_phase:
        main_projects[main_name] = card
    else:
        # Find corresponding main project card if exists, else keep it?
        # Let's just group them by main_name
        cards_to_remove.append((main_name, name, card))

# 2. Consolidate Data
# We also need to consolidate in JSON. We'll reconstruct the JSON based on the remaining cards and merged data.
# First, update the HTML by removing phase cards and merging info.

merged_data = {}

for main_name, phase_name, phase_card in cards_to_remove:
    # Find main card
    main_card = main_projects.get(main_name)
    if not main_card:
        print(f"Warning: Main project '{main_name}' not found for phase '{phase_name}'")
        continue
    
    # Extract scope from phase card
    scope_el = phase_card.find("p", class_="project-loc")
    phase_scope = scope_el.get_text(strip=True) if scope_el else ""
    if "·" in phase_scope:
        phase_scope = phase_scope.split("·", 1)[1].strip()
    
    # Append scope to main project scope in HTML? 
    # Or just in JSON. Let's do both.
    main_scope_el = main_card.find("p", class_="project-loc")
    if main_scope_el:
        main_text = main_scope_el.get_text(strip=True)
        # We can append it cleanly
        if phase_scope:
            if "·" in main_text:
                parts = main_text.split("·", 1)
                new_text = f"{parts[0]}· {parts[1].strip()}, {phase_scope}"
                main_scope_el.string = new_text
            else:
                main_scope_el.string = f"{main_text}, {phase_scope}"
    
    # Remove phase card from HTML
    phase_card.decompose()

# 3. Rebuild JSON from the updated HTML (since HTML is the source of truth for the list)
def slugify(text):
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text

new_json_data = {}
remaining_cards = soup.find_all("div", class_="project-card")

for card in remaining_cards:
    name_el = card.find("h3", class_="project-name")
    loc_el = card.find("p", class_="project-loc")
    
    name = name_el.get_text(strip=True) if name_el else "Unknown Project"
    loc_text = loc_el.get_text(strip=True) if loc_el else ""
    
    parts = [p.strip() for p in loc_text.split("·")]
    location = parts[0] if len(parts) > 0 else ""
    scope = parts[1] if len(parts) > 1 else ""
    
    slug = slugify(name)
    
    # We want to preserve all images from the previous json for the main project AND its phases
    all_images = []
    
    # Get old slug for main project
    old_slug = slugify(name)
    if old_slug in data:
        all_images.extend(data[old_slug]["images"])
        
    # Get old slugs for phases (we know them because they start with old_slug + phase)
    for old_key in data.keys():
        # if the old key is a phase of this project (e.g. taj-amer-phase-ii)
        if old_key.startswith(old_slug + "-phase") or old_key.startswith(old_slug + "-spa"):
            for img in data[old_key]["images"]:
                if img not in all_images:
                    all_images.append(img)
                    
    # The user also wanted to "Add all the images as provided". 
    # The JSON should already contain all provided images because they were added earlier.
    # Let's make sure we preserve them uniquely.
    unique_images = []
    for img in all_images:
        if img not in unique_images:
            unique_images.append(img)
            
    # Fallback to HTML if not in old JSON
    if not unique_images:
        img_el = card.find("img")
        if img_el:
            unique_images.append(img_el.get("src"))
            
    new_json_data[slug] = {
        "id": slug,
        "name": name,
        "category": card.get("data-cat", ""),
        "location": location,
        "scope": scope,
        "images": unique_images
    }
    
    # Update link in HTML to use the clean slug
    a_tag = card.find("a", href=re.compile(r"project-detail\.html"))
    if a_tag:
        a_tag["href"] = f"project-detail.html?id={slug}"

with open(r"c:\BNP RESOURCE 2\projects.html", "w", encoding="utf-8") as f:
    f.write(str(soup))
    
with open(r"c:\BNP RESOURCE 2\assets\js\projects-data.json", "w", encoding="utf-8") as f:
    json.dump(new_json_data, f, indent=2)

print("Consolidation complete.")
