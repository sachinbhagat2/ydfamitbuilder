import { Link } from "react-router-dom";
import { ArrowLeft, Construction } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

const PlaceholderPage = ({ title, description }: PlaceholderPageProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
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
            <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-ydf-deep-blue rounded-full flex items-center justify-center mx-auto mb-6">
            <Construction className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon</h2>
          <p className="text-gray-600 mb-8">
            {description} This feature is currently under development and will
            be available soon.
          </p>
          <Link
            to="/student-dashboard"
            className="bg-ydf-deep-blue text-white px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderPage;
