import { emergencyContactRepository } from "./emergency-contact.repository";

import {
  CreateEmergencyContactDTO,
  UpdateEmergencyContactDTO,
} from "./emergency-contact.types";

class EmergencyContactService {
  //create emergency contact
  async createContact(userId: string, data: CreateEmergencyContactDTO) {
    return emergencyContactRepository.create(userId, data);
  }

  async getContacts(userId: string) {
    return emergencyContactRepository.findAllByUser(userId);
  }

  //get contacts by Id
  async getContactById(id: string, userId: string) {
    const contact = await emergencyContactRepository.findById(id, userId);

    if (!contact) {
      throw new Error("Emergency contact not found.");
    }

    return contact;
  }

  //update contact
  async updateContact(
    id: string,
    userId: string,
    data: UpdateEmergencyContactDTO,
  ) {
    const contact = await emergencyContactRepository.findById(id, userId);

    if (!contact) {
      throw new Error("Emergency contact not found.");
    }

    await emergencyContactRepository.update(id, userId, data);

    return emergencyContactRepository.findById(id, userId);
  }

  //delete contact
  async deleteContact(id: string, userId: string) {
    const result = await emergencyContactRepository.delete(id, userId);

    if (result.count === 0) {
      throw new Error("Emergency contact not found.");
    }

    return {
      message: "Emergency contact deleted successfully.",
    };
  }

  //get emergency contact of a user
  async getEmergencyContacts(userId: string) {
    return emergencyContactRepository.findAllByUser(userId);
  }
}

export const emergencyContactService = new EmergencyContactService();
