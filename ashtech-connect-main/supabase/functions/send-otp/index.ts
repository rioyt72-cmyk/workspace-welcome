import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface OTPRequest {
  email: string;
  type: "verification" | "password_reset";
}

const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const handler = async (req: Request): Promise<Response> => {
  console.log("send-otp function called");

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, type }: OTPRequest = await req.json();
    console.log(`Processing OTP request for email: ${email}, type: ${type}`);

    // Validate inputs
    if (!email || !type) {
      return new Response(
        JSON.stringify({ error: "Email and type are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with service role
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Invalidate any existing unused OTPs for this email and type
    await supabaseAdmin
      .from("otp_codes")
      .update({ used: true })
      .eq("email", email)
      .eq("type", type)
      .eq("used", false);

    // Store OTP in database
    const { error: insertError } = await supabaseAdmin
      .from("otp_codes")
      .insert({
        email,
        code: otp,
        type,
        expires_at: expiresAt.toISOString(),
      });

    if (insertError) {
      console.error("Error storing OTP:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to generate OTP" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send email via SMTP
    const smtpHost = Deno.env.get("SMTP_HOST")!;
    const smtpPort = parseInt(Deno.env.get("SMTP_PORT") || "587");
    const smtpUser = Deno.env.get("SMTP_USER")!;
    const smtpPass = Deno.env.get("SMTP_PASS")!;
    const smtpFromEmail = Deno.env.get("SMTP_FROM_EMAIL")!;

    console.log(`Connecting to SMTP: ${smtpHost}:${smtpPort}`);

    const client = new SMTPClient({
      connection: {
        hostname: smtpHost,
        port: smtpPort,
        tls: smtpPort === 465,
        auth: {
          username: smtpUser,
          password: smtpPass,
        },
      },
    });

    const subject = type === "verification" 
      ? "Verify Your Email - Aztech Coworks" 
      : "Reset Your Password - Aztech Coworks";

    const htmlContent = type === "verification"
      ? `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            <div style="background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%); padding: 40px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Aztech Coworks</h1>
            </div>
            <div style="padding: 40px;">
              <h2 style="color: #1a1a1a; margin: 0 0 20px;">Verify Your Email</h2>
              <p style="color: #666; font-size: 16px; line-height: 1.6;">Thank you for signing up! Please use the following OTP to verify your email address:</p>
              <div style="background: #f8fafc; border: 2px dashed #2563eb; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
                <span style="font-size: 36px; font-weight: bold; color: #2563eb; letter-spacing: 8px;">${otp}</span>
              </div>
              <p style="color: #666; font-size: 14px;">This code will expire in <strong>10 minutes</strong>.</p>
              <p style="color: #999; font-size: 12px; margin-top: 30px;">If you didn't request this verification, please ignore this email.</p>
            </div>
          </div>
        </body>
        </html>
      `
      : `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            <div style="background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%); padding: 40px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Aztech Coworks</h1>
            </div>
            <div style="padding: 40px;">
              <h2 style="color: #1a1a1a; margin: 0 0 20px;">Reset Your Password</h2>
              <p style="color: #666; font-size: 16px; line-height: 1.6;">We received a request to reset your password. Use the following OTP to proceed:</p>
              <div style="background: #f8fafc; border: 2px dashed #2563eb; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
                <span style="font-size: 36px; font-weight: bold; color: #2563eb; letter-spacing: 8px;">${otp}</span>
              </div>
              <p style="color: #666; font-size: 14px;">This code will expire in <strong>10 minutes</strong>.</p>
              <p style="color: #999; font-size: 12px; margin-top: 30px;">If you didn't request a password reset, please ignore this email.</p>
            </div>
          </div>
        </body>
        </html>
      `;

    await client.send({
      from: smtpFromEmail,
      to: email,
      subject,
      html: htmlContent,
    });

    await client.close();

    console.log(`OTP sent successfully to ${email}`);

    return new Response(
      JSON.stringify({ success: true, message: "OTP sent successfully" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in send-otp function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to send OTP" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
