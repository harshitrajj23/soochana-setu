import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '../../../services/analytics.service';

export async function GET(req: NextRequest) {
  try {
    const analytics = await AnalyticsService.getInterMinistryAnalytics();

    return NextResponse.json({
      success: true,
      data: analytics,
      message: "Inter-ministry analytics generated successfully."
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: error.message || "An error occurred during analytics generation."
    }, { status: 500 });
  }
}
