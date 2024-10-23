from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from .syllabus_parser import SyllabusParser
from .utils.file_handlers import extract_text_from_file
from typing import Dict, Any
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI instance
app = FastAPI(
    title="Syllabus Parser API",
    description="API for parsing and structuring syllabus documents",
    version="2.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Replace with your React app's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the parser
parser = SyllabusParser()

def validate_syllabus_structure(parsed_content: Dict[str, Any]) -> bool:
    """
    Validate the parsed syllabus structure.
    Returns True if valid, False otherwise.
    """
    required_fields = {
        "courseName", "instructor", "term", "description",
        "modules", "prerequisites", "objectives"
    }
    
    if not all(field in parsed_content for field in required_fields):
        return False
    
    # Validate modules structure
    if not isinstance(parsed_content["modules"], list):
        return False
    
    for module in parsed_content["modules"]:
        required_module_fields = {
            "name", "description", "duration", "topics", "resources"
        }
        if not all(field in module for field in required_module_fields):
            return False
        
        # Validate topics structure
        if not isinstance(module["topics"], list):
            return False
        
        for topic in module["topics"]:
            required_topic_fields = {
                "name", "description", "duration", "completed"
            }
            if not all(field in topic for field in required_topic_fields):
                return False
    
    return True

@app.get("/")
async def read_root():
    """Health check endpoint"""
    return {
        "status": "online",
        "message": "Syllabus Parser API is running",
        "version": "2.0.0"
    }
@app.post("/api/parse-syllabus")
async def parse_syllabus(file: UploadFile = File(...)):
    """
    Parse an uploaded syllabus file and return structured content.
    
    Args:
        file (UploadFile): The uploaded syllabus file (PDF, DOCX, or TXT)
        
    Returns:
        JSONResponse: Structured syllabus data
    """
    try:
        # Validate file type
        allowed_types = {
            'application/pdf': 'pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
            'text/plain': 'txt'
        }
        
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail="Invalid file type. Please upload a PDF, Word document, or text file."
            )
        
        # Log file processing
        logger.info(f"Processing file: {file.filename} ({file.content_type})")
        
        # Extract text from the uploaded file
        text_content = await extract_text_from_file(file)
        
        if not text_content.strip():
            raise HTTPException(
                status_code=400,
                detail="Extracted text is empty. Please check the file content."
            )
        
        # Parse the syllabus
        parsed_content = parser.parse_syllabus(text_content)
        
        # Validate the parsed content structure
        if not validate_syllabus_structure(parsed_content):
            raise HTTPException(
                status_code=500,
                detail="Failed to generate valid syllabus structure"
            )
        
        # Log successful parsing
        logger.info(f"Successfully parsed syllabus: {parsed_content['courseName']}")
        
        return JSONResponse({
            "status": "success",
            "syllabusData": parsed_content,
            "metadata": {
                "fileName": file.filename,
                "fileType": file.content_type,
                "courseName": parsed_content["courseName"],
                "instructor": parsed_content["instructor"],
                "term": parsed_content["term"]
            }
        })
    
    except HTTPException as he:
        # Re-raise HTTP exceptions
        raise he
    
    except Exception as e:
        # Log the error
        logger.error(f"Error parsing syllabus: {str(e)}", exc_info=True)
        
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "message": "Failed to parse syllabus",
                "detail": str(e),
                "fileName": file.filename if file else None
            }
        )

# Error handlers for specific status codes
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "status": "error",
            "message": exc.detail
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    logger.error(f"Unexpected error: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "status": "error",
            "message": "An unexpected error occurred",
            "detail": str(exc)
        }
    )