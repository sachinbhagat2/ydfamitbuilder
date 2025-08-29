import {
  CreateUserInput,
  LoginInput,
  AuthResponse,
  ApiResponse,
  User,
} from "../../shared/types/database";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

class ApiService {
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem("ydf_token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
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
    const payload = {
      ...loginData,
      email: String(loginData.email || "")
        .trim()
        .toLowerCase(),
    };
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Login failed");
    }

    const result: ApiResponse<AuthResponse> = await response.json();

    // Store token and user data on successful login
    if (result.success && result.data) {
      localStorage.setItem("ydf_token", result.data.token);
      localStorage.setItem("ydf_user", JSON.stringify(result.data.user));
    }

    return result;
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
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Export failed");
    const blob = await res.blob();
    return blob;
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

  async changePassword(payload: { currentPassword: string; newPassword: string }) {
    const res = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'POST',
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
    const res = await fetch(`${API_BASE_URL}/auth/profile/documents`, { headers: this.getAuthHeaders() });
    return this.handleResponse(res);
  }
  async uploadMyDocument(payload: { name: string; size?: number; type?: string; content: string }) {
    const res = await fetch(`${API_BASE_URL}/auth/profile/documents`, { method: 'POST', headers: this.getAuthHeaders(), body: JSON.stringify(payload) });
    return this.handleResponse(res);
  }
  async deleteMyDocument(id: number) {
    const res = await fetch(`${API_BASE_URL}/auth/profile/documents/${id}`, { method: 'DELETE', headers: this.getAuthHeaders() });
    return this.handleResponse(res);
  }
  async downloadMyDocument(id: number) {
    const res = await fetch(`${API_BASE_URL}/auth/profile/documents/${id}/download`, { headers: this.getAuthHeaders() });
    if (!res.ok) throw new Error('Download failed');
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
