import { useCallback } from "react";
import { useProjectStore } from "../store/projectStore";
import { projectApi } from "../services/projectApi";
import {
  Project,
  ProjectClassification,
  ProjectEssentialInfo,
  BOQData,
  PublishSettings,
  DocumentFile,
} from "../types/project";

interface ApiDocument {
  id?: number | string;
  file_name?: string;
  name?: string;
  size?: number | string;
  size_formatted?: string;
  mime_type?: string;
  original_url?: string;
  url?: string;
}

interface ApiClassification {
  id: number;
  classification_job?: { id: number };
  work_type?: { id: number };
  classification_level?: { id: number };
  notes: string;
}

interface ApiBOQ {
  id: number;
  items: Array<{
    id?: string | number;
    name: string;
    description: string;
    unit_id: string;
    quantity: number;
    unit_price: number;
    sort_order: number;
    is_required: boolean;
  }>;
  total_expected?: number;
}

const transformDocuments = (docs: ApiDocument[]): DocumentFile[] => {
  return (docs || []).map((doc) => ({
    id: doc.id?.toString() || "",
    file: null,
    name: doc.file_name || doc.name || "",
    size: typeof doc.size === "string" ? parseInt(doc.size) : doc.size || 0,
    type: doc.mime_type || "",
    uploadStatus: "completed" as const,
    uploadProgress: 100,
    url: doc.original_url || doc.url || "",
  }));
};

