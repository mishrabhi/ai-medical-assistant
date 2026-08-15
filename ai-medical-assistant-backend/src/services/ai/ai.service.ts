import OpenAI from "openai";
import { env } from "../../config/env";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

class AIService {
  async analyzeMedicalReport(
    reportText: string
  ) {
    const response =
      await openai.responses.create({
        model: "gpt-5-mini",

        instructions: `
You are a medical information assistant.

Analyze the provided medical report and return
a clear, patient-friendly explanation.

Important:
- Do not diagnose the patient.
- Do not claim certainty about medical conditions.
- Highlight abnormal or concerning values when present.
- Explain medical terminology in simple language.
- Recommendations should encourage consultation with
  an appropriate healthcare professional when necessary.
- If the report does not contain enough information,
  clearly say so.

Return the following sections:

Summary:
Key Findings:
Abnormal Findings:
Risk Level:
Recommendations:

Risk Level must be one of:
LOW, MEDIUM, HIGH.

Medical report:
`,

        input: reportText,
      });

    return response.output_text;
  }
}

export const aiService = new AIService();