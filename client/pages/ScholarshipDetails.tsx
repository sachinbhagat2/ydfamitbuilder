import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  ChevronRight,
  DollarSign,
  FileText,
  MapPin,
  Star,
} from "lucide-react";
import api from "../services/api";
import { toast } from "../hooks/use-toast";

const ScholarshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sch, setSch] = useState<any | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    const run = async () => {
      if (!id) return;
      try {
        const res = await api.getScholarship(Number(id));
        if (res.success) setSch(res.data);
      } catch (e: any) {
        toast({
          title: "Failed to load",
          description: String(e?.message || e),
        });
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

  const details = useMemo(() => {
    if (!sch) return null;
    return {
      id: sch.id,
      name: sch.title,
      description: sch.description,
      amount: `₹${Number(sch.amount || 0).toLocaleString("en-IN")}`,
      deadline: sch.applicationDeadline
        ? new Date(sch.applicationDeadline).toISOString().slice(0, 10)
        : "-",
      status:
        sch.status === "active"
          ? "Open"
          : sch.status === "closed"
            ? "Closed"
            : "Open",
      applicants: sch.currentApplications || 0,
      category:
        Array.isArray(sch.tags) && sch.tags.length ? sch.tags[0] : "General",
      eligibility: Array.isArray(sch.eligibilityCriteria)
        ? sch.eligibilityCriteria
        : [],
      documents: Array.isArray(sch.requiredDocuments)
        ? sch.requiredDocuments
        : [],
      rating: 4.7,
    };
  }, [sch]);

  const handleApply = async () => {
    if (!details) return;
    try {
      setIsApplying(true);
      const res = await api.createApplication({ scholarshipId: details.id });
      if (res.success) {
        toast({
          title: "Application submitted",
          description: "You can track it in Progress",
        });
        navigate("/progress");
      }
    } catch (e: any) {
      toast({ title: "Apply failed", description: String(e?.message || e) });
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-ydf-light-gray">
        <div className="px-6 py-4">
          <div className="flex items-center space-x-3">
            <Link
              to="/scholarships"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <h1 className="text-xl font-bold text-gray-900">
              Scholarship Details
            </h1>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {loading && <div className="text-gray-600">Loading...</div>}
        {!loading && !details && (
          <div className="text-gray-600">Scholarship not found.</div>
        )}
        {!loading && details && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="bg-white rounded-lg shadow-sm border border-ydf-light-gray overflow-hidden">
              <div className="p-6 border-b border-ydf-light-gray">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {details.name}
                    </h2>
                    <p className="text-gray-700">{details.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-ydf-deep-blue">
                      {details.amount}
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-600 justify-end">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span>{details.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-6 lg:col-span-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Eligibility Criteria
                    </h3>
                    <div className="space-y-2">
                      {details.eligibility.length === 0 && (
                        <div className="text-sm text-gray-600">
                          No specific eligibility listed.
                        </div>
                      )}
                      {details.eligibility.map((c: string, i: number) => (
                        <div key={i} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-gray-700">{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Required Documents
                    </h3>
                    <div className="space-y-2">
                      {details.documents.length === 0 && (
                        <div className="text-sm text-gray-600">
                          No documents specified.
                        </div>
                      )}
                      {details.documents.map((d: string, i: number) => (
                        <div key={i} className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-blue-600" />
                          <span className="text-sm text-gray-700">{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2 text-sm text-gray-700">
                      <Calendar className="h-4 w-4" />
                      <span>Deadline: {details.deadline}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-700 mt-2">
                      <DollarSign className="h-4 w-4" />
                      <span>Amount: {details.amount}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-700 mt-2">
                      <MapPin className="h-4 w-4" />
                      <span>Status: {details.status}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-700 mt-2">
                      <FileText className="h-4 w-4" />
                      <span>Applications: {details.applicants}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleApply}
                    disabled={isApplying || details.status !== "Open"}
                    className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg text-white ${isApplying ? "bg-gray-400" : "bg-ydf-deep-blue hover:bg-opacity-90"}`}
                  >
                    <span>{isApplying ? "Submitting..." : "Apply Now"}</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ScholarshipDetails;
