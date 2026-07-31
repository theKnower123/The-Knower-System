// Connected backend store using React Query and Axios
import { useQuery } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import axios from "axios";
import * as seed from "./data";

export { seed };

const api = axios.create({
  baseURL: "/api/v1",
  headers: {
    Accept: "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token && token !== "undefined" && token !== "null") {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (config.headers) {
    delete config.headers.Authorization;
    delete config.headers.authorization;
    if (typeof config.headers.delete === "function") {
      config.headers.delete("Authorization");
      config.headers.delete("authorization");
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      localStorage.removeItem("auth_token");
      if (originalRequest.headers) {
        delete originalRequest.headers.Authorization;
        delete originalRequest.headers.authorization;
        if (typeof originalRequest.headers.delete === "function") {
          originalRequest.headers.delete("Authorization");
          originalRequest.headers.delete("authorization");
        }
      }
      return api(originalRequest);
    }
    return Promise.reject(error);
  }
);

const endpointMap: Record<string, string> = {
  companies: "companies",
  clients: "clients",
  contacts: "contacts",
  leads: "leads",
  meetings: "meetings",
  quotations: "quotations",
  contracts: "contracts",
  projects: "projects",
  milestones: "milestones",
  tasks: "tasks",
  bugs: "bugs",
  files: "files",
  invoices: "invoices",
  payments: "payments",
  expenses: "expenses",
  domains: "domains",
  hostingAccounts: "hosting",
  servers: "servers",
  ssls: "ssl",
  tickets: "tickets",
  employees: "employees",
  departments: "departments",
  jobPostings: "job-postings",
  jobApplications: "job-applications",
  attendance: "attendance",
  leaves: "leaves",
  notifications: "notifications",
  timeLogs: "time-logs",
  marketingPlans: "marketing-plans",
  testimonials: "testimonials",
  faqs: "faqs",
  blogPosts: "blog-posts",
  teamMembers: "team-members",
  servicesCms: "services-cms",
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime = 0: data is always considered stale, so invalidateQueries
      // will trigger an immediate background refetch whenever called.
      staleTime: 0,
      // Keep cached data in memory for 2 minutes while navigating between pages.
      gcTime: 1000 * 60 * 2,
    },
  },
});

// Convert snake_case keys to camelCase recursively so backend data
// matches the frontend field names (e.g. client_id → clientId).
function toCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function normalize(val: unknown): unknown {
  if (val instanceof File || val instanceof Blob) return val;
  if (Array.isArray(val)) return val.map(normalize);
  if (val !== null && typeof val === "object") {
    return Object.fromEntries(
      Object.entries(val as Record<string, unknown>).map(([k, v]) => [
        toCamel(k),
        normalize(v),
      ])
    );
  }
  return val;
}

const pageRouteMap: Record<string, string> = {
  companies: "/crm/companies",
  clients: "/crm/clients",
  contacts: "/support/contacts",
  leads: "/crm/leads",
  meetings: "/crm/meetings",
  quotations: "/crm/quotations",
  contracts: "/crm/contracts",
  projects: "/projects",
  milestones: "/projects",
  tasks: "/tasks",
  bugs: "/bugs",
  files: "/projects",
  invoices: "/finance/invoices",
  payments: "/finance/payments",
  expenses: "/finance/expenses",
  domains: "/hosting/domains",
  hostingAccounts: "/hosting/accounts",
  servers: "/hosting/servers",
  ssls: "/hosting/ssl",
  tickets: "/support/tickets",
  employees: "/hr/employees",
  departments: "/hr/departments",
  jobPostings: "/hr/jobs",
  jobApplications: "/hr/applications",
  attendance: "/hr/attendance",
  leaves: "/hr/leaves",
  marketingPlans: "/cms/pricing",
  testimonials: "/cms/testimonials",
  faqs: "/cms/faqs",
  blogPosts: "/cms/blog",
  teamMembers: "/cms/team",
  servicesCms: "/cms/services",
};

