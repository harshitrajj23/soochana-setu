import { supabaseAdmin } from '../lib/supabase';
import { AuditService } from './audit.service';

export class FraudService {
  /**
   * Detects fraud and returns standardized records.
   * Logic:
   * 1. Duplicate ID Numbers (HIGH RISK)
   * 2. Shared Address (> 3 people) (MEDIUM RISK)
   * 3. Multiple scheme enrollment for same identity (MEDIUM RISK)
   */
  static async detectFraud(): Promise<any[]> {
    const fraudRecords: any[] = [];

    // 1. DUPLICATE ID NUMBERS (HIGH RISK)
    const { data: beneficiaries } = await supabaseAdmin
      .from('beneficiaries')
      .select('id, id_number, full_name, address, scheme_name, created_at');

    if (beneficiaries) {
      const idMap: Map<string, any[]> = new Map();
      beneficiaries.forEach(b => {
        if (b.id_number) {
          const list = idMap.get(b.id_number) || [];
          list.push(b);
          idMap.set(b.id_number, list);
        }
      });

      idMap.forEach((matches, idNum) => {
        if (matches.length > 1) {
          matches.forEach((m: any) => {
            fraudRecords.push({
              id: `F-ID-${m.id}`,
              beneficiary_id: m.id,
              full_name: m.full_name || "Not Available",
              risk_level: "HIGH",
              fraud_reason: `Identity ID ${idNum} duplicated across ${matches.length} records.`,
              region: m.address || "Not Available",
              created_at: m.created_at
            });
          });
        }
      });
    }

    // 2. SHARED ADDRESS (> 3 people) (MEDIUM RISK)
    if (beneficiaries) {
      const addressMap: Map<string, any[]> = new Map();
      beneficiaries.forEach(b => {
        if (b.address) {
          const list = addressMap.get(b.address) || [];
          list.push(b);
          addressMap.set(b.address, list);
        }
      });

      addressMap.forEach((matches, addr) => {
        if (matches.length > 3) {
          matches.forEach((m: any) => {
            // Avoid duplicates if already flagged by ID
            if (!fraudRecords.find(f => f.beneficiary_id === m.id)) {
              fraudRecords.push({
                id: `F-ADDR-${m.id}`,
                beneficiary_id: m.id,
                full_name: m.full_name || "Not Available",
                risk_level: "MEDIUM",
                fraud_reason: `Address shared by ${matches.length} different beneficiaries.`,
                region: addr,
                created_at: m.created_at
              });
            }
          });
        }
      });
    }

    // 3. MULTIPLE SCHEMES (MEDIUM RISK)
    const { data: profiles } = await supabaseAdmin
      .from('unified_profiles')
      .select('id, full_name, address, created_at, beneficiaries(scheme_name)');

    if (profiles) {
      for (const p of profiles) {
        const schemes = new Set(p.beneficiaries.map((b: any) => b.scheme_name));
        if (schemes.size > 1) {
          if (!fraudRecords.find(f => f.beneficiary_id === p.id)) {
            fraudRecords.push({
              id: `F-SCHEME-${p.id}`,
              beneficiary_id: p.id,
              full_name: p.full_name || "Not Available",
              risk_level: "MEDIUM",
              fraud_reason: `Unified profile linked to ${schemes.size} concurrent schemes: ${Array.from(schemes).join(', ')}.`,
              region: p.address || "Not Available",
              created_at: p.created_at
            });
            await AuditService.logEvent('FRAUD_FLAG_ADDED', p.id, { schemes: Array.from(schemes) });
          }
        }
      }
    }

    console.log(`Fraud detection complete. Found ${fraudRecords.length} flags.`);
    return fraudRecords;
  }
}
