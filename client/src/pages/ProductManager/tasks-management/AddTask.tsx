import React, { useState, useEffect } from "react";
import { Plus, ArrowLeft, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { axiosPublic } from "@/api/axios";
import type { Skill, Machine, Operator } from "@/types/types";
import { toast, Toaster } from "react-hot-toast";

export default function AddTask() {
  const [taskName, setTaskName] = useState("");
  const [selectedMachine, setSelectedMachine] = useState<string>("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedOperators, setSelectedOperators] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [skills, setSkills] = useState<Skill[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [operators, setOperators] = useState<Operator[]>([]);
  const [availableOperators, setAvailableOperators] = useState<Operator[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [touched, setTouched] = useState({
    taskName: false,
    selectedMachine: false,
    selectedSkills: false,
    selectedOperators: false,
    startDate: false,
    endDate: false,
  });

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [skillsRes, machinesRes, operatorsRes] = await Promise.all([
          axiosPublic.get("/skills"),
          axiosPublic.get("/machines"),
          axiosPublic.get("/auth/users"),
        ]);

        setSkills(skillsRes.data.skills);
        setMachines(machinesRes.data.machines);

        const ops: Operator[] = operatorsRes.data.operators.map((u: any) => ({
          _id: u._id,
          name: u.name,
          skills: u.skills || [],
        }));

        setOperators(ops);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter available operators
  useEffect(() => {
    if (selectedSkills.length === 0) {
      setAvailableOperators([]);
      setSelectedOperators([]);
      return;
    }

    const filtered = operators.filter((op) =>
      selectedSkills.every((skillId) => op.skills.includes(skillId))
    );

    setAvailableOperators(filtered);
    setSelectedOperators([]); // reset selection
  }, [selectedSkills, operators]);
const handleCreateTask = async () => {
  // Mark all fields as touched to trigger validation
  setTouched({
    taskName: true,
    selectedMachine: true,
    selectedSkills: true,
    selectedOperators: true,
    startDate: true,
    endDate: true,
  });

  // Validate required fields
  if (
    !taskName ||
    !selectedMachine ||
    selectedSkills.length === 0 ||
    selectedOperators.length === 0 ||
    !startDate ||
    !endDate
  ) {
    toast.error("Please fill in all required fields.");
    return;
  }

  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Validate start date is not in the past
  if (start < now) {
    toast.error("Start date must be equal to or later than the current date.");
    return;
  }

  // Validate end date is after start date
  if (start >= end) {
    toast.error("End date must be later than start date.");
    return;
  }

  try {
    // Send task data to API
    await axiosPublic.post("/tasks", {
      taskName,
      machine: selectedMachine,
      skills: selectedSkills,
      operators: selectedOperators,
      dateStart: startDate,
      dateEnd: endDate,
    });

    toast.success("Task created successfully!");

    // Reset form
    setTaskName("");
    setSelectedMachine("");
    setSelectedSkills([]);
    setSelectedOperators([]);
    setAvailableOperators([]);
    setStartDate("");
    setEndDate("");
    setTouched({
      taskName: false,
      selectedMachine: false,
      selectedSkills: false,
      selectedOperators: false,
      startDate: false,
      endDate: false,
    });
  } catch (err: any) {
    console.error(err);
    toast.error(err.response?.data?.message || "Failed to create task");
  }
};


  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link to="/tasks/all">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Plus className="w-9 h-9 text-primary" />
            Create New Production Task
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Task Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Task Name */}
              <div className="space-y-2">
                <Label htmlFor="batch">Batch Name *</Label>
                <Input
                  id="batch"
                  placeholder="e.g., Batch A-101"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  onBlur={() => setTouched({ ...touched, taskName: true })}
                  className={touched.taskName && !taskName ? "border-red-500" : ""}
                />
                {touched.taskName && !taskName && (
                  <p className="text-red-500 text-sm">Required</p>
                )}
              </div>

              {/* Machine */}
              <div className="space-y-2">
                <Label>Select Machine *</Label>
                <Select
                  value={selectedMachine}
                  onValueChange={setSelectedMachine}
                  onBlur={() => setTouched({ ...touched, selectedMachine: true })}
                >
                  <SelectTrigger
                    className={touched.selectedMachine && !selectedMachine ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select machine" />
                  </SelectTrigger>
                  <SelectContent>
                    {machines.map((m) => (
                    <SelectItem key={m._id} value={m._id}>
  {m.name}{m.idMachine ? ` (${m.idMachine})` : ""}
</SelectItem>

                    ))}
                  </SelectContent>
                </Select>
                {touched.selectedMachine && !selectedMachine && (
                  <p className="text-red-500 text-sm">Required</p>
                )}
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <Label>Assign Skills *</Label>
              <Select
                value={selectedSkills}
                onValueChange={(values) =>
                  setSelectedSkills(Array.isArray(values) ? values : [values])
                }
                multiple
              >
                <SelectTrigger
                  className={touched.selectedSkills && selectedSkills.length === 0 ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select skills" />
                </SelectTrigger>
                <SelectContent>
                  {skills.map((s) => (
                    <SelectItem key={s._id} value={s._id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {touched.selectedSkills && selectedSkills.length === 0 && (
                <p className="text-red-500 text-sm">Required</p>
              )}
            </div>

            {/* Operators */}
            <div className="space-y-2">
              <Label>Assign Operators *</Label>
              {selectedSkills.length === 0 ? (
                <p className="text-gray-500">
                  Select at least one skill to see matching operators
                </p>
              ) : availableOperators.length === 0 ? (
                <p className="text-red-500">No operator matches the selected skills</p>
              ) : (
                <div
                  className={`flex flex-col gap-2 max-h-40 overflow-y-auto border rounded p-2 ${
                    touched.selectedOperators && selectedOperators.length === 0 ? "border-red-500" : ""
                  }`}
                >
                  {availableOperators.map((op) => (
                    <label key={op._id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        value={op._id}
                        checked={selectedOperators.includes(op._id)}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (e.target.checked) {
                            setSelectedOperators([...selectedOperators, value]);
                          } else {
                            setSelectedOperators(
                              selectedOperators.filter((id) => id !== value)
                            );
                          }
                        }}
                      />
                      {op.name}
                    </label>
                  ))}
                </div>
              )}
              {touched.selectedOperators &&
                selectedOperators.length === 0 &&
                availableOperators.length > 0 && (
                  <p className="text-red-500 text-sm">Required</p>
                )}
            </div>

            {/* Start Date & End Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Start Date *</Label>
                <Input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  onBlur={() => setTouched({ ...touched, startDate: true })}
                  className={touched.startDate && !startDate ? "border-red-500" : ""}
                />
                {touched.startDate && !startDate && (
                  <p className="text-red-500 text-sm">Required</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>End Date *</Label>
                <Input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  onBlur={() => setTouched({ ...touched, endDate: true })}
                  className={touched.endDate && !endDate ? "border-red-500" : ""}
                />
                {touched.endDate && !endDate && (
                  <p className="text-red-500 text-sm">Required</p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-6">
              <Button variant="outline" asChild>
                <Link to="/tasks/all">Cancel</Link>
              </Button>
              <Button className="bg-primary" onClick={handleCreateTask}>
                <Package className="w-4 h-4 mr-2" />
                Create Task
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
