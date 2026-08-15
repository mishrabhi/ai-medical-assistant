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

  //analyze symptoms
  async analyzeSymptoms(
  symptoms: string[]
) {
  const response =
    await openai.responses.create({
      model: "gpt-5-mini",

      instructions: `
You are a medical information assistant helping users
understand their reported symptoms.

Analyze the symptoms provided by the user.

IMPORTANT:
- Do not diagnose the user.
- Do not state that the user definitely has a disease.
- Provide possible explanations only as general information.
- Recommend appropriate medical attention when warranted.
- Clearly mention warning signs that require urgent medical care.
- Keep the language simple and patient-friendly.

Return ONLY valid JSON in this exact structure:

{
  "summary": "Brief explanation of the symptoms",
  "possibleCauses": [
    "Possible explanation 1",
    "Possible explanation 2"
  ],
  "riskLevel": "LOW",
  "urgency": "ROUTINE",
  "recommendations": [
    "Recommendation 1",
    "Recommendation 2"
  ],
  "warningSigns": [
    "Warning sign 1",
    "Warning sign 2"
  ]
}

riskLevel must be exactly one of:
LOW, MEDIUM, HIGH

urgency must be exactly one of:
ROUTINE, SOON, URGENT

Symptoms:
`,

      input: symptoms.join(", "),
    });

  return response.output_text;
}
}

export const aiService = new AIService();