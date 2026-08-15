import { aiService } from "../../services/ai/ai.service";
import { symptomRepository } from "./symptom.repository";
import { SymptomCheckDTO } from "./symptom.types";

class SymptomService {
  async checkSymptoms(userId: string, data: SymptomCheckDTO) {
    const aiResponse = await aiService.analyzeSymptoms(data.symptoms);

    const analysis = JSON.parse(aiResponse);

    const riskLevel = analysis.riskLevel as "LOW" | "MEDIUM" | "HIGH";

    return symptomRepository.create(userId, data.symptoms, analysis, riskLevel);
  }

  //get history
  async getHistory(userId: string) {
    return symptomRepository.findAllByUser(userId);
  }

  async getById(id: string, userId: string) {
    const result = await symptomRepository.findById(id, userId);

    if (!result) {
      throw new Error("Symptom check not found.");
    }

    return result;
  }

  async delete(id: string, userId: string) {
    const result = await symptomRepository.delete(id, userId);

    if (result.count === 0) {
      throw new Error("Symptom check not found.");
    }

    return {
      message: "Symptom check deleted successfully.",
    };
  }
}

export const symptomService = new SymptomService();
