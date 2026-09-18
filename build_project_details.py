import json
import re
from bs4 import BeautifulSoup
import string

def slugify(text):
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text

with open(r"c:\BNP RESOURCE 2\projects.html", "r", encoding="utf-8") as f:
    html_content = f.read()

soup = BeautifulSoup(html_content, "html.parser")
cards = soup.find_all("div", class_="project-card")

projects_data = {}

for card in cards:
    cat = card.get("data-cat", "")
    info = card.find("div", class_="project-info")
    name_el = info.find("h3", class_="project-name") if info else None
    loc_el = info.find("p", class_="project-loc") if info else None
    
    name = name_el.get_text(strip=True) if name_el else "Unknown Project"
    
    # Generate unique slug
    base_slug = slugify(name)
    slug = base_slug
    counter = 1
    while slug in projects_data:
        slug = f"{base_slug}-{counter}"
        counter += 1
        
    loc_text = loc_el.get_text(strip=True) if loc_el else ""
    # Usually "Location · Scope"
    parts = [p.strip() for p in loc_text.split("·")]
    location = parts[0] if len(parts) > 0 else ""
    scope = parts[1] if len(parts) > 1 else ""
    
    # Extract images
    images = []
    # Images might be in anchor tags with data-fancybox
    anchors = card.find_all("a", attrs={"data-fancybox": True})
    if anchors:
        for a in anchors:
            href = a.get("href")
            if href and href not in images:
                images.append(href)
    else:
        # Fallback to img src
        img = card.find("img")
        if img:
            images.append(img.get("src"))
            
    # Add to data dict
    projects_data[slug] = {
        "id": slug,
        "name": name,
        "category": cat,
        "location": location,
        "scope": scope,
        "images": images
    }
    
    # Modify card to link to detail page
    img_wrap = card.find("div", class_="project-img-wrap")
    if img_wrap:
        # Remove old fancybox anchors
        for a in card.find_all("a", attrs={"data-fancybox": True}):
            a.decompose()
        
        # Ensure img_wrap is clear except for our new link
        img_wrap.clear()
        
        detail_link = soup.new_tag("a", href=f"project-detail.html?id={slug}")
        detail_link["style"] = "display: block; width: 100%; height: 100%;"
        
        thumb_src = images[0] if images else ""
        thumb_img = soup.new_tag("img", src=thumb_src, alt=name)
        thumb_img["loading"] = "lazy"
        
        detail_link.append(thumb_img)
        img_wrap.append(detail_link)

# Save json data
with open(r"c:\BNP RESOURCE 2\assets\js\projects-data.json", "w", encoding="utf-8") as f:
    json.dump(projects_data, f, indent=2)

# Save updated HTML
with open(r"c:\BNP RESOURCE 2\projects.html", "w", encoding="utf-8") as f:
    f.write(str(soup))

print("Extracted projects data and updated projects.html")
