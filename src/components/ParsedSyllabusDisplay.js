// ParsedSyllabusDisplay.js
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ChevronRight, ChevronDown, Calendar, Clock, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const ParsedSyllabusDisplay = ({ syllabusData }) => {
  const [expandedModules, setExpandedModules] = useState({});

  if (!syllabusData || Object.keys(syllabusData).length === 0) {
    return null;
  }

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  // Calculate progress for each module
  const calculateModuleProgress = (module) => {
    if (!module.topics || module.topics.length === 0) return 0;
    const completedTopics = module.topics.filter(topic => topic.completed).length;
    return Math.round((completedTopics / module.topics.length) * 100);
  };

  return (
    <Card className="mt-6">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <div>
              <CardTitle className="text-xl">
                {syllabusData.courseName || 'Course Syllabus'}
              </CardTitle>
              {syllabusData.instructor && (
                <p className="text-sm text-gray-500">
                  Instructor: {syllabusData.instructor}
                </p>
              )}
            </div>
          </div>
          {syllabusData.term && (
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-2" />
              {syllabusData.term}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {/* Course Description if available */}
        {syllabusData.description && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Course Description</h3>
            <p className="text-gray-700">{syllabusData.description}</p>
          </div>
        )}

        {/* Modules/Units */}
        <div className="space-y-4">
          {syllabusData.modules?.map((module, moduleIndex) => (
            <div 
              key={moduleIndex}
              className="border rounded-lg overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                onClick={() => toggleModule(moduleIndex)}
              >
                <div className="flex items-center space-x-3">
                  <div className="font-semibold">{module.name}</div>
                  {module.duration && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {module.duration}
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <Progress 
                    value={calculateModuleProgress(module)} 
                    className="w-24"
                  />
                  {expandedModules[moduleIndex] ? (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </button>

              {expandedModules[moduleIndex] && (
                <div className="p-4 space-y-3">
                  {module.description && (
                    <p className="text-gray-700 text-sm mb-4">
                      {module.description}
                    </p>
                  )}
                  
                  {module.topics?.map((topic, topicIndex) => (
                    <div 
                      key={topicIndex}
                      className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded"
                    >
                      <div className="flex-shrink-0">
                        <CheckCircle 
                          className={`h-5 w-5 ${
                            topic.completed 
                              ? 'text-green-500' 
                              : 'text-gray-300'
                          }`} 
                        />
                      </div>
                      <div className="flex-grow">
                        <p className="text-gray-800">{topic.name}</p>
                        {topic.description && (
                          <p className="text-sm text-gray-500">
                            {topic.description}
                          </p>
                        )}
                      </div>
                      {topic.duration && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {topic.duration}
                        </div>
                      )}
                    </div>
                  ))}

                  {module.resources && module.resources.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="text-sm font-semibold mb-2">Resources</h4>
                      <ul className="space-y-2">
                        {module.resources.map((resource, index) => (
                          <li 
                            key={index}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            <a href={resource.url} target="_blank" rel="noopener noreferrer">
                              {resource.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Additional Course Information */}
        {(syllabusData.prerequisites || syllabusData.objectives) && (
          <div className="mt-8 space-y-6">
            {syllabusData.prerequisites && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Prerequisites</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {syllabusData.prerequisites.map((prereq, index) => (
                    <li key={index} className="text-gray-700">{prereq}</li>
                  ))}
                </ul>
              </div>
            )}

            {syllabusData.objectives && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Learning Objectives</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {syllabusData.objectives.map((objective, index) => (
                    <li key={index} className="text-gray-700">{objective}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ParsedSyllabusDisplay;