import React from "react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Users,
  Calendar,
  Target,
  MapPin,
  Award,
  Briefcase,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { ContractorProfile } from "@/features/profile/types/contractor";

interface OperationalProps {
  profile?: ContractorProfile | null;
}

const Operational: React.FC<OperationalProps> = ({ profile }) => {
  const t = useTranslations("profile.contractorOperational");
  const tCommon = useTranslations("common");

  const operationalProfile = profile?.operational_profile;

  if (!operationalProfile) {
    return (
      <div className="space-y-4">
        <div className="bg-card border border-border rounded-lg p-6 dark:bg-card dark:border-border">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-muted rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-card-foreground dark:text-card-foreground">
              {t("sections.empty.title")}
            </h3>
            <p className="text-sm text-muted-foreground dark:text-muted-foreground">
              {t("sections.empty.description")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="w-4 h-4 text-emerald-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    );
  };

  const getStatusBadge = (
    status: boolean,
    trueText: string,
    falseText: string
  ) => {
    return (
      <Badge
        variant={status ? "success" : "destructive"}
        className="text-xs font-medium px-2 py-1"
      >
        {status ? trueText : falseText}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Project Information Section */}
      <div className="bg-card border border-border rounded-lg p-6 dark:bg-card dark:border-border">
        <h3 className="text-lg font-semibold mb-4 text-card-foreground dark:text-card-foreground flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          {t("sections.projectInfo.title")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              {t("sections.projectInfo.executedProjectRange")}
            </p>
            <p className="text-sm text-card-foreground">
              {operationalProfile.executed_project_range?.label ||
                tCommon("notProvided")}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              {t("sections.projectInfo.staffSizeRange")}
            </p>
            <p className="text-sm text-card-foreground">
              {operationalProfile.staff_size_range?.label ||
                tCommon("notProvided")}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              {t("sections.projectInfo.experienceYearsRange")}
            </p>
            <p className="text-sm text-card-foreground">
              {operationalProfile.experience_years_range?.label ||
                tCommon("notProvided")}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              {t("sections.projectInfo.annualProjectsRange")}
            </p>
            <p className="text-sm text-card-foreground">
              {operationalProfile.annual_projects_range?.label ||
                tCommon("notProvided")}
            </p>
          </div>
        </div>
      </div>

      {/* Classification & Accreditation Section */}
      <div className="bg-card border border-border rounded-lg p-6 dark:bg-card dark:border-border">
        <h3 className="text-lg font-semibold mb-4 text-card-foreground dark:text-card-foreground flex items-center gap-2">
          <Award className="w-5 h-5" />
          {t("sections.classification.title")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              {t("sections.classification.classificationLevel")}
            </p>
            <p className="text-sm text-card-foreground">
              {operationalProfile.classification_level?.label ||
                tCommon("notProvided")}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              {t("sections.classification.hasGovernmentAccreditation")}
            </p>
            <div className="flex items-center gap-2">
              {getStatusIcon(operationalProfile.has_government_accreditation)}
              {getStatusBadge(
                operationalProfile.has_government_accreditation,
                tCommon("yes"),
                tCommon("no")
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Work Fields Section */}
      {operationalProfile.work_fields &&
        operationalProfile.work_fields.length > 0 && (
          <div className="bg-card border border-border rounded-lg p-6 dark:bg-card dark:border-border">
            <h3 className="text-lg font-semibold mb-4 text-card-foreground dark:text-card-foreground flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              {t("sections.workFields.title")}
            </h3>
            <div className="space-y-3">
              {operationalProfile.work_fields.map((field, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{field.work_field.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-card-foreground">
                        {field.work_field.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {field.work_field.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-card-foreground">
                      {field.years_of_experience_in_field} {tCommon("years")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Target Project Values Section */}
      {profile?.target_project_values &&
        profile.target_project_values.length > 0 && (
          <div className="bg-card border border-border rounded-lg p-6 dark:bg-card dark:border-border">
            <h3 className="text-lg font-semibold mb-4 text-card-foreground dark:text-card-foreground flex items-center gap-2">
              <Target className="w-5 h-5" />
              {t("sections.projectInfo.targetProjectRanges")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.target_project_values.map((value, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs font-medium px-3 py-1"
                >
                  {value.project_value_range.label}
                </Badge>
              ))}
            </div>
          </div>
        )}

      {/* Geographical Coverage Section */}
      {operationalProfile.geographical_coverage &&
        operationalProfile.geographical_coverage.length > 0 && (
          <div className="bg-card border border-border rounded-lg p-6 dark:bg-card dark:border-border">
            <h3 className="text-lg font-semibold mb-4 text-card-foreground dark:text-card-foreground flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              {t("sections.geographicalCoverage.title")}
            </h3>
            <div className="space-y-3">
              {operationalProfile.geographical_coverage.map(
                (coverage, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-card-foreground">
                          {coverage.city.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {coverage.city.country}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(coverage.covers_all_areas)}
                      <Badge
                        variant={
                          coverage.covers_all_areas ? "success" : "secondary"
                        }
                        className="text-xs font-medium px-2 py-1"
                      >
                        {coverage.covers_all_areas
                          ? tCommon("allAreas")
                          : tCommon("specificAreas")}
                      </Badge>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

      {/* Regional Coverage Status */}
      <div className="bg-card border border-border rounded-lg p-6 dark:bg-card dark:border-border">
        <h3 className="text-lg font-semibold mb-4 text-card-foreground dark:text-card-foreground flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          {t("sections.classification.coversAllRegions")}
        </h3>
        <div className="flex items-center gap-2">
          {getStatusIcon(operationalProfile.covers_all_regions)}
          {getStatusBadge(
            operationalProfile.covers_all_regions,
            tCommon("yes"),
            tCommon("no")
          )}
        </div>
      </div>
    </div>
  );
};

export default Operational;
