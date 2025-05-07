
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

// Define CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    })
  }
  
  try {
    // Log the request for debugging
    console.log(`Request received: ${req.method} ${new URL(req.url).pathname}`)
    
    // Parse the request body
    const body = await req.json()
    console.log(`📦 Raw request body: ${JSON.stringify(body)}`)
    
    // Get the table name and operation from the request body
    const { tableName, operation } = body
    console.log(`✅ Parsed body: ${JSON.stringify({ tableName, operation })}`)
    
    if (!tableName) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameter: tableName' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
    
    // Create a Supabase client with the service role key
    const supabaseClient = createClient(
      // Get these from environment variables
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )
    
    // Check if the table exists
    console.log(`Checking if table '${tableName}' exists`)
    const { data: tableExists, error: tableCheckError } = await supabaseClient
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public')
      .eq('tablename', tableName)
      .single()
      
    if (tableCheckError) {
      console.error(`Error checking if table exists: ${JSON.stringify(tableCheckError)}`)
      return new Response(
        JSON.stringify({ 
          error: `Failed to check if table exists: ${tableCheckError.message}` 
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
    
    if (!tableExists) {
      console.error(`Table ${tableName} does not exist`)
      return new Response(
        JSON.stringify({ error: `Table ${tableName} does not exist` }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
    
    console.log(`Table ${tableName} exists, proceeding with operation`)
    
    // Set up collection for warning messages
    const warnings = []
    
    try {
      // Set REPLICA IDENTITY FULL on the table
      console.log(`Setting REPLICA IDENTITY FULL on table ${tableName}`)
      
      // Execute SQL to set REPLICA IDENTITY
      const { error: replicaError } = await supabaseClient.rpc(
        'execute_sql', 
        { 
          sql_query: `ALTER TABLE "${tableName}" REPLICA IDENTITY FULL;`
        }
      )
      
      if (replicaError) {
        console.error(`REPLICA IDENTITY failed: ${JSON.stringify(replicaError)}`)
        warnings.push(`Warning: Could not set REPLICA IDENTITY: ${replicaError.message}`)
      }
    } catch (replicaErr) {
      console.error(`Exception in REPLICA IDENTITY: ${replicaErr}`)
      warnings.push(`Warning: Exception in REPLICA IDENTITY: ${replicaErr.message || replicaErr}`)
    }
    
    try {
      // Add the table to the supabase_realtime publication
      console.log(`Adding table ${tableName} to publication`)
      
      // Execute SQL to add table to publication
      const { error: pubError } = await supabaseClient.rpc(
        'execute_sql',
        {
          sql_query: `
            ALTER PUBLICATION supabase_realtime ADD TABLE "${tableName}";
          `
        }
      )
      
      if (pubError) {
        console.error(`Failed to add table to publication: ${JSON.stringify(pubError)}`)
        warnings.push(`Warning: Could not add to publication: ${pubError.message}`)
      }
    } catch (pubErr) {
      console.error(`Exception adding to publication: ${pubErr}`)
      warnings.push(`Warning: Exception adding to publication: ${pubErr.message || pubErr}`)
    }
    
    // Log success with any warnings
    console.log(`✅ Operation completed with messages: ${JSON.stringify(warnings)}`)
    
    // Return success response with any warnings
    return new Response(
      JSON.stringify({
        success: true,
        tableName,
        warnings: warnings.length > 0 ? warnings : undefined
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
    
  } catch (error) {
    // Log and return any unexpected errors
    console.error(`Unexpected error: ${error}`)
    
    return new Response(
      JSON.stringify({ error: `Unexpected error: ${error.message || 'Unknown error'}` }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
