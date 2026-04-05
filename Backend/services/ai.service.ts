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

  /**
   * Predicts inter-ministry fraud risk based on overlapping or conflicting records.
   */
  static async predictInterMinistryFraud(unifiedProfile: any, benefits: any[]): Promise<{ risk_score: number; fraud_type: string; recommended_action: string }> {
    const response = await client.chat.complete({
      model: "mistral-tiny",
      messages: [
        {
          role: "user",
          content: `Analyze this citizen's benefits across different schemes/ministries to detect potential fraud or overlapping claims.
          Return JSON: { "risk_score": number (0-100), "fraud_type": string, "recommended_action": string }
          
          Profile: ${JSON.stringify(unifiedProfile)}
          Benefits: ${JSON.stringify(benefits)}`
        }
      ],
      responseFormat: { type: "json_object" }
    });

    const content = response.choices?.[0]?.message?.content;
    if (typeof content !== 'string') {
        return { risk_score: 0, fraud_type: "None", recommended_action: "No action needed" };
    }
    return JSON.parse(content);
  }

  /**
   * Analyzes regional or state-wise exclusion patterns and overlap across ministries.
   */
  static async analyzeRegionalExclusion(benefitsList: any[], allSchemes: any[]): Promise<{ region: string; exclusion_count: number; duplicate_benefits_count: number; recommendations: string[] }> {
    const response = await client.chat.complete({
      model: "mistral-tiny",
      messages: [
        {
          role: "user",
          content: `Analyze this dataset of beneficiaries and schemes to identify systemic exclusion patterns and duplicate benefit claims across different ministries (like Health, Ed, Welfare).
          Return JSON: { "region": string (infer from data), "exclusion_count": number, "duplicate_benefits_count": number, "recommendations": [string] }
          
          Beneficiaries (sample): ${JSON.stringify(benefitsList.slice(0, 50))}
          Schemes: ${JSON.stringify(allSchemes)}`
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
   * Generates cross-ministry recommendations for a citizen.
   */
  static async generateMinistryInsights(profileData: any, missingSchemes: any[]): Promise<{ missing_benefits: any[]; alerts: string[] }> {
    const response = await client.chat.complete({
      model: "mistral-tiny",
      messages: [
        {
          role: "user",
          content: `Analyze this citizen's profile and the schemes they are missing. Which ministries are overlooking them? Formulate alerts.
          Return JSON: { "alerts": ["string alert..."] }
          
          Profile: ${JSON.stringify(profileData)}
          Missing Schemes: ${JSON.stringify(missingSchemes)}`
        }
      ],
      responseFormat: { type: "json_object" }
    });

    const content = response.choices?.[0]?.message?.content;
    let alerts: string[] = [];
    if (typeof content === 'string') {
      try { alerts = JSON.parse(content).alerts || []; } catch(e){}
    }

    // Generate explanations for all missing schemes in parallel
    const missing_benefits = await Promise.all(missingSchemes.map(async (scheme) => {
       const why = await this.explainEligibility(profileData, scheme);
       return {
         scheme_name: scheme.name,
         value: scheme.monthly_benefit,
         why_eligible: why
       };
    }));

    return { missing_benefits, alerts };
  }
}
