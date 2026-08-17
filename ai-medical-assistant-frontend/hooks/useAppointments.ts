"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { appointmentsApi } from "@/lib/api/appointments";
import type {
  CreateAppointmentPayload,
  UpdateAppointmentStatusPayload,
} from "@/types/appointment";


const APPOINTMENTS_QUERY_KEY = ["appointments"];

export function useAppointments() {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: APPOINTMENTS_QUERY_KEY,
    queryFn: () => appointmentsApi.list(),
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateAppointmentPayload) => appointmentsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_QUERY_KEY });
    },
  });


  const updateStatusMutation = useMutation({
  mutationFn: ({
    id,
    payload,
  }: {
    id: string;
    payload: UpdateAppointmentStatusPayload;
  }) => appointmentsApi.updateStatus(id, payload),

  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: APPOINTMENTS_QUERY_KEY,
    });
  },
});

  const deleteMutation = useMutation({
    mutationFn: (id: string) => appointmentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_QUERY_KEY });
    },
  });

  return {
  listQuery,
  createMutation,
  updateStatusMutation,
  deleteMutation,
};
}

export function useAppointment(id: string) {
  return useQuery({
    queryKey: [...APPOINTMENTS_QUERY_KEY, id],
    queryFn: () => appointmentsApi.getById(id),
  });
}


