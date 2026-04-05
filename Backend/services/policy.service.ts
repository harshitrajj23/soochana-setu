import { supabaseAdmin } from '../lib/supabase';

export class PolicyService {
  /**
   * Simulate a new policy rollout.
   * Calculates specific impact metrics for the given scheme and income threshold.
   */
  static async simulatePolicy(policy: { scheme_name: string; income_limit: number }): Promise<any> {
    const { data: beneficiaries, error } = await supabaseAdmin
      .from('beneficiaries')
      .select('id, income, scheme_name');

    if (error) throw error;

    if (!beneficiaries) {
      return {
        eligible_count: 0,
        excluded_count: 0,
        budget_required: 0,
        inclusion_rate: 0,
        high_risk_count: 0,
        insights: ["No population data available for simulation."]
      };
    }

    // 1. Identify Eligible Population
    const eligible = beneficiaries.filter(b => Number(b.income || 0) <= policy.income_limit);
    const eligible_count = eligible.length;

    // 2. Identify Inclusion Gap (Eligible but not enrolled in ANY scheme)
    const excluded = eligible.filter(b => !b.scheme_name);
    const excluded_count = excluded.length;

    // 3. Already Enrolled in THIS scheme (Duplicates)
    const enrolled_in_this = eligible.filter(b => b.scheme_name === policy.scheme_name).length;

    // 4. Inclusion Rate Calculation
    const enrolled_any = eligible_count - excluded_count;
    const inclusion_rate = eligible_count > 0 ? Number(((enrolled_any / eligible_count) * 100).toFixed(1)) : 0;

    // 5. Budget Required (Assuming 1500 INR / month per eligible person)
    const avg_monthly_benefit = 1500;
    const budget_required = (eligible_count * avg_monthly_benefit * 12);

    // 6. High Risk Count (Check if any eligible person already has fraud flags)
    const { data: fraudAlerts } = await supabaseAdmin
      .from('fraud_alerts')
      .select('beneficiary_id');
    
    const flaggedIds = new Set((fraudAlerts || []).map(f => f.beneficiary_id));
    const high_risk_count = eligible.filter(b => flaggedIds.has(b.id)).length;

    // 7. Dynamic Insights
    const insights = [];
    if (inclusion_rate < 50) {
      insights.push(`Critical Inclusion Gap: ${100 - inclusion_rate}% of the eligible population for ${policy.scheme_name} is currently underserved.`);
    } else {
      insights.push(`Stable Penetration: ${inclusion_rate}% coverage achieved across target demographic.`);
    }
    
    if (high_risk_count > (eligible_count * 0.1)) {
      insights.push(`Risk Alert: Significant behavioral anomalies (>${high_risk_count}) detected within the eligible pool. Recommend secondary verification.`);
    }

    if (budget_required > 100000000) {
      insights.push(`Budget Warning: Estimated annualized requirement (₹${(budget_required / 10000000).toFixed(1)} Cr) exceeds standard allocation blocks.`);
    } else {
      insights.push(`Fiscal Feasibility: Projected budget aligns with regional allocation headroom.`);
    }

    return {
      eligible_count,
      excluded_count,
      budget_required,
      inclusion_rate,
      high_risk_count,
      insights
    };
  }
}
