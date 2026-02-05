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
    let body: { bookingId?: string; status?: string } | null = null;
    if (req.method === "POST") {
      try {
        body = await req.json();
      } catch {
        body = {};
      }
    }

    // Determine action: if body has bookingId and status, it's an update
    const isUpdateAction = body?.bookingId && body?.status;

    // Handle fetch bookings (GET or POST without update params)
    if (req.method === "GET" || (req.method === "POST" && !isUpdateAction)) {
      // Fetch all bookings with workspace info
      const { data: bookingsData, error: bookingsError } = await supabaseAdmin
        .from("bookings")
        .select(`*, workspace:workspaces(name, location)`)
        .order("created_at", { ascending: false });

      if (bookingsError) {
        console.error("Error fetching bookings:", bookingsError);
        return new Response(JSON.stringify({ error: bookingsError.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Fetch profiles separately and join manually
      const userIds = [...new Set(bookingsData?.map((b) => b.user_id) || [])];
      const { data: profilesData } = await supabaseAdmin
        .from("profiles")
        .select("user_id, name, email, phone")
        .in("user_id", userIds);

      const profilesMap = new Map(
        profilesData?.map((p) => [p.user_id, p]) || []
      );

      const data = bookingsData?.map((booking) => ({
        ...booking,
        profile: profilesMap.get(booking.user_id) || null,
      }));

      console.log(`Fetched ${data?.length || 0} bookings`);
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Handle update booking status (POST with bookingId and status)
    if (req.method === "POST" && isUpdateAction) {
      const { bookingId, status } = body!;

      if (!bookingId || !status) {
        return new Response(
          JSON.stringify({ error: "bookingId and status are required" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const { error } = await supabaseAdmin
        .from("bookings")
        .update({ status })
        .eq("id", bookingId);

      if (error) {
        console.error("Error updating booking:", error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      console.log(`Updated booking ${bookingId} to status: ${status}`);
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
