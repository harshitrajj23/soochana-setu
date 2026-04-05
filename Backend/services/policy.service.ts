import { supabaseAdmin } from '../lib/supabase';

export class PolicyService {
  /**
   * Filter eligible beneficiaries
   * Check: Already receiving schemes
   * Potential duplication
   */
  static async simulatePolicy(policy: { scheme_name: string; income_limit: number }): Promise<any> {
    const { data: eligibleRecords, error } = await supabaseAdmin
      .from('beneficiaries')
      .select('id, id_number, income, scheme_name')
      .lt('income', policy.income_limit);

    if (error) throw error;

    const duplicates = eligibleRecords.filter(r => r.scheme_name === policy.scheme_name).length;
    const excluded_remaining = eligibleRecords.filter(r => r.scheme_name === null).length;

    return {
      eligible: eligibleRecords.length,
      duplicates,
      excluded_remaining
    };
  }
}
