// Minimal API client for the ERP backend, extended with Users/Interventions/Documents

export const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export function getToken(): string | null {
  const token = localStorage.getItem("access_token");
  console.log('getToken called, token exists:', !!token, 'length:', token?.length);
  return token;
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem("access_token", token);
  else localStorage.removeItem("access_token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${path}`;
  const headers = new Headers(options.headers as HeadersInit);
  const token = getToken();
  console.log('API Request:', { path, url, hasToken: !!token, tokenPreview: token ? token.substring(0, 20) + '...' : 'no token', method: options.method || 'GET' });
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
    console.log('Authorization header set:', `Bearer ${token.substring(0, 20)}...`);
  } else {
    console.log('No token found for request');
  }
  if (!(options.body instanceof FormData) && !(options.body instanceof URLSearchParams)) {
    if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  }

  const res = await fetch(url, { ...options, headers });
  console.log('API Response:', { status: res.status, statusText: res.statusText, url, ok: res.ok });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error('API Error:', { status: res.status, statusText: res.statusText, text, url, hasToken: !!token });
    throw new Error(text || `HTTP ${res.status}`);
  }
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return (await res.json()) as T;
  return (await res.text()) as unknown as T;
}

export const api = {
  // Auth endpoints
  loginWithUsername: async (username: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);
    const data = await request<{ access_token: string; token_type: string }>("/api/v1/auth/login", {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    setToken(data.access_token);
    console.log('Token stored successfully:', data.access_token ? 'Token present' : 'No token');
    return data;
  },
  me: async () => request("/api/v1/auth/me"),
  changePassword: async (currentPassword: string, newPassword: string) => {
    const form = new FormData();
    form.append("current_password", currentPassword);
    form.append("new_password", newPassword);
    return request("/api/v1/auth/change-password", {
      method: "POST",
      body: form,
    });
  },
  // Users (admin)
  listUsers: async () => request("/api/v1/users/"),
  createUser: async (payload: {
    username: string;
    full_name: string;
    email: string;
    role: "admin" | "responsable" | "technicien" | "client";
    password: string;
  }) =>
    request("/api/v1/users/", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  disableUser: async (userId: number) =>
    request(`/api/v1/users/${userId}`, { method: "DELETE" }),
  activateUser: async (userId: number) =>
    request(`/api/v1/users/${userId}/activate`, { method: "PATCH" }),

  // Interventions
  listInterventions: async () => request("/api/v1/interventions/"),
  getIntervention: async (id: number | string) => request(`/api/v1/interventions/${id}`),
  createIntervention: async (payload: {
    titre: string;
    description?: string | null;
    type: "corrective" | "preventive" | "ameliorative" | "diagnostic";
    statut?: "ouverte" | "affectee" | "en_cours" | "en_attente" | "cloturee" | "annulee" | "archivee" | null;
    priorite?: "urgente" | "haute" | "normale" | "basse" | "programmee" | null;
    urgence?: boolean | null;
    date_limite?: string | null; // ISO datetime
    technicien_id?: number | null;
    equipement_id: number;
  }) =>
    request("/api/v1/interventions/", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  changeInterventionStatus: async (
    id: number | string,
    statut: "ouverte" | "affectee" | "en_cours" | "en_attente" | "cloturee" | "annulee" | "archivee",
    remarque?: string
  ) => request(`/api/v1/interventions/${id}/statut?statut=${encodeURIComponent(statut)}${
      remarque ? `&remarque=${encodeURIComponent(remarque)}` : ""
    }`, { method: "PATCH" }),

  // Documents
  listDocuments: async () => request("/api/v1/documents/"),
  listDocumentsByIntervention: async (interventionId: number) =>
    request(`/api/v1/documents/${interventionId}`),
  uploadDocument: async (interventionId: number, file: File) => {
    const form = new FormData();
    form.append("file", file);
    return request(`/api/v1/documents/?intervention_id=${interventionId}`, {
      method: "POST",
      body: form,
      // Content-Type is automatically set by browser for FormData
    });
  },
  deleteDocument: async (id: number | string) =>
    request(`/api/v1/documents/${id}`, { method: "DELETE" }),

  // Technicians
  listTechnicians: async () => request("/api/v1/techniciens/"),
  getTechnician: async (id: number | string) => request(`/api/v1/techniciens/${id}`),
  createTechnician: async (payload: {
    user_id: number;
    equipe?: string | null;
    disponibilite?: string | null;
    competences_ids?: number[] | null;
  }) =>
    request("/api/v1/techniciens/", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateTechnician: async (
    id: number | string,
    payload: { equipe?: string | null; disponibilite?: string | null }
  ) =>
    request(`/api/v1/techniciens/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  deleteTechnician: async (id: number | string) =>
    request(`/api/v1/techniciens/${id}`, { method: "DELETE" }),
  listCompetences: async () => request("/api/v1/techniciens/competences"),
  createCompetence: async (payload: { nom: string }) =>
    request("/api/v1/techniciens/competences", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // Equipments
  listEquipments: async () => request("/api/v1/equipements/"),
  getEquipment: async (id: number | string) => request(`/api/v1/equipements/${id}`),
  createEquipment: async (payload: {
    nom: string;
    type: string;
    localisation: string;
    frequence_entretien?: string | null;
  }) =>
    request("/api/v1/equipements/", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  deleteEquipment: async (id: number | string) =>
    request(`/api/v1/equipements/${id}`, { method: "DELETE" }),

  // Planning
  listPlannings: async () => request("/api/v1/planning/"),
  createPlanning: async (payload: {
    frequence: string;
    equipement_id: number;
    prochaine_date?: string | null; // ISO datetime
    derniere_date?: string | null; // ISO datetime
  }) =>
    request("/api/v1/planning/", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updatePlanning: async (
    id: number | string,
    payload: {
      frequence: string;
      equipement_id: number;
      prochaine_date?: string | null;
      derniere_date?: string | null;
    }
  ) =>
    request(`/api/v1/planning/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  deletePlanning: async (id: number | string) =>
    request(`/api/v1/planning/${id}`, { method: "DELETE" }),
  updatePlanningNextDate: async (id: number | string, nouvelle_date: string) =>
    request(`/api/v1/planning/${id}/dates?nouvelle_date=${encodeURIComponent(nouvelle_date)}`, {
      method: "PATCH",
    }),
};

export const dashboardApi = {
  // Dashboard stats
  getStats: async () => request("/api/v1/dashboard/stats"),
};

export const notificationsApi = {
  // User notifications
  getMyNotifications: async (limit?: number, offset?: number) => {
    const params = new URLSearchParams();
    if (limit) params.append("limit", limit.toString());
    if (offset) params.append("offset", offset.toString());
    return request(`/api/v1/notifications/user/me?${params.toString()}`);
  },
  markAsRead: async (notificationId: number | string) =>
    request(`/api/v1/notifications/${notificationId}/read`, { method: "PUT" }),
};

export default api;
