import { supabaseAdmin } from '../lib/supabase';
import { AuditService } from './audit.service';

export class InclusionService {
  /**
   * Identify users where:
   * 1. income < 300000 (Low income threshold)
   * 2. not receiving any scheme (scheme_name is null)
   */
  static async findExclusion(): Promise<any[]> {
    const { data: beneficiaries, error } = await supabaseAdmin
      .from('beneficiaries')
      .select('id, full_name, address, income, scheme_name');

    if (error) throw error;

    const exclusionGaps: any[] = [];

    if (beneficiaries) {
      beneficiaries.forEach(b => {
        // Condition: Income < 300k AND not enrolled in any scheme
        if (Number(b.income || 0) < 300000 && !b.scheme_name) {
          const incomeVal = Number(b.income || 0);
          
          // Determine risk level based on poverty depth
          let risk_level = "LOW";
          if (incomeVal < 100000) risk_level = "HIGH";
          else if (incomeVal < 200000) risk_level = "MEDIUM";

          exclusionGaps.push({
            id: b.id,
            full_name: b.full_name || "Unknown",
            address: b.address || "Not Available",
            income: incomeVal,
            exclusion_reason: "Low income (eligible threshold) but no active ministerial scheme enrollment detected.",
            risk_level: risk_level
          });

          // Log the discovery for audit trails
          AuditService.logEvent('EXCLUSION_DETECTED', null, { beneficiary_id: b.id, income: b.income });
        }
      });
    }

    console.log(`Inclusion audit complete. Identified ${exclusionGaps.length} gaps.`);
    return exclusionGaps;
  }
}
