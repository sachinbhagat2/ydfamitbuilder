import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, Database, ExternalLink } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";

type TestConnectionResult = {
  success: boolean;
  error?: string;
  results?: {
    database?: {
      status?: string;
      host?: string;
      error?: string;
    };
    timestamp?: string;
  };
};

type DbStatusResponse = {
  success: boolean;
  status?: {
    mode?: string;
    engine?: string;
    host?: string | null;
    database?: string | null;
    user?: string | null;
    env?: { missing?: string[] };
    lastError?: string | null;
    lastErrorAt?: string | null;
    lastSuccessAt?: string | null;
    recentErrors?: { at: string; error: string }[];
  };
  reason?: string | null;
};

const DatabaseStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [dbConnected, setDbConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [details, setDetails] = useState<{
    dbHost?: string;
    error?: string;
    egressIp?: string;
    reason?: string | null;
    mode?: string;
    engine?: string;
    dbName?: string | null;
    dbUser?: string | null;
    lastErrorAt?: string | null;
    lastSuccessAt?: string | null;
    missingEnv?: string[];
    recentErrors?: { at: string; error: string }[];
    testedAt?: string;
  }>({});

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch("/api/test/connection");
        let result: TestConnectionResult = { success: false };
        try {
          result = await response.json();
        } catch {}
        const dbOk =
          result?.results?.database?.status === "connected" ||
          result?.success === true;
        // Consider any HTTP response as API reachable (even 4xx/5xx)
        setIsConnected(true);
        setDbConnected(!!dbOk);

        if (!dbOk) {
          const host = result?.results?.database?.host;
          const errMsg = result?.error || result?.results?.database?.error;
          try {
            const ipRes = await fetch("/api/test/egress-ip");
            const ipJson = await ipRes.json();
            setDetails({
              dbHost: host,
              error: errMsg || undefined,
              egressIp: ipJson?.ip || undefined,
            });
          } catch {
            setDetails({ dbHost: host, error: errMsg || undefined });
          }
        } else {
          setDetails({});
        }
      } catch (error) {
        // Network failure => API unreachable
        setIsConnected(false);
        setDbConnected(null);
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
      <Alert className="border-orange-200 bg-orange-50">
        <AlertCircle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-700">
          <div className="space-y-2">
            <p>
              Live database not connected. Please try again shortly or contact
              support.
            </p>
            {details.dbHost && (
              <p className="text-xs">
                Database host:{" "}
                <span className="font-medium">{details.dbHost}</span>
              </p>
            )}
            {details.egressIp && (
              <p className="text-xs">
                Server egress IP:{" "}
                <span className="font-medium">{details.egressIp}</span> (add to
                your DB allowlist)
              </p>
            )}
            {details.error && <p className="text-xs">Issue: {details.error}</p>}
          </div>
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
          <p className="text-sm">
            Please refresh the page or try again shortly.
          </p>
          <div className="flex items-center space-x-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open("/api/test/connection", "_blank")}
              className="text-orange-700 border-orange-300 hover:bg-orange-100"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              API Status
            </Button>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default DatabaseStatus;
