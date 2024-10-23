// SyllabusUpload.js
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import ParsedSyllabusDisplay from './ParsedSyllabusDisplay';

const SyllabusUpload = ({ onSyllabusUploaded }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [parsedContent, setParsedContent] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf' || 
          selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
          selectedFile.type === 'text/plain') {
        setFile(selectedFile);
        setError('');
        setParsedContent(null);
      } else {
        setError('Please upload only PDF, Word, or text documents');
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('file_type', file.type);

    try {
      const response = await fetch('http://localhost:8000/api/parse-syllabus', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to parse syllabus');
      }

      const data = await response.json();
      setParsedContent(data.parsedContent);
      setUploadStatus('File uploaded and parsed successfully!');
      
      // Send parsed data to parent component
      if (onSyllabusUploaded) {
        onSyllabusUploaded({
          courseName: data.parsedContent.courseName,
          content: data.parsedContent
        });
      }
    } catch (err) {
      setError('Failed to upload and parse file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-5 w-5" />
          Upload Syllabus
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6">
          <div className="flex flex-col items-center space-y-4">
            <Upload className="h-12 w-12 text-gray-400" />
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Drag and drop your syllabus file here, or click to browse
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Supports PDF, Word, and text documents
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              id="syllabus-upload"
              accept=".pdf,.docx,.txt"
              onChange={handleFileChange}
            />
            <Button 
              variant="outline" 
              onClick={() => document.getElementById('syllabus-upload').click()}
            >
              Browse Files
            </Button>
          </div>
        </div>

        {file && (
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2 text-blue-500" />
              <span className="text-sm">{file.name}</span>
            </div>
            <Button 
              onClick={handleUpload} 
              disabled={loading}
              className="ml-4"
            >
              {loading ? 'Processing...' : 'Upload & Parse'}
            </Button>
          </div>
        )}

        {error && (
          <div className="flex items-center text-red-500 text-sm">
            <AlertCircle className="h-4 w-4 mr-2" />
            {error}
          </div>
        )}

        {uploadStatus && (
          <div className="text-green-500 text-sm text-center">
            {uploadStatus}
          </div>
        )}

        {parsedContent && <ParsedSyllabusDisplay syllabusData={parsedContent} />}
      </CardContent>
    </Card>
  );
};

export default SyllabusUpload;