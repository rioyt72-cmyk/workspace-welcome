import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Create admin client with service role (bypasses RLS)
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    // Parse body for POST requests
    let body: { enquiryId?: string; status?: string; action?: string; data?: Record<string, unknown> } | null = null;
    if (req.method === "POST") {
      try {
        body = await req.json();
      } catch {
        body = {};
      }
    }

    // Determine action
    const isUpdateStatus = body?.enquiryId && body?.status;
    const isDelete = body?.action === "delete" && body?.enquiryId;
    const isUpdate = body?.action === "update" && body?.enquiryId && body?.data;

    // Handle fetch enquiries (GET or POST without action params)
    if (req.method === "GET" || (req.method === "POST" && !isUpdateStatus && !isDelete && !isUpdate)) {
      const { data, error } = await supabaseAdmin
        .from("enquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching enquiries:", error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      console.log(`Fetched ${data?.length || 0} enquiries`);
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Handle update status
    if (req.method === "POST" && isUpdateStatus) {
      const { enquiryId, status } = body!;

      const { error } = await supabaseAdmin
        .from("enquiries")
        .update({ status })
        .eq("id", enquiryId);

      if (error) {
        console.error("Error updating enquiry status:", error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      console.log(`Updated enquiry ${enquiryId} to status: ${status}`);
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Handle delete
    if (req.method === "POST" && isDelete) {
      const { enquiryId } = body!;

      const { error } = await supabaseAdmin
        .from("enquiries")
        .delete()
        .eq("id", enquiryId);

      if (error) {
        console.error("Error deleting enquiry:", error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      console.log(`Deleted enquiry ${enquiryId}`);
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Handle full update
    if (req.method === "POST" && isUpdate) {
      const { enquiryId, data } = body!;

      const { error } = await supabaseAdmin
        .from("enquiries")
        .update(data)
        .eq("id", enquiryId);

      if (error) {
        console.error("Error updating enquiry:", error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      console.log(`Updated enquiry ${enquiryId}`);
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
