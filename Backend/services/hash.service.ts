import crypto from 'crypto';

export class HashService {
  /**
   * Generates a SHA256 hash for a unified profile and its linked scheme data.
   * This hash acts as a tamper-proof signature that can be stored on-chain later.
   */
  static generateHash(profileData: {
    full_name: string;
    address: string;
    beneficiaries: any[];
  }): string {
    // 1. Sort beneficiaries by ID to ensure deterministic hashing
    const sortedBeneficiaries = [...profileData.beneficiaries].sort((a, b) => 
      (a.id || '').localeCompare(b.id || '')
    );

    // 2. Prepare data for hashing (deterministic structure)
    const payload = {
      full_name: profileData.full_name,
      address: profileData.address,
      beneficiaries: sortedBeneficiaries.map(b => ({
        id_number: b.id_number,
        scheme_name: b.scheme_name,
        income: b.income
      }))
    };

    // 3. Create SHA256 hash string
    return crypto
      .createHash('sha256')
      .update(JSON.stringify(payload))
      .digest('hex');
  }
}
