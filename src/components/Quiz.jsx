import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Quiz = () => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [error, setError] = useState(null);

  const generateQuiz = async () => {
    if (!topic.trim()) return;

    setLoading(true);
    setQuiz(null);
    setScore(null);
    setAnswers({});
    setError(null);

    try {
      // Check for React environment variable
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
      
      if (!apiKey) {
        throw new Error('API key not found. Please set REACT_APP_GEMINI_API_KEY in your environment.');
      }

      const prompt = `Generate a quiz about ${topic} with 5 multiple choice questions. 
        Format the response as a JSON object with this structure:
        {
          "questions": [
            {
              "question": "question text",
              "options": ["option1", "option2", "option3", "option4"],
              "correctAnswer": 0
            }
          ]
        }`;

      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to generate quiz');
      }

      const data = await response.json();
      
      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid response format from API');
      }

      const quizData = JSON.parse(data.candidates[0].content.parts[0].text);
      setQuiz(quizData);
    } catch (error) {
      console.error('Error generating quiz:', error);
      setError(error.message || 'Failed to generate quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  const submitQuiz = () => {
    if (!quiz) return;

    let correctAnswers = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const percentage = (correctAnswers / quiz.questions.length) * 100;
    setScore(percentage);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Quiz</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Enter topic (e.g., 'Operating Systems')"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={generateQuiz} 
              disabled={loading || !topic.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating
                </>
              ) : (
                'Generate Quiz'
              )}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {quiz && (
        <Card>
          <CardHeader>
            <CardTitle>Quiz on {topic}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {quiz.questions.map((q, questionIndex) => (
              <div key={questionIndex} className="space-y-4">
                <p className="font-medium">
                  {questionIndex + 1}. {q.question}
                </p>
                <div className="space-y-2 pl-4">
                  {q.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`question-${questionIndex}`}
                        id={`q${questionIndex}-opt${optionIndex}`}
                        checked={answers[questionIndex] === optionIndex}
                        onChange={() => handleAnswerSelect(questionIndex, optionIndex)}
                        className="h-4 w-4 text-blue-600"
                      />
                      <label
                        htmlFor={`q${questionIndex}-opt${optionIndex}`}
                        className="text-sm"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <Button 
              onClick={submitQuiz}
              disabled={Object.keys(answers).length !== quiz.questions.length}
              className="mt-4"
            >
              Submit Quiz
            </Button>
            {score !== null && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-lg">
                  Your Score: {score.toFixed(1)}%
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Quiz;