import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  FileText,
  User,
  DollarSign,
  Filter,
  Search,
  Eye,
  Download,
  MessageCircle,
  Paperclip,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

const Progress = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const applications = [
    {
      id: 1,
      scholarship: "Merit Excellence Scholarship",
      amount: "₹50,000",
      appliedDate: "2024-01-15",
      status: "Under Review",
      progress: 60,
      nextStep: "Document Verification",
      deadline: "2024-03-15",
      category: "Academic",
      reviewerComments:
        "Good academic performance. Pending income verification.",
      timeline: [
        {
          step: "Application Submitted",
          date: "2024-01-15",
          completed: true,
          description: "Your application has been successfully submitted.",
        },
        {
          step: "Initial Review",
          date: "2024-01-18",
          completed: true,
          description: "Application passed initial eligibility screening.",
        },
        {
          step: "Document Verification",
          date: "In Progress",
          completed: false,
          description: "Documents are being verified by our team.",
        },
        {
          step: "Interview",
          date: "Pending",
          completed: false,
          description:
            "Interview will be scheduled after document verification.",
        },
        {
          step: "Final Decision",
          date: "Pending",
          completed: false,
          description: "Final approval and disbursement process.",
        },
      ],
    },
    {
      id: 2,
      scholarship: "Rural Development Grant",
      amount: "₹25,000",
      appliedDate: "2024-01-12",
      status: "Interview Scheduled",
      progress: 80,
      nextStep: "Attend Interview",
      deadline: "2024-03-22",
      category: "Rural",
      reviewerComments: "Strong application. Interview scheduled for 25th Jan.",
      interviewDetails: {
        date: "2024-01-25",
        time: "10:00 AM",
        venue: "Online (Zoom)",
        interviewer: "Dr. Priya Sharma",
        instructions:
          "Please join 5 minutes early and keep your documents ready.",
      },
      timeline: [
        {
          step: "Application Submitted",
          date: "2024-01-12",
          completed: true,
          description: "Your application has been successfully submitted.",
        },
        {
          step: "Initial Review",
          date: "2024-01-14",
          completed: true,
          description: "Application passed initial eligibility screening.",
        },
        {
          step: "Document Verification",
          date: "2024-01-16",
          completed: true,
          description: "All documents verified successfully.",
        },
        {
          step: "Interview",
          date: "2024-01-25",
          completed: false,
          description: "Interview scheduled for 25th January at 10:00 AM.",
        },
        {
          step: "Final Decision",
          date: "Pending",
          completed: false,
          description: "Final approval and disbursement process.",
        },
      ],
    },
    {
      id: 3,
      scholarship: "Women Empowerment Scholarship",
      amount: "₹40,000",
      appliedDate: "2024-01-10",
      status: "Approved",
      progress: 100,
      nextStep: "Fund Disbursement",
      deadline: "2024-02-28",
      category: "Gender",
      reviewerComments:
        "Excellent application. Approved for full scholarship amount.",
      disbursementDetails: {
        amount: "₹40,000",
        accountNumber: "****7892",
        bankName: "State Bank of India",
        expectedDate: "2024-01-30",
      },
      timeline: [
        {
          step: "Application Submitted",
          date: "2024-01-10",
          completed: true,
          description: "Your application has been successfully submitted.",
        },
        {
          step: "Initial Review",
          date: "2024-01-11",
          completed: true,
          description: "Application passed initial eligibility screening.",
        },
        {
          step: "Document Verification",
          date: "2024-01-13",
          completed: true,
          description: "All documents verified successfully.",
        },
        {
          step: "Interview",
          date: "2024-01-16",
          completed: true,
          description: "Interview completed successfully.",
        },
        {
          step: "Final Decision",
          date: "2024-01-20",
          completed: true,
          description: "Application approved. Fund disbursement in progress.",
        },
      ],
    },
    {
      id: 4,
      scholarship: "Technical Innovation Fund",
      amount: "₹75,000",
      appliedDate: "2024-01-08",
      status: "Rejected",
      progress: 40,
      nextStep: "Application Closed",
      deadline: "2024-03-30",
      category: "Technology",
      reviewerComments:
        "Project proposal lacks innovation. Eligibility criteria not met.",
      timeline: [
        {
          step: "Application Submitted",
          date: "2024-01-08",
          completed: true,
          description: "Your application has been successfully submitted.",
        },
        {
          step: "Initial Review",
          date: "2024-01-10",
          completed: true,
          description: "Application passed initial eligibility screening.",
        },
        {
          step: "Technical Review",
          date: "2024-01-15",
          completed: true,
          description: "Technical committee reviewed the project proposal.",
        },
        {
          step: "Final Decision",
          date: "2024-01-18",
          completed: true,
          description: "Application rejected due to eligibility criteria.",
        },
      ],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Under Review":
        return "bg-yellow-100 text-yellow-800";
      case "Interview Scheduled":
        return "bg-blue-100 text-blue-800";
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      case "Pending Documents":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Under Review":
        return <Clock className="h-5 w-5" />;
      case "Interview Scheduled":
        return <User className="h-5 w-5" />;
      case "Approved":
        return <CheckCircle className="h-5 w-5" />;
      case "Rejected":
        return <XCircle className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return "bg-green-500";
    if (progress >= 60) return "bg-blue-500";
    if (progress >= 30) return "bg-yellow-500";
    return "bg-red-500";
  };

  const filteredApplications = applications.filter((app) => {
    const matchesFilter =
      activeFilter === "all" ||
      app.status.toLowerCase().replace(" ", "-") === activeFilter;
    const matchesSearch =
      searchQuery === "" ||
      app.scholarship.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = [
    {
      title: "Total Applications",
      value: applications.length,
      icon: FileText,
      color: "bg-blue-500",
    },
    {
      title: "Under Review",
      value: applications.filter((app) => app.status === "Under Review").length,
      icon: Clock,
      color: "bg-yellow-500",
    },
    {
      title: "Approved",
      value: applications.filter((app) => app.status === "Approved").length,
      icon: CheckCircle,
      color: "bg-green-500",
    },
    {
      title: "Total Amount Applied",
      value: "₹1,90,000",
      icon: DollarSign,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-ydf-light-gray">
        <div className="px-6 py-4">
          <div className="flex items-center space-x-3">
            <Link
              to="/student-dashboard"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Application Progress
              </h1>
              <p className="text-sm text-gray-600">
                Track your scholarship applications
              </p>
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
                placeholder="Search applications..."
                className="w-full pl-10 pr-4 py-2 border border-ydf-light-gray rounded-lg focus:ring-2 focus:ring-ydf-deep-blue focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="flex space-x-2">
              {[
                { id: "all", label: "All" },
                { id: "under-review", label: "Under Review" },
                { id: "interview-scheduled", label: "Interview" },
                { id: "approved", label: "Approved" },
                { id: "rejected", label: "Rejected" },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeFilter === filter.id
                      ? "bg-ydf-deep-blue text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-6">
          {filteredApplications.map((application, index) => (
            <motion.div
              key={application.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-ydf-light-gray overflow-hidden"
            >
              {/* Application Header */}
              <div className="p-6 border-b border-ydf-light-gray">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {application.scholarship}
                      </h3>
                      <span
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}
                      >
                        {getStatusIcon(application.status)}
                        <span>{application.status}</span>
                      </span>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4" />
                        <span>Amount: {application.amount}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Applied: {application.appliedDate}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>Deadline: {application.deadline}</span>
                      </div>
                      <div>
                        <span className="font-medium">Category: </span>
                        {application.category}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-ydf-deep-blue">
                      {application.progress}%
                    </div>
                    <div className="text-sm text-gray-600">Progress</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                    <span>Application Progress</span>
                    <span>Next: {application.nextStep}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getProgressColor(application.progress)}`}
                      style={{ width: `${application.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  Application Timeline
                </h4>
                <div className="space-y-4">
                  {application.timeline.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex items-start space-x-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step.completed
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h5
                            className={`font-medium ${
                              step.completed ? "text-gray-900" : "text-gray-600"
                            }`}
                          >
                            {step.step}
                          </h5>
                          <span className="text-sm text-gray-500">
                            {step.date}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Information */}
              {application.status === "Interview Scheduled" &&
                application.interviewDetails && (
                  <div className="bg-blue-50 border-t border-blue-200 p-6">
                    <h4 className="text-lg font-medium text-blue-900 mb-3">
                      Interview Details
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-blue-600" />
                          <span>
                            <strong>Date:</strong>{" "}
                            {application.interviewDetails.date}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <span>
                            <strong>Time:</strong>{" "}
                            {application.interviewDetails.time}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-blue-600" />
                          <span>
                            <strong>Venue:</strong>{" "}
                            {application.interviewDetails.venue}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-blue-600" />
                          <span>
                            <strong>Interviewer:</strong>{" "}
                            {application.interviewDetails.interviewer}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-blue-100 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Instructions:</strong>{" "}
                        {application.interviewDetails.instructions}
                      </p>
                    </div>
                  </div>
                )}

              {application.status === "Approved" &&
                application.disbursementDetails && (
                  <div className="bg-green-50 border-t border-green-200 p-6">
                    <h4 className="text-lg font-medium text-green-900 mb-3">
                      Disbursement Information
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div>
                          <strong>Amount:</strong>{" "}
                          {application.disbursementDetails.amount}
                        </div>
                        <div>
                          <strong>Bank Account:</strong>{" "}
                          {application.disbursementDetails.accountNumber}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <strong>Bank Name:</strong>{" "}
                          {application.disbursementDetails.bankName}
                        </div>
                        <div>
                          <strong>Expected Date:</strong>{" "}
                          {application.disbursementDetails.expectedDate}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              {/* Reviewer Comments */}
              {application.reviewerComments && (
                <div className="bg-gray-50 border-t border-gray-200 p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    Reviewer Comments
                  </h4>
                  <p className="text-sm text-gray-700">
                    {application.reviewerComments}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>Application ID: #{application.id}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
                    </button>
                    <button className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </button>
                    <button className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                      <MessageCircle className="h-4 w-4" />
                      <span>Contact Support</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No applications found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;
