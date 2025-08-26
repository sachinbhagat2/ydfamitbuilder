import { DemoResponse } from "@shared/api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Award, GraduationCap } from "lucide-react";

export default function Index() {
  const [exampleFromServer, setExampleFromServer] = useState("");
  // Fetch users on component mount
  useEffect(() => {
    fetchDemo();
  }, []);

  // Example of how to fetch data from the server (if needed)
  const fetchDemo = async () => {
    try {
      const response = await fetch("/api/demo");
      const data = (await response.json()) as DemoResponse;
      setExampleFromServer(data.message);
    } catch (error) {
      console.error("Error fetching hello:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F3b1b952ac06b422687ab6f8265e647a7%2F209099442e6c42e883b3d324b2f06354?format=webp&width=800"
                alt="Youth Dreamers Foundation"
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold text-gray-900">
                Youth Dreamers Foundation
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/auth"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/auth"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Empowering Dreams Through
            <span className="text-blue-600"> Education</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join thousands of students who have transformed their lives through our 
            scholarship programs. We believe every dream deserves a chance to flourish.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors"
            >
              <span>Apply for Scholarships</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/auth"
              className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors"
            >
              Become a Donor
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
          {[
            { number: "10,000+", label: "Students Supported", icon: Users },
            { number: "₹5.2 Cr", label: "Scholarships Distributed", icon: Award },
            { number: "500+", label: "Partner Institutions", icon: GraduationCap },
            { number: "95%", label: "Success Rate", icon: Users },
          ].map((stat, index) => (
            <div key={stat.label} className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Server Status */}
        {exampleFromServer && (
          <div className="mt-8 text-center">
            <p className="text-sm text-green-600 bg-green-50 px-4 py-2 rounded-lg inline-block">
              ✅ Server Connected: {exampleFromServer}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
