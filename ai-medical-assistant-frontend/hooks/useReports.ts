"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reportsApi } from "@/lib/api/reports";

const REPORTS_QUERY_KEY = ["reports"];

export function useReports() {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: REPORTS_QUERY_KEY,
    queryFn: () => reportsApi.list(),
  });

  const uploadMutation = useMutation({
    mutationFn: (payload: {
      title: string;
      reportType: Parameters<typeof reportsApi.upload>[0]["reportType"];
      file: File;
    }) => reportsApi.upload(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: REPORTS_QUERY_KEY,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => reportsApi.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: REPORTS_QUERY_KEY,
      });
    },
  });

  const processOCRMutation = useMutation({
    mutationFn: (id: string) => reportsApi.processOCR(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: REPORTS_QUERY_KEY,
      });

      queryClient.invalidateQueries({
        queryKey: [...REPORTS_QUERY_KEY, id],
      });
    },
  });

  const analyzeMutation = useMutation({
    mutationFn: (id: string) => reportsApi.analyze(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: REPORTS_QUERY_KEY,
      });

      queryClient.invalidateQueries({
        queryKey: [...REPORTS_QUERY_KEY, id],
      });
    },
  });

  return {
    listQuery,
    uploadMutation,
    deleteMutation,
    processOCRMutation,
    analyzeMutation,
  };
}

export function useReport(id: string) {
  return useQuery({
    queryKey: [...REPORTS_QUERY_KEY, id],
    queryFn: () => reportsApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useReportAnalysis(id: string) {
  return useQuery({
    queryKey: [...REPORTS_QUERY_KEY, id, "analysis"],
    queryFn: () => reportsApi.getAnalysis(id),
    enabled: Boolean(id),
  });
}