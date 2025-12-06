import { useEffect, useState } from "react";
import { Calendar, TrendingUp, Clock, Award } from "lucide-react";

interface ProductivityJourneyProps {
  operatorId: string;
  firstCompleted: { success: boolean; firstCompletedTaskStartDate: string } | null;
  lastCompleted: { success: boolean; lastCompletedTaskEndDate: string } | null;
  loading: boolean;
  error: Error | null;
}

interface JourneyData {
  firstStartDate: Date | null;
  lastEndDate: Date | null;
  totalDays: number;
  progressPercentage: number;
}

export default function ProductivityJourney({ 
  operatorId, 
  firstCompleted, 
  lastCompleted, 
  loading, 
  error 
}: ProductivityJourneyProps) {
  const [journeyData, setJourneyData] = useState<JourneyData>({
    firstStartDate: null,
    lastEndDate: null,
    totalDays: 0,
    progressPercentage: 0,
  });

  useEffect(() => {
    if (firstCompleted?.success && lastCompleted?.success) {
      const firstDate = new Date(firstCompleted.firstCompletedTaskStartDate);
      const lastDate = new Date(lastCompleted.lastCompletedTaskEndDate);
      const now = new Date();

      // Calculate total days between first and last task
      const totalDays = Math.max(1, Math.ceil(
        (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)
      ));

      // Calculate days since first task started
      const daysSinceStart = Math.ceil(
        (now.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Calculate progress percentage
      // If current date is past the last task, show 100%
      // Otherwise, show progress from first to now
      let progressPercentage = 100;
      
      if (now < lastDate) {
        progressPercentage = Math.min(
          Math.round((daysSinceStart / totalDays) * 100),
          100
        );
      }

      setJourneyData({
        firstStartDate: firstDate,
        lastEndDate: lastDate,
        totalDays,
        progressPercentage,
      });
    }
  }, [firstCompleted, lastCompleted]);

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric", 
      year: "numeric" 
    });
  };

  if (loading) {
    return (
      <div className=" rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className=" rounded-xl shadow-sm border border-red-200 p-6">
        <p className="text-red-600 text-sm">Unable to load journey data: {error.message}</p>
      </div>
    );
  }

  if (!journeyData.firstStartDate || !journeyData.lastEndDate) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-200 p-6">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">Your Productivity Journey</h3>
        </div>
        <p className="text-gray-600 text-sm">
          Start completing tasks to see your journey progress!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl shadow-lg border border-indigo-200 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-600 rounded-lg">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-800">Your Productivity Journey</h3>
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="/70 backdrop-blur rounded-lg p-4 border border-indigo-100">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-indigo-600" />
            <p className="text-xs font-medium text-gray-600">First Task</p>
          </div>
          <p className="text-sm font-bold text-gray-800">
            {formatDate(journeyData.firstStartDate)}
          </p>
        </div>

        <div className="/70 backdrop-blur rounded-lg p-4 border border-indigo-100">
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-4 h-4 text-purple-600" />
            <p className="text-xs font-medium text-gray-600">Latest Task</p>
          </div>
          <p className="text-sm font-bold text-gray-800">
            {formatDate(journeyData.lastEndDate)}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-xs font-medium text-gray-700">Journey Progress</p>
          <p className="text-xs font-bold text-indigo-600">
            {journeyData.totalDays} days
          </p>
        </div>
        <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${journeyData.progressPercentage}%` }}
          >
            <div className="absolute inset-0 /20 animate-pulse"></div>
          </div>
          {/* Current position indicator */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4  border-2 border-indigo-600 rounded-full shadow-lg transition-all duration-1000"
            style={{ left: `calc(${journeyData.progressPercentage}% - 8px)` }}
          ></div>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-gray-500">Start</span>
          <span className="text-xs font-semibold text-indigo-600">
            {journeyData.progressPercentage}%
          </span>
          <span className="text-xs text-gray-500">Today</span>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="/50 backdrop-blur rounded-lg p-4 border border-indigo-100">
        <p className="text-xs text-gray-600 text-center">
          {journeyData.totalDays === 1 ? (
            <>
              You've been on your productivity journey for{" "}
              <span className="font-bold text-indigo-600">1 day</span>
            </>
          ) : (
            <>
              You've been on your productivity journey for{" "}
              <span className="font-bold text-indigo-600">{journeyData.totalDays} days</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
