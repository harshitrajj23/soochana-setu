import { supabaseAdmin } from '../lib/supabase';
import { AuditService } from './audit.service';

export class InclusionService {
  /**
   * Identify users where:
   * 1. income < 300000
   * 2. not receiving any scheme
   */
  static async findExclusion(): Promise<any[]> {
    const { data, error } = await supabaseAdmin
      .from('beneficiaries')
      .select('*')
      .lt('income', 300000)
      .is('scheme_name', null); // Or where they have no linked records

    if (error) throw error;

    if (data) {
        for (const record of data) {
            await AuditService.logEvent('EXCLUSION_DETECTED', null, { beneficiary_id: record.id });
        }
    }

    return data;
  }
}
