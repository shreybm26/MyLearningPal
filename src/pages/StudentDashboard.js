import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Award, Calendar, Clock, BookMarked, FileText, Target, User } from 'lucide-react';
import SyllabusUpload from '@/components/SyllabusUpload';
import Quiz from '@/components/Quiz';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Updated student data with new subjects and module tracking
  const [studentData, setStudentData] = useState({
    name: "Alex Johnson",
    email: "alex.j@student.com",
    enrolledSubjects: [
      { 
        id: 1, 
        name: "Operating Systems",
        nextTopic: "Process Scheduling",
        nextSession: "Tomorrow, 10:00 AM",
        modules: [
          { name: "Introduction to OS", completed: false },
          { name: "Process Management", completed: false },
          { name: "Memory Management", completed: false },
          { name: "File Systems", completed: false },
          { name: "I/O Systems", completed: false }
        ]
      },
      { 
        id: 2, 
        name: "Computer Networks", 
        nextTopic: "Network Layer",
        nextSession: "Wednesday, 2:00 PM",
        modules: [
          { name: "Physical Layer", completed: false },
          { name: "Data Link Layer", completed: false },
          { name: "Network Layer", completed: false },
          { name: "Transport Layer", completed: false },
          { name: "Application Layer", completed: false }
        ]
      }
    ]
  });

  // Function to toggle module completion
  const toggleModule = (subjectId, moduleIndex) => {
    setStudentData(prevData => {
      const newData = { ...prevData };
      const subject = newData.enrolledSubjects.find(s => s.id === subjectId);
      subject.modules[moduleIndex].completed = !subject.modules[moduleIndex].completed;
      return newData;
    });
  };

  // Calculate progress for a subject
  const calculateProgress = (modules) => {
    const completedModules = modules.filter(module => module.completed).length;
    return Math.round((completedModules / modules.length) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">MyLearningPal</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/profile')}>
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
              <span className="text-gray-600">Welcome, {studentData.name}</span>
              <Button variant="outline">Logout</Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 space-y-4">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-2">
                  <Button 
                    variant={activeTab === 'overview' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('overview')}
                  >
                    <Target className="mr-2 h-4 w-4" />
                    Overview
                  </Button>
                  <Button 
                    variant={activeTab === 'subjects' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('subjects')}
                  >
                    <BookMarked className="mr-2 h-4 w-4" />
                    My Subjects
                  </Button>
                  <Button 
                    variant={activeTab === 'syllabus' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('syllabus')}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Syllabus
                  </Button>
                  <Button 
                    variant={activeTab === 'quiz' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('quiz')}
                  >
                    <Award className="mr-2 h-4 w-4" />
                    Take Quiz
                  </Button>
                </nav>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Subjects</span>
                  <span className="font-semibold">{studentData.enrolledSubjects.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg. Progress</span>
                  <span className="font-semibold">
                    {Math.round(
                      studentData.enrolledSubjects.reduce((acc, subj) => 
                        acc + calculateProgress(subj.modules), 0) / 
                      studentData.enrolledSubjects.length
                    )}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {activeTab === 'overview' && (
              <Card>
                <CardHeader>
                  <CardTitle>Current Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {studentData.enrolledSubjects.map(subject => (
                    <div key={subject.id} className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{subject.name}</span>
                        <span className="text-sm text-gray-600">
                          {calculateProgress(subject.modules)}%
                        </span>
                      </div>
                      <Progress 
                        value={calculateProgress(subject.modules)} 
                        className="w-full" 
                      />
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        Next: {subject.nextTopic}
                        <Calendar className="h-4 w-4 ml-4 mr-1" />
                        {subject.nextSession}
                      </div>
                      <div className="space-y-2 pl-4">
                        {subject.modules.map((module, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={module.completed}
                              onChange={() => toggleModule(subject.id, index)}
                              id={`${subject.id}-module-${index}`}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label
                              htmlFor={`${subject.id}-module-${index}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {module.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {activeTab === 'syllabus' && (
              <div className="space-y-6">
                <SyllabusUpload />
              </div>
            )}

            {activeTab === 'quiz' && (
              <Quiz />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;