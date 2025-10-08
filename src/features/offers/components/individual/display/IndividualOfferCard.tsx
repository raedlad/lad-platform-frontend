"use client";

import React from "react";
import { IndividualOffer } from "../../../types";
import {
  formatCurrency,
  formatDate,
  getStatusColor,
  getStatusLabel,
} from "../../../utils";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Calendar,
  MapPin,
  Clock,
  Eye,
  Check,
  X,
  MessageSquare,
} from "lucide-react";

interface IndividualOfferCardProps {
  offer: IndividualOffer;
  onAccept?: (offer: IndividualOffer) => void;
  onReject?: (offer: IndividualOffer) => void;
  onView?: (offer: IndividualOffer) => void;
  onCounterOffer?: (offer: IndividualOffer) => void;
}

export const IndividualOfferCard: React.FC<IndividualOfferCardProps> = ({
  offer,
  onAccept,
  onReject,
  onView,
  onCounterOffer,
}) => {
  const handleAccept = () => {
    if (offer.canAccept && onAccept) {
      onAccept(offer);
    }
  };

  const handleReject = () => {
    if (offer.canReject && onReject) {
      onReject(offer);
    }
  };

  const handleView = () => {
    if (onView) {
      onView(offer);
    }
  };

  const handleCounterOffer = () => {
    if (offer.canCounterOffer && onCounterOffer) {
      onCounterOffer(offer);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900">
              {offer.projectDetails.title}
            </CardTitle>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {offer.projectDetails.location}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {offer.timeline.estimatedDuration} days
              </div>
            </div>
          </div>
          <Badge className={getStatusColor(offer.status)}>
            {getStatusLabel(offer.status)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Contractor Info */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">
                {offer.contractorDetails.name.charAt(0)}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {offer.contractorDetails.name}
              </p>
              <p className="text-sm text-gray-600">
                Rating: {offer.contractorDetails.rating}/5 •{" "}
                {offer.contractorDetails.completedProjects} projects completed
              </p>
            </div>
          </div>

          {/* Offer Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Offered Amount</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(offer.amount, offer.currency)}
              </p>
            </div>
            {/* <div>
              <p className="text-sm text-gray-600">Project Budget</p>
              <p className="font-medium text-gray-900">
                {formatCurrency(
                  offer.projectDetails.,
                  offer.projectDetails.budget.currency
                )}{" "}
                -{" "}
                {formatCurrency(
                  offer.projectDetails.budget.max,
                  offer.projectDetails.budget.currency
                )}
              </p>
            </div> */}
          </div>

          {/* Timeline */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Proposed Timeline
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Start Date</p>
                <p className="font-medium">
                  {formatDate(offer.timeline.proposedStartDate)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">End Date</p>
                <p className="font-medium">
                  {formatDate(offer.timeline.proposedEndDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-sm text-gray-600 mb-1">Description</p>
            <p className="text-gray-900 line-clamp-2">{offer.description}</p>
          </div>

          {/* Submitted Date */}
          <div className="text-sm text-gray-600">
            Received on {formatDate(offer.submittedAt)}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleView}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-1" />
              View Details
            </Button>

            {offer.canAccept && (
              <Button
                size="sm"
                onClick={handleAccept}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Check className="h-4 w-4 mr-1" />
                Accept
              </Button>
            )}

            {offer.canReject && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleReject}
                className="flex-1 text-red-600 hover:text-red-700 hover:border-red-300"
              >
                <X className="h-4 w-4 mr-1" />
                Reject
              </Button>
            )}

            {offer.canCounterOffer && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCounterOffer}
                className="flex-1"
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                Counter Offer
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
