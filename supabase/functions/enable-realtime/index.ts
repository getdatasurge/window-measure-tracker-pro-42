import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.15.0";

// Define CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? '',
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ''
);

// Validate table name to prevent SQL injection
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

    // Check if the table exists
    const checkSQL = `SELECT to_regclass('public.${tableName}') IS NOT NULL AS exists`;

    const { data: existsData, error: existsError } = await supabase.rpc("execute_sql", {
      sql: checkSQL
    });

    if (existsError) {
      console.error("Failed to check if table exists:", existsError);
      throw existsError;
    }

    if (!Array.isArray(existsData) || !existsData[0]?.exists) {
      return new Response(JSON.stringify({ error: `Table "${tableName}" does not exist` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const messages: string[] = [];

    // Set REPLICA IDENTITY to FULL
    if (!operation || operation === "replica-identity") {
      const { error } = await supabase.rpc("execute_sql", {
        sql: `ALTER TABLE public."${tableName}" REPLICA IDENTITY FULL;`
      });
      if (error) {
        console.error("REPLICA IDENTITY failed:", error);
        throw error;
      }
      messages.push("REPLICA IDENTITY FULL set");
    }

    // Add table to publication if not already present
    if (!operation || operation === "add-publication") {
      const { data, error } = await supabase
        .from("pg_publication_tables")
        .select("*")
        .eq("pubname", "supabase_realtime")
        .eq("schemaname", "public")
        .eq("tablename", tableName);

      if (error) {
        console.error("Error checking publication:", error);
        throw new Error(`Failed to check publication: ${error.message}`);
      }

      if (!data || data.length === 0) {
        const { error: pubError } = await supabase.rpc("execute_sql", {
          sql: `ALTER PUBLICATION supabase_realtime ADD TABLE public."${tableName}";`
        });
        if (pubError) {
          console.error("Failed to add table to publication:", pubError);
          throw pubError;
        }
        messages.push(`Table ${tableName} added to publication`);
      } else {
        messages.push(`Table ${tableName} already in publication`);
      }
    }

    console.log("Operation successful:", messages);

    return new Response(JSON.stringify({ success: true, messages }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Unhandled error in enable-realtime:", error);
    return new Response(JSON.stringify({
      error: error?.message ?? "Unknown error"
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
