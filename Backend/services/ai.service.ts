import { Mistral } from '@mistralai/mistralai';

const apiKey = process.env.MISTRAL_API_KEY!;
const client = new Mistral({ apiKey });

export class AIService {
  /**
   * Normalizes beneficiary data into a clean JSON format.
   */
  static async normalizeData(rawData: any): Promise<any> {
    console.log("AI normalization started");
    const response = await client.chat.complete({
      model: "mistral-tiny",
      messages: [
        {
          role: "user",
          content: `Normalize this beneficiary record into clean JSON format. 
          Return: { "full_name": "", "address": "", "id_number": "", "income": 0, "scheme_name": "" }

          Data: ${JSON.stringify(rawData)}`
        }
      ],
      responseFormat: { type: "json_object" }
    });

    const content = response.choices?.[0]?.message?.content;
    if (typeof content !== 'string') {
        throw new Error("Invalid response from Mistral AI");
    }
    return JSON.parse(content);
  }

  /**
   * Performs entity resolution comparing two records.
   */
  static async matchEntities(recordA: any, recordB: any): Promise<{ match: boolean; confidence: number }> {
    const response = await client.chat.complete({
      model: "mistral-tiny",
      messages: [
        {
          role: "user",
          content: `Are these two records the same person?
          Return JSON: { "match": true/false, "confidence": number (0-100) }

          Record A: ${JSON.stringify(recordA)}
          Record B: ${JSON.stringify(recordB)}`
        }
      ],
      responseFormat: { type: "json_object" }
    });

    const content = response.choices?.[0]?.message?.content;
    if (typeof content !== 'string') {
        throw new Error("Invalid response from Mistral AI");
    }
    return JSON.parse(content);
  }

  /**
   * Explains why a citizen is eligible for a specific scheme.
   */
  static async explainEligibility(profileData: any, schemeData: any): Promise<string> {
    const response = await client.chat.complete({
      model: "mistral-tiny",
      messages: [
        {
          role: "user",
          content: `Explain in one short sentence why this person is eligible for this scheme.
          
          Person Data: ${JSON.stringify(profileData)}
          Scheme Data: ${JSON.stringify(schemeData)}`
        }
      ]
    });

    return response.choices?.[0]?.message?.content as string || "Eligible based on income criteria.";
  }
}
