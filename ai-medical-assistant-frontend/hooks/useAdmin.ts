"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { adminApi } from "@/lib/api/admin";
import type {
  CreateDoctorPayload,
  UpdateDoctorPayload,
} from "@/types/doctor";

const ADMIN_DASHBOARD_QUERY_KEY = ["admin", "dashboard"];
const ADMIN_DOCTORS_QUERY_KEY = ["admin", "doctors"];

export function useAdminDashboard() {
  return useQuery({
    queryKey: ADMIN_DASHBOARD_QUERY_KEY,
    queryFn: adminApi.getDashboard,
  });
}

export function useAdminDoctors() {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: ADMIN_DOCTORS_QUERY_KEY,
    queryFn: adminApi.listDoctors,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateDoctorPayload) =>
      adminApi.createDoctor(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_DOCTORS_QUERY_KEY,
      });

      queryClient.invalidateQueries({
        queryKey: ADMIN_DASHBOARD_QUERY_KEY,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateDoctorPayload;
    }) => adminApi.updateDoctor(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_DOCTORS_QUERY_KEY,
      });
    },
  });

  const availabilityMutation = useMutation({
    mutationFn: ({
      id,
      isAvailable,
    }: {
      id: string;
      isAvailable: boolean;
    }) =>
      adminApi.updateDoctorAvailability(id, isAvailable),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_DOCTORS_QUERY_KEY,
      });

      queryClient.invalidateQueries({
        queryKey: ADMIN_DASHBOARD_QUERY_KEY,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteDoctor(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_DOCTORS_QUERY_KEY,
      });

      queryClient.invalidateQueries({
        queryKey: ADMIN_DASHBOARD_QUERY_KEY,
      });
    },
  });

  return {
    listQuery,
    createMutation,
    updateMutation,
    availabilityMutation,
    deleteMutation,
  };
}