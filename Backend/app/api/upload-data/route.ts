import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase';
import { parse } from 'csv-parse/sync';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type');
    let dataToInsert: any[] = [];

    if (contentType?.includes('application/json')) {
      const body = await req.json();
      dataToInsert = Array.isArray(body) ? body : [body];
    } else if (contentType?.includes('text/csv')) {
      const text = await req.text();
      const records = parse(text, {
        columns: true,
        skip_empty_lines: true
      });
      dataToInsert = records;
    } else {
      return NextResponse.json({
        success: false,
        message: "Unsupported content type. Use application/json or text/csv."
      }, { status: 400 });
    }

    const { data: inserted, error } = await supabaseAdmin
      .from('beneficiaries')
      .insert(dataToInsert.map(r => ({
        full_name: r.full_name,
        address: r.address,
        id_number: r.id_number,
        income: r.income,
        scheme_name: r.scheme_name,
        raw_data: r
      })))
      .select();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: inserted,
      message: `${inserted?.length} records uploaded successfully.`
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || "An error occurred during data upload."
    }, { status: 500 });
  }
}
