import { NextRequest, NextResponse } from 'next/server';
import { CitizenService } from '../../../services/citizen.service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id_number = searchParams.get('id_number');

    if (!id_number) {
      return NextResponse.json({
        success: false,
        message: "id_number is required as a query parameter."
      }, { status: 400 });
    }

    const dashboardData = await CitizenService.getDashboard(id_number);

    const report = {
      generated_at: new Date().toISOString(),
      citizen_id: id_number,
      unified_status: dashboardData.profile.unified_profile_id ? "Linked" : "Unlinked",
      current_benefits: (dashboardData.current_benefits || []).map((b: any) => ({
        scheme: b.scheme_name,
        date_enrolled: b.created_at
      })),
      monthly_support_value: dashboardData.total_monthly_value,
      eligible_not_receiving: (dashboardData.recommendations || []).map((r: any) => ({
        scheme: r.scheme_name,
        value: r.benefit_amount,
        reason: r.why_eligible
      })),
      summary: `You are currently receiving support from ${(dashboardData.current_benefits || []).length} schemes with a total monthly value of Rs.${dashboardData.total_monthly_value}. You are missing out on an estimated Rs.${(dashboardData.recommendations || []).reduce((acc: number, r: any) => acc + r.benefit_amount, 0)} per month.`
    };

    return NextResponse.json({
      success: true,
      data: report,
      message: "Eligibility report generated successfully."
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || "An error occurred during report generation."
    }, { status: 500 });
  }
}
