// Mock API service for profile operations
// Replace with actual API calls to your backend

import api from "@/lib/api";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  location?: string;
  company?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UploadDocumentRequest {
  file: File;
  documentType: string;
  category: "mandatory" | "optional";
}

class ProfileApiService {
  private baseUrl = "/api/profile"; // Replace with actual API base URL

  // Simulate network delay
  private delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  async getProfile(): Promise<ApiResponse<any>> {
    const response = await api.get("/contractor/profile");

    // Mock response
    return {
      success: true,
      data: response.data,
    };
  }

  async updateProfile(data: UpdateProfileRequest): Promise<ApiResponse<any>> {
    await this.delay(1000);

    // Mock validation
    if (!data.firstName || data.firstName.length < 2) {
      return {
        success: false,
        error: "First name must be at least 2 characters",
      };
    }

    // Mock success response
    return {
      success: true,
      message: "Profile updated successfully",
      data: { ...data, updatedAt: new Date().toISOString() },
    };
  }

  async changePassword(data: ChangePasswordRequest): Promise<ApiResponse<any>> {
    await this.delay(1500);

    // Mock validation
    if (data.currentPassword === "wrongpassword") {
      return {
        success: false,
        error: "Current password is incorrect",
      };
    }

    if (data.newPassword.length < 8) {
      return {
        success: false,
        error: "New password must be at least 8 characters",
      };
    }

    return {
      success: true,
      message: "Password changed successfully",
    };
  }

  async uploadDocument(data: UploadDocumentRequest): Promise<ApiResponse<any>> {
    await this.delay(2000);

    // Mock file validation
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (data.file.size > maxSize) {
      return {
        success: false,
        error: "File size must be less than 10MB",
      };
    }

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(data.file.type)) {
      return {
        success: false,
        error: "Only PDF, JPEG, and PNG files are allowed",
      };
    }

    // Mock success response
    return {
      success: true,
      message: "Document uploaded successfully",
      data: {
        id: Date.now().toString(),
        name: data.documentType,
        type: data.file.type,
        size: data.file.size,
        status: "pending",
        uploadDate: new Date().toISOString(),
        url: URL.createObjectURL(data.file),
      },
    };
  }

  async verifyEmail(email: string): Promise<ApiResponse<any>> {
    await this.delay(1000);

    // Mock email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: "Invalid email format",
      };
    }

    return {
      success: true,
      message: "Verification email sent successfully",
    };
  }

  async verifyPhone(phone: string, code: string): Promise<ApiResponse<any>> {
    await this.delay(1000);

    // Mock phone verification
    if (code !== "123456") {
      return {
        success: false,
        error: "Invalid verification code",
      };
    }

    return {
      success: true,
      message: "Phone number verified successfully",
    };
  }

  async getDocuments(): Promise<ApiResponse<any[]>> {
    await this.delay(500);

    return {
      success: true,
      data: [
        {
          id: "1",
          name: "National ID",
          type: "Identity Document",
          category: "mandatory",
          status: "verified",
          uploadDate: "2024-01-15",
          size: "2.1 MB",
          url: "/documents/national-id.pdf",
        },
        {
          id: "2",
          name: "Professional License",
          type: "Professional Certificate",
          category: "mandatory",
          status: "verified",
          uploadDate: "2024-01-16",
          size: "1.8 MB",
          url: "/documents/professional-license.pdf",
        },
        {
          id: "3",
          name: "Commercial Registration",
          type: "Business License",
          category: "mandatory",
          status: "pending",
          uploadDate: "2024-01-20",
          size: "1.5 MB",
          url: "/documents/commercial-reg.pdf",
        },
      ],
    };
  }

  async deleteDocument(documentId: string): Promise<ApiResponse<any>> {
    await this.delay(500);

    return {
      success: true,
      message: "Document deleted successfully",
    };
  }

  async getActiveSessions(): Promise<ApiResponse<any[]>> {
    await this.delay(500);

    return {
      success: true,
      data: [
        {
          id: "1",
          device: "MacBook Pro",
          location: "Riyadh, Saudi Arabia",
          lastActivity: "Active now",
          isCurrent: true,
          browser: "Chrome 120.0",
          ip: "192.168.1.100",
        },
        {
          id: "2",
          device: "iPhone 15",
          location: "Riyadh, Saudi Arabia",
          lastActivity: "2 hours ago",
          isCurrent: false,
          browser: "Safari Mobile",
          ip: "192.168.1.101",
        },
      ],
    };
  }

  async logoutSession(sessionId: string): Promise<ApiResponse<any>> {
    await this.delay(500);

    return {
      success: true,
      message: "Session logged out successfully",
    };
  }

  async logoutAllOtherSessions(): Promise<ApiResponse<any>> {
    await this.delay(1000);

    return {
      success: true,
      message: "All other sessions logged out successfully",
    };
  }
}

export const profileApi = new ProfileApiService();
