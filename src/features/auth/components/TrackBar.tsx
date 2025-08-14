import React from "react";
import { User, UserCheck } from "lucide-react";

interface TrackBarProps {
  currentStep: number;
  totalSteps: number;
}

const TrackBar: React.FC<TrackBarProps> = ({ currentStep, totalSteps }) => {
  const steps = [
    {
      id: 1,
      title: "نوع المستخدم",
      description: "اختر نوع المستخدم",
      icon: User,
    },
    {
      id: 3,
      title: "المعلومات الشخصية",
      description: "أدخل معلوماتك",
      icon: UserCheck,
    },
  ]; 

  return (
    <div className="rounded-lg h-full bg-n-2/70 section p-6">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-p-6 mb-2">LAD</h1>
        <p className="text-sm text-n-7">إنشاء حساب جديد</p>
      </div>

      <div className="space-y-6">
        {steps.map((step, index) => {
          const IconComponent = step.icon;
          const isActive = currentStep === step.id;
          const isUpcoming = currentStep < step.id;

          return (
            <div key={step.id} className="relative group">
              {/* Progress Line */}
              {index < steps.length - 1 && (
                <div className="absolute right-[1.05rem] top-8 w-0.5 h-10 bg-n-4">
                  <div
                    className={`h-full bg-p-5 transition-all duration-700 ease-in-out ${
                      currentStep > step.id ? "w-full" : "w-0"
                    }`}
                  />
                </div>
              )}

              {/* Step Circle */}
              <div className="flex items-s gap-4">
                <div
                  className={`relative z-10 size-9 rounded-lg border flex items-center justify-center transition-all duration-500 ease-in-out transform ${
                    isActive
                      ? "border-n-4 bg-background  scale-110 shadow-xs "
                      : "border-n-4 bg-n-1 text-n-6 transition-all duration-300"
                  }`}
                >
                  <IconComponent
                    className={`size-5 transition-all duration-300 ${
                      isActive ? "text-n-9" : "text-n-6 opacity-80"
                    }`}
                  />
                </div>

                <div
                  className={`flex-1 transition-all duration-500 ease-in-out `}
                >
                  <h2
                    className={`font-bold transition-colors duration-300 mb-1 ${
                      isActive ? "" : "text-n-6/80"
                    }`}
                  >
                    {step.title}
                  </h2>
                  <p
                    className={`text-sm transition-colors duration-300 ${
                      isActive ? "text-n-7" : "text-n-5"
                    }`}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrackBar;
