import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function GET() {
  try {
    const { data: profiles, error } = await supabaseAdmin
      .from('unified_profiles')
      .select('id, full_name, address, confidence_score, verification_status')
      .order('confidence_score', { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: profiles || [],
      message: "Beneficiary insights retrieved successfully."
    }, { headers: corsHeaders });

  } catch (error: any) {
    console.error("BENEFICIARY INSIGHTS ERROR:", error.message);
    return NextResponse.json({
      success: false,
      message: error.message || "An error occurred fetching beneficiary insights."
    }, { status: 500, headers: corsHeaders });
  }
}
