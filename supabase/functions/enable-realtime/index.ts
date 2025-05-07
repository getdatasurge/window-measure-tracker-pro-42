import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.15.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? '',
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ''
);

// ✅ Regex for valid Postgres identifiers
const isValidTableName = (name: string) => /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const rawBody = await req.text();
    let tableName = '';
    let operation = '';

    try {
      const body = JSON.parse(rawBody);
      tableName = body.tableName;
      operation = body.operation;
    } catch (err) {
      console.error("Invalid JSON body:", rawBody);
      return new Response(JSON.stringify({ error: "Invalid JSON format" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    if (!tableName) {
      return new Response(JSON.stringify({ error: "Table name is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    if (!isValidTableName(tableName)) {
      console.error("Invalid table name format:", tableName);
      return new Response(JSON.stringify({ error: "Invalid table name. Use letters, numbers, underscores only." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // ✅ Unquoted for lowercase public table names
    const checkSQL = `SELECT to_regclass('public.${tableName}') IS NOT N_
