import { NextRequest, NextResponse } from 'next/server';
import { PolicyService } from '../../../services/policy.service';

export async function POST(req: NextRequest) {
  try {
    const policy = await req.json();

    if (!policy.scheme_name || !policy.income_limit) {
      return NextResponse.json({
        success: false,
        message: "scheme_name and income_limit are required."
      }, { status: 400 });
    }

    const simulation = await PolicyService.simulatePolicy(policy);

    return NextResponse.json({
      success: true,
      data: simulation,
      message: "Policy simulation complete."
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || "An error occurred during policy simulation."
    }, { status: 500 });
  }
}