export const useProjectData = () => {
  const {
    setCurrentStep,
    setCompletedSteps,
    setProjectTypes,
    setWorkTypes,
    setProjectClassificationJobs,
    setProjectClassificationLevels,
    setProject,
    setProjectId,
    setOriginalEssentialInfoData,
    setOriginalClassificationData,
    setDocuments,
    setLoadingProjectData,
    setBOQData,
    setOriginalBOQData,
    setPublishSettings,
  } = useProjectStore();

  const calculateCompletedSteps = useCallback((project: Project): number => {
    const step1Complete = !!(
      project.essential_info?.title &&
      project.essential_info?.project_type_id > 0
    );

    const step2Complete = !!(
      project.classification?.jobId > 0 &&
      project.classification?.workTypeId > 0 &&
      project.classification?.levelId > 0
    );

    const hasDocuments =
      (project.documents?.architectural_plans?.length || 0) > 0 ||
      (project.documents?.licenses?.length || 0) > 0 ||
      (project.documents?.specifications?.length || 0) > 0 ||
      (project.documents?.site_photos?.length || 0) > 0;

    const step4Complete = (project.boq?.items?.length || 0) > 0;
    const step5Complete =
      (project.publish_settings?.offers_window_days || 0) > 0;

    let stepsCompleted = 0;

    if (step1Complete) {
      stepsCompleted = 1;
      if (step2Complete) {
        stepsCompleted = 2;
        if (hasDocuments) {
          stepsCompleted = 3;
          if (step4Complete) {
            stepsCompleted = 4;
            if (step5Complete) {
              stepsCompleted = 5;
            }
          }
        }
      }
    }

    return stepsCompleted;
  }, []);

  const fetchProjectData = useCallback(
    async (projectId: string): Promise<Project | null> => {
      try {
        setLoadingProjectData(true);

        const response = await projectApi.getProject(projectId);

        if (!response.success || !response.response) {
          return null;
        }

        const apiProject = response.response;

        const hasClassification =
          apiProject.required_classifications &&
          apiProject.required_classifications.length > 0;
        const classificationData: ApiClassification | null = hasClassification
          ? apiProject.required_classifications[0]
          : null;

        const project: Project = {
          id: projectId,
          essential_info: {
            title: apiProject.title,
            project_type_id: parseInt(apiProject.project_type_id),
            city_id: apiProject.location?.city_id?.toString() || "",
            district: apiProject.location?.district || "",
            address_line: apiProject.location?.address_line || "",
            latitude: apiProject.location?.latitude || undefined,
            longitude: apiProject.location?.longitude || undefined,
            budget_min: apiProject.budget_min || 0,
            budget_max: apiProject.budget_max || 0,
            budget_unit: "SAR",
            duration_value: parseInt(apiProject.duration_value),
            duration_unit: apiProject.duration_unit,
            area_sqm: apiProject.area_sqm,
            description: apiProject.description,
          },
          classification: {
            id: classificationData?.id || 0,
            jobId: classificationData?.classification_job?.id || 0,
            workTypeId: classificationData?.work_type?.id || 0,
            levelId: classificationData?.classification_level?.id || 0,
            notes: classificationData?.notes || "",
          },
          documents: {
            architectural_plans: transformDocuments(
              apiProject.architectural_plans || []
            ),
            licenses: transformDocuments(apiProject.licenses || []),
            specifications: transformDocuments(apiProject.specifications || []),
            site_photos: transformDocuments(apiProject.site_photos || []),
          },
          status: { status: apiProject.status as Project["status"]["status"] },
          publish_settings: apiProject.publishing_setting
            ? {
                notify_matching_contractors:
                  apiProject.publishing_setting.notify_matching_providers ||
                  false,
                notify_client_on_offer:
                  apiProject.publishing_setting.notify_owner_on_offer || false,
                offers_window_days:
                  apiProject.publishing_setting.offers_window_days || 0,
              }
            : {
                notify_matching_contractors: false,
                notify_client_on_offer: false,
                offers_window_days: 0,
              },
          boq: (() => {
            if (apiProject.boqs && apiProject.boqs.length > 0) {
              const latestBOQ: ApiBOQ =
                apiProject.boqs[apiProject.boqs.length - 1];

              const mappedItems = (latestBOQ.items || []).map((item) => ({
                id: item.id?.toString() || "",
                name: item.name || "",
                description: item.description || "",
                unit_id: parseInt(item.unit_id) || 0,
                quantity: item.quantity || 0,
                unit_price: item.unit_price || 0,
                sort_order: item.sort_order || 0,
                is_required: item.is_required || false,
              }));

              return {
                id: latestBOQ.id,
                items: mappedItems,
                total_amount: latestBOQ.total_expected || 0,
                template_id: undefined,
              };
            }

            return {
              items: [],
              total_amount: 0,
              template_id: undefined,
            };
          })(),
        };

        const stepsCompleted = calculateCompletedSteps(project);

        setProject(project);
        setProjectId(project.id);
        setCompletedSteps(stepsCompleted);
        setCurrentStep(stepsCompleted + 1);
        setOriginalEssentialInfoData(project.essential_info);
        setOriginalClassificationData(project.classification);
        setDocuments(project.documents);
        setBOQData(project.boq);
        setOriginalBOQData(project.boq);
        setPublishSettings(project.publish_settings);

        return project;
      } catch (error) {
        return null;
      } finally {
        setLoadingProjectData(false);
      }
    },
    [
      calculateCompletedSteps,
      setProject,
      setProjectId,
      setCompletedSteps,
      setCurrentStep,
      setOriginalEssentialInfoData,
      setOriginalClassificationData,
      setDocuments,
      setBOQData,
      setOriginalBOQData,
      setPublishSettings,
      setLoadingProjectData,
    ]
  );

  const clearProjectData = useCallback(() => {
    setProjectTypes([]);
    setWorkTypes([]);
    setProjectClassificationJobs([]);
    setProjectClassificationLevels([]);
    setProject({
      status: { status: "in_progress" },
      id: "",
      essential_info: {
        title: "",
        project_type_id: 0,
        city_id: "",
        district: "",
        address_line: "",
        budget_min: 0,
        budget_max: 0,
        budget_unit: "",
        duration_value: 0,
        duration_unit: "",
        area_sqm: 0,
        description: "",
      },
      classification: {
        id: 0,
        jobId: 0,
        workTypeId: 0,
        levelId: 0,
        notes: "",
      },
      documents: {
        architectural_plans: [],
        licenses: [],
        specifications: [],
        site_photos: [],
      },
      publish_settings: {
        notify_matching_contractors: false,
        notify_client_on_offer: false,
        offers_window_days: 0,
      },
      boq: {
        items: [],
        total_amount: 0,
        template_id: undefined,
      },
    });
    setProjectId("");
    setOriginalEssentialInfoData(null);
    setOriginalClassificationData(null);
    setOriginalBOQData(null);
    setDocuments({
      architectural_plans: [],
      licenses: [],
      specifications: [],
      site_photos: [],
    });
  }, [
    setProjectTypes,
    setWorkTypes,
    setProjectClassificationJobs,
    setProjectClassificationLevels,
    setProject,
    setProjectId,
    setOriginalEssentialInfoData,
    setOriginalClassificationData,
    setOriginalBOQData,
    setDocuments,
  ]);

  const loadProjectBOQData = useCallback(
    async (projectId: string) => {
      try {
        setLoadingProjectData(true);

        const projectResponse = await projectApi.getProject(projectId);

        if (projectResponse.success && projectResponse.response) {
          const apiProject = projectResponse.response;

          let initialBOQData: BOQData;

          if (apiProject.boqs && apiProject.boqs.length > 0) {
            const latestBOQ: ApiBOQ =
              apiProject.boqs[apiProject.boqs.length - 1];

            const mappedItems = latestBOQ.items.map((item) => ({
              id: item.id?.toString() || "",
              name: item.name,
              description: item.description,
              unit_id: parseInt(item.unit_id),
              quantity: item.quantity,
              unit_price: item.unit_price,
              sort_order: item.sort_order,
              is_required: item.is_required,
            }));

            initialBOQData = {
              id: latestBOQ.id,
              items: mappedItems,
              total_amount: latestBOQ.total_expected || 0,
              template_id: undefined,
            };
          } else {
            initialBOQData = {
              items: [],
              total_amount: 0,
              template_id: undefined,
            };
          }

          setBOQData(initialBOQData);
          setOriginalBOQData(initialBOQData);
        } else {
          const emptyBOQData: BOQData = {
            items: [],
            total_amount: 0,
            template_id: undefined,
          };
          setBOQData(emptyBOQData);
          setOriginalBOQData(emptyBOQData);
        }
      } catch (error) {
        const emptyBOQData: BOQData = {
          items: [],
          total_amount: 0,
          template_id: undefined,
        };
        setBOQData(emptyBOQData);
        setOriginalBOQData(emptyBOQData);
      } finally {
        setLoadingProjectData(false);
      }
    },
    [setBOQData, setOriginalBOQData, setLoadingProjectData]
  );

  return {
    fetchProjectData,
    clearProjectData,
    loadProjectBOQData,
    calculateCompletedSteps,
  };
};
