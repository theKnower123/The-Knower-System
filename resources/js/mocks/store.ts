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
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
  attendance: "attendance",
  leaves: "leaves",
  notifications: "notifications",
  timeLogs: "time-logs",
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

export function useCollection<K extends keyof typeof endpointMap>(key: K): any[] {
  const { data } = useQuery({
    queryKey: [key],
    queryFn: async () => {
      const res = await api.get(`/${endpointMap[key as string]}`);
      return res.data?.data || [];
    },
    initialData: [],
  });

  return data;
}

async function invalidate(key: string) {
  // refetchType: 'all' forces an immediate refetch even for queries
  // that are currently mounted and active in the UI.
  await queryClient.invalidateQueries({
    queryKey: [key],
    refetchType: "all",
  });
}

export async function add<K extends keyof typeof endpointMap>(key: K, item: any) {
  const res = await api.post(`/${endpointMap[key as string]}`, item);
  await invalidate(key as string);
  return res.data;
}

export async function update<K extends keyof typeof endpointMap>(
  key: K,
  id: string | number,
  patch: any,
) {
  const res = await api.put(`/${endpointMap[key as string]}/${id}`, patch);
  await invalidate(key as string);
  return res.data;
}

export async function remove<K extends keyof typeof endpointMap>(key: K, id: string | number) {
  const res = await api.delete(`/${endpointMap[key as string]}/${id}`);
  await invalidate(key as string);
  return res.data;
}

