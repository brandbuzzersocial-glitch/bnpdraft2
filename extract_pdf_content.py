import fitz
import json
from sanitize_util import sanitize_text

pdf_path = r'C:\Users\korja\Downloads\BNP INTERIORS PROFILE 2026. PRESENTATION (1) (2)\BNP INTERIORS PROFILE 2026. PRESENTATION (1).pdf'

doc = fitz.open(pdf_path)
print(f"Total Pages: {len(doc)}")

slides_data = []

for page_num in range(len(doc)):
    page = doc[page_num]
    text = page.get_text("text")
    clean_t = sanitize_text(text)
    lines = [line.strip() for line in clean_t.splitlines() if line.strip()]
    
    slide_title = lines[0] if lines else f"Slide {page_num + 1}"
    body_lines = lines[1:] if len(lines) > 1 else []
    
    slides_data.append({
        'slide_num': page_num + 1,
        'title': slide_title,
        'full_text': clean_t,
        'lines': lines
    })

print(f"Successfully processed {len(slides_data)} slides.")
with open('pdf_slides_extracted.json', 'w', encoding='utf-8') as f:
    json.dump(slides_data, f, indent=2, ensure_ascii=False)
print("Saved extracted slides to pdf_slides_extracted.json")
