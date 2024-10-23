import re
from typing import Dict, Any

class SyllabusParser:
    def parse_syllabus(self, text: str) -> Dict[str, Any]:
        """
        Parses the syllabus text into a structured format.

        Args:
            text (str): The extracted text from the syllabus file.

        Returns:
            Dict[str, Any]: Structured syllabus data with course details.
        """
        syllabus = {
            "courseName": self.extract_course_name(text),
            "instructor": self.extract_instructor(text),
            "term": self.extract_term(text),
            "description": self.extract_description(text),
            "modules": self.extract_modules(text),
            "prerequisites": self.extract_prerequisites(text),
            "objectives": self.extract_objectives(text),
        }
        return syllabus

    def extract_course_name(self, text: str) -> str:
        """Extract the course name using regex or key phrases."""
        match = re.search(r"Course Name[:\s]*(.*)", text, re.IGNORECASE)
        return match.group(1).strip() if match else "Unknown"

    def extract_instructor(self, text: str) -> str:
        """Extract the instructor's name from the syllabus."""
        match = re.search(r"Instructor[:\s]*(.*)", text, re.IGNORECASE)
        return match.group(1).strip() if match else "Unknown"

    def extract_term(self, text: str) -> str:
        """Extract the term details."""
        match = re.search(r"Term[:\s]*(.*)", text, re.IGNORECASE)
        return match.group(1).strip() if match else "Unknown"

    def extract_description(self, text: str) -> str:
        """Extract the course description."""
        match = re.search(r"Description[:\s]*(.*?)(?:Module|Instructor|$)", text, re.DOTALL | re.IGNORECASE)
        return match.group(1).strip() if match else "No description provided"

    def extract_prerequisites(self, text: str) -> str:
        """Extract the prerequisites."""
        match = re.search(r"Prerequisites[:\s]*(.*)", text, re.IGNORECASE)
        return match.group(1).strip() if match else "No prerequisites"

    def extract_objectives(self, text: str) -> str:
        """Extract course objectives."""
        match = re.search(r"Objectives[:\s]*(.*?)(?:Module|$)", text, re.DOTALL | re.IGNORECASE)
        return match.group(1).strip() if match else "No objectives provided"

    def extract_modules(self, text: str) -> list:
        """
        Extract the list of modules from the syllabus.
        
        Modules might be defined by specific headings or keywords like "Module".
        """
        modules = []
        module_matches = re.finditer(r"Module[:\s]*(.*?)(?:Objectives|Prerequisites|Module|$)", text, re.DOTALL | re.IGNORECASE)
        
        for match in module_matches:
            module_text = match.group(1).strip()
            module = {
                "name": self.extract_module_name(module_text),
                "description": self.extract_module_description(module_text),
                "duration": self.extract_module_duration(module_text),
                "topics": self.extract_module_topics(module_text),
                "resources": self.extract_module_resources(module_text),
            }
            modules.append(module)
        
        return modules

    def extract_module_name(self, text: str) -> str:
        """Extract the module name."""
        match = re.search(r"Module Name[:\s]*(.*)", text, re.IGNORECASE)
        return match.group(1).strip() if match else "Unknown module"

    def extract_module_description(self, text: str) -> str:
        """Extract the module description."""
        match = re.search(r"Description[:\s]*(.*)", text, re.IGNORECASE)
        return match.group(1).strip() if match else "No description"

    def extract_module_duration(self, text: str) -> str:
        """Extract the module duration."""
        match = re.search(r"Duration[:\s]*(.*)", text, re.IGNORECASE)
        return match.group(1).strip() if match else "Unknown duration"

    def extract_module_topics(self, text: str) -> list:
        """Extract the list of topics covered in the module."""
        topics = []
        topic_matches = re.finditer(r"Topic[:\s]*(.*)", text, re.IGNORECASE)
        
        for match in topic_matches:
            topic_text = match.group(1).strip()
            topic = {
                "name": topic_text,  # Assuming each topic is simple text
                "description": "Description for this topic",  # Placeholder
                "duration": "Duration for this topic",  # Placeholder
                "completed": False  # Assuming unmarked topics are not completed
            }
            topics.append(topic)
        
        return topics

    def extract_module_resources(self, text: str) -> list:
        """Extract the list of resources for the module."""
        match = re.search(r"Resources[:\s]*(.*)", text, re.IGNORECASE)
        resources_text = match.group(1).strip() if match else "No resources"
        return [resource.strip() for resource in resources_text.split(',') if resource.strip()]

