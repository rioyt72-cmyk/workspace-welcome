import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSiteData } from "@/contexts/SiteDataContext";

export const MobileFAQ = () => {
  const { data } = useSiteData();

  return (
    <section className="px-4 py-6 pb-24">
      <h2 className="text-lg font-bold text-foreground mb-4">Frequently Asked Questions</h2>

      <Accordion type="single" collapsible className="space-y-2">
        {data.faqs.slice(0, 5).map((faq, index) => (
          <AccordionItem
            key={faq.id}
            value={`item-${index}`}
            className="border-b border-border bg-transparent"
          >
            <AccordionTrigger className="py-4 hover:no-underline text-left font-medium text-foreground text-sm">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-muted-foreground text-sm">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};
