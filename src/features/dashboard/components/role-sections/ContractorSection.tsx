"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shared/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  FileText,
  TrendingUp,
  Star,
  Clock,
  DollarSign,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

import { Project, Offer } from "../../types";
import { cn } from "@/lib/utils";

interface ContractorSectionProps {
  availableProjects: Project[];
  myOffers: Offer[];
  ongoingProjects: Project[];
  reputation: number;
  className?: string;
  onBrowseProjects?: () => void;
  onViewOffers?: () => void;
  onViewProject?: (projectId: string) => void;
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("ar-SA", {
    style: "currency",
    currency: currency || "SAR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  );

  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}

function AvailableProjectCard({ project }: { project: Project }) {
  const budgetRange = `${formatCurrency(
    project.budget.min,
    project.budget.currency
  )} - ${formatCurrency(project.budget.max, project.budget.currency)}`;

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-medium text-sm line-clamp-2">
              {project.title}
            </h4>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {project.description}
            </p>
          </div>
          {project.isUrgent && (
            <Badge
              variant="outline"
              className="bg-orange-100 text-orange-800 border-orange-300 ml-2"
            >
              Urgent
            </Badge>
          )}
        </div>

        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>{budgetRange}</span>
            <span>{project.timeline.duration} days</span>
          </div>
          <div className="flex items-center">
            <span>{project.location}</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {project.requiredSkills.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {project.requiredSkills.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{project.requiredSkills.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function OfferStatusCard({ offer }: { offer: Offer }) {
  const getStatusColor = (status: Offer["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "withdrawn":
        return "bg-gray-100 text-gray-800";
      case "counter_offer":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-medium text-sm line-clamp-1">
              {offer.projectTitle}
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              Submitted {timeAgo(offer.submittedAt)}
            </p>
          </div>
          <Badge variant="secondary" className={getStatusColor(offer.status)}>
            {offer.status}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold">
              {formatCurrency(offer.amount, offer.currency)}
            </span>
            <span className="text-xs text-muted-foreground">
              {offer.timeline.estimatedDuration} days
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ReputationCard({ reputation }: { reputation: number }) {
  const getReputationColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600";
    if (rating >= 4.0) return "text-blue-600";
    if (rating >= 3.5) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card className="bg-gradient-to-r from-yellow-50 to-orange-100 border-yellow-200">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-yellow-100 rounded-full">
            <Star className="h-5 w-5 text-yellow-600 fill-current" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Reputation Score</h3>
            <div className="flex items-center space-x-1">
              <span
                className={cn(
                  "text-lg font-bold",
                  getReputationColor(reputation)
                )}
              >
                {reputation.toFixed(1)}
              </span>
              <span className="text-xs text-muted-foreground">/ 5.0</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Based on client reviews
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ContractorSection({
  availableProjects,
  myOffers,
  ongoingProjects,
  reputation,
  className,
  onBrowseProjects,
  onViewOffers,
  onViewProject,
}: ContractorSectionProps) {
  const pendingOffers = myOffers.filter((offer) => offer.status === "pending");
  const recentProjects = availableProjects.slice(0, 4);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Main Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          className="bg-blue-50 border-blue-200 hover:shadow-md transition-shadow cursor-pointer"
          onClick={onBrowseProjects}
        >
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Search className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-sm">Browse Projects</h3>
                <p className="text-xs text-muted-foreground">
                  Find new opportunities
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className="bg-green-50 border-green-200 hover:shadow-md transition-shadow cursor-pointer"
          onClick={onViewOffers}
        >
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-sm">My Offers</h3>
                <p className="text-xs text-muted-foreground">
                  {pendingOffers.length} pending
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-sm">Ongoing</h3>
                <p className="text-xs text-muted-foreground">
                  {ongoingProjects.length} projects
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <ReputationCard reputation={reputation} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Available Projects to Bid */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Available Projects</CardTitle>
              <Button variant="outline" size="sm" onClick={onBrowseProjects}>
                <ExternalLink className="h-4 w-4 mr-1" />
                Browse All
              </Button>
            </CardHeader>
            <CardContent>
              {recentProjects.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="font-medium mb-2">No Projects Available</h3>
                  <p className="text-sm">
                    Check back later for new opportunities.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recentProjects.map((project) => (
                    <AvailableProjectCard key={project.id} project={project} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* My Submitted Offers */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Offers</CardTitle>
            </CardHeader>
            <CardContent>
              {myOffers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No offers submitted</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {myOffers.slice(0, 4).map((offer) => (
                    <OfferStatusCard key={offer.id} offer={offer} />
                  ))}
                  {myOffers.length > 4 && (
                    <Button
                      variant="ghost"
                      className="w-full"
                      onClick={onViewOffers}
                    >
                      View {myOffers.length - 4} more offers
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
