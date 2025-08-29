import { useEffect, useMemo, useState } from "react";
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
  MapPin,
} from "lucide-react";

const Progress = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [apps, setApps] = useState<any[]>([]);
  const [schMap, setSchMap] = useState<Map<number, any>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const api = (await import("../services/api")).default;
        const [appsRes, schRes] = await Promise.all([
          api.listMyApplications({ limit: 1000 }),
          api.listScholarships({ status: "all", limit: 2000 }),
        ]);
        if (appsRes.success) setApps(appsRes.data || []);
        if (schRes.success) {
          const m = new Map<number, any>();
          (schRes.data || []).forEach((s: any) => m.set(Number(s.id), s));
          setSchMap(m);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const applications = useMemo(() => {
    return (apps || []).map((a: any) => {
      const s = schMap.get(Number(a.scholarshipId));
      const amount = s
        ? `₹${Number(s.amount || 0).toLocaleString("en-IN")}`
        : "₹0";
      const deadline =
        s && s.applicationDeadline
          ? new Date(s.applicationDeadline).toISOString().slice(0, 10)
          : "-";
      const name = s ? s.title : `Scholarship #${a.scholarshipId}`;
      const statusRaw = String(a.status || "Submitted");
      const statusLc = statusRaw.toLowerCase().replace(/_/g, " ");
      const progress =
        statusLc === "approved"
          ? 100
          : statusLc.includes("under review")
            ? 60
            : statusLc === "rejected"
              ? 40
              : 50;
      const nextStep = statusLc.includes("under review")
        ? "Document Verification"
        : statusLc === "approved"
          ? "Fund Disbursement"
          : statusLc === "rejected"
            ? "Application Closed"
            : "Initial Review";
      return {
        id: a.id,
        scholarshipId: Number(a.scholarshipId),
        scholarship: name,
        amount,
        appliedDate: a.submittedAt
          ? new Date(a.submittedAt).toISOString().slice(0, 10)
          : "-",
        status: statusLc.replace(/\b\w/g, (l) => l.toUpperCase()),
        progress,
        nextStep,
        deadline,
        category: (Array.isArray(s?.tags) && s.tags[0]) || "General",
        reviewerComments: (a as any).reviewerComments,
        disbursementDetails: a.amountAwarded
          ? {
              amount: `₹${Number(a.amountAwarded).toLocaleString("en-IN")}`,
              accountNumber: "****",
              bankName: "-",
              expectedDate: "-",
            }
          : undefined,
        timeline: [
          {
            step: "Application Submitted",
            date: a.submittedAt
              ? new Date(a.submittedAt).toISOString().slice(0, 10)
              : "-",
            completed: true,
            description: "Your application has been successfully submitted.",
          },
          {
            step: "Initial Review",
            date: "In Progress",
            completed: ["under review", "approved", "rejected"].includes(
              statusLc,
            ),
            description: "Application eligibility screening.",
          },
        ],
      };
    });
  }, [apps, schMap]);

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
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      q === "" ||
      app.scholarship.toLowerCase().includes(q) ||
      (app.amount || "").toLowerCase().includes(q) ||
      (app.category || "").toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const stats = useMemo(() => {
    const total = applications.length;
    const under =
      applications.filter((a) => a.status === "Under Review").length || 0;
    const approved =
      applications.filter((a) => a.status === "Approved").length || 0;
    const totalAmount = applications.reduce(
      (acc, a) =>
        acc + (parseInt(String(a.amount).replace(/[^0-9]/g, "")) || 0),
      0,
    );
    return [
      {
        title: "Total Applications",
        value: total,
        icon: FileText,
        color: "bg-blue-500",
      },
      {
        title: "Under Review",
        value: under,
        icon: Clock,
        color: "bg-yellow-500",
      },
      {
        title: "Approved",
        value: approved,
        icon: CheckCircle,
        color: "bg-green-500",
      },
      {
        title: "Total Amount Applied",
        value: `₹${totalAmount.toLocaleString("en-IN")}`,
        icon: DollarSign,
        color: "bg-purple-500",
      },
    ];
  }, [applications]);

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
        {loading && <div className="text-gray-600">Loading...</div>}
        {!loading && (
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
                    {application.timeline.map(
                      (step: any, stepIndex: number) => (
                        <div
                          key={stepIndex}
                          className="flex items-start space-x-4"
                        >
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
                                  step.completed
                                    ? "text-gray-900"
                                    : "text-gray-600"
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
                      ),
                    )}
                  </div>
                </div>

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
                      <Link
                        to={`/scholarships/${application.scholarshipId}`}
                        className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Details</span>
                      </Link>
                      <button
                        onClick={() => {
                          const raw = apps.find((a) => a.id === application.id);
                          const sch = schMap.get(Number(raw?.scholarshipId));
                          const w = window.open("", "_blank");
                          if (!w) return;
                          const html = `<!DOCTYPE html><html><head><meta charset=\"utf-8\"><title>Application #${application.id}</title>
                          <style>
                          body{font-family:Arial,Helvetica,sans-serif;padding:24px;color:#111}
                          h1{font-size:20px;margin:0 0 8px}
                          h2{font-size:16px;margin:16px 0 8px}
                          table{border-collapse:collapse;width:100%;margin-bottom:12px}
                          td,th{border:1px solid #ddd;padding:8px;text-align:left}
                          small{color:#666}
                          .muted{color:#555;font-size:12px;margin-bottom:8px}
                          </style></head><body>
                          <h1>Application #${application.id}</h1>
                          <div class=\"muted\">Generated on ${new Date().toLocaleString()}</div>
                          <h2>Scholarship</h2>
                          <table><tr><th>Name</th><td>${application.scholarship}</td></tr>
                          <tr><th>Amount</th><td>${application.amount}</td></tr>
                          <tr><th>Deadline</th><td>${application.deadline}</td></tr>
                          <tr><th>Category</th><td>${application.category}</td></tr></table>
                          <h2>Status</h2>
                          <table><tr><th>Status</th><td>${application.status}</td></tr>
                          <tr><th>Applied</th><td>${application.appliedDate}</td></tr>
                          <tr><th>Next Step</th><td>${application.nextStep}</td></tr>
                          </table>
                          <script>window.onload=()=>{setTimeout(()=>{window.print(); setTimeout(()=>window.close(), 300);}, 100);}</script>
                          </body></html>`;
                          w.document.open();
                          w.document.write(html);
                          w.document.close();
                        }}
                        className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download PDF</span>
                      </button>
                      <Link
                        to="/support"
                        className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>Contact Support</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredApplications.length === 0 && (
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
