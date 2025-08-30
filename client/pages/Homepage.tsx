import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { ThemeToggle } from "../components/ThemeToggle";
import { useAuth } from "../contexts/AuthContext";
import {
  ArrowRight,
  Users,
  Award,
  GraduationCap,
  Heart,
  DollarSign,
  BookOpen,
  Target,
  CheckCircle,
  Star,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  TrendingUp,
  Shield,
  Globe,
  ChevronRight,
  Menu,
  X,
  LogIn,
  UserPlus,
  Database,
} from "lucide-react";

const Homepage = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [featured, setFeatured] = useState<any[]>([]);
  const [databaseData, setDatabaseData] = useState<any>({
    users: [],
    scholarships: [],
    applications: [],
    announcements: [],
    stats: null,
    dbStatus: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const api = (await import("../services/api")).default;
        
        // Fetch all data concurrently
        const [
          scholarshipsRes,
          usersRes,
          applicationsRes,
          announcementsRes,
          dbStatusRes
        ] = await Promise.allSettled([
          api.listScholarships({ status: "active", limit: 4, sortBy: "deadline", sortOrder: "asc" }),
          fetch('/api/users').then(r => r.json()).catch(() => ({ success: false })),
          fetch('/api/applications').then(r => r.json()).catch(() => ({ success: false })),
          fetch('/api/announcements').then(r => r.json()).catch(() => ({ success: false })),
          fetch('/api/test/connection').then(r => r.json()).catch(() => ({ success: false }))
        ]);

        // Extract results
        const scholarships = scholarshipsRes.status === 'fulfilled' && scholarshipsRes.value.success 
          ? scholarshipsRes.value.data || [] 
          : [];
        
        const users = usersRes.status === 'fulfilled' && usersRes.value.success 
          ? usersRes.value.data || [] 
          : [];
          
        const applications = applicationsRes.status === 'fulfilled' && applicationsRes.value.success 
          ? applicationsRes.value.data || [] 
          : [];
          
        const announcements = announcementsRes.status === 'fulfilled' && announcementsRes.value.success 
          ? announcementsRes.value.data || [] 
          : [];
          
        const dbStatus = dbStatusRes.status === 'fulfilled' 
          ? dbStatusRes.value 
          : null;

        // Set featured scholarships
        setFeatured(scholarships);
        
        // Set comprehensive database data
        setDatabaseData({
          users,
          scholarships,
          applications,
          announcements,
          stats: {
            totalUsers: users.length,
            totalScholarships: scholarships.length,
            totalApplications: applications.length,
            totalAnnouncements: announcements.length,
            usersByType: users.reduce((acc: any, user: any) => {
              acc[user.userType] = (acc[user.userType] || 0) + 1;
              return acc;
            }, {}),
            applicationsByStatus: applications.reduce((acc: any, app: any) => {
              acc[app.status] = (acc[app.status] || 0) + 1;
              return acc;
            }, {}),
            scholarshipsByStatus: scholarships.reduce((acc: any, sch: any) => {
              acc[sch.status] = (acc[sch.status] || 0) + 1;
              return acc;
            }, {})
          },
          dbStatus
        });
      } catch (error) {
        console.error('Error loading database data:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const stats = [
    {
      number: "10,000+",
      label: "Students Supported",
      icon: Users,
    },
    {
      number: "₹5.2 Cr",
      label: "Scholarships Distributed",
      icon: DollarSign,
    },
    {
      number: "500+",
      label: "Partner Institutions",
      icon: GraduationCap,
    },
    {
      number: "95%",
      label: "Success Rate",
      icon: TrendingUp,
    },
  ];

  const features = [
    {
      icon: Target,
      title: "Merit-Based Selection",
      description:
        "Fair and transparent selection process based on academic excellence and financial need.",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description:
        "Your data is protected with industry-standard security measures and encryption.",
    },
    {
      icon: Globe,
      title: "Pan-India Coverage",
      description:
        "Supporting students across all states and territories of India with equal opportunities.",
    },
    {
      icon: Heart,
      title: "Holistic Support",
      description:
        "Beyond funding - mentorship, career guidance, and skill development programs.",
    },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "B.Tech Student, IIT Mumbai",
      content:
        "Thanks to Youth Dreamers Foundation, I could pursue my engineering dreams without worrying about finances. The mentorship program was invaluable.",
      rating: 5,
    },
    {
      name: "Rahul Kumar",
      role: "M.Sc Agriculture, Delhi University",
      content:
        "The scholarship not only covered my education costs but also provided access to industry experts who guided my career path.",
      rating: 5,
    },
    {
      name: "Anjali Patel",
      role: "MBA Student, Ahmedabad",
      content:
        "The application process was seamless, and the support team was incredibly helpful throughout my journey.",
      rating: 5,
    },
  ];

  const userTypes = [
    {
      type: "Student",
      title: "Apply for Scholarships",
      description: "Browse and apply for scholarships that match your profile",
      features: [
        "Easy application process",
        "Track application status",
        "Access to mentorship",
        "Career guidance",
      ],
      link: "/student-dashboard",
      color: "bg-ydf-deep-blue",
    },
    {
      type: "Donor",
      title: "Fund Education",
      description: "Support deserving students and make a lasting impact",
      features: [
        "Create custom scholarships",
        "Track student progress",
        "Impact reporting",
        "Tax benefits",
      ],
      link: "/donor",
      color: "bg-ydf-teal-green",
    },
    {
      type: "Reviewer",
      title: "Evaluate Applications",
      description: "Help identify and support the most deserving candidates",
      features: [
        "Application review tools",
        "Scoring system",
        "Collaboration features",
        "Detailed reporting",
      ],
      link: "/reviewer",
      color: "bg-purple-600",
    },
    {
      type: "Admin",
      title: "Manage Programs",
      description: "Oversee scholarship programs and organizational operations",
      features: [
        "Program management",
        "Analytics dashboard",
        "User management",
        "Financial tracking",
      ],
      link: "/admin",
      color: "bg-ydf-golden-yellow text-ydf-deep-blue",
    },
  ];

  const navigation = [
    { name: t("navigation.about"), href: "#about" },
    { name: t("navigation.programs"), href: "#programs" },
    { name: t("navigation.impact"), href: "#impact" },
    { name: t("navigation.contact"), href: "#contact" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-ydf-deep-blue shadow-sm border-b border-ydf-light-gray sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F3b1b952ac06b422687ab6f8265e647a7%2F209099442e6c42e883b3d324b2f06354?format=webp&width=800"
                alt="Youth Dreamers Foundation Logo"
                className="h-8 w-auto"
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-white hover:text-ydf-golden-yellow transition-colors font-medium"
                >
                  {item.name}
                </a>
              ))}
              <div className="flex items-center space-x-3">
                <LanguageSwitcher />
                <ThemeToggle />
                {isAuthenticated ? (
                  <>
                    <Link
                      to={
                        user?.userType === "student"
                          ? "/student-dashboard"
                          : user?.userType === "admin"
                            ? "/admin-dashboard"
                            : user?.userType === "reviewer"
                              ? "/reviewer-dashboard"
                              : user?.userType === "donor"
                                ? "/donor-dashboard"
                                : "/student-dashboard"
                      }
                      className="text-white hover:text-ydf-golden-yellow transition-colors font-medium"
                    >
                      Dashboard
                    </Link>
                    <span className="text-ydf-golden-yellow text-sm">
                      {user?.firstName} {user?.lastName}
                    </span>
                    <button
                      onClick={() => logout()}
                      className="text-white hover:text-ydf-golden-yellow transition-colors font-medium"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/auth"
                      className="flex items-center space-x-1 text-white hover:text-ydf-golden-yellow transition-colors font-medium"
                    >
                      <LogIn className="h-4 w-4" />
                      <span>Sign In</span>
                    </Link>
                    <Link
                      to="/auth"
                      className="bg-ydf-golden-yellow text-ydf-deep-blue px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors font-semibold flex items-center space-x-1"
                    >
                      <UserPlus className="h-4 w-4" />
                      <span>Sign Up</span>
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="md:hidden border-t border-gray-200 py-4"
            >
              <div className="space-y-3">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2 text-white hover:text-ydf-golden-yellow"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
                <div className="px-3 py-2 flex items-center space-x-3">
                  <LanguageSwitcher />
                  <ThemeToggle />
                </div>
                <div className="px-3 space-y-2">
                  <Link
                    to="/auth"
                    className="flex items-center space-x-2 text-white hover:text-ydf-golden-yellow py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    to="/auth"
                    className="block bg-ydf-golden-yellow text-ydf-deep-blue px-4 py-2 rounded-lg text-center font-semibold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-ydf-deep-blue to-ydf-teal-green text-white py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-20 h-20 bg-ydf-golden-yellow rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-12 h-12 bg-white rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-40 left-20 w-16 h-16 bg-ydf-golden-yellow rounded-full animate-pulse delay-2000"></div>
          <div className="absolute bottom-20 right-10 w-8 h-8 bg-white rounded-full animate-pulse delay-3000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                {t("hero.title")}
                <span className="text-ydf-golden-yellow">
                  {" "}
                  {t("hero.titleHighlight")}
                </span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                {t("hero.subtitle")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/scholarships"
                  className="bg-ydf-golden-yellow text-ydf-deep-blue px-8 py-4 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-opacity-90 transition-colors"
                >
                  <span>{t("hero.exploreScholarships")}</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/donor"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-ydf-deep-blue transition-colors text-center"
                >
                  {t("hero.becomeADonor")}
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="w-full h-96 bg-white bg-opacity-10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white border-opacity-20">
                <div className="text-center">
                  <div className="w-32 h-32 bg-ydf-golden-yellow rounded-full mx-auto mb-6 flex items-center justify-center">
                    <GraduationCap className="h-16 w-16 text-ydf-deep-blue" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">10,000+</h3>
                  <p className="text-blue-100">Dreams Realized</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Database Status & Schema Explorer */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Database Schema & Live Data
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real-time view of our database structure and current data
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ydf-deep-blue"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Database Status */}
              <div className="bg-white rounded-2xl shadow-lg border border-ydf-light-gray p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Database Status</h3>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    databaseData.dbStatus?.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {databaseData.dbStatus?.success ? 'Connected' : 'Error'}
                  </div>
                </div>
                {databaseData.dbStatus && (
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Mode:</span>
                      <span className="text-gray-600">PostgreSQL</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Environment:</span>
                      <span className="text-gray-600">{process.env.NODE_ENV || 'development'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Version:</span>
                      <span className="text-gray-600">
                        {databaseData.dbStatus.data?.[0]?.version?.split(' ')[1] || 'Unknown'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Live Statistics */}
              <div className="bg-white rounded-2xl shadow-lg border border-ydf-light-gray p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Live Statistics</h3>
                {databaseData.stats && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-ydf-deep-blue bg-opacity-10 rounded-lg">
                      <div className="text-2xl font-bold text-ydf-deep-blue">
                        {databaseData.stats.totalUsers}
                      </div>
                      <div className="text-sm text-gray-600">Total Users</div>
                    </div>
                    <div className="text-center p-4 bg-ydf-teal-green bg-opacity-10 rounded-lg">
                      <div className="text-2xl font-bold text-ydf-teal-green">
                        {databaseData.stats.totalScholarships}
                      </div>
                      <div className="text-sm text-gray-600">Scholarships</div>
                    </div>
                    <div className="text-center p-4 bg-ydf-golden-yellow bg-opacity-20 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {databaseData.stats.totalApplications}
                      </div>
                      <div className="text-sm text-gray-600">Applications</div>
                    </div>
                    <div className="text-center p-4 bg-purple-100 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {databaseData.stats.totalAnnouncements}
                      </div>
                      <div className="text-sm text-gray-600">Announcements</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Database Tables Schema */}
          <div className="mt-12 bg-white rounded-2xl shadow-lg border border-ydf-light-gray p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Database Schema Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Users Table */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">users</h4>
                  <div className="text-sm text-gray-500">
                    {databaseData.stats?.totalUsers || 0} records
                  </div>
                </div>
                <div className="space-y-1 text-xs text-gray-600">
                  <div>• id (BIGSERIAL)</div>
                  <div>• email (TEXT, UNIQUE)</div>
                  <div>• firstName, lastName (TEXT)</div>
                  <div>• userType (ENUM)</div>
                  <div>• isActive, emailVerified (BOOLEAN)</div>
                  <div>• profileData (JSONB)</div>
                  <div>• createdAt, updatedAt (TIMESTAMPTZ)</div>
                </div>
                {databaseData.stats?.usersByType && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="text-xs text-gray-500 mb-1">By Type:</div>
                    {Object.entries(databaseData.stats.usersByType).map(([type, count]: [string, any]) => (
                      <div key={type} className="flex justify-between text-xs">
                        <span>{type}:</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Scholarships Table */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">scholarships</h4>
                  <div className="text-sm text-gray-500">
                    {databaseData.stats?.totalScholarships || 0} records
                  </div>
                </div>
                <div className="space-y-1 text-xs text-gray-600">
                  <div>• id (BIGSERIAL)</div>
                  <div>• title, description (TEXT)</div>
                  <div>• amount (NUMERIC)</div>
                  <div>• eligibilityCriteria (JSONB)</div>
                  <div>• requiredDocuments (JSONB)</div>
                  <div>• applicationDeadline (TIMESTAMPTZ)</div>
                  <div>• status, tags (TEXT/JSONB)</div>
                </div>
                {databaseData.stats?.scholarshipsByStatus && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="text-xs text-gray-500 mb-1">By Status:</div>
                    {Object.entries(databaseData.stats.scholarshipsByStatus).map(([status, count]: [string, any]) => (
                      <div key={status} className="flex justify-between text-xs">
                        <span>{status}:</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Applications Table */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">applications</h4>
                  <div className="text-sm text-gray-500">
                    {databaseData.stats?.totalApplications || 0} records
                  </div>
                </div>
                <div className="space-y-1 text-xs text-gray-600">
                  <div>• id (BIGSERIAL)</div>
                  <div>• studentId, scholarshipId (BIGINT)</div>
                  <div>• status (ENUM)</div>
                  <div>• score, amountAwarded (NUMERIC)</div>
                  <div>• formData, documents (JSONB)</div>
                  <div>• submittedAt, updatedAt (TIMESTAMPTZ)</div>
                </div>
                {databaseData.stats?.applicationsByStatus && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="text-xs text-gray-500 mb-1">By Status:</div>
                    {Object.entries(databaseData.stats.applicationsByStatus).map(([status, count]: [string, any]) => (
                      <div key={status} className="flex justify-between text-xs">
                        <span>{status}:</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Reviews Table */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">application_reviews</h4>
                <div className="space-y-1 text-xs text-gray-600">
                  <div>• id (BIGSERIAL)</div>
                  <div>• applicationId, reviewerId (BIGINT)</div>
                  <div>• criteria (JSONB)</div>
                  <div>• overallScore (INTEGER)</div>
                  <div>• recommendation (ENUM)</div>
                  <div>• isComplete (BOOLEAN)</div>
                </div>
              </div>

              {/* Announcements Table */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">announcements</h4>
                  <div className="text-sm text-gray-500">
                    {databaseData.stats?.totalAnnouncements || 0} records
                  </div>
                </div>
                <div className="space-y-1 text-xs text-gray-600">
                  <div>• id (BIGSERIAL)</div>
                  <div>• title, content (TEXT)</div>
                  <div>• type, priority (TEXT)</div>
                  <div>• targetAudience (JSONB)</div>
                  <div>• isActive (BOOLEAN)</div>
                  <div>• validFrom, validTo (TIMESTAMPTZ)</div>
                </div>
              </div>

              {/* Additional Tables */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Other Tables</h4>
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="font-medium">• roles</div>
                  <div>  - System roles and permissions</div>
                  <div className="font-medium">• user_roles</div>
                  <div>  - User role assignments</div>
                  <div className="font-medium">• documents</div>
                  <div>  - File upload metadata</div>
                  <div className="font-medium">• contributions</div>
                  <div>  - Donor contribution records</div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Data Preview */}
          {!loading && (
            <div className="mt-12 space-y-8">
              {/* Recent Users */}
              {databaseData.users.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg border border-ydf-light-gray p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Users</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4">ID</th>
                          <th className="text-left py-3 px-4">Name</th>
                          <th className="text-left py-3 px-4">Email</th>
                          <th className="text-left py-3 px-4">Type</th>
                          <th className="text-left py-3 px-4">Status</th>
                          <th className="text-left py-3 px-4">Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {databaseData.users.slice(0, 5).map((user: any) => (
                          <tr key={user.id} className="border-b border-gray-100">
                            <td className="py-3 px-4 font-medium">{user.id}</td>
                            <td className="py-3 px-4">{user.firstName} {user.lastName}</td>
                            <td className="py-3 px-4 text-gray-600">{user.email}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.userType === 'admin' ? 'bg-red-100 text-red-800' :
                                user.userType === 'student' ? 'bg-blue-100 text-blue-800' :
                                user.userType === 'reviewer' ? 'bg-purple-100 text-purple-800' :
                                user.userType === 'donor' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {user.userType}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {user.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-600">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Recent Applications */}
              {databaseData.applications.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg border border-ydf-light-gray p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Applications</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4">ID</th>
                          <th className="text-left py-3 px-4">Student</th>
                          <th className="text-left py-3 px-4">Scholarship</th>
                          <th className="text-left py-3 px-4">Status</th>
                          <th className="text-left py-3 px-4">Score</th>
                          <th className="text-left py-3 px-4">Submitted</th>
                        </tr>
                      </thead>
                      <tbody>
                        {databaseData.applications.slice(0, 5).map((app: any) => {
                          const scholarship = databaseData.scholarships.find((s: any) => s.id === app.scholarshipId);
                          const student = databaseData.users.find((u: any) => u.id === app.studentId);
                          return (
                            <tr key={app.id} className="border-b border-gray-100">
                              <td className="py-3 px-4 font-medium">{app.id}</td>
                              <td className="py-3 px-4">
                                {student ? `${student.firstName} ${student.lastName}` : `User ${app.studentId}`}
                              </td>
                              <td className="py-3 px-4 text-gray-600">
                                {scholarship?.title || `Scholarship ${app.scholarshipId}`}
                              </td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  app.status === 'approved' ? 'bg-green-100 text-green-800' :
                                  app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                  app.status === 'under_review' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {app.status}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                {app.score ? `${app.score}/100` : '-'}
                              </td>
                              <td className="py-3 px-4 text-gray-600">
                                {new Date(app.submittedAt).toLocaleDateString()}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Featured Scholarships (public) */}
      {featured && featured.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Explore Scholarships
              </h2>
              <Link
                to="/scholarships"
                className="text-ydf-deep-blue hover:underline font-semibold"
              >
                View all
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((s: any) => (
                <Link
                  key={s.id}
                  to={`/scholarships/${s.id}`}
                  className="bg-white rounded-2xl shadow-lg border border-ydf-light-gray p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mr-2">
                      {s.title}
                    </h3>
                    <div className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      {s.status}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                    {s.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-700">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-ydf-deep-blue" />
                      <span>₹{s.amount}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-ydf-teal-green" />
                      <span>
                        {s.applicationDeadline
                          ? new Date(s.applicationDeadline).toLocaleDateString()
                          : "-"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Statistics Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-ydf-deep-blue rounded-full mx-auto mb-4 flex items-center justify-center">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section id="programs" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Path
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you're seeking support or looking to make a difference, we
              have the right platform for you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {userTypes.map((userType, index) => (
              <motion.div
                key={userType.type}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg border border-ydf-light-gray overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        {userType.type}
                      </span>
                      <h3 className="text-2xl font-bold text-gray-900 mt-1">
                        {userType.title}
                      </h3>
                    </div>
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${userType.color}`}
                    >
                      <ArrowRight className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6">{userType.description}</p>
                  <ul className="space-y-3 mb-8">
                    {userType.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={userType.link}
                    className={`${userType.color} text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity`}
                  >
                    <span>Get Started</span>
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Youth Dreamers Foundation?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to providing not just financial support, but a
              comprehensive ecosystem for educational success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-ydf-teal-green rounded-full mx-auto mb-6 flex items-center justify-center">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="impact" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Read how our scholarship recipients have transformed their lives
              and communities.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg border border-ydf-light-gray p-8"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-ydf-golden-yellow fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-ydf-deep-blue rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-semibold">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-ydf-deep-blue to-ydf-teal-green text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Transform Lives Through Education?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join our community of dreamers, achievers, and changemakers.
              Whether you're seeking support or looking to make an impact, your
              journey starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/scholarships"
                className="bg-ydf-golden-yellow text-ydf-deep-blue px-8 py-4 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
              >
                Apply for Scholarships
              </Link>
              <Link
                to="/donor"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-ydf-deep-blue transition-colors"
              >
                Become a Supporter
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Organization Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F3b1b952ac06b422687ab6f8265e647a7%2F209099442e6c42e883b3d324b2f06354?format=webp&width=800"
                  alt="Youth Dreamers Foundation Logo"
                  className="h-12 w-auto"
                />
                <div>
                  <p className="text-gray-400">Empowering Dreams Since 2010</p>
                </div>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                We are committed to breaking down financial barriers to
                education and creating opportunities for deserving students
                across India. Our comprehensive support system ensures that
                talent gets the recognition and resources it deserves.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-ydf-deep-blue transition-colors cursor-pointer">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-ydf-deep-blue transition-colors cursor-pointer">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-ydf-deep-blue transition-colors cursor-pointer">
                  <Phone className="h-5 w-5" />
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/scholarships"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Scholarships
                  </Link>
                </li>
                <li>
                  <Link
                    to="/progress"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Track Application
                  </Link>
                </li>
                <li>
                  <Link
                    to="/support"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Support Center
                  </Link>
                </li>
                <li>
                  <Link
                    to="/donor"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Become a Donor
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-ydf-golden-yellow" />
                  <span className="text-gray-300">+91 80-1234-5678</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-ydf-golden-yellow" />
                  <span className="text-gray-300">info@youthdreamers.org</span>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-ydf-golden-yellow mt-1" />
                  <span className="text-gray-300">
                    123 MG Road, Bangalore,
                    <br />
                    Karnataka 560001
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Youth Dreamers Foundation. All rights reserved. |{" "}
              <span className="text-ydf-golden-yellow">
                Empowering Dreams Through Education
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
