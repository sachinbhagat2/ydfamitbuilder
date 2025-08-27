import React, { useEffect, useState } from 'react';
import RoleBasedNavigation from '../components/RoleBasedNavigation';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface VerificationRec {
  id: number;
  applicationId: number;
  surveyorId: number;
  type: 'home' | 'document';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  startLat?: number | null;
  startLng?: number | null;
  endLat?: number | null;
  endLng?: number | null;
  startTime?: string | null;
  endTime?: string | null;
  notes?: string | null;
}

const SurveyorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [applicationId, setApplicationId] = useState('');
  const [type, setType] = useState<'home' | 'document'>('home');
  const [notes, setNotes] = useState('');
  const [verifications, setVerifications] = useState<VerificationRec[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    try {
      const res = await fetch('/api/surveys/my', { headers: { 'Authorization': `Bearer ${localStorage.getItem('ydf_token')}` } });
      const data = await res.json();
      if (data.success) setVerifications(data.data);
    } catch {}
  };

  useEffect(() => { refresh(); }, []);

  const getLocation = (): Promise<{lat?: number; lng?: number}> => {
    return new Promise((resolve) => {
      if (!('geolocation' in navigator)) return resolve({});
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => resolve({}),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  };

  const startVerification = async () => {
    if (!applicationId) return;
    setLoading(true);
    try {
      const loc = await getLocation();
      const res = await fetch('/api/surveys/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('ydf_token')}`
        },
        body: JSON.stringify({ applicationId: Number(applicationId), type, lat: loc.lat, lng: loc.lng, notes })
      });
      const data = await res.json();
      if (data.success) {
        setApplicationId('');
        setNotes('');
        await refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  const completeVerification = async (verificationId: number) => {
    setLoading(true);
    try {
      const loc = await getLocation();
      const res = await fetch('/api/surveys/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('ydf_token')}`
        },
        body: JSON.stringify({ verificationId, lat: loc.lat, lng: loc.lng })
      });
      const data = await res.json();
      if (data.success) await refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <RoleBasedNavigation />
      <main className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Start Verification</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Application ID</Label>
              <Input value={applicationId} onChange={(e) => setApplicationId(e.target.value)} placeholder="Enter application ID" />
            </div>
            <div>
              <Label>Type</Label>
              <select className="w-full border rounded-md h-10 px-3" value={type} onChange={(e)=> setType(e.target.value as any)}>
                <option value="home">Home Verification</option>
                <option value="document">Document Verification</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <Label>Notes (optional)</Label>
              <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any notes" />
            </div>
            <div className="sm:col-span-2">
              <Button onClick={startVerification} disabled={loading || !applicationId} className="w-full sm:w-auto">{loading ? 'Please wait...' : 'Start with Current Location'}</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Verifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2 pr-4">ID</th>
                    <th className="py-2 pr-4">Application</th>
                    <th className="py-2 pr-4">Type</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2 pr-4">Start</th>
                    <th className="py-2 pr-4">End</th>
                    <th className="py-2 pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {verifications.map(v => (
                    <tr key={v.id} className="border-b">
                      <td className="py-2 pr-4">{v.id}</td>
                      <td className="py-2 pr-4">{v.applicationId}</td>
                      <td className="py-2 pr-4 capitalize">{v.type}</td>
                      <td className="py-2 pr-4 capitalize">{v.status.replace('_',' ')}</td>
                      <td className="py-2 pr-4">{v.startLat && v.startLng ? `${v.startLat.toFixed?.(5) ?? v.startLat}, ${v.startLng.toFixed?.(5) ?? v.startLng}` : '-'}</td>
                      <td className="py-2 pr-4">{v.endLat && v.endLng ? `${v.endLat.toFixed?.(5) ?? v.endLat}, ${v.endLng.toFixed?.(5) ?? v.endLng}` : '-'}</td>
                      <td className="py-2 pr-4">
                        {v.status !== 'completed' ? (
                          <Button size="sm" onClick={() => completeVerification(v.id)} disabled={loading}>Complete</Button>
                        ) : (
                          <span className="text-green-600 font-medium">Done</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {verifications.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-4 text-center text-gray-500">No verifications yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SurveyorDashboard;
