import { useCallback, useEffect, useRef } from "react";
import { useProjectStore } from "../store/projectStore";
import { projectApi } from "../services/projectApi";
import {
  Project,
  ProjectType,
  WorkType,
  ProjectClassificationJob,
  Level,
  ProjectClassification,
  ProjectEssentialInfo,
} from "../types/project";

// Mock data - Replace these with your actual data from the backend
// The IDs used in mockProjectEssentialInfo and mockProjectClassification should match your actual data IDs
//
// Example of how to replace with your actual data:
// 1. Replace mockProjectTypes with your actual project types array
// 2. Replace mockWorkTypes with your actual work types array
// 3. Replace mockProjectClassificationJobs with your actual classification jobs array
// 4. Replace mockProjectClassificationLevels with your actual classification levels array
// 5. Update the ID in mockProjectEssentialInfo.type to match your project type ID
// 6. Update the IDs in mockProjectClassification (jobId, workTypeId, levelId) to match your actual IDs
//
// Note: The form data now stores only integer IDs, not full objects.
// The dropdowns will display the full objects but submit only the ID values.
// const mockProjectTypes: ProjectType[] = [
//   {
//     id: 1,
//     name: "Residential Building",
//     description: "Single family homes, apartments, and residential complexes",
//     sort_order: 1,
//     is_active: true,
//     created_at: "2024-01-01T00:00:00Z",
//     updated_at: "2024-01-01T00:00:00Z",
//   },
//   {
//     id: 2,
//     name: "Commercial Building",
//     description: "Office buildings, retail spaces, and commercial complexes",
//     sort_order: 2,
//     is_active: true,
//     created_at: "2024-01-01T00:00:00Z",
//     updated_at: "2024-01-01T00:00:00Z",
//   },
//   {
//     id: 3,
//     name: "Industrial Building",
//     description:
//       "Manufacturing facilities, warehouses, and industrial complexes",
//     sort_order: 3,
//     is_active: true,
//     created_at: "2024-01-01T00:00:00Z",
//     updated_at: "2024-01-01T00:00:00Z",
//   },
//   {
//     id: 4,
//     name: "Infrastructure",
//     description: "Roads, bridges, utilities, and public infrastructure",
//     sort_order: 4,
//     is_active: true,
//     created_at: "2024-01-01T00:00:00Z",
//     updated_at: "2024-01-01T00:00:00Z",
//   },
// ];

// const mockWorkTypes: WorkType[] = [
//   {
//     id: 1,
//     name: "New Construction",
//     description: "Building new structures from scratch",
//     sort_order: 1,
//     is_active: true,
//   },
//   {
//     id: 2,
//     name: "Renovation",
//     description: "Updating and improving existing structures",
//     sort_order: 2,
//     is_active: true,
//   },
//   {
//     id: 3,
//     name: "Maintenance",
//     description: "Regular upkeep and repair work",
//     sort_order: 3,
//     is_active: true,
//   },
//   {
//     id: 4,
//     name: "Demolition",
//     description: "Removing existing structures",
//     sort_order: 4,
//     is_active: true,
//   },
// ];

// const mockProjectClassificationJobs: ProjectClassificationJob[] = [
//   {
//     id: 1,
//     name: "Architectural Design",
//     description: "Design and planning of building structures",
//     sort_order: 1,
//     is_active: true,
//   },
//   {
//     id: 2,
//     name: "Structural Engineering",
//     description: "Structural analysis and design",
//     sort_order: 2,
//     is_active: true,
//   },
//   {
//     id: 3,
//     name: "MEP Engineering",
//     description: "Mechanical, Electrical, and Plumbing systems",
//     sort_order: 3,
//     is_active: true,
//   },
//   {
//     id: 4,
//     name: "Civil Engineering",
//     description: "Infrastructure and site development",
//     sort_order: 4,
//     is_active: true,
//   },
// ];

// const mockProjectClassificationLevels: Level[] = [
//   {
//     id: 1,
//     level: 1,
//     label: "Basic Level",
//     sort_order: 1,
//   },
//   {
//     id: 2,
//     level: 2,
//     label: "Intermediate Level",
//     sort_order: 2,
//   },
//   {
//     id: 3,
//     level: 3,
//     label: "Advanced Level",
//     sort_order: 3,
//   },
//   {
//     id: 4,
//     level: 4,
//     label: "Expert Level",
//     sort_order: 4,
//   },
// ];