export function useCollection<K extends keyof typeof endpointMap>(
  key: K, 
  options?: { trashed?: boolean }
): any[] {
  const targetRoute = pageRouteMap[key as string];
  const isCurrentResource = typeof window !== 'undefined' && targetRoute
    ? (window.location.pathname.toLowerCase() === targetRoute.toLowerCase() || window.location.pathname.toLowerCase().startsWith(`${targetRoute.toLowerCase()}/`))
    : false;
  const trashed = options?.trashed ?? (isCurrentResource && typeof window !== 'undefined' && new URLSearchParams(window.location.search).get("trash") === "1");

  const { data } = useQuery({
    queryKey: [key, { trashed }],
    queryFn: async () => {
      const res = await api.get(`/${endpointMap[key as string]}${trashed ? '?trashed=1' : ''}`);
      const raw = res.data?.data || (Array.isArray(res.data) ? res.data : []);
      return normalize(raw) as any[];
    },
  });

  return Array.isArray(data) ? data : [];
}

async function invalidate(key: string) {
  // refetchType: 'all' forces an immediate refetch even for queries
  // that are currently mounted and active in the UI.
  await queryClient.invalidateQueries({
    queryKey: [key],
    refetchType: "all",
  });
}

// Convert camelCase to snake_case for outgoing API requests
function toSnake(str: string): string {
  return str.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
}

function denormalize(val: unknown): unknown {
  if (val instanceof File || val instanceof Blob) return val;
  if (Array.isArray(val)) return val.map(denormalize);
  if (val !== null && typeof val === "object") {
    return Object.fromEntries(
      Object.entries(val as Record<string, unknown>).map(([k, v]) => [
        toSnake(k),
        denormalize(v),
      ])
    );
  }
  return val;
}

// Check if an object contains File instances (for multipart upload)
function hasFiles(obj: Record<string, unknown>): boolean {
  return Object.values(obj).some((v) => v instanceof File);
}

function toFormData(obj: Record<string, unknown>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(obj)) {
    if (value instanceof File) {
      fd.append(key, value);
    } else if (value !== null && value !== undefined) {
      fd.append(key, String(value));
    }
  }
  return fd;
}

export async function add<K extends keyof typeof endpointMap>(key: K, item: any) {
  const payload = denormalize(item) as Record<string, unknown>;
  const useMultipart = hasFiles(payload);
  const body = useMultipart ? toFormData(payload) : payload;
  const res = await api.post(`/${endpointMap[key as string]}`, body, useMultipart ? { headers: { 'Content-Type': 'multipart/form-data' } } : {});
  await invalidate(key as string);
  return res.data;
}

export async function update<K extends keyof typeof endpointMap>(
  key: K,
  id: string | number,
  patch: any,
) {
  const payload = denormalize(patch) as Record<string, unknown>;
  const useMultipart = hasFiles(payload);
  const body = useMultipart ? toFormData(payload) : payload;
  // Use POST with _method=PUT for multipart file uploads
  if (useMultipart) {
    (body as FormData).append('_method', 'PUT');
    const res = await api.post(`/${endpointMap[key as string]}/${id}`, body, { headers: { 'Content-Type': 'multipart/form-data' } });
    await invalidate(key as string);
    return res.data;
  }
  const res = await api.put(`/${endpointMap[key as string]}/${id}`, body);
  await invalidate(key as string);
  return res.data;
}

export async function remove<K extends keyof typeof endpointMap>(key: K, id: string | number) {
  const res = await api.delete(`/${endpointMap[key as string]}/${id}`);
  await invalidate(key as string);
  return res.data;
}

export async function restore<K extends keyof typeof endpointMap>(key: K, id: string | number) {
  const res = await api.post(`/trash/${endpointMap[key as string]}/${id}/restore`);
  await invalidate(key as string);
  return res.data;
}

export async function forceDelete<K extends keyof typeof endpointMap>(key: K, id: string | number) {
  const res = await api.delete(`/trash/${endpointMap[key as string]}/${id}/force`);
  await invalidate(key as string);
  return res.data;
}
