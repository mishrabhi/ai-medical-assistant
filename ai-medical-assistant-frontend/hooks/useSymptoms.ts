"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { symptomsApi } from "@/lib/api/symptoms";

const SYMPTOMS_QUERY_KEY = ["symptom-checks"];

export function useSymptoms() {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: SYMPTOMS_QUERY_KEY,
    queryFn: symptomsApi.list,
  });

  const checkMutation = useMutation({
    mutationFn: symptomsApi.check,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SYMPTOMS_QUERY_KEY });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => symptomsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SYMPTOMS_QUERY_KEY });
    },
  });

  return {
    listQuery,
    checkMutation,
    removeMutation,
  };
}
