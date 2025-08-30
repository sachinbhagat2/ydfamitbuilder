
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Progress } from "../components/ui/progress";
import { Alert, AlertDescription } from "../components/ui/alert";
import { 
  Users, 
  BookOpen, 
  FileText, 
  Award, 
  TrendingUp, 
  Calendar,
  Database,
  RefreshCw,
  Eye,
  CheckCircle,
  AlertCircle,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";
import apiService from "../services/api";

const Homepage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dbData, setDbData] = useState<any>(null);
  const [recentScholarships, setRecentScholarships] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<any>(null);
  const [applicationStats, setApplicationStats] = useState<any>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load database explorer data
      const [
        dbExplorerRes,
        scholarshipsRes,
        usersRes,
        applicationsRes,
        announcementsRes
      ] = await Promise.allSettled([
        apiService.getDatabaseExplorer(),
        apiService.listScholarships({ status: 'active', limit: 4, sortBy: 'deadline', sortOrder: 'asc' }),
        apiService.listUsers(),
        apiService.getApplicationStats(),
        apiService.listAnnouncements()
      ]);

      // Handle database explorer data
      if (dbExplorerRes.status === 'fulfilled' && dbExplorerRes.value.success) {
        setDbData(dbExplorerRes.value.data);
      }

      // Handle scholarships
      if (scholarshipsRes.status === 'fulfilled' && scholarshipsRes.value.success) {
        setRecentScholarships(scholarshipsRes.value.data || []);
      }

      // Handle users
      if (usersRes.status === 'fulfilled' && usersRes.value.success) {
        const users = usersRes.value.data || [];
        setUserStats({
          total: users.length,
          byType: users.reduce((acc: any, user: any) => {
            acc[user.userType] = (acc[user.userType] || 0) + 1;
            return acc;
          }, {}),
          active: users.filter((u: any) => u.isActive).length
        });
      }

      // Handle application stats
      if (applicationsRes.status === 'fulfilled' && applicationsRes.value.success) {
        setApplicationStats(applicationsRes.value.data);
      }

      // Handle announcements
      if (announcementsRes.status === 'fulfilled' && announcementsRes.value.success) {
        setAnnouncements(announcementsRes.value.data || []);
      }

    } catch (err: any) {
      console.error('Dashboard data loading error:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getDatabaseStatusColor = (status: any) => {
    if (!status) return 'bg-gray-500';
    if (status.lastSuccessAt && !status.lastError) return 'bg-green-500';
    if (status.lastError) return 'bg-red-500';
    return 'bg-yellow-500';
  };

  const formatCurrency = (amount: number | string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(num || 0);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-gray-600 mt-1">
              {user?.userType === 'admin' ? 'System Administration Dashboard' :
               user?.userType === 'student' ? 'Student Portal' :
               user?.userType === 'reviewer' ? 'Application Review Dashboard' :
               user?.userType === 'donor' ? 'Donor Portal' :
               user?.userType === 'surveyor' ? 'Field Verification Dashboard' :
               'Youth Dreamers Foundation Portal'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={loadDashboardData} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Database Status */}
        {dbData?.dbStatus && (
          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getDatabaseStatusColor(dbData.dbStatus)}`}></div>
                <CardTitle className="text-lg">Database Status</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Mode:</span>
                  <p className="font-medium capitalize">{dbData.dbStatus.mode}</p>
                </div>
                <div>
                  <span className="text-gray-500">Host:</span>
                  <p className="font-medium">{dbData.dbStatus.host || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Database:</span>
                  <p className="font-medium">{dbData.dbStatus.database || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Last Success:</span>
                  <p className="font-medium">
                    {dbData.dbStatus.lastSuccessAt ? 
                      formatDate(dbData.dbStatus.lastSuccessAt) : 'Never'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Users Stats */}
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats?.total || 0}</div>
              <p className="text-xs text-blue-100 mt-1">
                {userStats?.active || 0} active users
              </p>
            </CardContent>
          </Card>

          {/* Scholarships Stats */}
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Active Scholarships</CardTitle>
                <BookOpen className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dbData?.stats?.totalScholarships || 0}</div>
              <p className="text-xs text-green-100 mt-1">
                {recentScholarships.length} currently open
              </p>
            </CardContent>
          </Card>

          {/* Applications Stats */}
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Applications</CardTitle>
                <FileText className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{applicationStats?.total || 0}</div>
              <p className="text-xs text-purple-100 mt-1">
                {applicationStats?.approved || 0} approved
              </p>
            </CardContent>
          </Card>

          {/* Total Fund Value */}
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Total Fund Value</CardTitle>
                <Award className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(applicationStats?.total_applied_amount || 0)}
              </div>
              <p className="text-xs text-orange-100 mt-1">
                In scholarship applications
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="scholarships">Recent Scholarships</TabsTrigger>
            <TabsTrigger value="database">Database Explorer</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Application Status */}
              {applicationStats && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Application Status Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { status: 'submitted', label: 'Submitted', color: 'bg-blue-500', count: applicationStats.submitted },
                      { status: 'under_review', label: 'Under Review', color: 'bg-yellow-500', count: applicationStats.under_review },
                      { status: 'approved', label: 'Approved', color: 'bg-green-500', count: applicationStats.approved },
                      { status: 'rejected', label: 'Rejected', color: 'bg-red-500', count: applicationStats.rejected }
                    ].map((item) => (
                      <div key={item.status} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                          <span className="text-sm font-medium">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">{item.count || 0}</span>
                          <Progress 
                            value={applicationStats.total ? (item.count / applicationStats.total) * 100 : 0} 
                            className="w-20 h-2" 
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Recent Announcements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Recent Announcements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {announcements.length > 0 ? (
                    <div className="space-y-3">
                      {announcements.slice(0, 4).map((announcement: any) => (
                        <div key={announcement.id} className="flex items-start gap-3 p-3 border rounded-lg">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            announcement.priority === 'urgent' ? 'bg-red-500' :
                            announcement.priority === 'high' ? 'bg-orange-500' : 'bg-blue-500'
                          }`}></div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{announcement.title}</h4>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {announcement.content}
                            </p>
                            <Badge variant="outline" className="mt-2 text-xs">
                              {announcement.type}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No announcements available</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Scholarships Tab */}
          <TabsContent value="scholarships" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recentScholarships.length > 0 ? (
                recentScholarships.map((scholarship: any) => (
                  <Card key={scholarship.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{scholarship.title}</CardTitle>
                          <CardDescription className="mt-1">
                            Amount: {formatCurrency(scholarship.amount)}
                          </CardDescription>
                        </div>
                        <Badge variant={scholarship.status === 'active' ? 'default' : 'secondary'}>
                          {scholarship.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {scholarship.description}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-gray-500">
                          <Clock className="h-4 w-4" />
                          Deadline: {formatDate(scholarship.applicationDeadline)}
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <Users className="h-4 w-4" />
                          {scholarship.currentApplications || 0} applied
                        </div>
                      </div>
                      <Button asChild size="sm" className="w-full mt-4">
                        <Link to={`/scholarships/${scholarship.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-2 text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No scholarships available</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Database Explorer Tab */}
          <TabsContent value="database" className="space-y-4">
            {dbData && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Schema Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      Database Schema
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(dbData.schema?.tables || {}).map(([tableName, table]: [string, any]) => (
                        <div key={tableName} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-medium text-sm">{tableName}</h4>
                            <p className="text-xs text-gray-600">{table.description}</p>
                          </div>
                          <Badge variant="outline">{table.recordCount} records</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Live Data Statistics */}
                <Card>
                  <CardHeader>
                    <CardTitle>Live Database Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Total Users</span>
                        <Badge>{dbData.stats?.totalUsers || 0}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Active Scholarships</span>
                        <Badge>{dbData.stats?.totalScholarships || 0}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Total Applications</span>
                        <Badge>{dbData.stats?.totalApplications || 0}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Announcements</span>
                        <Badge>{dbData.stats?.totalAnnouncements || 0}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Homepage;
