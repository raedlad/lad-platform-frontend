import { api as apiClient } from "@/lib/api";
import { DashboardData, KPI } from "../types";
import { mockDashboardData } from "./mockData";

class DashboardService {
  async getDashboardData(): Promise<DashboardData> {
    try {
      // In development, return mock data
      if (process.env.NODE_ENV === "development") {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return mockDashboardData;
      }

      // Production API call
      const response = await apiClient.get("/dashboard");
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard data:", error);

      // Fallback to mock data if API fails
      if (process.env.NODE_ENV === "development") {
        return mockDashboardData;
      }

      throw new Error("Failed to fetch dashboard data");
    }
  }

  async updateKPI(id: string, kpi: Partial<KPI>): Promise<KPI> {
    try {
      const response = await apiClient.patch(`/dashboard/kpis/${id}`, kpi);
      return response.data;
    } catch (error) {
      console.error("Error updating KPI:", error);
      throw new Error("Failed to update KPI");
    }
  }

  async markNotificationRead(notificationId: string): Promise<void> {
    try {
      await apiClient.patch(`/notifications/${notificationId}/read`);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw new Error("Failed to mark notification as read");
    }
  }

  async markAllNotificationsRead(): Promise<void> {
    try {
      await apiClient.patch("/notifications/mark-all-read");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw new Error("Failed to mark all notifications as read");
    }
  }

  async dismissAnnouncement(announcementId: string): Promise<void> {
    try {
      await apiClient.delete(`/announcements/${announcementId}/dismiss`);
    } catch (error) {
      console.error("Error dismissing announcement:", error);
      throw new Error("Failed to dismiss announcement");
    }
  }

  async getProjectsByRole(role: string): Promise<any[]> {
    try {
      const response = await apiClient.get(`/dashboard/projects?role=${role}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching projects by role:", error);
      throw new Error("Failed to fetch projects");
    }
  }

  async getOffersByRole(role: string): Promise<any[]> {
    try {
      const response = await apiClient.get(`/dashboard/offers?role=${role}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching offers by role:", error);
      throw new Error("Failed to fetch offers");
    }
  }
}

export const dashboardService = new DashboardService();
