import { NextRequest, NextResponse } from 'next/server';
import { PredictiveFraudService } from '../../../services/predictive-fraud.service';

export async function POST(req: NextRequest) {
  try {
    const predictions = await PredictiveFraudService.runPredictions();

    return NextResponse.json({
      success: true,
      data: predictions,
      message: "Predictive fraud analysis complete."
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: error.message || "An error occurred during predictive fraud generation."
    }, { status: 500 });
  }
}
