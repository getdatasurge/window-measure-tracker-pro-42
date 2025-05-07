import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.15.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL") ?? '',
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ''
);

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

    const { tableName, operation } = await req.json();

    if (!tableName) {
      return new Response(JSON.stringify({ error: "Table name is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const messages: string[] = [];

    if (!operation || operation === "replica-identity") {
      await supabaseClient.rpc("execute_sql", {
        sql: `ALTER TABLE public.${tableName} REPLICA IDENTITY FULL;`
      });
      messages.push("REPLICA IDENTITY FULL set");
    }

    if (!operation || operation === "add-publication") {
      const { data, error } = await supabaseClient
        .from("pg_publication_tables")
        .select("*")
        .eq("pubname", "supabase_realtime")
        .eq("schemaname", "public")
        .eq("tablename", tableName);

      if (error) throw new Error(`Failed to check publication: ${error.message}`);

      if (!data
