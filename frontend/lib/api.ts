const BASE_URL = "http://localhost:3001/api";

/**
 * Standardized API Request Utility
 */
export async function apiRequest(endpoint: string, options: any = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : "",
        ...(options.headers || {}),
      },
    });

    if (res.status === 401) {
       if (typeof window !== 'undefined') {
         localStorage.removeItem("token");
         window.location.href = "/select-role";
       }
       throw new Error("Session expired. Please login again.");
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${res.status}`);
    }

    return await res.json();
  } catch (err: any) {
    if (err instanceof TypeError && err.message === 'Failed to fetch') {
      console.error(`[API ERROR] ${endpoint}: Network error or backend offline at ${BASE_URL}`);
      throw new Error("Unable to connect to service. Please ensure the backend is running on port 3001.");
    }
    throw err;
  }
}

/**
 * Auth APIs
 */
export async function login(credentials: any) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export async function signup(userData: any) {
  return apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

/**
 * Global Admin Dashboard Data
 */
export async function getDashboardData() {
  return apiRequest('/dashboard');
}

/**
 * Citizen Dashboard Data
 */
export async function getCitizenData(idNumber: string) {
  return apiRequest(`/citizen/dashboard?id_number=${idNumber}`);
}

/**
 * Verify Profile & Generate Record Hash
 */
export async function verifyProfile(unifiedProfileId: string) {
  return apiRequest('/verify-profile', {
    method: 'POST',
    body: JSON.stringify({ unified_profile_id: unifiedProfileId }),
  });
}

/**
 * Upload Document for Beneficiary (Multipart)
 */
export async function uploadFile(file: File, beneficiaryId: string) {
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('beneficiary_id', beneficiaryId);

  try {
    const response = await fetch(`${BASE_URL}/upload-data`, {
      method: 'POST',
      headers: {
        "Authorization": token ? `Bearer ${token}` : "",
      },
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Upload failed: ${response.status}`);
    }
    
    return await response.json();
  } catch (err: any) {
    if (err instanceof TypeError && err.message === 'Failed to fetch') {
      console.error(`[UPLOAD ERROR]: Network error or backend offline at ${BASE_URL}`);
      throw new Error("Unable to connect to service. Please ensure the backend is running on port 3001.");
    }
    throw err;
  }
}

/**
 * Detect Fraudulent Profiles
 */
export async function detectFraud() {
  return apiRequest('/detect-fraud', { method: 'POST' });
}

/**
 * Get Citizen-Specific AI Insights
 */
export async function getCitizenInsights(idNumber: string) {
  return apiRequest(`/citizen-insights?id_number=${idNumber}`);
}

/**
 * Unify Data Engine
 */
export async function unifyData() {
  return apiRequest('/unify-data', { method: 'POST' });
}

/**
 * Find Inclusion Gaps
 */
export async function findExclusion() {
  return apiRequest('/find-exclusion', { method: 'POST' });
}

/**
 * Get Real-Time Beneficiary Insights
 */
export async function getBeneficiaryInsights() {
  return apiRequest('/beneficiary-insights', { method: 'GET' });
}

/**
 * Simulate Policy
 */
export async function simulatePolicy(params: { scheme_name: string; income_limit: number }) {
  return apiRequest('/simulate-policy', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

/**
 * Upload Raw Data (JSON/CSV)
 */
export async function uploadData(data: any, type: 'application/json' | 'text/csv' = 'application/json') {
  return apiRequest('/upload-data', {
    method: 'POST',
    headers: { 'Content-Type': type },
    body: type === 'application/json' ? JSON.stringify(data) : data,
  });
}
