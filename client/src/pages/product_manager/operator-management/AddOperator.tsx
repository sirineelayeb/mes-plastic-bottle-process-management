// src/pages/supervisor/AddOperator.tsx
'use client';

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, UserPlus, Mail, Phone, Shield, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";

/* ------------------------------------------------------------------ */
/* 1. Validation schema – role & shift are gone                     */
/* ------------------------------------------------------------------ */
const formSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(8, "Phone number too short"),
  skills: z.array(z.string()).min(1, "Select at least one skill"),
});

type FormData = z.infer<typeof formSchema>;

const skills = [
  "Injection Molding",
  "Blow Molding",
  "Cooling",
  "Quality Control",
  "Labeling",
  "Packaging",
  "Maintenance",
];

/* ------------------------------------------------------------------ */
export default function AddOperator() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      skills: [],
    },
  });

  const selectedSkills = watch("skills") || [];

  /* -------------------------------------------------------------- */
  const handleSkillToggle = (skill: string) => {
    const current = selectedSkills || [];
    const updated = current.includes(skill)
      ? current.filter((s) => s !== skill)
      : [...current, skill];
    setValue("skills", updated, { shouldValidate: true });
  };

  /* -------------------------------------------------------------- */
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    // ---- Simulate API ------------------------------------------------
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const newOperator = {
      id: String(Date.now()),
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      steps: data.skills,
      status: "active" as const,
      availability: true,
      // shift will be added later when you assign the operator to a step
    };

    console.log("New operator created:", newOperator);

    toast.success("Operator Created!", {
      description: `${data.firstName} ${data.lastName} has been added successfully.`,
      duration: 5000,
    });

    setIsSubmitting(false);
    navigate("/operators/manage");
  };

  /* ------------------------------------------------------------------ */
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link to="/operators/manage">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <UserPlus className="w-9 h-9 text-primary" />
              Add New Operator
            </h1>
            <p className="text-muted-foreground">Create a new operator profile</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Operator Information</CardTitle>
            </CardHeader>

            <CardContent className="space-y-8">
              {/* ---------- Names ---------- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="Ahmed" {...register("firstName")} />
                  {errors.firstName && (
                    <p className="text-sm text-destructive">{errors.firstName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Ben Ali" {...register("lastName")} />
                  {errors.lastName && (
                    <p className="text-sm text-destructive">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              {/* ---------- Contact ---------- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ahmed@factory.com"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Phone
                  </Label>
                  <Input id="phone" placeholder="+216 98 765 432" {...register("phone")} />
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              {/* ---------- Skills ---------- */}
              <div className="space-y-4">
                <div>
                  <Label>Skills & Certifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Select all production steps this operator can perform
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {skills.map((skill) => (
                    <div key={skill} className="flex items-center space-x-3">
                      <Checkbox
                        id={skill}
                        checked={selectedSkills.includes(skill)}
                        onCheckedChange={() => handleSkillToggle(skill)}
                      />
                      <label
                        htmlFor={skill}
                        className="text-sm font-medium leading-none cursor-pointer hover:text-primary transition-colors"
                      >
                        {skill}
                      </label>
                    </div>
                  ))}
                </div>

                {errors.skills && (
                  <p className="text-sm text-destructive">{errors.skills.message}</p>
                )}
              </div>

              {/* ---------- Actions ---------- */}
              <div className="flex justify-end gap-4 pt-8 border-t">
                <Button type="button" variant="outline" asChild>
                  <Link to="/operators/manage">Cancel</Link>
                </Button>

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Create Operator
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}