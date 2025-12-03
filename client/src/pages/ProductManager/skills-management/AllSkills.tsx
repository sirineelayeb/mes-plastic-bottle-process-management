import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { axiosPublic } from "@/api/axios";
import type { Skill } from "@/types/types";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Award } from "lucide-react"; 

export default function ListSkills() {
const [skills, setSkills] = useState<Skill[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

// Pagination state
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 5;

useEffect(() => {
const fetchSkills = async () => {
try {
const response = await axiosPublic.get("/skills");
setSkills(response.data.skills || response.data || []);
} catch (err: any) {
setError(err.response?.data?.message || "Failed to fetch skills");
} finally {
setLoading(false);
}
};


fetchSkills();


}, []);

if (loading) return <p>Loading skills...</p>;
if (error) return <p className="text-red-500">{error}</p>;

// Calculate total pages and slice skills for current page
const totalPages = Math.ceil(skills.length / itemsPerPage);
const paginatedSkills = skills.slice(
(currentPage - 1) * itemsPerPage,
currentPage * itemsPerPage
);

return (
   <div className="p-6 space-y-6">
   <Card> 
    <CardHeader>
  <h1 className="text-3xl font-bold flex items-center gap-2">
    <Award className="w-8 h-8 text-primary" />
    All Skills
  </h1>
</CardHeader>
     <CardContent> <ul className="space-y-2">
{paginatedSkills.map((skill) => (
<li
key={skill.id || skill._id}
className="border p-2 rounded flex flex-col justify-between"
> <span className="font-semibold">{skill.name}</span> <span className="text-sm text-gray-600">{skill.description}</span> </li>
))} </ul>


      {/* Pagination controls */}
      <div className="mt-4 flex justify-center">
        <Pagination>
          <PaginationPrevious
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          >
            Previous
          </PaginationPrevious>

          <PaginationContent>
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem
                key={i + 1}
                page={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={currentPage === i + 1 ? "bg-primary text-white" : ""}
              >
                {i + 1}
              </PaginationItem>
            ))}
          </PaginationContent>

          <PaginationNext
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          >
            Next
          </PaginationNext>
        </Pagination>
      </div>
    </CardContent>
  </Card>

  <Link to="/skills/manage">
    <Button>Manage Skills</Button>
  </Link>
</div>


);
}
