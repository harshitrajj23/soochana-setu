import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase';
import { HashService } from '../../../services/hash.service';

export async function POST(req: NextRequest) {
  try {
    const { unified_profile_id } = await req.json();

    if (!unified_profile_id) {
      return NextResponse.json({
        success: false,
        message: "unified_profile_id is required."
      }, { status: 400 });
    }

    // 1. Fetch current profile data
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('unified_profiles')
      .select('*, beneficiaries(*)')
      .eq('id', unified_profile_id)
      .single();

    if (profileError || !profile) {
      throw new Error("Profile not found.");
    }

    if (!profile.record_hash) {
      return NextResponse.json({
        success: false,
        message: "Profile has not been verified yet (no hash available)."
      }, { status: 400 });
    }

    // 2. Recompute current hash
    const currentHash = HashService.generateHash({
      full_name: profile.full_name,
      address: profile.address,
      beneficiaries: profile.beneficiaries || []
    });

    // 3. Compare with stored hash
    const isIntact = currentHash === profile.record_hash;

    return NextResponse.json({
      success: true,
      integrity: isIntact,
      current_hash: currentHash,
      stored_hash: profile.record_hash,
      message: isIntact 
        ? "Data integrity verified. Records match the stored hash." 
        : "ALERT: Data integrity compromised! Records do not match the stored hash."
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || "An error occurred during integrity check."
    }, { status: 500 });
  }
}
