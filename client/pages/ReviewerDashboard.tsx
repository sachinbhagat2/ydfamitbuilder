import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import RoleBasedNavigation from "../components/RoleBasedNavigation";
import api from "../services/api";
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Eye,
  MapPin,
  Star,
  Calendar,
  GraduationCap,
  Phone,
  Mail,
  Paperclip,
} from "lucide-react";

const ReviewerDashboard = () => {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [schemeFilter, setSchemeFilter] = useState<string>("all");

  const [items, setItems] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const reload = async () => {
    setLoading(true);
    try {
      const res = await api.listReviewerApplications({ page: 1, limit: 100 });
      if (res.success) {
        const mapped = (res.data || []).map((a: any) => ({
          id: a.id,
          raw: a,
          applicant: {
            name: a.studentName || `Student #${a.studentId}`,
            age: a?.formData?.age || "",
            location: a?.formData?.location || "",
            email: a?.formData?.email || "",
            phone: a?.formData?.phone || "",
            course: a?.formData?.course || "",
            year: a?.formData?.year || "",
          },
          scheme: a.scholarshipTitle || `Scholarship #${a.scholarshipId}`,
          amount: a.amountAwarded ? `₹${a.amountAwarded}` : "",
          submittedDate: a.submittedAt,
          score: a.score == null ? "" : a.score,
          status: a.status,
          documents: Array.isArray(a.documents) ? a.documents : [],
          priority: "medium",
        }));
        setItems(mapped);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  useEffect(() => {
    let data = [...items];
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      data = data.filter(
        (d) =>
          d.applicant.name.toLowerCase().includes(q) ||
          String(d.scheme || "").toLowerCase().includes(q),
      );
    }
    if (statusFilter !== "all") {
      data = data.filter((d) => d.status === statusFilter);
    }
    if (schemeFilter !== "all") {
      data = data.filter((d) => d.scheme === schemeFilter);
    }
    setFiltered(data);
  }, [items, searchQuery, statusFilter, schemeFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "under_review":
        return "bg-yellow-100 text-yellow-800";
      case "submitted":
        return "bg-gray-100 text-gray-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "waitlisted":
        return "bg-orange-100 text-orange-800";
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

  const [stats, setStats] = useState([
    { title: "Submitted", value: "0", icon: Clock, color: "bg-yellow-500" },
    {
      title: "Under Review",
      value: "0",
      icon: CheckCircle,
      color: "bg-green-500",
    },
    { title: "Approved", value: "0", icon: Star, color: "bg-red-500" },
    { title: "Rejected", value: "0", icon: Calendar, color: "bg-blue-500" },
  ]);

  useEffect(() => {
    (async () => {
      try {
        const r = await api.getReviewerStats();
        if (r.success && r.data) {
          const d = r.data as any;
          setStats([
            {
              title: "Submitted",
              value: String(d.submitted || 0),
              icon: Clock,
              color: "bg-yellow-500",
            },
            {
              title: "Under Review",
              value: String(d.under_review || 0),
              icon: CheckCircle,
              color: "bg-green-500",
            },
            {
              title: "Approved",
              value: String(d.approved || 0),
              icon: Star,
              color: "bg-red-500",
            },
            {
              title: "Rejected",
              value: String(d.rejected || 0),
              icon: Calendar,
              color: "bg-blue-500",
            },
          ]);
        }
      } catch {}
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <RoleBasedNavigation />

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-ydf-light-gray">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Reviewer Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Welcome back, {user?.firstName}! Review and evaluate scholarship
                applications
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
                placeholder="Search by applicant or scheme..."
                className="w-full pl-10 pr-4 py-2 border border-ydf-light-gray rounded-lg focus:ring-2 focus:ring-ydf-deep-blue focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-ydf-light-gray rounded-lg focus:ring-2 focus:ring-ydf-deep-blue focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="waitlisted">Waitlisted</option>
            </select>

            {/* Scheme Filter */}
            <select
              value={schemeFilter}
              onChange={(e) => setSchemeFilter(e.target.value)}
              className="px-4 py-2 border border-ydf-light-gray rounded-lg focus:ring-2 focus:ring-ydf-deep-blue focus:border-transparent"
            >
              <option value="all">All Schemes</option>
              {Array.from(new Set(items.map((i) => i.scheme))).map((s) => (
                <option key={s} value={s as string}>
                  {s as string}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filtered.map((application, index) => {
            const finalStatus = application.status === "approved" || application.status === "rejected";
            return (
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
                        className={`text-2xl font-bold ${getScoreColor(Number(application.score || 0))}`}
                      >
                        {application.score || "-"}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">Score</div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}
                      >
                        {application.status.replace("_", " ")}
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
                          {application.amount || "-"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Submitted:</span>
                        <span className="font-medium">
                          {application.submittedDate
                            ? new Date(application.submittedDate).toLocaleString()
                            : "-"}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Age:</span>
                        <span className="font-medium">
                          {application.applicant.age || "-"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Year:</span>
                        <span className="font-medium">
                          {application.applicant.year || "-"}
                        </span>
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
                          <span>{String(doc)}</span>
                        </span>
                      ))}
                      {!application.documents.length && (
                        <span className="text-sm text-gray-500">No documents</span>
                      )}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">
                        {application.applicant.email || "-"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">
                        {application.applicant.phone || "-"}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <button
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      onClick={() => setSelectedApp(application)}
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
                    </button>

                    <div className="flex items-center space-x-3">
                      {!finalStatus && (
                        <>
                          <button
                            className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-600 transition-colors"
                            onClick={async () => {
                              await api.updateMyAssignedApplication(application.id, { status: "rejected" });
                              await reload();
                            }}
                          >
                            <XCircle className="h-4 w-4" />
                            <span>Reject</span>
                          </button>
                          <button
                            className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600 transition-colors"
                            onClick={async () => {
                              await api.updateMyAssignedApplication(application.id, { status: "approved" });
                              await reload();
                            }}
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>Approve</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
          {!filtered.length && (
            <div className="bg-white border rounded p-6 text-center text-gray-500">
              {loading ? "Loading..." : "No applications found"}
            </div>
          )}
        </div>

        {/* Details Modal */}
        {selectedApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Application Details</h3>
                <button className="text-gray-500 hover:text-gray-700" onClick={() => setSelectedApp(null)}>✕</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Applicant</h4>
                  <p className="text-sm">{selectedApp.applicant.name}</p>
                  <p className="text-sm text-gray-600">{selectedApp.applicant.email || "-"}</p>
                  <p className="text-sm text-gray-600">{selectedApp.applicant.phone || "-"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Scheme</h4>
                  <p className="text-sm">{selectedApp.scheme}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Form Data</h4>
                <pre className="text-xs bg-gray-100 rounded p-3 overflow-auto max-h-64">{JSON.stringify(selectedApp.raw?.formData || {}, null, 2)}</pre>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Documents</h4>
                {selectedApp.documents?.length ? (
                  <ul className="list-disc pl-5 text-sm">
                    {selectedApp.documents.map((d: any, i: number) => (
                      <li key={i}>{String(d)}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No documents</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewerDashboard;
