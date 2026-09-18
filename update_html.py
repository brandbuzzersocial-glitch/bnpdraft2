import json
from bs4 import BeautifulSoup
import re

with open(r"c:\BNP RESOURCE 2\slider_images.json", "r") as f:
    project_images = json.load(f)

with open(r"c:\BNP RESOURCE 2\projects.html", "r", encoding="utf-8") as f:
    html_content = f.read()

soup = BeautifulSoup(html_content, "html.parser")

# Map json keys to search terms in HTML (either name or location)
mapping = {
    "COURTYARD BY MARRIOT, RANCHI, JHARKHAND": ["Marriott Hotel", "Ranchi"],
    "DISTRICT 150, HYDERABAD": ["District 150"],
    "FAIRFIELD, CHENNAI, TAMIL NADU": ["Chennai"], # "Fairfield" might not be in the name
    "HYATT PLACE, GURUGRAM, HARYANA": ["Hyatt Place", "Gurugram"],
    "HYATT REGENCY, PUNE, MAHARASHTRA": ["Hyatt Regency", "Pune"],
    "INDIAN ACCENT, NMACC, BKC, MUMBAI, MAHARASHTRA": ["Indian Accent"],
    "NOVOTAL HOTEL, SUITES AND RESORT, , PUNE, MAHARASHTRA": ["Novotel Hotel", "Pune"],
    "PIRAMAL CLUBHOUSE, MUMBAI, MAHARSTHRA": ["Piramal"],
    "QUORUM CLUB, HYDERABAD": ["Quorum"],
    "RADISSON, JAMHSHEDPUR, JHARKHAND": ["Radisson", "Jamshedpur"],
    "SHERATON, HYDERABAD, TELANGANA": ["Sheraton", "Hyderabad"],
    "TAJ AMER, JAIPUR, RAJASTHAN": ["Taj Amer", "Jaipur"],
    "TAJ CHAMBERS, TAJ MAHAL PALACE MUMBAI, MAHARASHTRA": ["Chambers, Taj Mahal"],
    "TAJ CIADADE DE, GOA": ["Cidade de Goa"],
    "TAJ GANGA KUTIR, RAICHAK, WEST BENGAL": ["Taj Ganga Kutir"],
    "TAJ GORBANDH PALACE, JAISALMER, RAJASTHAN": ["Taj Gorbandh Palace"],
    "TAJ THE TREES, VIKHROLI, MAHARASHTRA": ["Taj The Trees", "Vikhroli"],
    "VIVANTA, BHUBANESHWAR, ODISHA": ["Vivanta", "Bhubaneshwar"]
}

# Function to check if a project card matches
def card_matches(card, terms):
    text = card.get_text().lower()
    return all(term.lower() in text for term in terms)

grid = soup.find(id="projects-grid")
cards = grid.find_all("div", class_="project-card")

# Keep track of which projects from JSON were found
found_projects = set()

for key, data in project_images.items():
    terms = mapping.get(key)
    if not terms:
        continue
    
    # Find matching card
    matched_card = None
    for card in cards:
        if card_matches(card, terms):
            matched_card = card
            break
    
    if matched_card:
        found_projects.add(key)
        img_wrap = matched_card.find("div", class_="project-img-wrap")
        if img_wrap:
            # Check if already a swiper
            if not img_wrap.find("div", class_="swiper"):
                # Create swiper structure
                images = data["images"]
                
                swiper_container = soup.new_tag("div")
                swiper_container['class'] = "swiper project-slider"
                swiper_container['style'] = "width: 100%; height: 100%;"
                
                swiper_wrapper = soup.new_tag("div")
                swiper_wrapper['class'] = "swiper-wrapper"
                
                for img_src in images:
                    slide = soup.new_tag("div")
                    slide['class'] = "swiper-slide"
                    img = soup.new_tag("img")
                    img['src'] = img_src
                    img['alt'] = key
                    img['loading'] = "lazy"
                    img['style'] = "width: 100%; height: 100%; object-fit: cover;"
                    slide.append(img)
                    swiper_wrapper.append(slide)
                
                swiper_container.append(swiper_wrapper)
                
                # Add navigation and pagination
                next_btn = soup.new_tag("div", **{'class': 'swiper-button-next'})
                prev_btn = soup.new_tag("div", **{'class': 'swiper-button-prev'})
                pagination = soup.new_tag("div", **{'class': 'swiper-pagination'})
                
                swiper_container.append(next_btn)
                swiper_container.append(prev_btn)
                swiper_container.append(pagination)
                
                img_wrap.clear()
                img_wrap.append(swiper_container)

# Missing projects to append
missing_keys = set(project_images.keys()) - found_projects
for key in missing_keys:
    data = project_images[key]
    images = data["images"]
    
    card = soup.new_tag("div")
    card['class'] = "project-card"
    card['data-cat'] = "hospitality" # default
    
    img_wrap = soup.new_tag("div")
    img_wrap['class'] = "project-img-wrap"
    
    swiper_container = soup.new_tag("div")
    swiper_container['class'] = "swiper project-slider"
    swiper_container['style'] = "width: 100%; height: 100%;"
    
    swiper_wrapper = soup.new_tag("div")
    swiper_wrapper['class'] = "swiper-wrapper"
    
    for img_src in images:
        slide = soup.new_tag("div")
        slide['class'] = "swiper-slide"
        img = soup.new_tag("img")
        img['src'] = img_src
        img['alt'] = key
        img['loading'] = "lazy"
        img['style'] = "width: 100%; height: 100%; object-fit: cover;"
        slide.append(img)
        swiper_wrapper.append(slide)
    
    swiper_container.append(swiper_wrapper)
    swiper_container.append(soup.new_tag("div", **{'class': 'swiper-button-next'}))
    swiper_container.append(soup.new_tag("div", **{'class': 'swiper-button-prev'}))
    swiper_container.append(soup.new_tag("div", **{'class': 'swiper-pagination'}))
    
    img_wrap.append(swiper_container)
    card.append(img_wrap)
    
    info = soup.new_tag("div")
    info['class'] = "project-info"
    
    cat = soup.new_tag("span")
    cat['class'] = "project-cat"
    cat.string = "Hospitality"
    
    name = soup.new_tag("h3")
    name['class'] = "project-name"
    name.string = key.split(",")[0].title()
    
    loc = soup.new_tag("p")
    loc['class'] = "project-loc"
    loc.string = key.title()
    
    info.append(cat)
    info.append(name)
    info.append(loc)
    
    card.append(info)
    grid.append(card)

# Add Swiper CDN if not present
head = soup.head
if head and not head.find("link", href=re.compile("swiper-bundle.min.css")):
    link = soup.new_tag("link", rel="stylesheet", href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css")
    head.append(link)

body = soup.body
if body and not body.find("script", src=re.compile("swiper-bundle.min.js")):
    script = soup.new_tag("script", src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js")
    body.append(script)

with open(r"c:\BNP RESOURCE 2\projects.html", "w", encoding="utf-8") as f:
    f.write(str(soup))

print("Missing projects appended:", missing_keys)
print("Done updating HTML.")
