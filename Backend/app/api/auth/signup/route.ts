import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '../../../../lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, governmentId } = await req.json();

    console.log("SIGNUP BODY:", { name, email, governmentId });

    if (!name || !email || !password || !governmentId) {
      return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);

    const { data, error } = await supabaseAdmin.from("users").insert([
      {
        name,
        email,
        password: hashed,
        government_id: governmentId,
        role: 'admin'
      }
    ]).select();

    if (error) {
      console.error("SUPABASE ERROR:", error);
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("SIGNUP EXCEPTION:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
