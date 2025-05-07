
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.15.0";

// Define comprehensive CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-requested-with",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Max-Age": "86400",
  "Content-Type": "application/json"
};

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? '',
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ''
);

// Validate table name to prevent SQL injection
const isValidTableName = (name: string) => /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name);

serve(async (req) => {
  console.log(`Request received: ${req.method} ${new URL(req.url).pathname}`);

  // Handle CORS preflight requests - this is critical for browser compatibility
  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS preflight request");
    return new Response("OK", {
      status: 200,
      headers: corsHeaders
    });
  }

  try {
    if (req.method !== "POST") {
      console.log(`Method not allowed: ${req.method}`);
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: corsHeaders
      });
    }

    const rawBody = await req.text();
    console.log("📦 Raw request body:", rawBody);

    let tableName = '';
    let operation = '';

    try {
      const maybeDoubleEncoded = JSON.parse(rawBody);
      const body = typeof maybeDoubleEncoded === "string"
        ? JSON.parse(maybeDoubleEncoded)
        : maybeDoubleEncoded;

      tableName = body.tableName;
      operation = body.operation;
      console.log("✅ Parsed body:", { tableName, operation });
    } catch (err) {
      console.error("❌ Failed to parse JSON body:", rawBody, err);
      return new Response(JSON.stringify({ 
        error: "Invalid JSON format",
        details: err instanceof Error ? err.message : "Unknown parsing error"
      }), {
        status: 400,
        headers: corsHeaders
      });
    }

    if (!tableName) {
      console.log("Table name is required but was not provided");
      return new Response(JSON.stringify({ error: "Table name is required" }), {
        status: 400,
        headers: corsHeaders
      });
    }

    if (!isValidTableName(tableName)) {
      console.error("Invalid table name format:", tableName);
      return new Response(JSON.stringify({
        error: "Invalid table name. Use letters, numbers, underscores only."
      }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // Check if the table exists
    try {
      console.log(`Checking if table '${tableName}' exists`);
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);

      if (error) {
        console.error(`Error checking if table exists: ${error.message}`);
        return new Response(JSON.stringify({
          error: `Table "${tableName}" may not exist or is not accessible: ${error.message}`
        }), {
          status: 400,
          headers: corsHeaders
        });
      }
      console.log(`Table ${tableName} exists, proceeding with operation`);
    } catch (error) {
      console.error(`Error checking table existence: ${error}`);
      return new Response(JSON.stringify({
        error: `Failed to verify table "${tableName}": ${error instanceof Error ? error.message : "Unknown error"}`
      }), {
        status: 500,
        headers: corsHeaders
      });
    }

    const messages: string[] = [];

    // Set REPLICA IDENTITY to FULL
    if (!operation || operation === "replica-identity") {
      try {
        console.log(`Setting REPLICA IDENTITY FULL on table ${tableName}`);
        
        // Use direct SQL query 
        const { data, error } = await supabase.rpc(
          'execute_function', 
          { 
            function_name: 'alter_table_replica_identity',
            parameters: { table_name: tableName } 
          }
        );
        
        if (error) {
          console.error("REPLICA IDENTITY failed:", error);
          messages.push(`Warning: Could not set REPLICA IDENTITY: ${error.message}`);
        } else {
          console.log("REPLICA IDENTITY FULL set successfully");
          messages.push("REPLICA IDENTITY FULL set");
        }
      } catch (error) {
        console.error("Error setting REPLICA IDENTITY:", error);
        messages.push(`Warning: Error setting REPLICA IDENTITY: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }

    // Add table to publication
    if (!operation || operation === "add-publication") {
      try {
        console.log(`Adding table ${tableName} to publication`);
        
        // Use direct SQL query
        const { data, error } = await supabase.rpc(
          'execute_function',
          {
            function_name: 'add_table_to_publication',
            parameters: { table_name: tableName }
          }
        );
        
        if (error) {
          console.error("Failed to add table to publication:", error);
          messages.push(`Warning: Could not add to publication: ${error.message}`);
        } else {
          console.log(`Table ${tableName} added to publication successfully`);
          messages.push(`Table ${tableName} added to publication`);
        }
      } catch (error) {
        console.error("Error adding table to publication:", error);
        messages.push(`Warning: Error adding to publication: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }

    console.log("✅ Operation completed with messages:", messages);

    return new Response(JSON.stringify({ 
      success: true, 
      messages,
      status: "completed"
    }), {
      status: 200,
      headers: corsHeaders
    });

  } catch (error) {
    console.error("🔥 Unhandled error in enable-realtime:", error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
});
