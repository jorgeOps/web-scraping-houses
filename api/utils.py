import re

def clean_description(text: str) -> str:
    if not text: return ""
    
    # Replace "The Well Come Home" with "O.S Arquitectura"
    # Handling case insensitivity and spacing variations
    text = re.sub(r'(?i)The\s*Well\s*Come\s*Home', 'OBS & WCH', text)
    
    # Only collapse multiple horizontal spaces (not newlines)
    # [ \t]+ matches spaces/tabs but not \n
    text = re.sub(r'[ \t]+', ' ', text)
    
    return text.strip()
