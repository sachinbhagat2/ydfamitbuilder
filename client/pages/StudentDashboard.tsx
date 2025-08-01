import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import OnboardingTour from "../components/OnboardingTour";
import {
  GraduationCap,
  FileText,
  Bell,
  MessageCircle,
  Search,
  User,
  ChevronRight,
  Calendar,
  DollarSign,
  Clock,
  BookOpen,
} from "lucide-react";

const StudentDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Check if user is new (hasn't seen onboarding)
    const hasSeenOnboarding = localStorage.getItem('ydf_onboarding_student');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('ydf_onboarding_student', 'true');
    setShowOnboarding(false);
  };

  const handleOnboardingSkip = () => {
    localStorage.setItem('ydf_onboarding_student', 'skipped');
    setShowOnboarding(false);
  };

  const scholarships = [
    {
      id: 1,
      name: "Merit Excellence Scholarship",
      amount: "₹50,000",
      deadline: "15 Mar 2024",
      status: "Applied",
      category: "Academic",
      color: "bg-ydf-deep-blue",
    },
    {
      id: 2,
      name: "Rural Development Grant",
      amount: "₹25,000",
      deadline: "22 Mar 2024",
      status: "Eligible",
      category: "Rural",
      color: "bg-ydf-teal-green",
    },
    {
      id: 3,
      name: "Technical Innovation Fund",
      amount: "₹75,000",
      deadline: "30 Mar 2024",
      status: "Under Review",
      category: "Technology",
      color: "bg-purple-600",
    },
  ];

  const announcements = [
    {
      id: 1,
      title: "New Scholarship Programs Launched",
      time: "2 hours ago",
      urgent: true,
    },
    {
      id: 2,
      title: "Application Deadline Extended",
      time: "1 day ago",
      urgent: false,
    },
    {
      id: 3,
      title: "Document Verification Process",
      time: "3 days ago",
      urgent: false,
    },
  ];

  const quickActions = [
    {
      icon: Search,
      label: "Browse Scholarships",
      color: "bg-ydf-deep-blue",
      link: "/scholarships",
    },
    {
      icon: MessageCircle,
      label: "Chat Support",
      color: "bg-ydf-teal-green",
      link: "/support",
    },
    {
      icon: FileText,
      label: "Track Progress",
      color: "bg-ydf-golden-yellow text-ydf-deep-blue",
      link: "/progress",
    },
    {
      icon: User,
      label: "Profile",
      color: "bg-gray-600",
      link: "/profile",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-ydf-light-gray">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Good Morning, Arjun!
              </h1>
              <p className="text-sm text-gray-600">
                Ready to explore new opportunities?
              </p>
            </div>
            <div className="relative">
              <Bell className="h-6 w-6 text-gray-600" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg p-4 shadow-sm border border-ydf-light-gray"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-ydf-deep-blue rounded-lg flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">5</p>
                <p className="text-sm text-gray-600">Active Applications</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-lg p-4 shadow-sm border border-ydf-light-gray"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-ydf-teal-green rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">₹2.5L</p>
                <p className="text-sm text-gray-600">Total Applied</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link
                  to={action.link}
                  className={`${action.color} text-white rounded-lg p-4 flex flex-col items-center space-y-2 shadow-sm hover:shadow-md transition-shadow`}
                >
                  <action.icon className="h-6 w-6" />
                  <span className="text-sm font-medium text-center">
                    {action.label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Active Scholarships */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Your Scholarships
            </h2>
            <Link
              to="/scholarships"
              className="text-ydf-deep-blue text-sm font-medium"
            >
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {scholarships.map((scholarship, index) => (
              <motion.div
                key={scholarship.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg p-4 shadow-sm border border-ydf-light-gray"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <div
                        className={`w-3 h-3 rounded-full ${scholarship.color}`}
                      ></div>
                      <h3 className="font-medium text-gray-900">
                        {scholarship.name}
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4" />
                        <span>{scholarship.amount}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{scholarship.deadline}</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          scholarship.status === "Applied"
                            ? "bg-blue-100 text-blue-800"
                            : scholarship.status === "Eligible"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {scholarship.status}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Announcements */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Latest Announcements
          </h2>
          <div className="bg-white rounded-lg shadow-sm border border-ydf-light-gray">
            {announcements.map((announcement, index) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`p-4 ${index !== announcements.length - 1 ? "border-b border-ydf-light-gray" : ""}`}
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${announcement.urgent ? "bg-red-500" : "bg-gray-400"}`}
                  ></div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {announcement.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {announcement.time}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 mt-1" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-ydf-light-gray">
        <div className="grid grid-cols-4 py-2">
          {[
            { icon: BookOpen, label: "Home", active: true },
            { icon: Search, label: "Search", active: false },
            { icon: Bell, label: "Alerts", active: false },
            { icon: User, label: "Profile", active: false },
          ].map((item, index) => (
            <div
              key={item.label}
              className={`flex flex-col items-center py-2 ${item.active ? "text-ydf-deep-blue" : "text-gray-400"}`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
