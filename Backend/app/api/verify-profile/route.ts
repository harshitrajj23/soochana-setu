import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase';
import { HashService } from '../../../services/hash.service';
import { AuditService } from '../../../services/audit.service';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'soochana_setu_secret_2026';
const secret = new TextEncoder().encode(JWT_SECRET);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    let profileId = body.unified_profile_id;

    if (!profileId) {
      return NextResponse.json({
        success: false,
        message: "Source Profile ID is required for holographic handshake."
      }, { status: 400 });
    }

    // 1. Fetch full profile and linked beneficiaries
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('unified_profiles')
      .select('*, beneficiaries(*)')
      .eq('id', profileId)
      .single();

    if (profileError || !profile) {
      throw new Error(`Profile ${profileId} not found in federal registry.`);
    }

    // 2. TIERED IDENTITY RESOLUTION
    let resolvedName = profile.full_name || (profile.beneficiaries?.[0]?.name) || (profile.beneficiaries?.[0]?.full_name);

    // Tier 3: Fetch from authenticated admin (JWT fallback)
    if (!resolvedName) {
      const authHeader = req.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
          const { payload } = await jwtVerify(token, secret);
          const userId = payload.userId as string;
          
          const { data: user } = await supabaseAdmin
            .from('users')
            .select('name, full_name')
            .eq('id', userId)
            .single();
            
          resolvedName = user?.name || user?.full_name;
        } catch (jwtErr) {
          console.error("JWT Fallback Resolution Failed:", jwtErr);
        }
      }
    }

    // Final fallback
    resolvedName = resolvedName || "Not Available";

    // DEBUG: Server-side Identity Audit
    console.log("PROFILE:", profile.full_name);
    console.log("BENEFICIARY:", profile.beneficiaries?.[0]);
    console.log("FINAL NAME:", resolvedName);

    // 3. Generate tamper-proof hash
    const recordHash = HashService.generateHash({
      full_name: resolvedName,
      address: profile.address,
      beneficiaries: profile.beneficiaries || []
    });

    // 4. Update profile with hash and status
    const { error: updateError } = await supabaseAdmin
      .from('unified_profiles')
      .update({
        record_hash: recordHash,
        verification_status: 'verified',
        updated_at: new Date().toISOString()
      })
      .eq('id', profileId);

    if (updateError) throw updateError;

    // 5. Log audit event
    await AuditService.logEvent('PROFILE_VERIFIED', profileId, { hash: recordHash });

    // 6. Fetch chronological audit logs
    const auditLogs = await AuditService.getLogs(profileId);

    return NextResponse.json({
      success: true,
      data: {
        id: profile.id,
        full_name: resolvedName,
        verification_status: 'verified',
        hash_result: recordHash,
        audit_logs: auditLogs
      },
      message: "Profile verified and node audit complete."
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || "An error occurred during verification."
    }, { status: 500 });
  }
}
