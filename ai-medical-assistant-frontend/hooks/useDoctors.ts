"use client";

import { useQuery } from "@tanstack/react-query";
import { doctorsApi } from "@/lib/api/doctors";

const DOCTORS_QUERY_KEY = ["doctors"];

export function useDoctors() {
  return useQuery({
    queryKey: DOCTORS_QUERY_KEY,
    queryFn: () => doctorsApi.list(),
  });
}

export function useDoctor(id: string) {
  return useQuery({
    queryKey: [...DOCTORS_QUERY_KEY, id],
    queryFn: () => doctorsApi.getById(id),
  });
}
