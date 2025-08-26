import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import RoleBasedNavigation from "../components/RoleBasedNavigation";
import OnboardingTour from "../components/OnboardingTour";
import {
  Users,
  FileText,
  BarChart3,
  Plus,
  Search,
  Filter,
  Settings,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Edit,
  Copy,
  MoreVertical,
  Download,
  TrendingUp,
  DollarSign,
  Calendar,
} from "lucide-react";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('ydf_onboarding_admin');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('ydf_onboarding_admin', 'true');
    setShowOnboarding(false);
  };

  const handleOnboardingSkip = () => {
    localStorage.setItem('ydf_onboarding_admin', 'skipped');
    setShowOnboarding(false);
  };

  const stats = [
    {
      title: "Total Applications",
      value: "1,247",
      change: "+12%",
      icon: FileText,
      color: "bg-blue-500",
    },
    {
      title: "Approved",
      value: "523",
      change: "+8%",
      icon: CheckCircle,
      color: "bg-green-500",
    },
    {
      title: "In Progress",
      value: "401",
      change: "+15%",
      icon: Clock,
      color: "bg-yellow-500",
    },
    {
      title: "Rejected",
      value: "323",
      change: "-5%",
      icon: XCircle,
      color: "bg-red-500",
    },
  ];

  const schemes = [
    {
      id: 1,
      name: "Merit Excellence Scholarship",
      status: "Active",
      applications: 156,
      budget: "₹50,00,000",
      deadline: "2024-03-15",
      category: "Academic",
    },
    {
      id: 2,
      name: "Rural Development Grant",
      status: "Active",
      applications: 89,
      budget: "₹25,00,000",
      deadline: "2024-03-22",
      category: "Rural",
    },
    {
      id: 3,
      name: "Technical Innovation Fund",
      status: "Draft",
      applications: 0,
      budget: "₹75,00,000",
      deadline: "2024-03-30",
      category: "Technology",
    },
    {
      id: 4,
      name: "Women Empowerment Scholarship",
      status: "Closed",
      applications: 234,
      budget: "₹40,00,000",
      deadline: "2024-02-28",
      category: "Gender",
    },
  ];

  const recentApplications = [
    {
      id: 1,
      applicant: "Priya Sharma",
      scheme: "Merit Excellence",
      status: "Under Review",
      submittedDate: "2024-01-15",
      score: 85,
    },
    {
      id: 2,
      applicant: "Rahul Kumar",
      scheme: "Rural Development",
      status: "Approved",
      submittedDate: "2024-01-14",
      score: 92,
    },
    {
      id: 3,
      applicant: "Anjali Patel",
      scheme: "Women Empowerment",
      status: "Pending Documents",
      submittedDate: "2024-01-13",
      score: 78,
    },
    {
      id: 4,
      applicant: "Arjun Singh",
      scheme: "Merit Excellence",
      status: "Interview Scheduled",
      submittedDate: "2024-01-12",
      score: 88,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Draft":
        return "bg-gray-100 text-gray-800";
      case "Closed":
        return "bg-red-100 text-red-800";
      case "Under Review":
        return "bg-yellow-100 text-yellow-800";
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Pending Documents":
        return "bg-orange-100 text-orange-800";
      case "Interview Scheduled":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-lg p-4 shadow-sm border border-ydf-light-gray"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-green-600">{stat.change}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-ydf-light-gray">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Plus, label: "Create Scheme", color: "bg-ydf-deep-blue" },
            {
              icon: FileText,
              label: "Review Apps",
              color: "bg-ydf-teal-green",
            },
            { icon: Download, label: "Export Data", color: "bg-purple-500" },
            { icon: Settings, label: "Settings", color: "bg-gray-500" },
          ].map((action, index) => (
            <button
              key={action.label}
              className={`${action.color} text-white p-4 rounded-lg flex flex-col items-center space-y-2 hover:opacity-90 transition-opacity`}
            >
              <action.icon className="h-6 w-6" />
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-ydf-light-gray">
        <div className="p-6 border-b border-ydf-light-gray">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Applications
          </h3>
        </div>
        <div className="divide-y divide-ydf-light-gray">
          {recentApplications.map((app) => (
            <div key={app.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-ydf-deep-blue rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {app.applicant
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {app.applicant}
                      </p>
                      <p className="text-sm text-gray-600">{app.scheme}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      Score: {app.score}
                    </p>
                    <p className="text-xs text-gray-600">{app.submittedDate}</p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}
                  >
                    {app.status}
                  </span>
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <Eye className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSchemes = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Scholarship Schemes
        </h2>
        <button className="bg-ydf-deep-blue text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-opacity-90">
          <Plus className="h-4 w-4" />
          <span>Create Scheme</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search schemes..."
            className="w-full pl-10 pr-4 py-2 border border-ydf-light-gray rounded-lg focus:ring-2 focus:ring-ydf-deep-blue focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="p-2 border border-ydf-light-gray rounded-lg hover:bg-gray-50">
          <Filter className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      {/* Schemes Table */}
      <div className="bg-white rounded-lg shadow-sm border border-ydf-light-gray overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-ydf-light-gray">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scheme Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applications
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Budget
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deadline
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ydf-light-gray">
              {schemes.map((scheme) => (
                <tr key={scheme.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{scheme.name}</p>
                      <p className="text-sm text-gray-600">{scheme.category}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(scheme.status)}`}
                    >
                      {scheme.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {scheme.applications}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {scheme.budget}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {scheme.deadline}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 hover:bg-gray-200 rounded">
                        <Eye className="h-4 w-4 text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-200 rounded">
                        <Edit className="h-4 w-4 text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-200 rounded">
                        <Copy className="h-4 w-4 text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-200 rounded">
                        <MoreVertical className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Analytics</h2>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-ydf-light-gray">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Applications Trend
            </h3>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">+18%</div>
          <p className="text-sm text-gray-600">Compared to last month</p>
          <div className="mt-4 h-20 bg-gradient-to-r from-ydf-deep-blue to-ydf-teal-green rounded opacity-20"></div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-ydf-light-gray">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Total Disbursed
            </h3>
            <DollarSign className="h-5 w-5 text-ydf-golden-yellow" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">₹2.3Cr</div>
          <p className="text-sm text-gray-600">This financial year</p>
          <div className="mt-4 h-20 bg-gradient-to-r from-ydf-golden-yellow to-ydf-teal-green rounded opacity-20"></div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-ydf-light-gray">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Success Rate</h3>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">68%</div>
          <p className="text-sm text-gray-600">Application approval rate</p>
          <div className="mt-4 h-20 bg-gradient-to-r from-green-400 to-ydf-teal-green rounded opacity-20"></div>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-ydf-light-gray">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Application Distribution
          </h3>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Bar Chart Placeholder</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-ydf-light-gray">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Disbursement Breakdown
          </h3>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full border-4 border-gray-400 mx-auto mb-2"></div>
              <p className="text-gray-500">Donut Chart Placeholder</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {showOnboarding && (
        <OnboardingTour
          userType="admin"
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      )}
      <div className="min-h-screen bg-gray-50">
        <RoleBasedNavigation />
        
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-ydf-light-gray">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-600">
                  Welcome back, {user?.firstName}! Manage scholarships and applications
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Download className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Settings className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-white shadow-sm border-r border-ydf-light-gray min-h-screen">
          <nav className="p-4 space-y-2">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "schemes", label: "Manage Schemes", icon: FileText },
              { id: "applications", label: "View Applications", icon: Users },
              { id: "analytics", label: "Analytics", icon: TrendingUp },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? "bg-ydf-deep-blue text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeTab === "overview" && renderOverview()}
          {activeTab === "schemes" && renderSchemes()}
          {activeTab === "applications" && renderOverview()}
          {activeTab === "analytics" && renderAnalytics()}
        </div>
      </div>
      </div>
    </>
  );
};

export default AdminDashboard;
