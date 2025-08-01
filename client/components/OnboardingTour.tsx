import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, CheckCircle, Target, Users, Award, Lightbulb } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface TourStep {
  id: string;
  title: string;
  content: string;
  icon: React.ReactNode;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface OnboardingTourProps {
  userType?: 'student' | 'donor' | 'reviewer' | 'admin';
  onComplete: () => void;
  onSkip: () => void;
}

const OnboardingTour = ({ userType = 'student', onComplete, onSkip }: OnboardingTourProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const tourSteps: Record<string, TourStep[]> = {
    student: [
      {
        id: 'welcome',
        title: 'Welcome to Youth Dreamers Foundation!',
        content: 'We\'re here to help you achieve your educational dreams through scholarships and support.',
        icon: <Award className="h-6 w-6 text-blue-600" />,
      },
      {
        id: 'dashboard',
        title: 'Your Dashboard',
        content: 'This is your personal dashboard where you can track applications, view announcements, and access quick actions.',
        icon: <Target className="h-6 w-6 text-green-600" />,
      },
      {
        id: 'scholarships',
        title: 'Browse Scholarships',
        content: 'Explore available scholarships that match your profile and apply directly through our platform.',
        icon: <Users className="h-6 w-6 text-purple-600" />,
      },
      {
        id: 'support',
        title: 'Get Support',
        content: 'Need help? Our support team is always ready to assist you throughout your journey.',
        icon: <Lightbulb className="h-6 w-6 text-orange-600" />,
      },
    ],
    donor: [
      {
        id: 'welcome',
        title: 'Welcome, Dear Donor!',
        content: 'Thank you for choosing to make a difference in students\' lives through education.',
        icon: <Award className="h-6 w-6 text-blue-600" />,
      },
      {
        id: 'impact',
        title: 'Track Your Impact',
        content: 'Monitor the progress of students you\'re supporting and see the real impact of your contributions.',
        icon: <Target className="h-6 w-6 text-green-600" />,
      },
      {
        id: 'funding',
        title: 'Funding Opportunities',
        content: 'Discover new scholarship schemes and funding opportunities to expand your impact.',
        icon: <Users className="h-6 w-6 text-purple-600" />,
      },
    ],
    reviewer: [
      {
        id: 'welcome',
        title: 'Welcome, Reviewer!',
        content: 'Your expertise helps us identify and support the most deserving students.',
        icon: <Award className="h-6 w-6 text-blue-600" />,
      },
      {
        id: 'applications',
        title: 'Review Applications',
        content: 'Access and review student applications with our comprehensive evaluation tools.',
        icon: <Target className="h-6 w-6 text-green-600" />,
      },
      {
        id: 'scoring',
        title: 'Scoring System',
        content: 'Use our standardized scoring system to ensure fair and consistent evaluations.',
        icon: <Users className="h-6 w-6 text-purple-600" />,
      },
    ],
    admin: [
      {
        id: 'welcome',
        title: 'Admin Dashboard',
        content: 'Manage the entire scholarship ecosystem from this comprehensive admin panel.',
        icon: <Award className="h-6 w-6 text-blue-600" />,
      },
      {
        id: 'schemes',
        title: 'Scheme Management',
        content: 'Create, edit, and monitor scholarship schemes with detailed analytics and reporting.',
        icon: <Target className="h-6 w-6 text-green-600" />,
      },
      {
        id: 'users',
        title: 'User Management',
        content: 'Oversee all users, reviewers, and donors within the platform.',
        icon: <Users className="h-6 w-6 text-purple-600" />,
      },
    ],
  };

  const steps = tourSteps[userType] || tourSteps.student;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  const handleSkip = () => {
    setIsVisible(false);
    setTimeout(() => {
      onSkip();
    }, 300);
  };

  if (!isVisible) return null;

  const currentStepData = steps[currentStep];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <Card className="w-full max-w-md bg-white shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {currentStepData.icon}
                  <span className="text-sm font-medium text-gray-500">
                    Step {currentStep + 1} of {steps.length}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {currentStepData.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {currentStepData.content}
                </p>
              </div>

              {/* Progress bar */}
              <div className="mb-6">
                <div className="flex space-x-1">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 flex-1 rounded-full transition-colors duration-300 ${
                        index <= currentStep
                          ? 'bg-blue-600'
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="flex items-center space-x-1"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Previous</span>
                </Button>

                <Button
                  variant="ghost"
                  onClick={handleSkip}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Skip Tour
                </Button>

                <Button
                  onClick={handleNext}
                  className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700"
                >
                  {currentStep === steps.length - 1 ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      <span>Get Started</span>
                    </>
                  ) : (
                    <>
                      <span>Next</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OnboardingTour;
