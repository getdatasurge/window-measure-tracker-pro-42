
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Get environment variables
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Only allow POST requests
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Initialize Supabase admin client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    console.log("Starting backfill process...");
    
    // Get all users from auth.users table
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      throw usersError;
    }
    
    console.log(`Found ${users.users.length} users in auth.users`);
    
    // Process users and insert missing profiles
    const results = {
      total: users.users.length,
      processed: 0,
      created: 0,
      skipped: 0,
      errors: 0,
      details: [],
    };
    
    for (const user of users.users) {
      try {
        results.processed++;
        
        // First check if user already has a profile
        const { data: existingProfile, error: profileError } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .maybeSingle();
        
        if (profileError) {
          throw profileError;
        }
        
        // Skip if profile already exists
        if (existingProfile) {
          console.log(`Profile already exists for user: ${user.id}`);
          results.skipped++;
          continue;
        }
        
        // Extract metadata for full name
        const metadata = user.user_metadata || {};
        
        // Try to get or construct full name from available data
        let fullName = metadata.full_name || metadata.name;
        
        if (!fullName && (metadata.first_name || metadata.last_name)) {
          fullName = `${metadata.first_name || ''} ${metadata.last_name || ''}`.trim();
        }
        
        // Insert new profile
        const { error: insertError } = await supabase.from("profiles").insert({
          id: user.id,
          full_name: fullName || null,
          email: user.email,
          role: null
        });
        
        if (insertError) {
          throw insertError;
        }
        
        console.log(`Created profile for user: ${user.id}`);
        results.created++;
        results.details.push({ id: user.id, email: user.email, status: "created" });
        
      } catch (error) {
        console.error(`Error processing user ${user.id}:`, error);
        results.errors++;
        results.details.push({ id: user.id, email: user.email, status: "error", message: error.message });
      }
    }
    
    console.log("Backfill process completed");
    console.log(`Created ${results.created} profiles`);
    console.log(`Skipped ${results.skipped} existing profiles`);
    console.log(`Encountered ${results.errors} errors`);
    
    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
    
  } catch (error) {
    console.error("Error in backfill-profiles function:", error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
