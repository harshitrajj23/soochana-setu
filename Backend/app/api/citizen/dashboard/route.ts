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

    return NextResponse.json({
      success: true,
      data: dashboardData,
      message: "Citizen dashboard data fetched successfully."
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || "An error occurred during dashboard fetch."
    }, { status: 500 });
  }
}
