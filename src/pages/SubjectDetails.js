import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function SubjectDetails() {
  const { id } = useParams();
  const [subject, setSubject] = useState(null);

  useEffect(() => {
    // Fetch subject details
    setSubject({
      id,
      name: 'Mathematics',
      modules: [
        {
          id: 1,
          name: 'Algebra',
          topics: ['Linear Equations', 'Quadratic Equations'],
          completed: true
        },
        // Add more modules
      ]
    });
  }, [id]);

  if (!subject) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{subject.name}</h1>
      <div className="space-y-6">
        {subject.modules.map((module) => (
          <div key={module.id} className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">{module.name}</h2>
            <div className="space-y-2">
              {module.topics.map((topic, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={module.completed}
                    readOnly
                  />
                  <span>{topic}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SubjectDetails;