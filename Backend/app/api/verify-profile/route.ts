import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase';
import { HashService } from '../../../services/hash.service';
import { AuditService } from '../../../services/audit.service';

export async function POST(req: NextRequest) {
  try {
    const { unified_profile_id } = await req.json();

    if (!unified_profile_id) {
      return NextResponse.json({
        success: false,
        message: "unified_profile_id is required."
      }, { status: 400 });
    }

    // 1. Fetch full profile and linked beneficiaries
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('unified_profiles')
      .select('*, beneficiaries(*)')
      .eq('id', unified_profile_id)
      .single();

    if (profileError || !profile) {
      throw new Error("Profile not found.");
    }

    // 2. Generate tamper-proof hash
    const recordHash = HashService.generateHash({
      full_name: profile.full_name,
      address: profile.address,
      beneficiaries: profile.beneficiaries || []
    });

    // 3. Update profile with hash and status
    const { error: updateError } = await supabaseAdmin
      .from('unified_profiles')
      .update({
        record_hash: recordHash,
        verification_status: 'verified',
        updated_at: new Date().toISOString()
      })
      .eq('id', unified_profile_id);

    if (updateError) throw updateError;

    // 4. Log audit event
    await AuditService.logEvent('PROFILE_VERIFIED', unified_profile_id, { hash: recordHash });

    return NextResponse.json({
      success: true,
      hash: recordHash,
      message: "Profile verified and record hash generated successfully."
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || "An error occurred during verification."
    }, { status: 500 });
  }
}
