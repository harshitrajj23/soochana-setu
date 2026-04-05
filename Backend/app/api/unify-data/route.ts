import { NextRequest, NextResponse } from 'next/server';
import { UnifyService } from '../../../services/unify.service';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(req: NextRequest) {
  try {
    const profiles = await UnifyService.unifyBeneficiaries();

    return NextResponse.json({
      success: true,
      data: profiles || [],
      message: "Entity resolution and profile unification complete."
    }, { headers: corsHeaders });

  } catch (error: any) {
    console.error("UNIFICATION ERROR:", error.message);
    return NextResponse.json({
      success: false,
      message: error.message || "An error occurred during unification."
    }, { status: 500, headers: corsHeaders });
  }
}
