import { NextRequest, NextResponse } from 'next/server';
import { FraudService } from '../../../services/fraud.service';

export async function POST() {
  try {
    const flags = await FraudService.detectFraud();

    return NextResponse.json({
      success: true,
      data: flags,
      message: "Fraud detection audit complete."
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || "An error occurred during fraud detection."
    }, { status: 500 });
  }
}
