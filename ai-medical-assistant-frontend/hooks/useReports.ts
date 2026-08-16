"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { reportsApi } from "@/lib/api/reports";
import type { ReportType } from "@/types/report";

const REPORTS_QUERY_KEY = ["reports"];

export function useReports() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const listQuery = useQuery({
    queryKey: REPORTS_QUERY_KEY,
    queryFn: reportsApi.list,
  });

  const uploadMutation = useMutation({
    mutationFn: (payload: { title: string; reportType: ReportType; file: File }) => reportsApi.upload(payload),
    onSuccess: (response) => {
      queryClient.setQueryData(REPORTS_QUERY_KEY, (previous: any) => {
        const oldList = Array.isArray(previous) ? previous : [];
        return [response.data, ...oldList];
      });
      queryClient.invalidateQueries({ queryKey: REPORTS_QUERY_KEY });
      router.push(`/reports/${response.data.id}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => reportsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REPORTS_QUERY_KEY });
    },
  });

  const processOcrMutation = useMutation({
    mutationFn: (id: string) => reportsApi.processOCR(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["report", id] });
      queryClient.invalidateQueries({ queryKey: REPORTS_QUERY_KEY });
    },
  });

  const analyzeMutation = useMutation({
    mutationFn: (id: string) => reportsApi.analyze(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["report", id] });
      queryClient.invalidateQueries({ queryKey: REPORTS_QUERY_KEY });
    },
  });

  return {
    listQuery,
    uploadMutation,
    deleteMutation,
    processOcrMutation,
    analyzeMutation,
  };
}

export function useReport(id: string) {
  return useQuery({
    queryKey: ["report", id],
    queryFn: () => reportsApi.getById(id),
    enabled: Boolean(id),
  });
}
