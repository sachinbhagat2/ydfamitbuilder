import { useEffect } from 'react';
import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, AlertCircle, LogIn } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading, redirectToDashboard } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is authenticated but accessing wrong dashboard, redirect to correct one
    if (isAuthenticated && user && !allowedRoles.includes(user.userType)) {
      setTimeout(() => {
        redirectToDashboard();
      }, 1000);
    }
  }, [isAuthenticated, user, allowedRoles, redirectToDashboard]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading...</h2>
          <p className="text-gray-600">Verifying your authentication</p>
        </motion.div>
      </div>
    );
  }

  // Show login required message
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl">Authentication Required</CardTitle>
              <CardDescription>
                You need to sign in to access this page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <LogIn className="h-4 w-4" />
                <AlertDescription>
                  Please sign in with your account to continue
                </AlertDescription>
              </Alert>
              <div className="flex flex-col space-y-2">
                <Button 
                  onClick={() => navigate('/auth')}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="w-full"
                >
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Show access denied for wrong role
  if (!allowedRoles.includes(user.userType)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl">Access Denied</CardTitle>
              <CardDescription>
                You don't have permission to access this page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">
                  This page is restricted to: {allowedRoles.join(', ')} users.
                  <br />
                  Your account type: <strong>{user.userType}</strong>
                </AlertDescription>
              </Alert>
              <div className="flex flex-col space-y-2">
                <Button 
                  onClick={() => redirectToDashboard()}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Go to My Dashboard
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="w-full"
                >
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Render protected content
  return <>{children}</>;
};

export default ProtectedRoute;
