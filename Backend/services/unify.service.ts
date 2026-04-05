import { supabaseAdmin } from '../lib/supabase';
import { AIService } from './ai.service';

export class UnifyService {
  /**
   * Main unification logic.
   * 1. Fetch records
   * 2. Normalize (if not done)
   * 3. Group by ID number or other similarity
   * 4. AI-power match for uncertain cases
   */
  static async unifyBeneficiaries(): Promise<any> {
    const { data: records, error } = await supabaseAdmin
      .from('beneficiaries')
      .select('*');

    if (error) throw error;

    const unifiedProfilesMap: Map<string, any> = new Map();

    // Loop through all records and perform initial normalization and matching
    for (const record of records) {
      if (!record.normalized_data) {
        const normalized = await AIService.normalizeData(record.raw_data);
        await supabaseAdmin
            .from('beneficiaries')
            .update({ normalized_data: normalized })
            .eq('id', record.id);
        record.normalized_data = normalized;
      }

      const { id_number } = record.normalized_data;

      // Grouping by ID number (first level matching)
      if (id_number && unifiedProfilesMap.has(id_number)) {
        await this.linkToProfile(record.id, unifiedProfilesMap.get(id_number).id);
      } else {
        // Create new unified profile
        const { data: newProfile, error: profileError } = await supabaseAdmin
            .from('unified_profiles')
            .insert({
                full_name: record.normalized_data.full_name,
                address: record.normalized_data.address,
                confidence_score: 100,
                verification_status: 'pending'
            })
            .select()
            .single();

        if (profileError) throw profileError;

        unifiedProfilesMap.set(id_number, newProfile);
        await this.linkToProfile(record.id, newProfile.id);
      }
    }

    console.log("Entity resolution complete");

    // Re-fetch profiles for output
    const { data: finalProfiles } = await supabaseAdmin
      .from('unified_profiles')
      .select('*, beneficiaries(*)');

    return finalProfiles;
  }

  private static async linkToProfile(beneficiaryId: string, profileId: string) {
    await supabaseAdmin
        .from('beneficiaries')
        .update({ unified_profile_id: profileId })
        .eq('id', beneficiaryId);
  }
}
