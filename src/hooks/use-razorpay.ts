 import { useState, useCallback } from "react";
 import { supabase } from "@/integrations/supabase/client";
 import { toast } from "sonner";
 
 interface RazorpayOptions {
   amount: number;
   serviceName: string;
   workspaceName: string;
   workspaceId: string;
   userEmail?: string;
   userName?: string;
   userPhone?: string;
   onSuccess?: (paymentId: string, orderId: string) => void;
   onFailure?: (error: string) => void;
 }
 
 declare global {
   interface Window {
     Razorpay: any;
   }
 }
 
 export const useRazorpay = () => {
   const [isLoading, setIsLoading] = useState(false);
 
   const loadRazorpayScript = useCallback((): Promise<boolean> => {
     return new Promise((resolve) => {
       if (window.Razorpay) {
         resolve(true);
         return;
       }
 
       const script = document.createElement("script");
       script.src = "https://checkout.razorpay.com/v1/checkout.js";
       script.onload = () => resolve(true);
       script.onerror = () => resolve(false);
       document.body.appendChild(script);
     });
   }, []);
 
   const initiatePayment = useCallback(
     async ({
       amount,
       serviceName,
       workspaceName,
       workspaceId,
       userEmail,
       userName,
       userPhone,
       onSuccess,
       onFailure,
     }: RazorpayOptions) => {
       setIsLoading(true);
 
       try {
         // Load Razorpay script
         const scriptLoaded = await loadRazorpayScript();
         if (!scriptLoaded) {
           throw new Error("Failed to load payment gateway");
         }
 
         // Create order via edge function
         const { data, error } = await supabase.functions.invoke("create-razorpay-order", {
           body: {
             amount,
             currency: "INR",
             receipt: `${workspaceId}_${Date.now()}`,
             notes: {
               workspace_id: workspaceId,
               workspace_name: workspaceName,
               service_name: serviceName,
             },
           },
         });
 
         if (error || !data) {
           console.error("Order creation error:", error);
           throw new Error(error?.message || "Failed to create order");
         }
 
         const { order_id, key_id } = data;
 
         // Configure Razorpay options
         const options = {
           key: key_id,
           amount: amount * 100, // in paise
           currency: "INR",
           name: workspaceName,
           description: serviceName,
           order_id: order_id,
           prefill: {
             name: userName || "",
             email: userEmail || "",
             contact: userPhone || "",
           },
           theme: {
             color: "#000000",
           },
           handler: function (response: any) {
             console.log("Payment successful:", response);
             toast.success("Payment successful!");
             onSuccess?.(response.razorpay_payment_id, response.razorpay_order_id);
           },
           modal: {
             ondismiss: function () {
               console.log("Payment modal closed");
               setIsLoading(false);
             },
           },
         };
 
         const razorpay = new window.Razorpay(options);
         
         razorpay.on("payment.failed", function (response: any) {
           console.error("Payment failed:", response.error);
           toast.error(response.error.description || "Payment failed");
           onFailure?.(response.error.description);
         });
 
         razorpay.open();
       } catch (error: any) {
         console.error("Payment initiation error:", error);
         toast.error(error.message || "Failed to initiate payment");
         onFailure?.(error.message);
       } finally {
         setIsLoading(false);
       }
     },
     [loadRazorpayScript]
   );
 
   return { initiatePayment, isLoading };
 };