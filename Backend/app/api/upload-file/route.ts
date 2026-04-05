import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const beneficiaryId = formData.get('beneficiary_id') as string;

    if (!file || !beneficiaryId) {
      return NextResponse.json({
        success: false,
        message: "File and beneficiary_id are required."
      }, { status: 400 });
    }

    const { data: uploadData, error: uploadError } = await supabaseAdmin
      .storage
      .from('beneficiary-uploads')
      .upload(`${beneficiaryId}/${file.name}`, file);

    if (uploadError) throw uploadError;

    // Get public URL (assuming public bucket)
    const { data: { publicUrl } } = supabaseAdmin
        .storage
        .from('beneficiary-uploads')
        .getPublicUrl(uploadData.path);

    const { data: inserted, error: dbError } = await supabaseAdmin
      .from('uploads')
      .insert({
        beneficiary_id: beneficiaryId,
        file_url: publicUrl,
        file_type: file.type
      })
      .select()
      .single();

    if (dbError) throw dbError;

    return NextResponse.json({
      success: true,
      data: inserted,
      message: "File uploaded successfully."
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || "An error occurred during file upload."
    }, { status: 500 });
  }
}
