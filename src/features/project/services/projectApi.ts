import { api } from "@/lib/api";
import { ProjectEssentialInfo } from "../types/project";

export const projectApi = {
  getProjectTypes: async () => {
    try {
      const response = await api.get("general-data-profile/project-types");
      
     return response.data;
    } catch (error) {
      console.log("Error getting project types:", error);
      return {
        success: false,
        message: "Error getting project types",
        data: null,
      };
    }
  },
  createEssentialInfoProject: async (data: ProjectEssentialInfo) => {
    try {
      const response = await api.post("/projects/essential-info", data);
      return {
        success: true,
        message: "Essential info project created successfully",
        data: response.data,
      };
    } catch (error) {
      console.log("Error creating essential info project:", error);
      return {
        success: false,
        message: "Error creating essential info project",
        data: null,
      };
    }
  },
};
