import { supabaseAdmin } from '../lib/supabase';
import { AIService } from './ai.service';

export class AnalyticsService {
  static async getInterMinistryAnalytics(): Promise<any> {
    const { data: beneficiaries } = await supabaseAdmin.from('beneficiaries').select('*').limit(100);
    const { data: schemes } = await supabaseAdmin.from('schemes').select('*');

    if (!beneficiaries || !schemes) {
        throw new Error("Unable to fetch data for analytics");
    }

    const analytics = await AIService.analyzeRegionalExclusion(beneficiaries, schemes);

    return analytics;
  }
}
