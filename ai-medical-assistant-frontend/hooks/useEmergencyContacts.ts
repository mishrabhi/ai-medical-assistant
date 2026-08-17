"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { emergencyContactsApi } from "@/lib/api/emergency-contacts";

import type {
  CreateEmergencyContactPayload,
  UpdateEmergencyContactPayload,
} from "@/types/emergency-contact";

const EMERGENCY_CONTACTS_QUERY_KEY = ["emergency-contacts"];

export function useEmergencyContacts() {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: EMERGENCY_CONTACTS_QUERY_KEY,
    queryFn: emergencyContactsApi.list,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateEmergencyContactPayload) =>
      emergencyContactsApi.create(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: EMERGENCY_CONTACTS_QUERY_KEY,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateEmergencyContactPayload;
    }) => emergencyContactsApi.update(id, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: EMERGENCY_CONTACTS_QUERY_KEY,
      });

      queryClient.invalidateQueries({
        queryKey: [...EMERGENCY_CONTACTS_QUERY_KEY, variables.id],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => emergencyContactsApi.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: EMERGENCY_CONTACTS_QUERY_KEY,
      });
    },
  });

  return {
    listQuery,
    createMutation,
    updateMutation,
    deleteMutation,
  };
}

export function useEmergencyContact(id: string) {
  return useQuery({
    queryKey: [...EMERGENCY_CONTACTS_QUERY_KEY, id],
    queryFn: () => emergencyContactsApi.getById(id),
    enabled: Boolean(id),
  });
}