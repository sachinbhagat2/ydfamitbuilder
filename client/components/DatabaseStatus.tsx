import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Database, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';

const DatabaseStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [dbConnected, setDbConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch('/api/test/connection');
        const ok = response.ok;
        let result: any = {};
        try { result = await response.json(); } catch {}
        const dbOk = result?.results?.database?.status === 'connected' || result?.success === true;
        setIsConnected(ok); // API reachable -> app usable
        setDbConnected(dbOk);
      } catch (error) {
        setIsConnected(false);
        setDbConnected(false);
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

  if (isConnected && dbConnected) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-700">
          ✅ Database connected successfully! Authentication is ready.
        </AlertDescription>
      </Alert>
    );
  }

  if (isConnected && dbConnected === false) {
    return (
      <Alert className="border-blue-200 bg-blue-50">
        <Database className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-700">
          Running with mock database. You can still sign in using demo accounts:
          admin@ydf.org, student@ydf.org, reviewer@ydf.org, donor@ydf.org, surveyor@ydf.org
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="border-orange-200 bg-orange-50">
      <AlertCircle className="h-4 w-4 text-orange-600" />
      <AlertDescription className="text-orange-700">
        <div className="space-y-3">
          <p className="font-medium">⚠️ API not reachable</p>
          <p className="text-sm">Please refresh the page or try again shortly.</p>
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
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default DatabaseStatus;
