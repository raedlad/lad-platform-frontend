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
  BOQData,
  BOQItem,
  BOQTemplate,
  Unit,
  PublishSettings,
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
//
// NEW: Multiple Projects Support
// The hook now includes mockProjects array with 3 sample projects at different completion stages:
// - Project 1 (proj_001): Only Essential Info completed (1 step)
// - Project 2 (proj_002): Essential Info + Classification completed (2 steps)
// - Project 3 (proj_003): Essential Info + Classification + Documents completed (3 steps)
//
// Usage examples:
// const { fetchProjectData, getMockProjects, getMockProjectById, getMockProjectsByCompletion, loadMockProject } = useProjectData();
//
// // Fetch and load a project by ID (returns Promise<Project | null>)
// const project = await fetchProjectData('proj_001');
//
// // Get all projects
// const allProjects = getMockProjects();
//
// // Get a specific project (synchronous)
// const project = getMockProjectById('proj_001');
//
// // Get projects with specific completion level
// const projectsWith2Steps = getMockProjectsByCompletion(2);
//
// // Load a project into the store for editing (synchronous)
// loadMockProject('proj_002');
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
  title: "مشروع المبنى السكني الجديد",
  project_type_id: 1, // Just the ID - Residential Building
  city: "Riyadh",
  district: "Al Malaz",
  location: "King Fahd Road, Near King Saud University",
  budget: 2500000,
  budget_unit: "SAR",
  duration_value: 18,
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

