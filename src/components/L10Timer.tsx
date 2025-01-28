'use client';

import React, { useState, useEffect } from 'react';
import { Bell, PlayCircle, PauseCircle, SkipForward, SkipBack, Clock, RefreshCcw, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';

interface Section {
  name: string;
  emoji: string;
  duration: number;
  description: string;
  color: string;
}

interface Participant {
  name: string;
  rating: string;
}

const L10Timer: React.FC = () => {
  const sections: Section[] = [
    { 
      name: "Segue", 
      emoji: "👋",
      duration: 5,
      description: "Check-in with all participants. Share personal and professional best news from the past week.",
      color: "bg-blue-500"
    },
    { 
      name: "Scorecard", 
      emoji: "📊",
      duration: 5,
      description: "Review key metrics and numbers. Identify any metrics that are off track.",
      color: "bg-green-500"
    },
    { 
      name: "Rock Review", 
      emoji: "🎯",
      duration: 5,
      description: "Review quarterly priorities (Rocks). Are they on track or off track?",
      color: "bg-purple-500"
    },
    { 
      name: "Customer/Employee Headlines", 
      emoji: "📰",
      duration: 5,
      description: "Share essential customer and employee feedback, news, or updates.",
      color: "bg-yellow-500"
    },
    { 
      name: "To-Do List", 
      emoji: "✅",
      duration: 5,
      description: "Review last week's to-dos. Mark complete or incomplete. Discuss any stuck items.",
      color: "bg-orange-500"
    },
    { 
      name: "IDS", 
      emoji: "💡",
      duration: 60,
      description: "Identify, Discuss, and Solve the most important issues affecting the business.",
      color: "bg-red-500"
    },
    { 
      name: "Conclude", 
      emoji: "🏁",
      duration: 5,
      description: "Recap to-dos, cascade communication needs, and rate the meeting.",
      color: "bg-indigo-500"
    }
  ];

  const [currentSection, setCurrentSection] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(sections[0].duration * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [participants, setParticipants] = useState<Participant[]>([{ name: '', rating: '' }]);
  const [showWarning, setShowWarning] = useState<boolean>(false);

  // Audio files
  const warningAudio = new Audio('/12-seconds-warning.mp3'); // Warning at 12 seconds
  const startAudio = new Audio('/start-sound.mp3'); // Sound when a section starts

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (isRunning) {
      timer = setInterval(() => {
        setTimeLeft((prevTime: number) => {
          if (prevTime === 12) {
            warningAudio.play(); // Play warning sound
          }
          if (prevTime <= 1) {
            setIsRunning(false);
            setShowWarning(true);
            setTimeout(() => setShowWarning(false), 5000);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, warningAudio]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = (): void => {
    setIsRunning(true);
    startAudio.play(); // Play start sound
  };

  const pauseTimer = (): void => setIsRunning(false);

  const resetTimer = (): void => {
    setIsRunning(false);
    setTimeLeft(sections[currentSection].duration * 60);
    setShowWarning(false);
  };

  const goToSection = (index: number): void => {
    setCurrentSection(index);
    setTimeLeft(sections[index].duration * 60);
    setIsRunning(true);
    startAudio.play(); // Play start sound when switching sections
    setShowWarning(false);
  };

  const previousSection = (): void => {
    if (currentSection > 0) {
      goToSection(currentSection - 1);
    }
  };

  const nextSection = (): void => {
    if (currentSection < sections.length - 1) {
      goToSection(currentSection + 1);
    } else {
      setIsComplete(true);
      setIsRunning(false);
    }
  };

  const extendTime = (minutes: number): void => {
    setTimeLeft((prevTime) => prevTime + minutes * 60);
    setShowWarning(false);
  };

  const addParticipant = (): void => {
    setParticipants((prev) => [...prev, { name: '', rating: '' }]);
  };

  const updateParticipant = (index: number, field: keyof Participant, value: string): void => {
    const newParticipants = [...participants];
    newParticipants[index] = { ...newParticipants[index], [field]: value };
    setParticipants(newParticipants);
  };

  const calculateAverageRating = (): string => {
    const validRatings = participants
      .map(p => parseInt(p.rating))
      .filter((r): r is number => !isNaN(r));
    return validRatings.length ? 
      (validRatings.reduce((a, b) => a + b, 0) / validRatings.length).toFixed(1) : 
      'N/A';
  };

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Meeting Complete 🎉</CardTitle>
            <CardDescription className="text-center">Please rate the meeting from 1-10</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {participants.map((participant, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex space-x-2"
                >
                  <Input
                    placeholder="Participant Name"
                    value={participant.name}
                    onChange={(e) => updateParticipant(index, 'name', e.target.value)}
                    className="flex-grow"
                  />
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    placeholder="Rating (1-10)"
                    value={participant.rating}
                    onChange={(e) => updateParticipant(index, 'rating', e.target.value)}
                    className="w-24"
                  />
                </motion.div>
              ))}
              <Button 
                onClick={addParticipant} 
                className="w-full"
                variant="outline"
              >
                Add Participant
              </Button>
              <motion.div 
                className="text-center mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="text-lg font-bold">Average Rating: {calculateAverageRating()}</div>
              </motion.div>
            </div>
          </CardContent>
          <CardFooter className="text-center text-sm text-gray-500">
            <p className="w-full">
              Built with ❤️ by{' '}
              <a 
                href="https://www.ruptiveai.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Ruptive AI
              </a>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 max-w-6xl mx-auto">
      <motion.div 
        className="w-full md:w-64 space-y-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        {sections.map((section, index) => (
          <Button
            key={index}
            variant={currentSection === index ? "default" : "outline"}
            className={`w-full justify-start transition-all duration-200 ${
              currentSection === index ? 'scale-105' : ''
            }`}
            onClick={() => goToSection(index)}
          >
            <span className="mr-2">{section.emoji}</span>
            {section.name}
          </Button>
        ))}
      </motion.div>

      <motion.div 
        className="flex-grow"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center text-2xl">
              <span className="mr-3 text-3xl">{sections[currentSection].emoji}</span>
              {sections[currentSection].name}
            </CardTitle>
            <CardDescription className="text-center mt-2">
              {sections[currentSection].description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={timeLeft}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center text-4xl font-bold"
                >
                  {formatTime(timeLeft)}
                </motion.div>
              </AnimatePresence>

              <div className="relative">
                <Progress 
                  value={(timeLeft / (sections[currentSection].duration * 60)) * 100} 
                  className={`w-full h-2 transition-all duration-500 ${timeLeft < 30 ? 'bg-red-200' : ''}`}
                />
                {showWarning && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute -top-8 left-0 right-0 text-center text-red-500 text-sm"
                  >
                    <AlertCircle className="inline-block mr-1 h-4 w-4" />
                    Time is running out!
                  </motion.div>
                )}
              </div>
              
              <div className="flex justify-center space-x-4">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button onClick={previousSection} size="lg" variant="outline">
                    <SkipBack className="w-6 h-6" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  {!isRunning ? (
                    <Button onClick={startTimer} size="lg" variant="outline">
                      <PlayCircle className="w-6 h-6" />
                    </Button>
                  ) : (
                    <Button onClick={pauseTimer} size="lg" variant="outline">
                      <PauseCircle className="w-6 h-6" />
                    </Button>
                  )}
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button onClick={resetTimer} size="lg" variant="outline">
                    <RefreshCcw className="w-6 h-6" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button onClick={nextSection} size="lg" variant="outline">
                    <SkipForward className="w-6 h-6" />
                  </Button>
                </motion.div>
              </div>

              <div className="flex justify-center space-x-2">
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button onClick={() => extendTime(5)} size="sm" variant="outline">
                    +5 min
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button onClick={() => extendTime(10)} size="sm" variant="outline">
                    +10 min
                  </Button>
                </motion.div>
              </div>

              <div className="text-sm text-center text-gray-500">
                Section {currentSection + 1} of {sections.length}
              </div>
            </div>
          </CardContent>
          <CardFooter className="text-center text-sm text-gray-500">
            <p className="w-full">
              Built with ❤️ by{' '}
              <a 
                href="https://www.ruptiveai.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Ruptive AI
              </a>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default L10Timer;
