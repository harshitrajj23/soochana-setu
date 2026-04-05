import { supabaseAdmin } from '../lib/supabase';
import { AIService } from './ai.service';
import { CitizenService } from './citizen.service';

export class InsightsService {
  static async getCitizenInsights(idNumber: string): Promise<any> {
    const dashboardData = await CitizenService.getDashboard(idNumber);

    // AI computes missing benefits with explanations and alerts
    const insights = await AIService.generateMinistryInsights(
        dashboardData.profile, 
        dashboardData.recommendations.map((r: any) => ({ name: r.scheme_name, monthly_benefit: r.benefit_amount }))
    );

    const receivedValue = dashboardData.total_monthly_value;
    const missingValue = insights.missing_benefits.reduce((sum: number, b: any) => sum + b.value, 0);

    return {
      citizen_id: idNumber,
      benefits_received: dashboardData.current_benefits,
      missing_benefits: insights.missing_benefits,
      estimated_value_received: receivedValue,
      estimated_value_missing: missingValue,
      eligibility_reasons: insights.missing_benefits.map((b: any) => b.why_eligible),
      alerts: insights.alerts,
      unified_profile_id: dashboardData.profile?.unified_profile_id
    };
  }
}
