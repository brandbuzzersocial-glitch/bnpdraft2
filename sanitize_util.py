import re

def sanitize_text(text):
    if not text:
        return ""
    
    # Replace common HTML entities and unicode quirks
    replacements = {
        '\xa0': ' ',
        '\u2013': '–',
        '\u2014': '—',
        '\u2018': '‘',
        '\u2019': "’",
        '\u201c': '“',
        '\u201d': '”',
        '\ufffd': ' ',
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#39;': "'",
        '&nbsp;': ' '
    }
    
    for k, v in replacements.items():
        text = text.replace(k, v)
        
    # Remove multiple spaces
    text = re.sub(r'[ \t]+', ' ', text)
    # Remove blank lines
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    return "\n".join(lines)

print("Sanitizer module created.")
