import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { axiosPublic } from '@/api/axios';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff,Plus } from 'lucide-react';
import type { Skill } from '@/types/types';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  skills: string[];  // <-- IMPORTANT
}

export default function AddOperator() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      skills: [],  // <-- FIXED, now typed correctly
    },
  });

  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const selectedSkills = watch("skills");
  const password = watch("password");

  /* ------------------------------------------
      FETCH SKILLS FROM BACKEND
  ------------------------------------------- */
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await axiosPublic.get('/skills');
        setAllSkills(res.data.skills);
      } catch (err) {
        toast.error("Failed to load skills");
      }
    };
    fetchSkills();
  }, []);

  /* ------------------------------------------
      TOGGLE SKILLS
  ------------------------------------------- */
  const handleSkillToggle = (skillId: string) => {
    const current = selectedSkills || [];

    const updated = current.includes(skillId)
      ? current.filter((id) => id !== skillId)
      : [...current, skillId];

    setValue("skills", updated, { shouldValidate: true });
  };

  /* ------------------------------------------
      SUBMIT
  ------------------------------------------- */
  const onSubmit = async (data: FormData) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (data.skills.length === 0) {
      toast.error("Please select at least one skill");
      return;
    }

    try {
      setIsSubmitting(true);

      await axiosPublic.post("/auth/signup", {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
        role: "operator",
        skills: data.skills,  // Backend expects array of skill IDs
      });

      toast.success("Operator created successfully");

      setTimeout(() => navigate("/operators/manage"), 1200);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create operator");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ------------------------------------------
      UI
  ------------------------------------------- */
  return (
    <div className="min-h-screen p-6 bg-background">
      <Toaster position="top-right" />

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold flex items-center gap-3">
            <Plus className="w-9 h-9 text-primary" />
            Add New Operator
          </h1>
           <p className="text-muted-foreground mb-6">
          Create a new operator account with login credentials
        </p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 bg-card p-6 rounded-lg border"
        >
          {/* NAME FIELDS */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-medium text-sm">First Name *</label>
              <input
                {...register("firstName", { required: "First name is required" })}
                className="w-full p-2 border rounded"
                placeholder="John"
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 font-medium text-sm">Last Name *</label>
              <input
                {...register("lastName", { required: "Last name is required" })}
                className="w-full p-2 border rounded"
                placeholder="Doe"
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* EMAIL */}
          <div>
            <label className="block mb-2 font-medium text-sm">Email *</label>
            <input
              {...register("email", { required: "Email is required" })}
              className="w-full p-2 border rounded"
              type="email"
              placeholder="john.doe@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block mb-2 font-medium text-sm">Password *</label>
            <div className="relative">
              <input
                {...register("password", { required: "Password is required" })}
                type={showPassword ? "text" : "password"}
                className="w-full p-2 border rounded pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="block mb-2 font-medium text-sm">Confirm Password *</label>
            <div className="relative">
              <input
                {...register("confirmPassword", {
                  required: "Please confirm password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                type={showConfirmPassword ? "text" : "password"}
                className="w-full p-2 border rounded pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          {/* SKILLS */}
          <div>
            <label className="block mb-2 font-medium text-sm">
              Skills * (Select at least one)
            </label>

            <div className="flex flex-col space-y-2 max-h-48 overflow-y-auto p-4 border rounded bg-muted/20">
              {allSkills.map((skill) => (
                <div key={skill._id} className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedSkills.includes(skill._id)}
                    onCheckedChange={() => handleSkillToggle(skill._id)}
                  />
                  <label>{skill.name}</label>
                </div>
              ))}
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => navigate("/operators/manage")}>
              Cancel
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Operator"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
