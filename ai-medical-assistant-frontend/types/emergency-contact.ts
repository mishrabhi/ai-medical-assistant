export interface EmergencyContact {
  id: string;
  userId: string;
  name: string;
  relation: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmergencyContactPayload {
  name: string;
  relation: string;
  phone: string;
}

export interface UpdateEmergencyContactPayload {
  name?: string;
  relation?: string;
  phone?: string;
}