// Mock BOQ Templates
const mockBOQTemplates: BOQTemplate[] = [
  {
    id: 1,
    name: "Residential Building Template",
    description: "Standard template for residential construction projects",
    category: "Residential",
    items: [
      {
        name: "Concrete Foundation",
        description: "Reinforced concrete foundation with steel bars",
        unit_id: 1,
        quantity: 50,
        unit_price: 150,
        sort_order: 1,
        is_required: true,
      },
      {
        name: "Steel Reinforcement",
        description: "Steel bars for structural reinforcement",
        unit_id: 2,
        quantity: 2000,
        unit_price: 2.5,
        sort_order: 2,
        is_required: true,
      },
      {
        name: "Brick Work",
        description: "Standard brick masonry work",
        unit_id: 3,
        quantity: 1000,
        unit_price: 8,
        sort_order: 3,
        is_required: true,
      },
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "Commercial Building Template",
    description: "Template for commercial construction projects",
    category: "Commercial",
    items: [
      {
        name: "Steel Frame Structure",
        description: "Main structural steel frame",
        unit_id: 3,
        quantity: 100,
        unit_price: 500,
        sort_order: 1,
        is_required: true,
      },
      {
        name: "Glass Facade",
        description: "Curtain wall glass system",
        unit_id: 3,
        quantity: 200,
        unit_price: 300,
        sort_order: 2,
        is_required: true,
      },
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 3,
    name: "Infrastructure Template",
    description: "Template for infrastructure projects",
    category: "Infrastructure",
    items: [
      {
        name: "Asphalt Paving",
        description: "Road asphalt paving work",
        unit_id: 3,
        quantity: 500,
        unit_price: 25,
        sort_order: 1,
        is_required: true,
      },
      {
        name: "Drainage System",
        description: "Storm water drainage system",
        unit_id: 4,
        quantity: 200,
        unit_price: 15,
        sort_order: 2,
        is_required: true,
      },
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
];

// Mock Units
const mockUnits: Unit[] = [
  {
    id: 1,
    name: "Cubic Meter",
    symbol: "m³",
    description: "Volume unit for concrete and materials",
    is_active: true,
  },
  {
    id: 2,
    name: "Kilogram",
    symbol: "kg",
    description: "Weight unit for steel and materials",
    is_active: true,
  },
  {
    id: 3,
    name: "Square Meter",
    symbol: "m²",
    description: "Area unit for flooring and surfaces",
    is_active: true,
  },
  {
    id: 4,
    name: "Meter",
    symbol: "m",
    description: "Length unit for pipes and cables",
    is_active: true,
  },
  {
    id: 5,
    name: "Piece",
    symbol: "pcs",
    description: "Count unit for fixtures and fittings",
    is_active: true,
  },
  {
    id: 6,
    name: "Linear Meter",
    symbol: "lm",
    description: "Linear unit for trim and moldings",
    is_active: true,
  },
];

// Mock BOQ Data (draft project with some completed steps)
const mockBOQData: BOQData = {
  items: [
    {
      id: "boq_item_1",
      name: "Concrete Foundation",
      description: "Reinforced concrete foundation with steel bars",
      unit_id: 1,
      quantity: 50,
      unit_price: 150,
      sort_order: 1,
      is_required: true,
    },
    {
      id: "boq_item_2",
      name: "Steel Reinforcement",
      description: "Steel bars for structural reinforcement",
      unit_id: 2,
      quantity: 2000,
      unit_price: 2.5,
      sort_order: 2,
      is_required: true,
    },
    {
      id: "boq_item_3",
      name: "Brick Work",
      description: "Standard brick masonry work",
      unit_id: 3,
      quantity: 1000,
      unit_price: 8,
      sort_order: 3,
      is_required: true,
    },
    {
      id: "boq_item_4",
      name: "Electrical Installation",
      description: "Complete electrical wiring and fixtures",
      unit_id: 4,
      quantity: 150,
      unit_price: 25,
      sort_order: 4,
      is_required: false,
    },
  ],
  total_amount: 18750, // Calculated from items above
  template_id: 1, // Using Residential Building Template
};

const mockPublishSettings: PublishSettings = {
  notify_matching_contractors: true,
  notify_client_on_offer: true,
  offers_window_days: 10,
};
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

// Mock Projects List - 3 projects with different completion states
const mockProjects: Project[] = [
  // Project 1: Only Essential Info completed (Step 1)
  {
    id: "proj_001",
    essential_info: {
      title: "مشروع المبنى السكني الجديد",
      project_type_id: 1, // Residential Building
      city: "Riyadh",
      district: "Al Malaz",
      location: "King Fahd Road, Near King Saud University",
      budget: 2500000,
      budget_unit: "SAR",
      duration_value: 18,
      duration_unit: "months",
      area_sqm: 2500,
      description:
        "A modern residential complex featuring 20 luxury apartments with contemporary design, premium amenities, and sustainable building practices.",
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
    status: { status: "in_progress" },
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
  },

  // Project 2: Essential Info + Classification completed (Steps 1-2)
  {
    id: "proj_002",
    essential_info: {
      title: "مشروع المركز التجاري الحديث",
      project_type_id: 2, // Commercial Building
      city: "Jeddah",
      district: "Al Hamra",
      location: "Prince Sultan Road, Near Red Sea Mall",
      budget: 5000000,
      budget_unit: "SAR",
      duration_value: 24,
      duration_unit: "months",
      area_sqm: 5000,
      description:
        "A state-of-the-art commercial complex featuring retail spaces, offices, and entertainment facilities with modern architectural design.",
    },
    classification: {
      id: 1,
      jobId: 1, // Architectural Design
      workTypeId: 1, // New Construction
      levelId: 2, // Intermediate Level
      notes:
        "This commercial project requires intermediate architectural design with focus on retail optimization and customer flow.",
    },
    documents: {
      architectural_plans: [],
      licenses: [],
      specifications: [],
      site_photos: [],
    },
    status: { status: "in_progress" },
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
  },

  // Project 3: Essential Info + Classification + Documents completed (Steps 1-3)
  {
    id: "proj_003",
    essential_info: {
      title: "مشروع البنية التحتية الذكية",
      project_type_id: 4, // Infrastructure
      city: "Dammam",
      district: "Al Faisaliyah",
      location: "King Abdulaziz Road, Near Dammam Port",
      budget: 8000000,
      budget_unit: "SAR",
      duration_value: 36,
      duration_unit: "months",
      area_sqm: 10000,
      description:
        "A comprehensive smart infrastructure project including roads, utilities, and smart city features with sustainable technology integration.",
    },
    classification: {
      id: 2,
      jobId: 4, // Civil Engineering
      workTypeId: 1, // New Construction
      levelId: 4, // Expert Level
      notes:
        "This infrastructure project requires expert-level civil engineering with focus on smart city integration and sustainable development practices.",
    },
    documents: {
      architectural_plans: [
        {
          id: "arch_plan_1",
          file: null,
          name: "infrastructure_master_plan.pdf",
          size: 5120000, // 5MB
          type: "application/pdf",
          uploadStatus: "completed" as const,
          uploadProgress: 100,
          url: "https://mock-cdn.com/architectural_plans/infrastructure_master_plan.pdf",
        },
        {
          id: "arch_plan_2",
          file: null,
          name: "utility_layout.dwg",
          size: 3072000, // 3MB
          type: "application/dwg",
          uploadStatus: "completed" as const,
          uploadProgress: 100,
          url: "https://mock-cdn.com/architectural_plans/utility_layout.dwg",
        },
      ],
      licenses: [
        {
          id: "license_1",
          file: null,
          name: "infrastructure_permit.pdf",
          size: 2048000, // 2MB
          type: "application/pdf",
          uploadStatus: "completed" as const,
          uploadProgress: 100,
          url: "https://mock-cdn.com/licenses/infrastructure_permit.pdf",
        },
        {
          id: "license_2",
          file: null,
          name: "environmental_impact_assessment.pdf",
          size: 1536000, // 1.5MB
          type: "application/pdf",
          uploadStatus: "completed" as const,
          uploadProgress: 100,
          url: "https://mock-cdn.com/licenses/environmental_impact_assessment.pdf",
        },
      ],
      specifications: [
        {
          id: "spec_1",
          file: null,
          name: "technical_specifications_infrastructure.pdf",
          size: 6144000, // 6MB
          type: "application/pdf",
          uploadStatus: "completed" as const,
          uploadProgress: 100,
          url: "https://mock-cdn.com/specifications/technical_specifications_infrastructure.pdf",
        },
        {
          id: "spec_2",
          file: null,
          name: "smart_city_requirements.xlsx",
          size: 1024000, // 1MB
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          uploadStatus: "completed" as const,
          uploadProgress: 100,
          url: "https://mock-cdn.com/specifications/smart_city_requirements.xlsx",
        },
      ],
      site_photos: [
        {
          id: "photo_1",
          file: null,
          name: "site_aerial_view.jpg",
          size: 4096000, // 4MB
          type: "image/jpeg",
          uploadStatus: "completed" as const,
          uploadProgress: 100,
          url: "https://mock-cdn.com/site_photos/site_aerial_view.jpg",
        },
        {
          id: "photo_2",
          file: null,
          name: "existing_infrastructure.jpg",
          size: 2560000, // 2.5MB
          type: "image/jpeg",
          uploadStatus: "completed" as const,
          uploadProgress: 100,
          url: "https://mock-cdn.com/site_photos/existing_infrastructure.jpg",
        },
        {
          id: "photo_3",
          file: null,
          name: "surrounding_development.jpg",
          size: 2048000, // 2MB
          type: "image/jpeg",
          uploadStatus: "completed" as const,
          uploadProgress: 100,
          url: "https://mock-cdn.com/site_photos/surrounding_development.jpg",
        },
      ],
    },
    status: { status: "in_progress" },
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
  },
];

// Keep the original single project for backward compatibility
const mockProject: Project = {
  id: "proj_123456789",
  essential_info: mockProjectEssentialInfo,
  classification: mockProjectClassification,
  documents: mockDocuments,
  status: { status: "in_progress" },
  publish_settings: mockPublishSettings,
  boq: mockBOQData,
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
    // BOQ related state
    boqTemplates,
    units,
    boqData,
    setBOQTemplates,
    setUnits,
    setBOQData,
    setOriginalBOQData,
    completedSteps,
    setPublishSettings,
    publishSettings,
    hasPublishSettingsChanged,
  } = useProjectStore();

  // Centralized function to calculate completed steps for any project
  const calculateCompletedSteps = useCallback((project: Project): number => {
    let stepsCompleted = 0;

    // Step 1: Essential Info completion
    if (
      project.essential_info?.title &&
      project.essential_info?.project_type_id > 0
    ) {
      stepsCompleted++;
    }

    // Step 2: Classification completion
    if (
      project.classification?.jobId > 0 &&
      project.classification?.workTypeId > 0 &&
      project.classification?.levelId > 0
    ) {
      stepsCompleted++;
    }

    // Step 3: Documents completion
    const hasDocuments =
      (project.documents?.architectural_plans?.length || 0) > 0 ||
      (project.documents?.licenses?.length || 0) > 0 ||
      (project.documents?.specifications?.length || 0) > 0 ||
      (project.documents?.site_photos?.length || 0) > 0;
    if (hasDocuments) {
      stepsCompleted++;
    }

    // Step 4: BOQ completion
    if ((project.boq?.items?.length || 0) > 0) {
      stepsCompleted++;
    }

    // Step 5: Publish Settings completion
    if ((project.publish_settings?.offers_window_days || 0) > 0) {
      stepsCompleted++;
    }

    return stepsCompleted;
  }, []);

  // Function to fetch and load a project by ID (asynchronous with Promise)
  // This function simulates an API call, loads the project into the store, and returns the project data
  const fetchProjectData = useCallback(
    async (projectId: string): Promise<Project | null> => {
      try {
        setLoadingProjectData(true);
        console.log(`🔄 Fetching project data for ID: ${projectId}`);

        // Simulate API call with delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Find the project by ID
        const project = mockProjects.find((p) => p.id === projectId) || null;

        if (!project) {
          console.warn(`❌ Project with ID ${projectId} not found`);
          return null;
        }

        // Calculate completed steps using centralized function
        const stepsCompleted = calculateCompletedSteps(project);

        // Load BOQ Templates and Units (if not already loaded)
        const currentState = useProjectStore.getState();
        if (
          !currentState.boqTemplates ||
          currentState.boqTemplates.length === 0
        ) {
          setBOQTemplates(mockBOQTemplates);
          console.log("✅ BOQ Templates loaded");
        }

        if (!currentState.units || currentState.units.length === 0) {
          setUnits(mockUnits);
          console.log("✅ Units loaded");
        }

        // Set the project data in store
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

        console.log(
          `✅ Project ${projectId} loaded with ${stepsCompleted} completed steps`
        );
        return project;
      } catch (error) {
        console.error("Error fetching project data:", error);
        return null;
      } finally {
        setLoadingProjectData(false);
        console.log("🏁 Project data fetching completed");
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
      setBOQTemplates,
      setUnits,
      setBOQData,
      setOriginalBOQData,
      setPublishSettings,
      setLoadingProjectData,
    ]
  );

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
      status: { status: "in_progress" },
      id: "",
      essential_info: {
        title: "",
        project_type_id: 0, // ID instead of array
        city: "",
        district: "",
        location: "",
        budget: 0,
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
    // Clear BOQ data
    setBOQTemplates([]);
    setUnits([]);
    setBOQData({
      items: [],
      total_amount: 0,
      template_id: undefined,
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
    setOriginalBOQData,
    setDocuments,
    setBOQTemplates,
    setUnits,
    setBOQData,
    setPublishSettings,
  ]);

  // Function to load specific project's BOQ data (for draft projects)
  const loadProjectBOQData = useCallback(
    async (projectId: string) => {
      try {
        setLoadingProjectData(true);
        console.log(`🔄 Loading BOQ data for project: ${projectId}`);

        // Simulate API call to fetch project's BOQ data
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Load BOQ Templates (if not already loaded)
        if (!boqTemplates || boqTemplates.length === 0) {
          setBOQTemplates(mockBOQTemplates);
          console.log("✅ BOQ Templates loaded");
        }

        // Load Units (if not already loaded)
        if (!units || units.length === 0) {
          setUnits(mockUnits);
          console.log("✅ Units loaded");
        }

        // Load project-specific BOQ data
        // In real implementation, this would come from API based on projectId
        setBOQData(mockBOQData);
        setOriginalBOQData(mockBOQData);
        console.log("✅ Project BOQ data loaded:", mockBOQData);
      } catch (error) {
        console.error("Error loading project BOQ data:", error);
      } finally {
        setLoadingProjectData(false);
      }
    },
    [
      boqTemplates,
      units,
      setBOQTemplates,
      setUnits,
      setBOQData,
      setOriginalBOQData,
      setLoadingProjectData,
    ]
  );

  // Function to get all mock projects (synchronous)
  const getMockProjects = useCallback(() => {
    return mockProjects;
  }, []);

  // Function to get a specific project by ID (synchronous)
  const getMockProjectById = useCallback((projectId: string) => {
    return mockProjects.find((project) => project.id === projectId) || null;
  }, []);

  // Function to get projects by completion status
  const getMockProjectsByCompletion = useCallback(
    (completedSteps: number) => {
      return mockProjects.filter((project) => {
        const stepsCompleted = calculateCompletedSteps(project);
        return stepsCompleted === completedSteps;
      });
    },
    [calculateCompletedSteps]
  );

  // Function to load a specific project into the store
  const loadMockProject = useCallback(
    (projectId: string) => {
      const project = getMockProjectById(projectId);
      if (project) {
        // Calculate completed steps using centralized function
        const stepsCompleted = calculateCompletedSteps(project);

        // Set the project data in store
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

        console.log(
          `✅ Loaded project ${projectId} with ${stepsCompleted} completed steps`
        );
        return true;
      }
      console.warn(`❌ Project ${projectId} not found`);
      return false;
    },
    [
      getMockProjectById,
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
    ]
  );

  return {
    fetchProjectData,
    clearProjectData,
    loadProjectBOQData,
    // New functions for working with multiple projects
    getMockProjects,
    getMockProjectById,
    getMockProjectsByCompletion,
    loadMockProject,
    // Step calculation utility
    calculateCompletedSteps,
  };
};
