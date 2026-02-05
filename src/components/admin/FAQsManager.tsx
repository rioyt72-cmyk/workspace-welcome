import { useState } from "react";
import { useSiteData, FAQ } from "@/contexts/SiteDataContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const FAQsManager = () => {
  const { data, updateFaqs } = useSiteData();
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<FAQ>>({});

  const openNewDialog = () => {
    setEditingFaq(null);
    setFormData({ question: "", answer: "" });
    setIsDialogOpen(true);
  };

  const openEditDialog = (faq: FAQ) => {
    setEditingFaq(faq);
    setFormData(faq);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.question || !formData.answer) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (editingFaq) {
      const updated = data.faqs.map(f => 
        f.id === editingFaq.id ? { ...f, ...formData } : f
      );
      updateFaqs(updated);
      toast.success("FAQ updated successfully");
    } else {
      const newFaq: FAQ = {
        id: Date.now().toString(),
        question: formData.question || "",
        answer: formData.answer || "",
      };
      updateFaqs([...data.faqs, newFaq]);
      toast.success("FAQ added successfully");
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    updateFaqs(data.faqs.filter(f => f.id !== id));
    toast.success("FAQ deleted");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>FAQs Management</CardTitle>
          <CardDescription>Manage frequently asked questions</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="coral" onClick={openNewDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Add FAQ
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingFaq ? "Edit FAQ" : "Add New FAQ"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Question *</Label>
                <Input 
                  value={formData.question || ""} 
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })} 
                  placeholder="Enter question"
                />
              </div>
              <div className="space-y-2">
                <Label>Answer *</Label>
                <Textarea 
                  value={formData.answer || ""} 
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })} 
                  placeholder="Enter answer"
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button variant="coral" onClick={handleSave}>Save</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead className="hidden md:table-cell">Answer</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.faqs.map((faq) => (
              <TableRow key={faq.id}>
                <TableCell className="font-medium max-w-xs truncate">{faq.question}</TableCell>
                <TableCell className="hidden md:table-cell max-w-md truncate">{faq.answer}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(faq)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(faq.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