const mockProjectEssentialInfo: ProjectEssentialInfo = {
  name: "Modern Residential Complex",
  type: 1, // Just the ID - Residential Building
  city: "Riyadh",
  district: "Al Malaz",
  location: "King Fahd Road, Near King Saud University",
  budget: 2500000,
  budget_unit: "SAR",
  duration: 18,
  duration_unit: "months",
  area_sqm: 2500,
  description:
    "A modern residential complex featuring 20 luxury apartments with contemporary design, premium amenities, and sustainable building practices. The project includes underground parking, rooftop gardens, and smart home features.",
};

const mockProjectClassification: ProjectClassification = {
  id: 1,
  jobId: 1, // Just the ID - Architectural Design
  workTypeId: 1, // Just the ID - New Construction
  levelId: 3, // Just the ID - Advanced Level
  notes:
    "This project requires advanced architectural design with focus on sustainability and modern aesthetics. Special attention needed for energy efficiency and smart home integration.",
};

const mockProject: Project = {
  id: "proj_123456789",
  essential_info: mockProjectEssentialInfo,
  classification: [mockProjectClassification],
  documents: [],
};

export const useProjectData = () => {
  const {
    setCurrentStep,
    setCompletedSteps,
    projectTypes,
    workTypes,
    projectClassificationJobs,
    projectClassificationLevels,
    project,
    setProjectTypes,
    setWorkTypes,
    setProjectClassificationJobs,
    setProjectClassificationLevels,
    setProject,
    setProjectId,
    setLoading,
    setOriginalEssentialInfoData,
    setOriginalClassificationData,
    setDocuments,
    setLoadingProjectData,
  } = useProjectStore();

  const fetchProjectData = useCallback(async () => {
    // Get current store state to check if data is already loaded
    const currentState = useProjectStore.getState();

    // Only fetch if data is not already loaded
    if (
      currentState.projectTypes &&
      currentState.workTypes &&
      currentState.projectClassificationJobs &&
      currentState.projectClassificationLevels &&
      currentState.project
    ) {
      console.log("📋 Data already loaded, skipping fetch");
      return;
    }

    try {
      setLoadingProjectData(true);
      console.log("🔄 Starting to fetch mock project data...");

      // Simulate API calls with delays - using your existing data
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      // // Note: You'll replace this with your actual project types data
      // // setProjectTypes(mockProjectTypes);
      // // console.log("✅ Project types loaded:", mockProjectTypes.length, "types");

      // await new Promise((resolve) => setTimeout(resolve, 800));
      // // Note: You'll replace this with your actual work types data
      // // setWorkTypes(mockWorkTypes);
      // // console.log("✅ Work types loaded:", mockWorkTypes.length, "types");

      // await new Promise((resolve) => setTimeout(resolve, 600));
      // // Note: You'll replace this with your actual classification jobs data
      // setProjectClassificationJobs(mockProjectClassificationJobs);
      // console.log(
      //   "✅ Classification jobs loaded:",
      //   mockProjectClassificationJobs.length,
      //   "jobs"
      // );

      // await new Promise((resolve) => setTimeout(resolve, 400));
      // // Note: You'll replace this with your actual classification levels data
      // setProjectClassificationLevels(mockProjectClassificationLevels);
      // console.log(
      //   "✅ Classification levels loaded:",
      //   mockProjectClassificationLevels.length,
      //   "levels"
      // );

      await new Promise((resolve) => setTimeout(resolve, 500));
      setCurrentStep(4);
      setCompletedSteps(3);
      setProject(mockProject);
      setProjectId(mockProject.id);
      console.log("✅ Project data loaded:", mockProject);

      // Set original data for change detection
      setOriginalEssentialInfoData(mockProjectEssentialInfo);
      setOriginalClassificationData(mockProjectClassification);
      console.log("✅ Original data set for change detection");

      // Set mock documents with file metadata only (no File objects)
      const mockDocuments = {
        architectural_plans: [
          {
            id: "arch_plan_1",
            file: null, // No File object from backend
            name: "floor_plan_ground.pdf",
            size: 2048576, // 2MB
            type: "application/pdf",
            uploadStatus: "completed" as const,
            uploadProgress: 100,
            url: "https://mock-cdn.com/architectural_plans/floor_plan_ground.pdf",
          },
          {
            id: "arch_plan_2",
            file: null, // No File object from backend
            name: "elevation_front.dwg",
            size: 1536000, // 1.5MB
            type: "application/dwg",
            uploadStatus: "completed" as const,
            uploadProgress: 100,
            url: "https://mock-cdn.com/architectural_plans/elevation_front.dwg",
          },
        ],
        licenses: [
          {
            id: "license_1",
            file: null, // No File object from backend
            name: "building_permit.pdf",
            size: 1024000, // 1MB
            type: "application/pdf",
            uploadStatus: "completed" as const,
            uploadProgress: 100,
            url: "https://mock-cdn.com/licenses/building_permit.pdf",
          },
          {
            id: "license_2",
            file: null, // No File object from backend
            name: "environmental_clearance.pdf",
            size: 512000, // 512KB
            type: "application/pdf",
            uploadStatus: "completed" as const,
            uploadProgress: 100,
            url: "https://mock-cdn.com/licenses/environmental_clearance.pdf",
          },
        ],
        specifications: [
          {
            id: "spec_1",
            file: null, // No File object from backend
            name: "technical_specifications.pdf",
            size: 3072000, // 3MB
            type: "application/pdf",
            uploadStatus: "completed" as const,
            uploadProgress: 100,
            url: "https://mock-cdn.com/specifications/technical_specifications.pdf",
          },
          {
            id: "spec_2",
            file: null, // No File object from backend
            name: "material_specifications.xlsx",
            size: 768000, // 768KB
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            uploadStatus: "completed" as const,
            uploadProgress: 100,
            url: "https://mock-cdn.com/specifications/material_specifications.xlsx",
          },
        ],
        site_photos: [
          {
            id: "photo_1",
            file: null, // No File object from backend
            name: "site_overview.jpg",
            size: 2048000, // 2MB
            type: "image/jpeg",
            uploadStatus: "completed" as const,
            uploadProgress: 100,
            url: "https://mock-cdn.com/site_photos/site_overview.jpg",
          },
          {
            id: "photo_2",
            file: null, // No File object from backend
            name: "entrance_view.jpg",
            size: 1536000, // 1.5MB
            type: "image/jpeg",
            uploadStatus: "completed" as const,
            uploadProgress: 100,
            url: "https://mock-cdn.com/site_photos/entrance_view.jpg",
          },
          {
            id: "photo_3",
            file: null, // No File object from backend
            name: "surrounding_area.jpg",
            size: 1280000, // 1.28MB
            type: "image/jpeg",
            uploadStatus: "completed" as const,
            uploadProgress: 100,
            url: "https://mock-cdn.com/site_photos/surrounding_area.jpg",
          },
        ],
      };
      setDocuments(mockDocuments);
      console.log(
        "✅ Mock documents initialized with file metadata (no File objects)"
      );
    } catch (error) {
      console.error("Error fetching project data:", error);
    } finally {
      setLoadingProjectData(false);
      console.log("🏁 Mock data fetching completed");
    }
  }, [
    // Only include setter functions, not store state values
    setProjectTypes,
    setWorkTypes,
    setProjectClassificationJobs,
    setProjectClassificationLevels,
    setProject,
    setProjectId,
    setLoading,
    setOriginalEssentialInfoData,
    setOriginalClassificationData,
    setDocuments,
  ]);

  // Remove automatic useEffect - let components call fetchProjectData manually when needed
  // useEffect(() => {
  //   fetchProjectData();
  // }, [fetchProjectData]);

  const clearProjectData = useCallback(() => {
    // Reset to initial state by setting empty arrays and null values
    setProjectTypes([]);
    setWorkTypes([]);
    setProjectClassificationJobs([]);
    setProjectClassificationLevels([]);
    setProject({
      id: "",
      essential_info: {
        name: "",
        type: 0, // ID instead of array
        city: "",
        district: "",
        location: "",
        budget: 0,
        budget_unit: "",
        duration: 0,
        duration_unit: "",
        area_sqm: 0,
        description: "",
      },
      classification: [],
      documents: [],
    });
    setProjectId("");
    setOriginalEssentialInfoData(null);
    setOriginalClassificationData(null);
    setDocuments({
      architectural_plans: [],
      licenses: [],
      specifications: [],
      site_photos: [],
    });
    console.log("🗑️ Project data cleared");
  }, [
    setProjectTypes,
    setWorkTypes,
    setProjectClassificationJobs,
    setProjectClassificationLevels,
    setProject,
    setProjectId,
    setOriginalEssentialInfoData,
    setOriginalClassificationData,
    setDocuments,
  ]);

  return {
    fetchProjectData,
    clearProjectData,
  };
};
