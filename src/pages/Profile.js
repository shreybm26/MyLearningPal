import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, User, Mail, Phone, Book, Calendar, Edit } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  // Sample profile data - would come from backend in real app
  const [profileData, setProfileData] = useState({
    name: "Alex Johnson",
    email: "alex.j@student.com",
    phone: "+1 234 567 8900",
    dateJoined: "January 2024",
    programEnrolled: "Computer Science",
    semester: "Spring 2024",
    bio: "Passionate about learning and technology. Currently focusing on web development and artificial intelligence.",
    achievements: [
      "Completed Advanced Mathematics",
      "Top performer in Physics",
      "Perfect attendance - Fall 2023"
    ]
  });

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
              <Button variant="ghost" onClick={() => navigate('/')}>
                Dashboard
              </Button>
              <Button variant="outline">Logout</Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Overview */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Profile</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)}>
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-16 w-16 text-blue-600" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{profileData.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{profileData.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{profileData.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>Joined {profileData.dateJoined}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Academic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Program</label>
                  <p className="font-medium">{profileData.programEnrolled}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Current Semester</label>
                  <p className="font-medium">{profileData.semester}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm text-gray-500">Bio</label>
                <p className="mt-1">{profileData.bio}</p>
              </div>

              <div>
                <label className="text-sm text-gray-500">Achievements</label>
                <div className="mt-2 space-y-2">
                  {profileData.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                      <span>{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;