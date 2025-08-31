import {
  CreateUserInput,
  LoginInput,
  AuthResponse,
  ApiResponse,
  User,
} from "../../shared/types/database";

const API_BASE_URL = "/api";

class ApiService {
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem("ydf_token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private getAuthHeadersForGet(): Record<string, string> {
    const token = localStorage.getItem("ydf_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`,
      );
    }
    return response.json();
  }

  // Authentication endpoints
  async register(
    userData: CreateUserInput,
  ): Promise<ApiResponse<AuthResponse>> {
    const payload = {
      ...userData,
      email: String(userData.email || "")
        .trim()
        .toLowerCase(),
    };
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    const result = await this.handleResponse<AuthResponse>(response);

    // Store token and user data on successful registration
    if (result.success && result.data) {
      localStorage.setItem("ydf_token", result.data.token);
      localStorage.setItem("ydf_user", JSON.stringify(result.data.user));
    }

    return result;
  }

  async login(loginData: LoginInput): Promise<ApiResponse<AuthResponse>> {
    try {
      const payload = {
        ...loginData,
        email: String(loginData.email || "")
          .trim()
          .toLowerCase(),
      };

      console.log("Making login request to:", `${API_BASE_URL}/auth/login`);
      console.log("Login payload:", { email: payload.email, password: "***" });

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      console.log("Login response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Login error response:", errorData);
        throw new Error(errorData.error || `HTTP ${response.status}: Login failed`);
      }

      const result: ApiResponse<AuthResponse> = await response.json();
      console.log("Login success result:", { success: result.success, hasData: !!result.data });

      // Store token and user data on successful login
      if (result.success && result.data) {
        localStorage.setItem("ydf_token", result.data.token);
        localStorage.setItem("ydf_user", JSON.stringify(result.data.user));
      }

      return result;
    } catch (error) {
      console.error("Login API error:", error);
      throw error;
    }
  }

  async logout(): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: this.getAuthHeaders(),
      });
      const result = await this.handleResponse(response);
      return result;
    } finally {
      // Always clear local auth on logout
      this.clearAuth();
    }
  }

  async getProfile(): Promise<ApiResponse<User>> {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<User>(response);
  }

  async updateProfile(profileData: Partial<User>): Promise<ApiResponse<User>> {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(profileData),
    });

    const result = await this.handleResponse<User>(response);

    // Update stored user data on successful update
    if (result.success && result.data) {
      localStorage.setItem("ydf_user", JSON.stringify(result.data));
    }

    return result;
  }

  // Scholarship endpoints
  async listScholarships(params?: Record<string, any>) {
    const qs = params
      ? `?${new URLSearchParams(params as any).toString()}`
      : "";
    const res = await fetch(`${API_BASE_URL}/scholarships${qs}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(res);
  }
  async getScholarship(id: number) {
    const res = await fetch(`${API_BASE_URL}/scholarships/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(res);
  }
  async createScholarship(payload: any) {
    const res = await fetch(`${API_BASE_URL}/scholarships`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return this.handleResponse(res);
  }
  async updateScholarship(id: number, payload: any) {
    const res = await fetch(`${API_BASE_URL}/scholarships/${id}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return this.handleResponse(res);
  }
  async deleteScholarship(id: number) {
    const res = await fetch(`${API_BASE_URL}/scholarships/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(res);
  }

  async exportScholarshipsCSV(params?: Record<string, any>) {
    const qs = params
      ? `?${new URLSearchParams(params as any).toString()}`
      : "";
    const res = await fetch(`${API_BASE_URL}/scholarships/export${qs}`, {
      headers: this.getAuthHeadersForGet(),
    });
    if (!res.ok) throw new Error("Export failed");
    return await res.blob();
  }

  // Applications endpoints (admin)
  async listApplications(params?: Record<string, any>) {
    const qs = params
      ? `?${new URLSearchParams(params as any).toString()}`
      : "";
    const res = await fetch(`${API_BASE_URL}/applications${qs}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(res);
  }
  async updateApplication(
    id: number,
    payload: Partial<{
      status: string;
      assignedReviewerId: number | null;
      score: number | null;
      amountAwarded: number | null;
      reviewNotes: string | null;
    }>,
  ) {
    const res = await fetch(`${API_BASE_URL}/applications/${id}`, {
      method: "PATCH",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return this.handleResponse(res);
  }
  async getApplicationStats() {
    const res = await fetch(`${API_BASE_URL}/applications/stats`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(res);
  }
  async getRecentApplications(limit = 5) {
    const res = await fetch(
      `${API_BASE_URL}/applications/recent?limit=${limit}`,
      { headers: this.getAuthHeaders() },
    );
    return this.handleResponse(res);
  }
  async exportApplicationsCSV(params?: Record<string, any>) {
    const qs = params
      ? `?${new URLSearchParams(params as any).toString()}`
      : "";
    const res = await fetch(`${API_BASE_URL}/applications/export${qs}`, {
      headers: this.getAuthHeadersForGet(),
    });
    if (!res.ok) throw new Error("Export failed");
    const blob = await res.blob();
    return blob;
  }

  // Reviewer endpoints
  async listReviewerApplications(params?: Record<string, any>) {
    const qs = params
      ? `?${new URLSearchParams(params as any).toString()}`
      : "";
    const res = await fetch(`${API_BASE_URL}/reviewer/applications${qs}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(res);
  }
  async getReviewerStats() {
    const res = await fetch(`${API_BASE_URL}/reviewer/stats`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(res);
  }
  async updateMyAssignedApplication(
    id: number,
    payload: Partial<{
      status: string;
      score: number | null;
      reviewNotes: string | null;
    }>,
  ) {
    const res = await fetch(`${API_BASE_URL}/reviewer/applications/${id}`, {
      method: "PATCH",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return this.handleResponse(res);
  }
  async createReview(payload: {
    applicationId: number;
    criteria?: any;
    overallScore?: number | null;
    comments?: string | null;
    recommendation?: string | null;
  }) {
    const res = await fetch(`${API_BASE_URL}/reviewer/reviews`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return this.handleResponse(res);
  }
  async listMyReviews(params?: { applicationId?: number }) {
    const qs = params
      ? `?${new URLSearchParams(params as any).toString()}`
      : "";
    const res = await fetch(`${API_BASE_URL}/reviewer/reviews${qs}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(res);
  }

  // Roles
  async listRoles() {
    const res = await fetch(`${API_BASE_URL}/roles`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(res);
  }
  async createRole(payload: {
    name: string;
    description?: string;
    permissions?: any;
  }) {
    const res = await fetch(`${API_BASE_URL}/roles`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return this.handleResponse(res);
  }
  async updateRole(
    id: number,
    payload: { name?: string; description?: string; permissions?: any },
  ) {
    const res = await fetch(`${API_BASE_URL}/roles/${id}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return this.handleResponse(res);
  }
  async deleteRole(id: number) {
    const res = await fetch(`${API_BASE_URL}/roles/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(res);
  }
  async listUserRoles(userId: number) {
    const res = await fetch(`${API_BASE_URL}/roles/user/${userId}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(res);
  }
  async assignRole(userId: number, roleId: number) {
    const res = await fetch(`${API_BASE_URL}/roles/assign`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ userId, roleId }),
    });
    return this.handleResponse(res);
  }
  async removeUserRole(userId: number, roleId: number) {
    const res = await fetch(`${API_BASE_URL}/roles/remove`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ userId, roleId }),
    });
    return this.handleResponse(res);
  }

  // Admin: list users
  async listUsers(params?: Record<string, any>) {
    const qs = params
      ? `?${new URLSearchParams(params as any).toString()}`
      : "";
    const res = await fetch(`${API_BASE_URL}/auth/users${qs}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(res);
  }
  // Admin: update user status
  async updateUser(
    userId: number,
    payload: { isActive?: boolean; userType?: string },
  ) {
    const res = await fetch(`${API_BASE_URL}/auth/users/${userId}`, {
      method: "PATCH",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return this.handleResponse(res);
  }

  // Student applications
  async listMyApplications(params?: Record<string, any>) {
    const qs = params
      ? `?${new URLSearchParams(params as any).toString()}`
      : "";
    const res = await fetch(`${API_BASE_URL}/applications/my${qs}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(res);
  }
  async getMyApplicationStats() {
    const res = await fetch(`${API_BASE_URL}/applications/my/stats`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(res);
  }
  async createApplication(payload: {
    scholarshipId: number;
    applicationData?: any;
    documents?: any;
  }) {
    const res = await fetch(`${API_BASE_URL}/applications`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return this.handleResponse(res);
  }

  // Announcements
  async listAnnouncements(limit = 5) {
    const res = await fetch(`${API_BASE_URL}/announcements?limit=${limit}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(res);
  }
  async getAnnouncement(id: number) {
    const res = await fetch(`${API_BASE_URL}/announcements/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(res);
  }

  async changePassword(payload: {
    currentPassword: string;
    newPassword: string;
  }) {
    const res = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return this.handleResponse(res);
  }

  async verifyToken(): Promise<ApiResponse<User>> {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      // If token verification fails, clear auth data
      this.clearAuth();
      throw new Error("Token verification failed");
    }

    const result = await this.handleResponse<User>(response);

    // Update stored user data if verification succeeds
    if (result.success && result.data) {
      localStorage.setItem("ydf_user", JSON.stringify(result.data));
    }

    return result;
  }

  // Profile documents
  async listMyDocuments() {
    const res = await fetch(`${API_BASE_URL}/auth/profile/documents`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(res);
  }
  async uploadMyDocument(payload: {
    name: string;
    size?: number;
    type?: string;
    content: string;
  }) {
    const res = await fetch(`${API_BASE_URL}/auth/profile/documents`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return this.handleResponse(res);
  }
  async deleteMyDocument(id: number) {
    const res = await fetch(`${API_BASE_URL}/auth/profile/documents/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(res);
  }
  async downloadMyDocument(id: number) {
    const res = await fetch(
      `${API_BASE_URL}/auth/profile/documents/${id}/download`,
      { headers: this.getAuthHeaders() },
    );
    if (!res.ok) throw new Error("Download failed");
    return await res.blob();
  }

  // Surveys (surveyor staff module)
  async getMyVerifications() {
    const response = await fetch(`${API_BASE_URL}/surveys/my`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async startVerification(payload: {
    applicationId: number;
    type: "home" | "document";
    lat?: number;
    lng?: number;
    notes?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/surveys/start`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return this.handleResponse(response);
  }

  async completeVerification(payload: {
    verificationId: number;
    lat?: number;
    lng?: number;
    notes?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/surveys/complete`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return this.handleResponse(response);
  }

  // Utility methods
  isAuthenticated(): boolean {
    const token = localStorage.getItem("ydf_token");
    const user = localStorage.getItem("ydf_user");
    return !!(token && user);
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem("ydf_user");
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken(): string | null {
    return localStorage.getItem("ydf_token");
  }

  clearAuth(): void {
    localStorage.removeItem("ydf_token");
    localStorage.removeItem("ydf_user");
  }

  // Test database connection
  async testConnection(): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/test/connection`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    return this.handleResponse(response);
  }
}

export const apiService = new ApiService();
export default apiService;
