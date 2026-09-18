import json
from bs4 import BeautifulSoup
import re

with open(r"c:\BNP RESOURCE 2\projects.html", "r", encoding="utf-8") as f:
    html_content = f.read()

soup = BeautifulSoup(html_content, "html.parser")

cards = soup.find_all("div", class_="project-card")

for i, card in enumerate(cards):
    img_wrap = card.find("div", class_="project-img-wrap")
    if not img_wrap:
        continue
    
    gallery_id = f"gallery_{i}"
    
    # Check if there is a Swiper slider inside
    swiper = img_wrap.find("div", class_="swiper")
    images = []
    
    if swiper:
        # Extract all images from swiper slides
        slides = swiper.find_all("img")
        for img in slides:
            images.append((img.get("src"), img.get("alt")))
    else:
        # Check if there's a fancybox anchor already or just a single img
        anchor = img_wrap.find("a", attrs={"data-fancybox": True})
        if anchor:
            # Already fancybox, skip or re-process? Let's just grab the img inside
            img = anchor.find("img")
            if img:
                images.append((img.get("src"), img.get("alt")))
        else:
            img = img_wrap.find("img")
            if img:
                images.append((img.get("src"), img.get("alt")))
    
    if not images:
        continue
    
    # Rebuild the img_wrap contents
    img_wrap.clear()
    
    # First image becomes the visible thumbnail inside the img_wrap
    first_src, first_alt = images[0]
    visible_a = soup.new_tag("a", href=first_src, **{"data-fancybox": gallery_id})
    visible_a["style"] = "display: block; width: 100%; height: 100%; cursor: zoom-in;"
    
    thumbnail_img = soup.new_tag("img", src=first_src, alt=first_alt)
    thumbnail_img["loading"] = "lazy"
    # Remove any swiper inline styles, just let the original css handle it
    
    visible_a.append(thumbnail_img)
    img_wrap.append(visible_a)
    
    # Any other images become hidden anchors appended to the card
    # First remove any existing hidden anchors to avoid duplicates
    for hidden_a in card.find_all("a", attrs={"data-fancybox": gallery_id, "style": "display: none;"}):
        hidden_a.decompose()
        
    for src, alt in images[1:]:
        hidden_a = soup.new_tag("a", href=src, **{"data-fancybox": gallery_id})
        hidden_a["style"] = "display: none;"
        card.append(hidden_a)

# Replace Swiper CDN with Fancybox CDN
head = soup.head
swiper_css = head.find("link", href=re.compile("swiper-bundle.min.css"))
if swiper_css:
    swiper_css.decompose()

if not head.find("link", href=re.compile("fancyapps/ui")):
    fancy_css = soup.new_tag("link", rel="stylesheet", href="https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.css")
    head.append(fancy_css)

body = soup.body
swiper_js = body.find("script", src=re.compile("swiper-bundle.min.js"))
if swiper_js:
    swiper_js.decompose()

if not body.find("script", src=re.compile("fancyapps/ui")):
    fancy_js = soup.new_tag("script", src="https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.umd.js")
    body.append(fancy_js)
    
    init_script = soup.new_tag("script")
    init_script.string = "Fancybox.bind('[data-fancybox]', {});"
    body.append(init_script)

with open(r"c:\BNP RESOURCE 2\projects.html", "w", encoding="utf-8") as f:
    f.write(str(soup))

print("Fixed HTML for Lightbox gallery.")
