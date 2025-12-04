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
import { axiosPublic } from "@/api/axios"; 
import { Label } from "@/components/ui/label";
import useFetch from "@/hooks/useFetchData";
import { ca } from "date-fns/locale";

export default function ManageSkills() {
  const {data: skills, refetch, loading} = useFetch("/skills");

  console.log("Fetched skills:", skills);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [skillName, setSkillName] = useState("");
  const [skillDescription, setSkillDescription] = useState("");

  const handleAdd = () => {
    try {
      const response = axiosPublic.post("/skills", {
        name: skillName,
        description: skillDescription,
      });
      setOpenDialog(false);
      setSkillName("");
      setSkillDescription("");
      refetch();
    }catch (error) {
      console.error("Error adding skill:", error);
    }
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
            {skills && skills?.skills && skills?.skills.map((skill) => (
              <li
                key={skill._id}
                className="flex justify-between items-center border p-2 rounded"
              >
                <div className="flex flex-col gap-2">
                  <span className="font-medium">{skill.name}</span>
                  <p className="text-sm text-gray-600">{skill.description}</p>
                </div>
              </li>
            ))}
            {
              loading && <p>Loading skills...</p>
            }
          </ul>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Skill</DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div>
              <Label>Skill Name</Label>
              <Input
                value={skillName}
                className="mt-2"
                onChange={(e) => setSkillName(e.target.value)}
                placeholder="e.g., Quality Control"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Input
                value={skillDescription}
                className="mt-2"
                onChange={(e) => setSkillDescription(e.target.value)}
                placeholder="e.g., Ensuring product quality standards"
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
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAdd}>
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}