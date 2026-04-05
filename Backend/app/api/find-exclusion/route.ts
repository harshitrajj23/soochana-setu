import { NextRequest, NextResponse } from 'next/server';
import { InclusionService } from '../../../services/inclusion.service';

export async function POST() {
  try {
    const excluded = await InclusionService.findExclusion();

    return NextResponse.json({
      success: true,
      data: excluded,
      message: "Exclusion analysis complete."
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || "An error occurred during exclusion search."
    }, { status: 500 });
  }
}
