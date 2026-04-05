import { NextRequest, NextResponse } from 'next/server';
import { InsightsService } from '../../../services/insights.service';

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

    const insights = await InsightsService.getCitizenInsights(id_number);

    return NextResponse.json({
      success: true,
      data: insights,
      message: "Citizen insights generated successfully."
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: error.message || "An error occurred during insights generation."
    }, { status: 500 });
  }
}
