 import { useState, useEffect } from "react";
 import { supabase } from "@/integrations/supabase/client";
 
 interface ServiceOptionPriceData {
   [workspaceId: string]: {
     minPrice: number;
     priceUnit: string;
     totalSlots: number;
   };
 }
 
 export const useServiceOptionsPrice = (workspaceIds: string[]) => {
   const [priceData, setPriceData] = useState<ServiceOptionPriceData>({});
   const [loading, setLoading] = useState(true);
 
   useEffect(() => {
     if (workspaceIds.length === 0) {
       setLoading(false);
       return;
     }
 
     const fetchPrices = async () => {
       const { data: options } = await supabase
         .from("workspace_service_options")
         .select("workspace_id, price, price_unit, capacity")
         .in("workspace_id", workspaceIds)
         .eq("is_active", true);
 
       if (!options) {
         setLoading(false);
         return;
       }
 
       const grouped: ServiceOptionPriceData = {};
 
       workspaceIds.forEach((wsId) => {
         const wsOptions = options.filter((o) => o.workspace_id === wsId);
         if (wsOptions.length > 0) {
           const minOption = wsOptions.reduce((min, o) => (o.price < min.price ? o : min));
           
           // Calculate total slots from capacity strings (e.g., "1-5 Seater" -> 5)
           const totalSlots = wsOptions.reduce((sum, o) => {
             if (!o.capacity) return sum;
             const match = o.capacity.match(/(\d+)/g);
             if (match && match.length > 0) {
               return sum + parseInt(match[match.length - 1]);
             }
             return sum;
           }, 0);
 
           grouped[wsId] = {
             minPrice: minOption.price,
             priceUnit: minOption.price_unit,
             totalSlots,
           };
         }
       });
 
       setPriceData(grouped);
       setLoading(false);
     };
 
     fetchPrices();
   }, [workspaceIds.join(",")]);
 
   return { priceData, loading };
 };
 
 // Hook for single workspace
 export const useWorkspaceServiceOptionsPrice = (workspaceId: string | undefined) => {
   const [minPrice, setMinPrice] = useState<number | null>(null);
   const [priceUnit, setPriceUnit] = useState<string>("month");
   const [totalSlots, setTotalSlots] = useState<number>(0);
   const [loading, setLoading] = useState(true);
 
   useEffect(() => {
     if (!workspaceId) {
       setLoading(false);
       return;
     }
 
     const fetchPrice = async () => {
       const { data: options } = await supabase
         .from("workspace_service_options")
         .select("price, price_unit, capacity")
         .eq("workspace_id", workspaceId)
         .eq("is_active", true)
         .order("price", { ascending: true });
 
       if (options && options.length > 0) {
         setMinPrice(options[0].price);
         setPriceUnit(options[0].price_unit);
         
         // Calculate total slots
         const slots = options.reduce((sum, o) => {
           if (!o.capacity) return sum;
           const match = o.capacity.match(/(\d+)/g);
           if (match && match.length > 0) {
             return sum + parseInt(match[match.length - 1]);
           }
           return sum;
         }, 0);
         setTotalSlots(slots);
       }
       setLoading(false);
     };
 
     fetchPrice();
   }, [workspaceId]);
 
   return { minPrice, priceUnit, totalSlots, loading };
 };