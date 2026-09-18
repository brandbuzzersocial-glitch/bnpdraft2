import json
from bs4 import BeautifulSoup
import re

def slugify(text):
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text

with open(r"c:\BNP RESOURCE 2\projects.html", "r", encoding="utf-8") as f:
    html = f.read()

soup = BeautifulSoup(html, "html.parser")
cards = soup.find_all("div", class_="project-card")

for card in cards:
    name_el = card.find("h3", class_="project-name")
    loc_el = card.find("p", class_="project-loc")
    
    if not name_el or not loc_el:
        continue
        
    name = name_el.get_text(strip=True)
    loc_text = loc_el.get_text(strip=True)
    
    # Only append city if it's a generic hotel name, or to be safe, just all 'Hotel', 'Resort', or if user requested
    if "Hotel" in name or "Marriott" in name or "Novotel" in name or "Radisson" in name or "Hyatt" in name:
        parts = [p.strip() for p in loc_text.split("·")]
        location_part = parts[0] if len(parts) > 0 else ""
        
        # Extract city (before comma)
        city = location_part.split(",")[0].strip()
        
        # If city not already in name, append it
        if city and city.lower() not in name.lower() and city != "Pan India":
            # For "Hyatt Regency", make it "Hyatt Regency - Pune"
            new_name = f"{name} - {city}"
            name_el.string = new_name
            
            # Update the slug
            new_slug = slugify(new_name)
            a_tag = card.find("a", href=re.compile(r"project-detail\.html"))
            if a_tag:
                a_tag["href"] = f"project-detail.html?id={new_slug}"

with open(r"c:\BNP RESOURCE 2\projects.html", "w", encoding="utf-8") as f:
    f.write(str(soup))
    
print("Updated names in HTML.")
