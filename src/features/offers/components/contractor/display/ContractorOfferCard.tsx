"use client";

import React from "react";
import { ContractorOffer } from "../../../types";
import {
  formatCurrency,
  formatDate,
  getStatusColor,
  getStatusLabel,
} from "../../../utils/formatters";
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
  DollarSign,
  Clock,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";

interface ContractorOfferCardProps {
  offer: ContractorOffer;
  onEdit?: (offer: ContractorOffer) => void;
  onWithdraw?: (offer: ContractorOffer) => void;
  onView?: (offer: ContractorOffer) => void;
}

export const ContractorOfferCard: React.FC<ContractorOfferCardProps> = ({
  offer,
  onEdit,
  onWithdraw,
  onView,
}) => {
  const handleEdit = () => {
    if (offer.canModify && onEdit) {
      onEdit(offer);
    }
  };

  const handleWithdraw = () => {
    if (offer.canWithdraw && onWithdraw) {
      onWithdraw(offer);
    }
  };

  const handleView = () => {
    if (onView) {
      onView(offer);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900">
              {offer.projectTitle}
            </CardTitle>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {offer.projectLocation}
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
          {/* Project Owner Info */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">
                {offer.projectOwner.name.charAt(0)}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {offer.projectOwner.name}
              </p>
              <p className="text-sm text-gray-600">
                Rating: {offer.projectOwner.rating}/5
              </p>
            </div>
          </div>

          {/* Offer Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Your Offer</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(offer.amount, offer.currency)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Project Type</p>
              <p className="font-medium text-gray-900">{offer.projectType}</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Timeline
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
            Submitted on {formatDate(offer.submittedAt)}
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

            {offer.canModify && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                className="flex-1"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}

            {offer.canWithdraw && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleWithdraw}
                className="flex-1 text-red-600 hover:text-red-700 hover:border-red-300"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Withdraw
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
