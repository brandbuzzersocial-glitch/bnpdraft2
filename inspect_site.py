import glob
import os
from bs4 import BeautifulSoup

html_files = ['index.html', 'about.html', 'services.html', 'projects.html', 'media.html', 'blog.html', 'team.html', 'contact.html']

for f_path in html_files:
    if not os.path.exists(f_path):
        continue
    with open(f_path, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
    
    title = soup.title.string.strip() if soup.title else 'No Title'
    print(f"=== File: {f_path} | Title: {title} ===")
    
    sections = soup.find_all('section')
    if not sections:
        sections = soup.find_all('main')
    
    for idx, sec in enumerate(sections, 1):
        sec_id = sec.get('id', '')
        sec_class = ' '.join(sec.get('class', []))
        heading = sec.find(['h1', 'h2', 'h3', 'h4'])
        heading_text = heading.get_text(strip=True) if heading else 'No Heading'
        p_count = len(sec.find_all('p'))
        print(f"  Section {idx}: id='{sec_id}' class='{sec_class}' | Main Heading: '{heading_text}' | Paragraphs: {p_count}")
