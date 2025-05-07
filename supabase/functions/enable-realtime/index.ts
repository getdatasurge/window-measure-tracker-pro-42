
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.15.0";

// Create a Supabase client with the service role key
const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL") ?? '',
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? '',
);

serve(async (req) => {
  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // Parse the request body
    const { tableName } = await req.json();
    
    if (!tableName) {
      return new Response(
        JSON.stringify({ error: 'Table name is required' }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // Execute SQL to enable REPLICA IDENTITY FULL on the table
    const { data, error } = await supabaseClient.rpc('execute_sql', {
      sql: `ALTER TABLE public.${tableName} REPLICA IDENTITY FULL;`
    });
    
    if (error) {
      throw error;
    }
    
    // Enable the table in the supabase_realtime publication
    const { data: pubData, error: pubError } = await supabaseClient.rpc('execute_sql', {
      sql: `ALTER PUBLICATION supabase_realtime ADD TABLE public.${tableName};`
    });
    
    if (pubError) {
      throw pubError;
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Real-time enabled on ${tableName}` 
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred',
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
