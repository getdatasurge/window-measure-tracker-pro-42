
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.15.0";

// Proper CORS headers for cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Consider restricting this to your domain in production
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400", // 24 hours cache for preflight requests
};

// Create a Supabase client with the service role key
const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL") ?? '',
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? '',
);

serve(async (req) => {
  // Handle CORS preflight requests (OPTIONS)
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204, 
      headers: corsHeaders 
    });
  }
  
  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Parse the request body
    const { tableName, operation } = await req.json();
    
    if (!tableName) {
      return new Response(
        JSON.stringify({ error: 'Table name is required' }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    let successMessage = '';
    
    // If no specific operation provided, do both operations
    if (!operation) {
      try {
        // First, set REPLICA IDENTITY FULL
        await supabaseClient.rpc('execute_sql', {
          sql: `ALTER TABLE public.${tableName} REPLICA IDENTITY FULL;`
        });
        
        // Second, add table to publication
        await supabaseClient.rpc('execute_sql', {
          sql: `ALTER PUBLICATION supabase_realtime ADD TABLE public.${tableName};`
        });
        
        successMessage = `Real-time fully enabled on ${tableName}`;
      } catch (err) {
        throw new Error(`Failed to enable realtime: ${err.message}`);
      }
    } 
    // Only set REPLICA IDENTITY FULL
    else if (operation === 'replica-identity') {
      try {
        await supabaseClient.rpc('execute_sql', {
          sql: `ALTER TABLE public.${tableName} REPLICA IDENTITY FULL;`
        });
        successMessage = `REPLICA IDENTITY FULL set on ${tableName}`;
      } catch (err) {
        throw new Error(`Failed to set REPLICA IDENTITY: ${err.message}`);
      }
    } 
    // Only add to publication
    else if (operation === 'add-publication') {
      try {
        await supabaseClient.rpc('execute_sql', {
          sql: `ALTER PUBLICATION supabase_realtime ADD TABLE public.${tableName};`
        });
        successMessage = `${tableName} added to supabase_realtime publication`;
      } catch (err) {
        throw new Error(`Failed to update publication: ${err.message}`);
      }
    } else {
      throw new Error(`Unknown operation: ${operation}`);
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: successMessage
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred',
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
