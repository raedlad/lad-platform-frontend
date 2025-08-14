import React from "react";

interface AdminApprovalStatusStepProps {
  status: "pending" | "approved" | "rejected";
  onContinue?: () => void;
}

const AdminApprovalStatusStep: React.FC<AdminApprovalStatusStepProps> = ({
  status,
  onContinue,
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case "pending":
        return {
          title: "Application Under Review",
          description:
            "Your application is currently being reviewed by our team.",
          icon: "⏳",
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
        };
      case "approved":
        return {
          title: "Application Approved!",
          description: "Congratulations! Your application has been approved.",
          icon: "✅",
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
        };
      case "rejected":
        return {
          title: "Application Review Required",
          description:
            "Your application needs some adjustments. Please review the feedback.",
          icon: "❌",
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="max-w-md mx-auto p-6">
      <div
        className={`text-center p-6 border-2 rounded-lg ${config.bgColor} ${config.borderColor}`}
      >
        <div className={`text-4xl mb-4 ${config.color}`}>{config.icon}</div>
        <h2 className={`text-xl font-semibold mb-2 ${config.color}`}>
          {config.title}
        </h2>
        <p className="text-gray-600 mb-6">{config.description}</p>

        {status === "approved" && onContinue && (
          <button
            onClick={onContinue}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Continue to Dashboard
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminApprovalStatusStep;
