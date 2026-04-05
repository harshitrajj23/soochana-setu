import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '../../../../lib/supabase';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;
    
    console.log("LOGIN BODY:", email, password);

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email and password are required." }, { status: 400 });
    }

    // Fetch user from Supabase 'users' table
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    console.log("DB USER:", user);

    if (error || !user) {
      console.log("LOGIN ERROR: User not found", email);
      return NextResponse.json({ success: false, message: "Invalid credentials." }, { status: 401 });
    }

    // Compare password with stored hash
    const valid = await bcrypt.compare(password, user.password);
    console.log("PASSWORD VALID:", valid);

    if (!valid) {
      console.log("LOGIN ERROR: Password mismatch", email);
      return NextResponse.json({ success: false, message: "Invalid credentials." }, { status: 401 });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role || "admin" }, 
      JWT_SECRET, 
      { expiresIn: '1d' }
    );

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name || user.full_name || 'Admin',
        role: user.role || 'admin',
        email: user.email
      }
    });

  } catch (error: any) {
    console.error("LOGIN EXCEPTION:", error);
    return NextResponse.json({ success: false, message: "Server error during authentication." }, { status: 500 });
  }
}
