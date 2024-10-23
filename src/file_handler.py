import fitz  
from docx import Document  

def process_syllabus_input(syllabus_input=None, file=None, file_type=None):
    if syllabus_input:
        return syllabus_input 
    elif file and file_type == 'pdf':
        return extract_text_from_pdf(file)
    elif file and file_type == 'word':
        return extract_text_from_word(file)
    else:
        raise ValueError("Invalid input. Please provide either syllabus text or a valid file (PDF/Word).")

def extract_text_from_pdf(file):
    # Read the file content
    file_bytes = file.read()
    
    # Open the PDF from the bytes
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text("text")
    return text

def extract_text_from_word(file):
    # Read the file content
    file_bytes = file.read()
    
    # Open the Word document from the bytes
    with open("temp.docx", "wb") as f:
        f.write(file_bytes)

    doc = Document("temp.docx")
    return "\n".join([p.text for p in doc.paragraphs])
