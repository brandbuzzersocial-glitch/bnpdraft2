import os
import re
from bs4 import BeautifulSoup
from sanitize_util import sanitize_text

def extract_page_elements(html_file):
    if not os.path.exists(html_file):
        return []
    
    with open(html_file, 'r', encoding='utf-8', errors='ignore') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
    
    # Decompose non-content tags
    for tag in soup(['script', 'style', 'svg', 'noscript', 'iframe']):
        tag.decompose()
        
    page_sections = []
    
    # 1. Page Browser Meta & Title
    meta_desc = soup.find('meta', attrs={'name': 'description'})
    desc_content = sanitize_text(meta_desc['content']) if meta_desc and meta_desc.has_attr('content') else ""
    page_title = sanitize_text(soup.title.string) if soup.title else ""
    
    meta_elements = []
    if page_title:
        meta_elements.append(("Page Browser Title (SEO)", page_title))
    if desc_content:
        meta_elements.append(("Meta Description (SEO)", desc_content))
    if meta_elements:
        page_sections.append({
            'section_title': 'SEO & Browser Metadata',
            'elements': meta_elements
        })
    
    # 2. Extract Sections from Main/Body
    main = soup.find('main') or soup.find('body')
    if not main:
        return page_sections

    sections = main.find_all('section', recursive=True)
    if not sections:
        sections = [main]
        
    for s_idx, sec in enumerate(sections, 1):
        sec_id = sec.get('id', '')
        sec_class = ' '.join(sec.get('class', []))
        
        # Determine section title
        heading_tag = sec.find(['h1', 'h2', 'h3'])
        sec_name = ""
        if heading_tag:
            sec_name = sanitize_text(heading_tag.get_text())
        if not sec_name:
            if 'hero' in sec_class or 'hero' in sec_id:
                sec_name = "Hero Banner Section"
            elif 'cta' in sec_class or 'cta' in sec_id:
                sec_name = "Call-To-Action (CTA) Section"
            elif 'testimonial' in sec_class or 'testimonial' in sec_id:
                sec_name = "Client Testimonials & Endorsements"
            elif 'team' in sec_class or 'team' in sec_id:
                sec_name = "Leadership & Team Section"
            elif 'timeline' in sec_class or 'timeline' in sec_id:
                sec_name = "Our Journey & Milestones Timeline"
            else:
                sec_name = f"Content Section {s_idx}"
            
        elements = []
        seen_texts = set()

        def add_element(elem_label, txt):
            clean_t = sanitize_text(txt)
            if clean_t and clean_t not in seen_texts and len(clean_t) > 1:
                seen_texts.add(clean_t)
                elements.append((elem_label, clean_t))
        
        # Eyebrow / Badges / Subtitles
        badges = sec.find_all(class_=lambda c: c and any(b in str(c).lower() for b in ['badge', 'eyebrow', 'subtitle', 'tag', 'hero-subtitle', 'section-tag']))
        for b in badges:
            add_element("Eyebrow / Section Tag", b.get_text())
                
        # Headings (H1, H2, H3, H4, H5)
        headings = sec.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
        for h in headings:
            tag_name = h.name.upper()
            add_element(f"Heading ({tag_name})", h.get_text())
                
        # Paragraphs & Body Text
        paragraphs = sec.find_all('p')
        for p_idx, p in enumerate(paragraphs, 1):
            add_element(f"Body Paragraph {p_idx}", p.get_text())

        # Cards / Feature Blocks
        cards = sec.find_all(class_=lambda c: c and any(card in str(c).lower() for card in ['card', 'vertical-card', 'step-card', 'feature-item', 'metric-card', 'timeline-content', 'testimonial-card']))
        if cards:
            for c_idx, card in enumerate(cards, 1):
                c_title = card.find(['h3', 'h4', 'h5', 'strong'])
                c_desc = card.find('p')
                if c_title and c_desc:
                    card_txt = f"{sanitize_text(c_title.get_text())}: {sanitize_text(c_desc.get_text())}"
                    add_element(f"Feature Card / Item {c_idx}", card_txt)

        # Lists (ul, ol)
        lists = sec.find_all(['ul', 'ol'])
        for l_idx, lst in enumerate(lists, 1):
            items = [sanitize_text(li.get_text()) for li in lst.find_all('li') if sanitize_text(li.get_text())]
            if items:
                items_str = "\n• " + "\n• ".join(items)
                add_element(f"Bullet List / Key Highlights", items_str)
                
        # Blockquotes / Testimonials
        quotes = sec.find_all(['blockquote', 'q'])
        for q in quotes:
            add_element("Quote / Testimonial", q.get_text())
                
        # Buttons & CTAs
        buttons = sec.find_all(['a', 'button'], class_=lambda c: c and any(btn in str(c).lower() for btn in ['btn', 'button', 'cta', 'link']))
        for btn in buttons:
            txt = btn.get_text()
            if len(sanitize_text(txt)) < 80:
                add_element("Button / CTA Label", txt)
                
        # Form Labels & Placeholders
        form_inputs = sec.find_all(['input', 'textarea', 'select', 'label'])
        for inp in form_inputs:
            if inp.name == 'label':
                add_element("Form Field Label", inp.get_text())
            elif inp.get('placeholder'):
                add_element(f"Input Field Placeholder ({inp.get('name', 'field')})", inp.get('placeholder'))

        if elements:
            page_sections.append({
                'section_title': f"Section {s_idx}: {sec_name}",
                'elements': elements
            })
            
    return page_sections
