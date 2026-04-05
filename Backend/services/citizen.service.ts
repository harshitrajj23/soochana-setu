import { supabaseAdmin } from '../lib/supabase';
import { AIService } from './ai.service';

export class CitizenService {
  /**
   * Resolves or creates a citizen profile based on the ID number.
   * Links to a unified_profile_id if found in existing beneficiary records.
   */
  static async login(idNumber: string): Promise<any> {
    // 1. Check if citizen profile already exists
    const { data: existingProfile } = await supabaseAdmin
      .from('citizen_profiles')
      .select('*, unified_profiles(*)')
      .eq('id_number', idNumber)
      .single();

    if (existingProfile) return existingProfile;

    // 2. Not found, search in beneficiaries to find an existing unified profile
    const { data: beneficiary } = await supabaseAdmin
      .from('beneficiaries')
      .select('unified_profile_id')
      .eq('id_number', idNumber)
      .limit(1)
      .single();

    // 3. Create the citizen profile (linked or not)
    const { data: newProfile, error: insertError } = await supabaseAdmin
      .from('citizen_profiles')
      .insert({
        id_number: idNumber,
        unified_profile_id: beneficiary?.unified_profile_id || null
      })
      .select('*, unified_profiles(*)')
      .single();

    if (insertError) throw insertError;
    return newProfile;
  }

  /**
   * Aggregates dashboard data for a citizen.
   */
  static async getDashboard(idNumber: string): Promise<any> {
    // 1. Fetch profile and unified data
    const profile = await this.login(idNumber);
    const unifiedProfileId = profile.unified_profile_id;

    if (!unifiedProfileId) {
      return {
        profile,
        current_benefits: [],
        recommendations: [],
        total_monthly_value: 0,
        exclusion_alerts: ["No unified records found for your ID. You might be eligible for all basic schemes."]
      };
    }

    // 2. Fetch current benefits (enrolled schemes)
    const { data: benefits } = await supabaseAdmin
      .from('beneficiaries')
      .select('*')
      .eq('unified_profile_id', unifiedProfileId);

    const currentSchemeNames = benefits?.map(b => b.scheme_name) || [];

    // 3. Fetch all potential schemes and check eligibility
    const { data: allSchemes } = await supabaseAdmin.from('schemes').select('*');
    
    // Get latest income from unified profile or beneficiaries
    const userIncome = benefits?.[0]?.income || 1000000; // Default to high if unknown

    const recommendations: any[] = [];
    let totalMonthlyValue = 0;

    for (const scheme of allSchemes || []) {
      const isEnrolled = currentSchemeNames.includes(scheme.name);
      
      if (isEnrolled) {
        totalMonthlyValue += scheme.monthly_benefit;
      } else {
        // Eligibility check
        if (userIncome <= scheme.income_limit) {
          // Use AI to explain why they are eligible
          const whyEligible = await AIService.explainEligibility(
            { income: userIncome, name: profile.id_number },
            scheme
          );

          recommendations.push({
            scheme_name: scheme.name,
            description: scheme.description,
            benefit_amount: scheme.monthly_benefit,
            why_eligible: whyEligible
          });
        }
      }
    }

    return {
      profile,
      current_benefits: benefits,
      recommendations,
      total_monthly_value: totalMonthlyValue,
      exclusion_alerts: recommendations.length > 0 ? 
        [`You are currently missing out on ${recommendations.length} schemes you appear eligible for.`] : []
    };
  }
}
