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
        // Add cache busting timestamp to force fresh data
        const timestamp = Date.now();
        const response = await fetch(`/api/test/connection?t=${timestamp}`, {
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
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
          const testedAt = (result as any)?.results?.timestamp || undefined;
          
          try {
            const [ipRes, statusRes] = await Promise.all([
              fetch(`/api/test/egress-ip?t=${timestamp}`, { cache: 'no-cache' }),
              fetch(`/api/test/db/status?t=${timestamp}`, { cache: 'no-cache' }),
            ]);
            const ipJson = await ipRes.json();
            const statusJson: DbStatusResponse = await statusRes.json();
            
            // Only show error if it's recent (within last 5 minutes) and there's no recent success
            const errorTime = statusJson?.status?.lastErrorAt ? new Date(statusJson.status.lastErrorAt).getTime() : 0;
            const successTime = statusJson?.status?.lastSuccessAt ? new Date(statusJson.status.lastSuccessAt).getTime() : 0;
            const now = Date.now();
            const fiveMinutesAgo = now - (5 * 60 * 1000);
            
            // If we have a recent success (within last minute) and error is older, consider it connected
            if (successTime > now - (60 * 1000) && errorTime < successTime) {
              setDbConnected(true);
              setDetails({});
              return;
            }
            
            setDetails({
              dbHost: host || statusJson?.status?.host || undefined,
              error: errMsg || (errorTime > fiveMinutesAgo ? statusJson?.status?.lastError : undefined) || undefined,
              egressIp: ipJson?.ip || undefined,
              reason: statusJson?.reason || null,
              mode: statusJson?.status?.mode,
              engine: statusJson?.status?.engine,
              dbName: statusJson?.status?.database ?? null,
              dbUser: statusJson?.status?.user ?? null,
              lastErrorAt: statusJson?.status?.lastErrorAt ?? null,
              lastSuccessAt: statusJson?.status?.lastSuccessAt ?? null,
              missingEnv: statusJson?.status?.env?.missing || [],
              recentErrors: statusJson?.status?.recentErrors || [],
              testedAt,
            });
          } catch {
            setDetails({ dbHost: host, error: errMsg || undefined, testedAt });
          }
        } else {
          // Clear all details on success
          setDetails({});
        }
      } catch (error) {
        // Network failure => API unreachable
        setIsConnected(false);
        setDbConnected(null);
        setDetails({});
      } finally {
        setIsLoading(false);
      }
    };

    checkConnection();
    
    // Auto-refresh every 30 seconds to get latest status
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
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

  const handleRefresh = () => {
    setIsLoading(true);
    window.location.reload();
  };

  if (isConnected && dbConnected) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-700">
          <div className="flex items-center justify-between">
            <span>✅ Database connected successfully! Authentication is ready.</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              className="text-green-600 hover:text-green-700 h-6 px-2"
            >
              Refresh
            </Button>
          </div>
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
            <p className="font-medium">Live database connection failed.</p>
            <div className="text-xs space-y-1">
              {details.reason && (
                <p>
                  Likely cause:{" "}
                  <span className="font-medium">{details.reason}</span>
                </p>
              )}
              {details.error && (
                <p>
                  Error:{" "}
                  <span className="font-mono break-all">{details.error}</span>
                </p>
              )}
              <p>
                Target:{" "}
                <span className="font-medium">{details.engine || "db"}</span>
                {details.dbHost ? (
                  <>
                    {" "}
                    at <span className="font-medium">{details.dbHost}</span>
                  </>
                ) : null}
                {details.dbName ? (
                  <>
                    {" "}
                    database{" "}
                    <span className="font-medium">{details.dbName}</span>
                  </>
                ) : null}
                {details.dbUser ? (
                  <>
                    {" "}
                    as user{" "}
                    <span className="font-medium">{details.dbUser}</span>
                  </>
                ) : null}
              </p>
              {details.testedAt && (
                <p>
                  Checked at:{" "}
                  <span className="font-medium">
                    {new Date(details.testedAt).toLocaleString()}
                  </span>
                </p>
              )}
              {details.egressIp && (
                <p>
                  Server egress IP:{" "}
                  <span className="font-medium">{details.egressIp}</span> (add
                  to your DB allowlist)
                </p>
              )}
              {details?.missingEnv && details.missingEnv.length > 0 && (
                <p>
                  Missing env:{" "}
                  <span className="font-medium">
                    {details.missingEnv.join(", ")}
                  </span>
                </p>
              )}
              {details.recentErrors && details.recentErrors.length > 0 && (
                <details>
                  <summary className="cursor-pointer select-none">
                    Recent errors
                  </summary>
                  <ul className="list-disc pl-4 space-y-1">
                    {details.recentErrors.slice(0, 5).map((e, idx) => (
                      <li key={idx}>
                        <span className="text-muted-foreground">
                          {new Date(e.at).toLocaleString()}:
                        </span>{" "}
                        <span className="font-mono break-all">{e.error}</span>
                      </li>
                    ))}
                  </ul>
                </details>
              )}
              <div className="pt-1">
                <p>How to fix:</p>
                <ul className="list-disc pl-5 space-y-0.5">
                  <li>Verify DB host, port, user, and database name</li>
                  <li>
                    If using a firewall, allowlist the server egress IP above
                  </li>
                  <li>
                    If SSL is required, set DB_SSL=true or provide a valid
                    certificate
                  </li>
                  <li>
                    Ensure credentials are correct and user has access to the
                    database
                  </li>
                </ul>
                <div className="flex items-center space-x-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    className="text-orange-700 border-orange-300 hover:bg-orange-100"
                  >
                    Refresh Status
                  </Button>
                </div>
              </div>
            </div>
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