import { CreateDoctorDTO } from "./doctor.types";
import { doctorRepository } from "./doctor.repository";

class DoctorService {
  async createDoctor(
    data: CreateDoctorDTO
  ) {
    return doctorRepository.create(data);
  }

  async getDoctors() {
    return doctorRepository.findAll();
  }

  async getDoctorById(id: string) {
    const doctor =
      await doctorRepository.findById(id);

    if (!doctor) {
      throw new Error("Doctor not found.");
    }

    return doctor;
  }

  async updateAvailability(
    id: string,
    isAvailable: boolean
  ) {
    const result =
      await doctorRepository.updateAvailability(
        id,
        isAvailable
      );

    if (result.count === 0) {
      throw new Error("Doctor not found.");
    }

    return doctorRepository.findById(id);
  }
}

export const doctorService =
  new DoctorService();