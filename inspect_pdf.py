import os
import pypdf

pdf_path = r'C:\Users\korja\Downloads\BNP INTERIORS PROFILE 2026. PRESENTATION (1) (2)\BNP INTERIORS PROFILE 2026. PRESENTATION (1).pdf'

reader = pypdf.PdfReader(pdf_path)
num_pages = len(reader.pages)
print(f"Total Pages in PDF: {num_pages}")

for i, page in enumerate(reader.pages):
    text = page.extract_text() or ""
    first_few_lines = [line.strip() for line in text.splitlines() if line.strip()][:3]
    summary = " | ".join(first_few_lines) if first_few_lines else "[No text / Image-based slide]"
    print(f"Page {i+1}: {summary[:100]}")
