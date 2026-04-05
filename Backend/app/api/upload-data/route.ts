import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase';

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
    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400, headers: corsHeaders });
    }

    // STEP 3: Final Upload Code with Hardcoded CORRECT Bucket
    const fileName = `files/${Date.now()}-${file.name}`;

    const { data, error } = await supabaseAdmin.storage
      .from("beneficiery-docs")
      .upload(fileName, file);

    if (error) {
      console.error("UPLOAD ERROR:", error.message);
      return NextResponse.json({ message: error.message }, { status: 500, headers: corsHeaders });
    }

    return NextResponse.json({
      success: true,
      path: data.path,
    }, { headers: corsHeaders });

  } catch (err: any) {
    console.error("UPLOAD EXCEPTION:", err.message);
    return NextResponse.json({ message: "Upload failed" }, { status: 500, headers: corsHeaders });
  }
}
