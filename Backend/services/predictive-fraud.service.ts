import { supabaseAdmin } from '../lib/supabase';
import { AIService } from './ai.service';

export class PredictiveFraudService {
  static async runPredictions(): Promise<any[]> {
    // Fetch profiles that have multiple benefits attached
    const { data: profiles } = await supabaseAdmin
      .from('unified_profiles')
      .select('*, beneficiaries(*)')
      .limit(20);

    if (!profiles) return [];

    const predictions = [];

    // To prevent hitting Mistral rate limits, only process the first 5 profiles 
    // or just a subset and return them.
    for (const profile of profiles.slice(0, 5)) {
       const risk = await AIService.predictInterMinistryFraud(
           { id: profile.id, full_name: profile.full_name, address: profile.address },
           profile.beneficiaries
       );
       
       if (risk.risk_score > 50) {
           await supabaseAdmin
             .from('fraud_flags')
             .insert({
                 unified_profile_id: profile.id,
                 reason: `AI Flag: ${risk.fraud_type} - ${risk.recommended_action}`,
                 risk_score: risk.risk_score
             });
       }

       predictions.push({
           unified_profile_id: profile.id,
           risk_score: risk.risk_score,
           fraud_type: risk.fraud_type,
           recommended_action: risk.recommended_action
       });
    }

    return predictions;
  }
}
