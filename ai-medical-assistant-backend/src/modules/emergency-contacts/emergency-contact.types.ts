export interface CreateEmergencyContactDTO {
  name: string;
  relation: string;
  phone: string;
}

export interface UpdateEmergencyContactDTO {
  name?: string;
  relation?: string;
  phone?: string;
}