import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Search,
  MessageCircle,
  Phone,
  Mail,
  FileText,
  ChevronDown,
  ChevronUp,
  Send,
  Paperclip,
  Clock,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Users,
  Book,
  Settings,
  Shield,
  CreditCard,
  Star,
  MapPin,
  Calendar,
  Headphones,
  MessageSquare,
  Video,
} from "lucide-react";

const Support = () => {
  const [activeTab, setActiveTab] = useState("faq");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [ticketForm, setTicketForm] = useState({
    category: "",
    subject: "",
    description: "",
    priority: "medium",
  });

  const faqCategories = [
    {
      id: "general",
      name: "General",
      icon: HelpCircle,
      count: 12,
    },
    {
      id: "application",
      name: "Applications",
      icon: FileText,
      count: 8,
    },
    {
      id: "eligibility",
      name: "Eligibility",
      icon: CheckCircle,
      count: 6,
    },
    {
      id: "payment",
      name: "Payments",
      icon: CreditCard,
      count: 5,
    },
    {
      id: "technical",
      name: "Technical",
      icon: Settings,
      count: 4,
    },
    {
      id: "account",
      name: "Account",
      icon: Users,
      count: 7,
    },
  ];

  const faqs = [
    {
      id: 1,
      category: "general",
      question: "What is Youth Dreamers Foundation?",
      answer:
        "Youth Dreamers Foundation is a non-profit organization dedicated to providing educational scholarships and support to deserving students. We aim to bridge the gap between talent and opportunity by offering financial assistance, mentorship, and career guidance.",
    },
    {
      id: 2,
      category: "application",
      question: "How do I apply for a scholarship?",
      answer:
        "To apply for a scholarship: 1) Browse available scholarships in the 'Scholarships' section, 2) Check eligibility criteria, 3) Click 'Apply Now' on your chosen scholarship, 4) Fill out the application form with accurate information, 5) Upload required documents, 6) Submit your application before the deadline.",
    },
    {
      id: 3,
      category: "eligibility",
      question: "What are the general eligibility criteria?",
      answer:
        "General eligibility criteria include: Being enrolled in or admitted to a recognized educational institution, meeting academic performance requirements (usually minimum 60% or equivalent), family income criteria (varies by scholarship), and Indian citizenship. Specific scholarships may have additional requirements.",
    },
    {
      id: 4,
      category: "application",
      question: "What documents do I need to submit?",
      answer:
        "Commonly required documents include: Academic transcripts/marksheets, Income certificate, Aadhaar card, Bank account details, Passport-size photographs, and category certificate (if applicable). Some scholarships may require additional documents like project proposals or recommendation letters.",
    },
    {
      id: 5,
      category: "payment",
      question: "How and when will I receive the scholarship money?",
      answer:
        "Scholarship funds are directly transferred to your bank account after successful verification and approval. The timeline varies by scholarship type: one-time scholarships are usually disbursed within 30-45 days of approval, while multi-year scholarships may have semester-wise disbursements.",
    },
    {
      id: 6,
      category: "application",
      question: "Can I apply for multiple scholarships?",
      answer:
        "Yes, you can apply for multiple scholarships if you meet their respective eligibility criteria. However, ensure you can fulfill the requirements of all applications and be transparent about other scholarships you've applied for or received.",
    },
    {
      id: 7,
      category: "technical",
      question: "I'm having trouble uploading documents. What should I do?",
      answer:
        "For document upload issues: 1) Ensure files are in accepted formats (PDF, JPG, PNG), 2) Check file size limits (usually 5MB per file), 3) Try using a different browser, 4) Clear your browser cache, 5) Ensure stable internet connection. If problems persist, contact technical support.",
    },
    {
      id: 8,
      category: "account",
      question: "How do I reset my password?",
      answer:
        "To reset your password: 1) Go to the login page, 2) Click 'Forgot Password', 3) Enter your registered email address, 4) Check your email for reset instructions, 5) Follow the link in the email to create a new password. If you don't receive the email, check your spam folder.",
    },
    {
      id: 9,
      category: "eligibility",
      question: "I don't meet one eligibility criterion. Can I still apply?",
      answer:
        "Eligibility criteria are set to ensure fair distribution of scholarships. If you don't meet a specific criterion, we recommend looking for other scholarships that match your profile. However, some criteria may have exceptions - contact our support team for clarification.",
    },
    {
      id: 10,
      category: "payment",
      question: "Is there any fee to apply for scholarships?",
      answer:
        "No, applying for scholarships through Youth Dreamers Foundation is completely free. We never charge any application fees, processing fees, or service charges. Beware of fraudulent websites or individuals asking for payment.",
    },
  ];

  const supportChannels = [
    {
      type: "Live Chat",
      description: "Get instant help from our support team",
      availability: "Mon-Fri, 9 AM - 6 PM",
      responseTime: "Immediate",
      icon: MessageCircle,
      color: "bg-green-500",
      action: "Start Chat",
    },
    {
      type: "Email Support",
      description: "Send us your queries via email",
      availability: "24/7",
      responseTime: "Within 24 hours",
      icon: Mail,
      color: "bg-blue-500",
      action: "Send Email",
    },
    {
      type: "Phone Support",
      description: "Speak directly with our team",
      availability: "Mon-Fri, 10 AM - 5 PM",
      responseTime: "Immediate",
      icon: Phone,
      color: "bg-purple-500",
      action: "Call Now",
    },
    {
      type: "Video Call",
      description: "Schedule a video consultation",
      availability: "By appointment",
      responseTime: "Same day",
      icon: Video,
      color: "bg-orange-500",
      action: "Schedule Call",
    },
  ];

  const contactInfo = [
    {
      title: "General Inquiries",
      email: "info@youthdreamers.org",
      phone: "+91 80-1234-5678",
    },
    {
      title: "Application Support",
      email: "applications@youthdreamers.org",
      phone: "+91 80-1234-5679",
    },
    {
      title: "Technical Support",
      email: "tech@youthdreamers.org",
      phone: "+91 80-1234-5680",
    },
  ];

  const officeLocations = [
    {
      city: "Bangalore",
      address: "123 MG Road, Bangalore, Karnataka 560001",
      phone: "+91 80-1234-5678",
      email: "bangalore@youthdreamers.org",
    },
    {
      city: "Mumbai",
      address: "456 Marine Drive, Mumbai, Maharashtra 400002",
      phone: "+91 22-1234-5678",
      email: "mumbai@youthdreamers.org",
    },
    {
      city: "Delhi",
      address: "789 Connaught Place, New Delhi 110001",
      phone: "+91 11-1234-5678",
      email: "delhi@youthdreamers.org",
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle ticket submission
    console.log("Ticket submitted:", ticketForm);
    setTicketForm({
      category: "",
      subject: "",
      description: "",
      priority: "medium",
    });
  };

  const renderFAQ = () => (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search frequently asked questions..."
          className="w-full pl-10 pr-4 py-3 border border-ydf-light-gray rounded-lg focus:ring-2 focus:ring-ydf-deep-blue focus:border-transparent"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* FAQ Categories */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {faqCategories.map((category) => (
          <button
            key={category.id}
            className="p-4 bg-white border border-ydf-light-gray rounded-lg hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-ydf-deep-blue rounded-lg flex items-center justify-center">
                <category.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{category.name}</h3>
                <p className="text-sm text-gray-600">
                  {category.count} articles
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* FAQ List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {searchQuery
            ? `Search Results (${filteredFaqs.length})`
            : "Popular Questions"}
        </h3>
        {filteredFaqs.map((faq, index) => (
          <motion.div
            key={faq.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white border border-ydf-light-gray rounded-lg overflow-hidden"
          >
            <button
              onClick={() =>
                setExpandedFaq(expandedFaq === faq.id ? null : faq.id)
              }
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h4 className="font-medium text-gray-900">{faq.question}</h4>
              {expandedFaq === faq.id ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>
            {expandedFaq === faq.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="px-6 pb-4 text-gray-700"
              >
                {faq.answer}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderContact = () => (
    <div className="space-y-6">
      {/* Support Channels */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Get in Touch
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {supportChannels.map((channel, index) => (
            <motion.div
              key={channel.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white p-6 border border-ydf-light-gray rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-4">
                <div
                  className={`${channel.color} p-3 rounded-lg flex-shrink-0`}
                >
                  <channel.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {channel.type}
                  </h4>
                  <p className="text-gray-600 text-sm mb-3">
                    {channel.description}
                  </p>
                  <div className="space-y-1 text-xs text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{channel.availability}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>Response: {channel.responseTime}</span>
                    </div>
                  </div>
                  <button className="bg-ydf-deep-blue text-white px-4 py-2 rounded-lg text-sm hover:bg-opacity-90 transition-colors">
                    {channel.action}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Contact Information
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {contactInfo.map((contact, index) => (
            <div
              key={contact.title}
              className="bg-white p-4 border border-ydf-light-gray rounded-lg"
            >
              <h4 className="font-medium text-gray-900 mb-3">
                {contact.title}
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-ydf-deep-blue hover:underline"
                  >
                    {contact.email}
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-ydf-deep-blue hover:underline"
                  >
                    {contact.phone}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Office Locations */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Our Offices
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {officeLocations.map((office, index) => (
            <div
              key={office.city}
              className="bg-white p-4 border border-ydf-light-gray rounded-lg"
            >
              <h4 className="font-medium text-gray-900 mb-3">{office.city}</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <span>{office.address}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{office.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{office.email}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTicket = () => (
    <div className="max-w-2xl">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Submit a Support Ticket
      </h3>
      <form onSubmit={handleTicketSubmit} className="space-y-6">
        <div className="bg-white p-6 border border-ydf-light-gray rounded-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={ticketForm.category}
                onChange={(e) =>
                  setTicketForm({ ...ticketForm, category: e.target.value })
                }
                className="w-full px-3 py-2 border border-ydf-light-gray rounded-lg focus:ring-2 focus:ring-ydf-deep-blue focus:border-transparent"
                required
              >
                <option value="">Select a category</option>
                <option value="application">Application Issues</option>
                <option value="technical">Technical Problems</option>
                <option value="payment">Payment Queries</option>
                <option value="account">Account Issues</option>
                <option value="general">General Inquiry</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={ticketForm.priority}
                onChange={(e) =>
                  setTicketForm({ ...ticketForm, priority: e.target.value })
                }
                className="w-full px-3 py-2 border border-ydf-light-gray rounded-lg focus:ring-2 focus:ring-ydf-deep-blue focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              value={ticketForm.subject}
              onChange={(e) =>
                setTicketForm({ ...ticketForm, subject: e.target.value })
              }
              placeholder="Brief description of your issue"
              className="w-full px-3 py-2 border border-ydf-light-gray rounded-lg focus:ring-2 focus:ring-ydf-deep-blue focus:border-transparent"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={ticketForm.description}
              onChange={(e) =>
                setTicketForm({ ...ticketForm, description: e.target.value })
              }
              placeholder="Please provide detailed information about your issue..."
              rows={6}
              className="w-full px-3 py-2 border border-ydf-light-gray rounded-lg focus:ring-2 focus:ring-ydf-deep-blue focus:border-transparent"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attachments (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-ydf-deep-blue transition-colors">
              <Paperclip className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                Drag and drop files here, or{" "}
                <button
                  type="button"
                  className="text-ydf-deep-blue hover:underline"
                >
                  browse
                </button>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Max file size: 10MB. Supported formats: PDF, JPG, PNG, DOC
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-ydf-deep-blue text-white py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-opacity-90 transition-colors"
          >
            <Send className="h-4 w-4" />
            <span>Submit Ticket</span>
          </button>
        </div>
      </form>

      {/* Ticket Guidelines */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">
          Tips for Better Support
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Be specific about the issue you're facing</li>
          <li>• Include screenshots or error messages if applicable</li>
          <li>• Mention the device and browser you're using</li>
          <li>
            • Provide your application ID if the query is application-related
          </li>
        </ul>
      </div>
    </div>
  );

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
                Support Center
              </h1>
              <p className="text-sm text-gray-600">Find answers and get help</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-ydf-deep-blue to-ydf-teal-green text-white py-12">
        <div className="px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">How can we help you?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Our support team is here to assist you with any questions or issues
            you may have. Browse our FAQ, contact us directly, or submit a
            support ticket.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <Headphones className="h-4 w-4" />
              <span>24/7 Support Available</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Star className="h-4 w-4" />
              <span>4.9/5 Customer Rating</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-ydf-light-gray">
        <div className="px-6">
          <nav className="flex space-x-8">
            {[
              { id: "faq", label: "FAQ", icon: HelpCircle },
              { id: "contact", label: "Contact Info", icon: Phone },
              { id: "ticket", label: "Submit Ticket", icon: FileText },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-ydf-deep-blue text-ydf-deep-blue"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "faq" && renderFAQ()}
          {activeTab === "contact" && renderContact()}
          {activeTab === "ticket" && renderTicket()}
        </motion.div>
      </div>
    </div>
  );
};

export default Support;
