'use client';
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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

export default function ManageSkills() {
  const [skills, setSkills] = useState<string[]>([
    "Injection Molding",
    "Quality Control",
    "Blow Molding",
  ]);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [skillName, setSkillName] = useState("");

  const handleSave = () => {
    if (!skillName.trim()) return;
    if (editingIndex !== null) {
      const updated = [...skills];
      updated[editingIndex] = skillName;
      setSkills(updated);
    } else {
      setSkills([...skills, skillName]);
    }
    setSkillName("");
    setEditingIndex(null);
    setOpenDialog(false);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setSkillName(skills[index]);
    setOpenDialog(true);
  };

  const handleDelete = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manage Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setOpenDialog(true)}>+ Add Skill</Button>

          <ul className="mt-4 space-y-2">
            {skills.map((skill, index) => (
              <li
                key={index}
                className="flex justify-between items-center border p-2 rounded"
              >
                <span>{skill}</span>
                <div className="space-x-2">
                  <Button size="sm" variant="secondary" onClick={() => handleEdit(index)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(index)}
                  >
                    Delete
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
            <DialogTitle>{editingIndex !== null ? "Edit Skill" : "Add Skill"}</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <Label>Skill Name</Label>
            <Input
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              placeholder="e.g., Quality Control"
            />
          </div>

          <DialogFooter className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setOpenDialog(false);
                setSkillName("");
                setEditingIndex(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingIndex !== null ? "Save" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
