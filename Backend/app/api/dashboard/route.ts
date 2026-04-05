import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '../../../services/analytics.service';
import { PredictiveFraudService } from '../../../services/predictive-fraud.service';

export async function GET(req: NextRequest) {
  try {
    const analytics = await AnalyticsService.getInterMinistryAnalytics();
    
    return NextResponse.json({
      success: true,
      data: {
        analytics
      },
      message: "Global admin dashboard data fetched successfully."
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: error.message || "An error occurred during global dashboard generation."
    }, { status: 500 });
  }
}
