import { adminRepository } from "./admin.repository";

class AdminService {
  async getDashboardStats() {
    return adminRepository.getDashboardStats();
  }
}

export const adminService =
  new AdminService();