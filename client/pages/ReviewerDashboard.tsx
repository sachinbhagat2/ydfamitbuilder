import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Eye,
  MapPin,
  Star,
  Calendar,
  User,
  GraduationCap,
  Phone,
  Mail,
  Paperclip,
} from "lucide-react";

const ReviewerDashboard = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");

  const pendingApplications = [
    {
      id: 1,
      applicant: {
        name: "Priya Sharma",
        age: 20,
        location: "Mumbai, Maharashtra",
        email: "priya.sharma@email.com",
        phone: "+91 9876543210",
        course: "B.Tech Computer Science",
        year: "3rd Year",
      },
      scheme: "Merit Excellence Scholarship",
      amount: "₹50,000",
      submittedDate: "2024-01-15",
      score: 85,
      status: "Under Review",
      documents: [
        "Aadhaar Card",
        "10th Marksheet",
        "12th Marksheet",
        "Income Certificate",
        "College ID",
      ],
      priority: "high",
      region: "West",
    },
    {
      id: 2,
      applicant: {
        name: "Rahul Kumar",
        age: 19,
        location: "Patna, Bihar",
        email: "rahul.kumar@email.com",
        phone: "+91 9123456789",
        course: "B.Sc Agriculture",
        year: "2nd Year",
      },
      scheme: "Rural Development Grant",
      amount: "₹25,000",
      submittedDate: "2024-01-14",
      score: 92,
      status: "Pending Documents",
      documents: ["Aadhaar Card", "10th Marksheet", "Income Certificate"],
      priority: "medium",
      region: "East",
    },
    {
      id: 3,
      applicant: {
        name: "Anjali Patel",
        age: 21,
        location: "Ahmedabad, Gujarat",
        email: "anjali.patel@email.com",
        phone: "+91 9988776655",
        course: "B.A. Economics",
        year: "Final Year",
      },
      scheme: "Women Empowerment Scholarship",
      amount: "₹40,000",
      submittedDate: "2024-01-13",
      score: 78,
      status: "Interview Scheduled",
      documents: [
        "Aadhaar Card",
        "10th Marksheet",
        "12th Marksheet",
        "Income Certificate",
        "Caste Certificate",
      ],
      priority: "high",
      region: "West",
    },
    {
      id: 4,
      applicant: {
        name: "Arjun Singh",
        age: 22,
        location: "Bangalore, Karnataka",
        email: "arjun.singh@email.com",
        phone: "+91 9765432108",
        course: "M.Tech AI & ML",
        year: "1st Year",
      },
      scheme: "Technical Innovation Fund",
      amount: "₹75,000",
      submittedDate: "2024-01-12",
      score: 88,
      status: "Under Review",
      documents: [
        "Aadhaar Card",
        "UG Marksheet",
        "Project Portfolio",
        "Income Certificate",
      ],
      priority: "medium",
      region: "South",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Under Review":
        return "bg-yellow-100 text-yellow-800";
      case "Pending Documents":
        return "bg-orange-100 text-orange-800";
      case "Interview Scheduled":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const stats = [
    {
      title: "Pending Review",
      value: "42",
      icon: Clock,
      color: "bg-yellow-500",
    },
    {
      title: "Reviewed Today",
      value: "18",
      icon: CheckCircle,
      color: "bg-green-500",
    },
    {
      title: "High Priority",
      value: "8",
      icon: Star,
      color: "bg-red-500",
    },
    {
      title: "This Week",
      value: "156",
      icon: Calendar,
      color: "bg-blue-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-ydf-light-gray">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Reviewer Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Review and evaluate scholarship applications
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="bg-ydf-deep-blue text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-opacity-90">
                <Download className="h-4 w-4" />
                <span>Export Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
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
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-ydf-light-gray">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search applicants..."
                className="w-full pl-10 pr-4 py-2 border border-ydf-light-gray rounded-lg focus:ring-2 focus:ring-ydf-deep-blue focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-2 border border-ydf-light-gray rounded-lg focus:ring-2 focus:ring-ydf-deep-blue focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="under-review">Under Review</option>
              <option value="pending-docs">Pending Documents</option>
              <option value="interview">Interview Scheduled</option>
            </select>

            {/* Region Filter */}
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-4 py-2 border border-ydf-light-gray rounded-lg focus:ring-2 focus:ring-ydf-deep-blue focus:border-transparent"
            >
              <option value="all">All Regions</option>
              <option value="north">North</option>
              <option value="south">South</option>
              <option value="east">East</option>
              <option value="west">West</option>
            </select>

            {/* Score Filter */}
            <button className="flex items-center space-x-2 px-4 py-2 border border-ydf-light-gray rounded-lg hover:bg-gray-50">
              <Filter className="h-4 w-4 text-gray-600" />
              <span>More Filters</span>
            </button>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {pendingApplications.map((application, index) => (
            <motion.div
              key={application.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-ydf-light-gray overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    {/* Priority Indicator */}
                    <div
                      className={`w-1 h-16 rounded ${getPriorityColor(application.priority)}`}
                    ></div>

                    {/* Applicant Info */}
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-ydf-deep-blue rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {application.applicant.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {application.applicant.name}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{application.applicant.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <GraduationCap className="h-4 w-4" />
                            <span>{application.applicant.course}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Score and Status */}
                  <div className="text-right">
                    <div
                      className={`text-2xl font-bold ${getScoreColor(application.score)}`}
                    >
                      {application.score}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">Score</div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}
                    >
                      {application.status}
                    </span>
                  </div>
                </div>

                {/* Application Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Scheme:</span>
                      <span className="font-medium">{application.scheme}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium text-ydf-deep-blue">
                        {application.amount}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Submitted:</span>
                      <span className="font-medium">
                        {application.submittedDate}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Age:</span>
                      <span className="font-medium">
                        {application.applicant.age} years
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Year:</span>
                      <span className="font-medium">
                        {application.applicant.year}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Region:</span>
                      <span className="font-medium">{application.region}</span>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Attached Documents ({application.documents.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {application.documents.map((doc, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                      >
                        <Paperclip className="h-3 w-3" />
                        <span>{doc}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">
                      {application.applicant.email}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">
                      {application.applicant.phone}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <button className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Eye className="h-4 w-4" />
                    <span>View Details</span>
                  </button>

                  <div className="flex items-center space-x-3">
                    <button className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-600 transition-colors">
                      <XCircle className="h-4 w-4" />
                      <span>Reject</span>
                    </button>
                    <button className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600 transition-colors">
                      <CheckCircle className="h-4 w-4" />
                      <span>Approve</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center">
          <button className="bg-white border border-ydf-light-gray text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
            Load More Applications
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewerDashboard;
