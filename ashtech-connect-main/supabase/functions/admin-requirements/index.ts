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
    let body: { requirementId?: string; status?: string; action?: string; data?: Record<string, unknown> } | null = null;
    if (req.method === "POST") {
      try {
        body = await req.json();
      } catch {
        body = {};
      }
    }

    // Determine action
    const isUpdateStatus = body?.requirementId && body?.status;
    const isDelete = body?.action === "delete" && body?.requirementId;
    const isUpdate = body?.action === "update" && body?.requirementId && body?.data;

    // Handle fetch requirements (GET or POST without action params)
    if (req.method === "GET" || (req.method === "POST" && !isUpdateStatus && !isDelete && !isUpdate)) {
      const { data, error } = await supabaseAdmin
        .from("requirements")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching requirements:", error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      console.log(`Fetched ${data?.length || 0} requirements`);
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Handle update status
    if (req.method === "POST" && isUpdateStatus) {
      const { requirementId, status } = body!;

      const { error } = await supabaseAdmin
        .from("requirements")
        .update({ status })
        .eq("id", requirementId);

      if (error) {
        console.error("Error updating requirement status:", error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      console.log(`Updated requirement ${requirementId} to status: ${status}`);
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Handle delete
    if (req.method === "POST" && isDelete) {
      const { requirementId } = body!;

      const { error } = await supabaseAdmin
        .from("requirements")
        .delete()
        .eq("id", requirementId);

      if (error) {
        console.error("Error deleting requirement:", error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      console.log(`Deleted requirement ${requirementId}`);
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Handle full update
    if (req.method === "POST" && isUpdate) {
      const { requirementId, data } = body!;

      const { error } = await supabaseAdmin
        .from("requirements")
        .update(data)
        .eq("id", requirementId);

      if (error) {
        console.error("Error updating requirement:", error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      console.log(`Updated requirement ${requirementId}`);
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
