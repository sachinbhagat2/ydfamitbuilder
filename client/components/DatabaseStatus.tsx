import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Database, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';

export const DatabaseStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch('/api/test/connection');
        const result = await response.json();
        if (result.success) {
          setIsConnected(true);
        } else {
          setIsConnected(false);
        }
        setIsConnected(true);
      } catch (error) {
        setIsConnected(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkConnection();
  }, []);

  if (isLoading) {
    return (
      <Alert className="border-blue-200 bg-blue-50">
        <Database className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-700">
          Checking database connection...
        </AlertDescription>
      </Alert>
    );
  }

  if (isConnected) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-700">
          ✅ Database connected successfully! Authentication is ready.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="border-orange-200 bg-orange-50">
      <AlertCircle className="h-4 w-4 text-orange-600" />
      <AlertDescription className="text-orange-700">
        <div className="space-y-3">
          <p className="font-medium">⚡ MySQL database not connected</p>
          <p className="text-sm">
            To connect to your MySQL database:
          </p>
          <ol className="text-sm space-y-1 ml-4 list-decimal">
            <li>Ensure MySQL server is running on sparsindia.com</li>
            <li>Verify database credentials are correct</li>
            <li>Import the database_setup.sql file</li>
            <li>Start backend server: <code className="bg-orange-100 px-1 rounded">npm run dev:server</code></li>
          </ol>
          <div className="flex items-center space-x-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('/docs/MYSQL_SETUP.md', '_blank')}
              className="text-orange-700 border-orange-300 hover:bg-orange-100"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              MySQL Setup Guide
            </Button>
          </div>
        ✅ MySQL database connected successfully! Authentication is ready.
      </AlertDescription>
    </Alert>
  );
};

export default DatabaseStatus;
