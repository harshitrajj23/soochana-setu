import { supabaseAdmin } from '../lib/supabase';
import { AuditService } from './audit.service';

export class FraudService {
  /**
   * Detects fraud based on:
   * 1. Same id_number appearing multiple times across records
   * 2. Same address used by more than 3 beneficiaries
   * 3. Same person (unified profile) linked to multiple schemes
   */
  static async detectFraud(): Promise<any[]> {
    const fraudFlags: any[] = [];

    // 1. Identify duplicated id_numbers within beneficiaries
    const { data: idDups, error: idDuplicateError } = await supabaseAdmin
      .rpc('get_duplicate_id_numbers'); // Assuming custom RPC function for efficiency

    if (idDuplicateError) {
      // Fallback for manual query if RPC is not available
      const { data: records } = await supabaseAdmin
        .from('beneficiaries')
        .select('id_number, id');
      
      const counts: Record<string, number> = {};
      records?.forEach(r => {
        if (r.id_number) counts[r.id_number] = (counts[r.id_number] || 0) + 1;
      });

      for (const [idNum, count] of Object.entries(counts)) {
        if (count > 1) {
          fraudFlags.push({ type: 'DUPLICATE_ID', id_number: idNum, count });
        }
      }
    }

    // 2. Identify shared addresses (> 3 beneficiaries)
    const { data: records } = await supabaseAdmin
        .from('beneficiaries')
        .select('address, id');

    const addressCounts: Record<string, number> = {};
    records?.forEach(r => {
        if (r.address) addressCounts[r.address] = (addressCounts[r.address] || 0) + 1;
    });

    for (const [addr, count] of Object.entries(addressCounts)) {
        if (count > 3) {
            fraudFlags.push({ type: 'SHARED_ADDRESS', address: addr, count });
        }
    }

    // 3. Same person (unified) linked to multiple schemes
    const { data: unifiedData } = await supabaseAdmin
      .from('unified_profiles')
      .select('id, beneficiaries(scheme_name)');

    if (unifiedData) {
      for (const profile of unifiedData) {
        const schemes = new Set(profile.beneficiaries.map((b: any) => b.scheme_name));
        if (schemes.size > 1) {
          const fraudInfo = { profile_id: profile.id, schemes: Array.from(schemes) };
          fraudFlags.push({ type: 'MULTIPLE_SCHEMES', ...fraudInfo });
          await AuditService.logEvent('FRAUD_FLAG_ADDED', profile.id, fraudInfo);
        }
      }
    }

    console.log("Fraud detection complete");
    return fraudFlags;
  }
}
