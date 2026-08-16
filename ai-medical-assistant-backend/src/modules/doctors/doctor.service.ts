import { CreateDoctorDTO, UpdateDoctorDTO } from "./doctor.types";
import { doctorRepository } from "./doctor.repository";
import { ApiError } from "../../utils/ApiError";

class DoctorService {
  async createDoctor(data: CreateDoctorDTO) {
    return doctorRepository.create(data);
  }

  async getDoctors() {
    return doctorRepository.findAll();
  }

  async getDoctorById(id: string) {
    const doctor = await doctorRepository.findById(id);

    if (!doctor) {
      throw new ApiError(404, "Doctor not found.");
    }

    return doctor;
  }

  async updateAvailability(id: string, isAvailable: boolean) {
    const result = await doctorRepository.updateAvailability(id, isAvailable);

    if (result.count === 0) {
      throw new ApiError(404, "Doctor not found.");
    }

    return doctorRepository.findById(id);
  }

  async updateDoctor(id: string, data: UpdateDoctorDTO) {
    const doctor = await doctorRepository.findById(id);

    if (!doctor) {
      throw new ApiError(404,"Doctor not found.");
    }

    return doctorRepository.update(id, data);
  }

  async deleteDoctor(id: string) {
    const doctor = await doctorRepository.findById(id);

    if (!doctor) {
      throw new ApiError(404, "Doctor not found.");
    }

    await doctorRepository.delete(id);

    return {
      message: "Doctor deleted successfully.",
    };
  }
}

export const doctorService = new DoctorService();
