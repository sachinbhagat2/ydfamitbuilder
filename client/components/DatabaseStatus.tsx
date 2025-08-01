import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Database, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import apiService from '../services/api';

export const DatabaseStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        await apiService.testConnection();
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
          <p className="font-medium">⚡ Backend server not connected</p>
          <p className="text-sm">
            To enable real authentication, you need to:
          </p>
          <ol className="text-sm space-y-1 ml-4 list-decimal">
            <li>Get your Neon database URL from <a href="https://neon.tech" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">neon.tech</a></li>
            <li>Create <code className="bg-orange-100 px-1 rounded">.env</code> file with DATABASE_URL</li>
            <li>Run <code className="bg-orange-100 px-1 rounded">npm run dev:server</code> in a new terminal</li>
          </ol>
          <div className="flex items-center space-x-2 mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.open('/docs/NEON_SETUP.md', '_blank')}
              className="text-orange-700 border-orange-300 hover:bg-orange-100"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Setup Guide
            </Button>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default DatabaseStatus;
