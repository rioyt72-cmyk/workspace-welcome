 import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
 
 const corsHeaders = {
   "Access-Control-Allow-Origin": "*",
   "Access-Control-Allow-Headers":
     "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
 };
 
 serve(async (req) => {
   // Handle CORS preflight requests
   if (req.method === "OPTIONS") {
     return new Response("ok", { headers: corsHeaders });
   }
 
   try {
     const RAZORPAY_KEY_ID = Deno.env.get("RAZORPAY_KEY_ID");
     const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET");
 
     if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
       console.error("Razorpay credentials not configured");
       return new Response(
         JSON.stringify({ error: "Payment gateway not configured" }),
         { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
 
     const { amount, currency = "INR", receipt, notes } = await req.json();
 
     if (!amount || amount <= 0) {
       return new Response(
         JSON.stringify({ error: "Invalid amount" }),
         { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
 
     // Convert amount to paise (Razorpay expects amount in smallest currency unit)
     const amountInPaise = Math.round(amount * 100);
 
    // Generate a short receipt (max 40 chars) - use last 8 chars of receipt + timestamp
    const shortReceipt = receipt 
      ? `${receipt.slice(-8)}_${Date.now().toString(36)}`.slice(0, 40)
      : `order_${Date.now().toString(36)}`;

    console.log("Creating Razorpay order:", { amountInPaise, currency, receipt: shortReceipt, notes });
 
     // Create order using Razorpay API
     const auth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);
     
     const response = await fetch("https://api.razorpay.com/v1/orders", {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
         Authorization: `Basic ${auth}`,
       },
       body: JSON.stringify({
         amount: amountInPaise,
         currency,
        receipt: shortReceipt,
         notes: notes || {},
       }),
     });
 
     const orderData = await response.json();
 
     if (!response.ok) {
       console.error("Razorpay order creation failed:", orderData);
       return new Response(
         JSON.stringify({ error: "Failed to create order", details: orderData }),
         { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
 
     console.log("Razorpay order created successfully:", orderData.id);
 
     return new Response(
       JSON.stringify({
         order_id: orderData.id,
         amount: orderData.amount,
         currency: orderData.currency,
         key_id: RAZORPAY_KEY_ID,
       }),
       { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
     );
   } catch (error) {
     console.error("Error creating Razorpay order:", error);
     return new Response(
       JSON.stringify({ error: "Internal server error" }),
       { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
     );
   }
 });