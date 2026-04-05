import { NextRequest, NextResponse } from 'next/server';
import { CitizenService } from '../../../../services/citizen.service';

export async function POST(req: NextRequest) {
  try {
    const { id_number } = await req.json();

    if (!id_number) {
      return NextResponse.json({
        success: false,
        message: "id_number is required."
      }, { status: 400 });
    }

    const profile = await CitizenService.login(id_number);

    return NextResponse.json({
      success: true,
      data: profile,
      message: "Citizen login successful."
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || "An error occurred during citizen login."
    }, { status: 500 });
  }
}
