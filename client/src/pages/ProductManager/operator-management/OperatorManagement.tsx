import { useEffect, useState } from "react";
import { axiosPublic } from "@/api/axios";
import type { Operator, Skill } from "@/types/types";
import { Trash2, Edit2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { toast } from "sonner";

export default function OperatorsManagement() {
const [operators, setOperators] = useState<Operator[]>([]);
const [skills, setSkills] = useState<Skill[]>([]);
const [editingOperator, setEditingOperator] = useState<Operator | null>(null);
const [openDialog, setOpenDialog] = useState(false);
const [editName, setEditName] = useState("");
const [editEmail, setEditEmail] = useState("");
const [editSkills, setEditSkills] = useState<string[]>([]);

// Pagination state
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 6;

// Fetch operators and skills
const loadData = async () => {
try {
const opRes = await axiosPublic.get("/auth/operators");
const skRes = await axiosPublic.get("/skills");
setOperators(opRes.data.operators || []);
setSkills(skRes.data.skills || []);
} catch {
toast.error("Failed to load operators or skills");
}
};

useEffect(() => {
loadData();
}, []);

const openEditDialog = (op: Operator) => {
setEditingOperator(op);
setEditName(op.name);
setEditEmail(op.email);
setEditSkills(op.skills);
setOpenDialog(true);
};

const handleSubmitEdit = async () => {
if (!editingOperator) return;
try {
await axiosPublic.put("/auth/operators/edit", {
operatorId: editingOperator._id,
name: editName,
email: editEmail,
skills: editSkills,
});
toast.success("Operator updated successfully");
setOpenDialog(false);
setEditingOperator(null);
loadData();
} catch {
toast.error("Failed to update operator");
}
};

const handleDelete = async (operatorId: string) => {
if (!window.confirm("Are you sure you want to delete this operator?")) return;
try {
await axiosPublic.delete(`/auth/operators/${operatorId}`);
toast.success("Operator deleted successfully");
setOperators((prev) => prev.filter((op) => op._id !== operatorId));
} catch {
toast.error("Failed to delete operator");
}
};

const getSkillNames = (skillIds: string[]) =>
skillIds
.map((id) => skills.find((s) => s._id === id)?.name)
.filter((name): name is string => !!name);

// Pagination calculations
const totalPages = Math.ceil(operators.length / itemsPerPage);
const paginatedOperators = operators.slice(
(currentPage - 1) * itemsPerPage,
currentPage * itemsPerPage
);

return ( <div className="p-6 space-y-6">


  {/* Header */}
  <div className="flex justify-between items-center">
    <h1 className="text-2xl font-bold flex items-center gap-2">
      <UserPlus size={24} className="text-yellow-500" /> Operators Management
    </h1>
    <Link to="/operators/add">
      <Button size="sm" className="flex items-center gap-2">
        <UserPlus size={16} /> Add Operator
      </Button>
    </Link>
  </div>

  {/* Operators Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {paginatedOperators.map((op) => (
      <Card key={op._id} className="p-4 flex flex-col justify-between">
        <div>
          <p className="font-semibold text-lg">{op.name}</p>
          <p className="text-sm text-gray-600">{op.email}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {getSkillNames(op.skills).map((skill) => (
              <span
                key={skill}
                className="px-2 py-1 rounded bg-gray-800 text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button size="sm" variant="outline" onClick={() => openEditDialog(op)}>
            <Edit2 size={16} /> Edit
          </Button>
          <Button size="sm" variant="destructive" onClick={() => handleDelete(op._id)}>
            <Trash2 size={16} /> Delete
          </Button>
        </div>
      </Card>
    ))}
  </div>

  {/* Pagination */}
  <Pagination
    currentPage={currentPage}
    onPageChange={setCurrentPage}
    totalPages={totalPages}
  >
    <PaginationPrevious>Previous</PaginationPrevious>
    <PaginationContent>
      {Array.from({ length: totalPages }, (_, i) => (
        <PaginationItem key={i + 1} page={i + 1}>
          {i + 1}
        </PaginationItem>
      ))}
    </PaginationContent>
    <PaginationNext>Next</PaginationNext>
  </Pagination>

  {/* Edit Operator Dialog */}
  <Dialog open={openDialog} onOpenChange={setOpenDialog}>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Edit Operator</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-2">
        <div>
          <Label>Name</Label>
          <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
        </div>
        <div>
          <Label>Email</Label>
          <Input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
        </div>
        <div>
          <Label>Skills</Label>
          <Select multiple value={editSkills} onValueChange={setEditSkills}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select skills" />
            </SelectTrigger>
            <SelectContent>
              {skills.map((skill) => (
                <SelectItem key={skill._id} value={skill._id}>
                  {skill.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={() => {
            setOpenDialog(false);
            setEditingOperator(null);
            setEditName("");
            setEditEmail("");
            setEditSkills([]);
          }}
        >
          Cancel
        </Button>
        <Button onClick={handleSubmitEdit}>Save</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</div>


);
}
