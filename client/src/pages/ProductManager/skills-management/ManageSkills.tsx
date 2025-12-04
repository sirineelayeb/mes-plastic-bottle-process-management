import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { axiosPublic } from "@/api/axios";
import toast, { Toaster } from "react-hot-toast"; // <- import toast
import type { Skill } from "@/types/types";
import { Award, Edit2, Trash2 } from "lucide-react";

export default function ManageSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [skillName, setSkillName] = useState("");
  const [skillDescription, setSkillDescription] = useState("");

  // Fetch skills from API
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axiosPublic.get("/skills");
        setSkills(response.data.skills);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch skills");
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const handleSave = async () => {
    if (!skillName.trim()) return;

    try {
      if (editingSkill) {
        const response = await axiosPublic.put(`/skills/${editingSkill._id}`, {
          name: skillName,
          description: skillDescription,
        });
        setSkills((prev) =>
          prev.map((s) => (s._id === editingSkill._id ? response.data.skill : s))
        );
        toast.success("Skill updated successfully!");
      } else {
        const response = await axiosPublic.post("/skills", {
          name: skillName,
          description: skillDescription,
        });
        setSkills((prev) => [...prev, response.data.skill]);
        toast.success("Skill added successfully!");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to save skill");
    } finally {
      setSkillName("");
      setSkillDescription("");
      setEditingSkill(null);
      setOpenDialog(false);
    }
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setSkillName(skill.name);
    setSkillDescription(skill.description);
    setOpenDialog(true);
  };

  const handleDelete = async (skillId: string) => {
    try {
      await axiosPublic.delete(`/skills/${skillId}`);
      setSkills((prev) => prev.filter((s) => s._id !== skillId));
      toast.success("Skill deleted successfully!"); // <- toast here
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to delete skill");
    }
  };

  if (loading) return <p>Loading skills...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 space-y-6">
      <Toaster position="top-right" /> {/* <- add this once at the top */}
      <Card>
       <CardHeader>
  <h1 className="text-3xl font-bold flex items-center gap-2">
    <Award className="w-8 h-8 text-primary" />
    Manage Skills
  </h1>
</CardHeader>

        <CardContent>
          <Button onClick={() => setOpenDialog(true)}>+ Add Skill</Button>

          <ul className="mt-4 space-y-2">
            {skills.map((skill) => (
              <li
                key={skill._id}
                className="flex flex-col md:flex-row justify-between items-start md:items-center border p-2 rounded"
              >
                <div>
                  <span className="font-semibold">{skill.name}</span>
                  <p className="text-sm text-gray-600">{skill.description}</p>
                </div>
               <div className="flex space-x-2 mt-2 md:mt-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(skill)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(skill._id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingSkill ? "Edit Skill" : "Add Skill"}</DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                placeholder="Skill name"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={skillDescription}
                onChange={(e) => setSkillDescription(e.target.value)}
                placeholder="Skill description"
              />
            </div>
          </div>

          <DialogFooter className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setOpenDialog(false);
                setSkillName("");
                setSkillDescription("");
                setEditingSkill(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingSkill ? "Save" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
