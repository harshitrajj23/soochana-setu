import { NextRequest, NextResponse } from 'next/server';
import { UnifyService } from '../../../services/unify.service';

export async function POST() {
  try {
    const profiles = await UnifyService.unifyBeneficiaries();

    return NextResponse.json({
      success: true,
      data: profiles,
      message: "Entity resolution and profile unification complete."
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || "An error occurred during unification."
    }, { status: 500 });
  }
}
