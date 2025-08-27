import React, { useState } from 'react';
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import RoleBasedNavigation from "../components/RoleBasedNavigation";
import {
  Heart,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  Gift,
  Calendar,
  MapPin,
  GraduationCap,
  Award,
  Target,
  ChevronRight,
  Eye,
  Download,
  Share,
  Bell,
} from "lucide-react";

const DonorDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const donorStats = [
    {
      title: "Students Funded",
      value: "127",
      change: "+12 this month",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Total Contributed",
      value: "₹15.2L",
      change: "+₹2.3L this month",
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      title: "Active Schemes",
      value: "8",
      change: "2 new schemes",
      icon: Award,
      color: "bg-purple-500",
    },
    {
      title: "Impact Score",
      value: "92%",
      change: "+5% improvement",
      icon: TrendingUp,
      color: "bg-ydf-teal-green",
    },
  ];

  const activeSchemes = [
    {
      id: 1,
      name: "Merit Excellence Scholarship",
      totalFunding: "₹5,00,000",
      studentsSupported: 45,
      remaining: "₹1,50,000",
      deadline: "2024-03-15",
      category: "Academic Excellence",
      progress: 70,
      impact: "High",
    },
    {
      id: 2,
      name: "Rural Girls Education",
      totalFunding: "₹3,00,000",
      studentsSupported: 28,
      remaining: "₹80,000",
      deadline: "2024-04-20",
      category: "Gender Equity",
      progress: 85,
      impact: "Very High",
    },
    {
      id: 3,
      name: "Technical Innovation Fund",
      totalFunding: "₹7,50,000",
      studentsSupported: 18,
      remaining: "₹3,20,000",
      deadline: "2024-05-30",
      category: "Technology",
      progress: 45,
      impact: "Medium",
    },
  ];

  const fundedStudents = [
    {
      id: 1,
      name: "Priya Sharma",
      course: "B.Tech Computer Science",
      college: "IIT Mumbai",
      year: "3rd Year",
      scholarship: "Merit Excellence",
      amount: "₹50,000",
      progress: "Completed Semester",
      location: "Mumbai, Maharashtra",
      gpa: "8.9",
    },
    {
      id: 2,
      name: "Anjali Patel",
      course: "B.Sc Agriculture",
      college: "Gujarat Agricultural University",
      year: "2nd Year",
      scholarship: "Rural Girls Education",
      amount: "₹35,000",
      progress: "Mid-Semester",
      location: "Ahmedabad, Gujarat",
      gpa: "9.2",
    },
    {
      id: 3,
      name: "Rahul Kumar",
      course: "M.Tech AI & ML",
      college: "IIIT Bangalore",
      year: "1st Year",
      scholarship: "Technical Innovation",
      amount: "₹75,000",
      progress: "Project Submission",
      location: "Bangalore, Karnataka",
      gpa: "8.7",
    },
  ];

  const newOpportunities = [
    {
      id: 1,
      title: "Emergency Education Fund",
      description: "Support students affected by natural disasters",
      target: "₹10,00,000",
      raised: "₹3,50,000",
      students: 50,
      urgency: "High",
      category: "Emergency Relief",
    },
    {
      id: 2,
      title: "Tribal Community Development",
      description: "Educational support for tribal students",
      target: "₹8,00,000",
      raised: "₹2,10,000",
      students: 35,
      urgency: "Medium",
      category: "Community Development",
    },
    {
      id: 3,
      title: "Skill Development Program",
      description: "Vocational training and certification support",
      target: "₹6,00,000",
      raised: "₹4,20,000",
      students: 40,
      urgency: "Low",
      category: "Skill Development",
    },
  ];

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 60) return "bg-blue-500";
    if (progress >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "Very High":
        return "bg-green-100 text-green-800";
      case "High":
        return "bg-blue-100 text-blue-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {donorStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-lg p-4 shadow-sm border border-ydf-light-gray"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-green-600">{stat.change}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-ydf-light-gray">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <button className="bg-ydf-deep-blue text-white p-4 rounded-lg flex items-center space-x-3 hover:bg-opacity-90 transition-colors">
            <Plus className="h-5 w-5" />
            <span className="font-medium">Fund New Scholarship</span>
          </button>
          <button className="bg-ydf-teal-green text-white p-4 rounded-lg flex items-center space-x-3 hover:bg-opacity-90 transition-colors">
            <Gift className="h-5 w-5" />
            <span className="font-medium">Make Donation</span>
          </button>
          <button className="bg-purple-500 text-white p-4 rounded-lg flex items-center space-x-3 hover:bg-opacity-90 transition-colors">
            <Download className="h-5 w-5" />
            <span className="font-medium">Download Report</span>
          </button>
        </div>
      </div>

      {/* Impact Summary */}
      <div className="bg-gradient-to-r from-ydf-deep-blue to-ydf-teal-green rounded-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold">Your Impact This Year</h3>
            <p className="text-blue-100">Making dreams come true</p>
          </div>
          <Heart className="h-8 w-8 text-ydf-golden-yellow" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold">127</p>
            <p className="text-sm text-blue-100">Students Supported</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">₹15.2L</p>
            <p className="text-sm text-blue-100">Total Contribution</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">92%</p>
            <p className="text-sm text-blue-100">Success Rate</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">8</p>
            <p className="text-sm text-blue-100">Active Programs</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActiveSchemes = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Your Active Schemes
        </h2>
        <button className="bg-ydf-deep-blue text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-opacity-90">
          <Plus className="h-4 w-4" />
          <span>Fund New Scheme</span>
        </button>
      </div>

      <div className="grid gap-6">
        {activeSchemes.map((scheme, index) => (
          <motion.div
            key={scheme.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-ydf-light-gray"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {scheme.name}
                  </h3>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${getImpactColor(scheme.impact)}`}
                  >
                    {scheme.impact} Impact
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{scheme.category}</p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                    <span>Funding Progress</span>
                    <span>{scheme.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getProgressColor(scheme.progress)}`}
                      style={{ width: `${scheme.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Total Funding</p>
                    <p className="font-semibold text-gray-900">
                      {scheme.totalFunding}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Students Supported</p>
                    <p className="font-semibold text-gray-900">
                      {scheme.studentsSupported}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Remaining</p>
                    <p className="font-semibold text-ydf-deep-blue">
                      {scheme.remaining}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Deadline</p>
                    <p className="font-semibold text-gray-900">
                      {scheme.deadline}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Deadline: {scheme.deadline}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Eye className="h-4 w-4 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Share className="h-4 w-4 text-gray-600" />
                </button>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderTracker = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Student Tracker</h2>

      <div className="grid gap-4">
        {fundedStudents.map((student, index) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-ydf-light-gray"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-ydf-deep-blue rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {student.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {student.name}
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2 text-sm text-gray-600">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <GraduationCap className="h-4 w-4" />
                        <span>{student.course}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>{student.location}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div>
                        <span className="font-medium">College: </span>
                        {student.college}
                      </div>
                      <div>
                        <span className="font-medium">GPA: </span>
                        <span className="text-green-600 font-semibold">
                          {student.gpa}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg font-bold text-ydf-deep-blue">
                  {student.amount}
                </div>
                <div className="text-sm text-gray-600">
                  {student.scholarship}
                </div>
                <div className="mt-2">
                  <span className="bg-green-100 text-green-800 px-2.5 py-1 rounded-full text-xs font-medium">
                    {student.progress}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* New Funding Opportunities */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          New Funding Opportunities
        </h3>
        <div className="grid gap-4">
          {newOpportunities.map((opportunity, index) => (
            <div
              key={opportunity.id}
              className="bg-white rounded-lg p-6 shadow-sm border border-ydf-light-gray"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {opportunity.title}
                    </h4>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${getUrgencyColor(opportunity.urgency)}`}
                    >
                      {opportunity.urgency} Priority
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">
                    {opportunity.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>
                        Raised: {opportunity.raised} of {opportunity.target}
                      </span>
                      <span>
                        {Math.round(
                          (parseInt(opportunity.raised.replace(/[^0-9]/g, "")) /
                            parseInt(
                              opportunity.target.replace(/[^0-9]/g, ""),
                            )) *
                            100,
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-ydf-teal-green h-2 rounded-full"
                        style={{
                          width: `${Math.round((parseInt(opportunity.raised.replace(/[^0-9]/g, "")) / parseInt(opportunity.target.replace(/[^0-9]/g, ""))) * 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{opportunity.students} students</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Target className="h-4 w-4" />
                        <span>{opportunity.category}</span>
                      </div>
                    </div>
                    <button className="bg-ydf-deep-blue text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors">
                      Fund Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <RoleBasedNavigation />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-ydf-light-gray">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Donor Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Welcome back, {user?.firstName}! Track your contributions and support students
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  3
                </span>
              </button>
              <button className="bg-ydf-deep-blue text-white px-4 py-2 rounded-lg hover:bg-opacity-90">
                Make Donation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-ydf-light-gray">
        <div className="px-6">
          <nav className="flex space-x-8">
            {[
              { id: "overview", label: "Overview" },
              { id: "schemes", label: "Active Schemes" },
              { id: "contributions", label: "Contributions" },
              { id: "tracker", label: "Student Tracker" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-ydf-deep-blue text-ydf-deep-blue"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === "overview" && renderOverview()}
        {activeTab === "schemes" && renderActiveSchemes()}
        {activeTab === "contributions" && renderOverview()}
        {activeTab === "tracker" && renderTracker()}
      </div>
    </div>
  );
};

export default DonorDashboard;
