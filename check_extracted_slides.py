import json

with open('pdf_slides_extracted.json', 'r', encoding='utf-8') as f:
    slides = json.load(f)

print(f"Total Slides Extracted: {len(slides)}")

categories = {
    "1. Executive Profile & Leadership Vision": list(range(1, 6)),
    "2. Chronicles of BNP Interiors (Timeline 2006-2026)": list(range(6, 10)),
    "3. Philosophy, ERP & Growth Processes": list(range(10, 12)),
    "4. Infrastructure, Machinery & Millwork Plant": list(range(12, 16)),
    "5. Project Sectors & PAN India Geographic Footprint": list(range(16, 18)),
    "6. Hospitality Division & Luxury Hotel Case Studies": list(range(18, 46)),
    "7. High-End Member Clubs": list(range(46, 50)),
    "8. Corporate Division & Headquarters Projects": list(range(50, 75)),
    "9. Retail, Malls, Education & Healthcare Projects": list(range(75, 83)),
    "10. Luxury Hi-End Residential Projects": list(range(83, 88)),
    "11. Innovation, SOH Magazine & Future Outlook": list(range(88, 90)),
    "12. Ongoing Projects Showcase": list(range(90, 92)),
    "13. Corporate Office & Official Contact Details": [92]
}

for cat_name, slide_nums in categories.items():
    print(f"\n=== {cat_name} (Slides {slide_nums[0]} - {slide_nums[-1]}) ===")
    for sn in slide_nums:
        s = slides[sn - 1]
        line_preview = " / ".join(s['lines'][:2]) if s['lines'] else "[Image / No Text]"
        print(f"  Slide {sn:02d}: {line_preview[:80]}")
