import ProfileCompletionAlert from "@/features/profile/components/ProfileCompletionAlert";

export default function EngineeringOfficePage() {
  return (
    <div className="w-full h-full p-6">
      <div className="flex flex-col gap-8">
        {/* Profile Completion Alert */}
        <ProfileCompletionAlert />

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Engineering Office Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Welcome to your engineering office dashboard. Complete your profile
            to access all features.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <p className="text-gray-600 dark:text-gray-400">
            This dashboard is under development. Complete your profile to get
            started.
          </p>
        </div>
      </div>
    </div>
  );
}
