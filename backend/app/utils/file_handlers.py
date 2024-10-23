from fastapi import UploadFile, HTTPException
import PyPDF2
from docx import Document
from io import BytesIO
import logging

logger = logging.getLogger(__name__)

async def extract_text_from_file(file: UploadFile) -> str:
    """
    Extract text content from various file types.
    
    Args:
        file (UploadFile): The uploaded file
        
    Returns:
        str: Extracted text content
    """
    try:
        content = await file.read()
        text = ""
        
        if file.content_type == 'application/pdf':
            text = extract_from_pdf(content)
        elif file.content_type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            text = extract_from_docx(content)
        elif file.content_type == 'text/plain':
            text = content.decode('utf-8')
        else:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type: {file.content_type}"
            )
        
        await file.seek(0)  # Reset file pointer
        return text
        
    except Exception as e:
        logger.error(f"Error extracting text from file: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to extract text from file: {str(e)}"
        )

def extract_from_pdf(content: bytes) -> str:
    """Extract text from PDF content."""
    try:
        pdf_file = BytesIO(content)
        reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        logger.error(f"Error extracting text from PDF: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Failed to extract text from PDF"
        )

def extract_from_docx(content: bytes) -> str:
    """Extract text from DOCX content."""
    try:
        doc_file = BytesIO(content)
        doc = Document(doc_file)
        text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
        return text
    except Exception as e:
        logger.error(f"Error extracting text from DOCX: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Failed to extract text from DOCX"
        )