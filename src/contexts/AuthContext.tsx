import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string, name: string, phone: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  verifyOtp: (email: string, otp: string, type: "verification" | "password_reset") => Promise<{ error: string | null }>;
  sendOtp: (email: string, type: "verification" | "password_reset") => Promise<{ error: string | null }>;
  resetPassword: (email: string, newPassword: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingOtpVerification, setPendingOtpVerification] = useState<{email: string; password: string; name: string; phone: string} | null>(null);

  useEffect(() => {
    // Set up auth state listener BEFORE getting session
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string, phone: string) => {
    // Store credentials for after OTP verification
    setPendingOtpVerification({ email, password, name, phone });
    return { error: null };
  };

  const sendOtp = async (email: string, type: "verification" | "password_reset") => {
    try {
      const { data, error } = await supabase.functions.invoke("send-otp", {
        body: { email, type }
      });

      if (error) {
        console.error("Error sending OTP:", error);
        return { error: error.message || "Failed to send OTP" };
      }

      if (data?.error) {
        return { error: data.error };
      }

      console.log(`OTP sent to ${email} for ${type}`);
      return { error: null };
    } catch (err: any) {
      console.error("Error in sendOtp:", err);
      return { error: err.message || "Failed to send OTP" };
    }
  };

  const verifyOtp = async (email: string, otp: string, type: "verification" | "password_reset") => {
    try {
      const { data, error } = await supabase.functions.invoke("verify-otp", {
        body: { email, code: otp, type }
      });

      if (error) {
        console.error("Error verifying OTP:", error);
        return { error: error.message || "Failed to verify OTP" };
      }

      if (data?.error) {
        return { error: data.error };
      }

      // If this is a signup verification, complete the signup
      if (type === "verification" && pendingOtpVerification) {
        const { email: regEmail, password, name, phone } = pendingOtpVerification;

        const { error: signUpError } = await supabase.auth.signUp({
          email: regEmail,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              name,
              phone
            }
          }
        });

        if (signUpError) {
          return { error: signUpError.message };
        }

        setPendingOtpVerification(null);
      }

      return { error: null };
    } catch (err: any) {
      console.error("Error in verifyOtp:", err);
      return { error: err.message || "Failed to verify OTP" };
    }
  };

  const resetPassword = async (email: string, newPassword: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("reset-password", {
        body: { email, newPassword }
      });

      if (error) {
        console.error("Error resetting password:", error);
        return { error: error.message || "Failed to reset password" };
      }

      if (data?.error) {
        return { error: data.error };
      }

      return { error: null };
    } catch (err: any) {
      console.error("Error in resetPassword:", err);
      return { error: err.message || "Failed to reset password" };
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      isLoading, 
      signUp, 
      signIn, 
      signOut, 
      verifyOtp,
      sendOtp,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
