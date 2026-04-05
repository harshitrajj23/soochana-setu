import { supabaseAdmin } from '../lib/supabase';

export class AuditService {
  /**
   * Logs a lifecycle event for a unified profile or system action.
   * This audit trail is ready for future on-chain indexing.
   */
  static async logEvent(
    eventType: 'PROFILE_VERIFIED' | 'PROFILE_MODIFIED' | 'FRAUD_FLAG_ADDED' | 'EXCLUSION_DETECTED',
    profileId: string | null = null,
    details: any = {}
  ): Promise<void> {
    const { error } = await supabaseAdmin
      .from('audit_logs')
      .insert({
        profile_id: profileId,
        event_type: eventType,
        details,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error(`Failed to log audit event ${eventType}:`, error.message);
    }
  }
}
