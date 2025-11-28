'use client';
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
export default function ListSkills() {
  const [skills, setSkills] = useState<string[]>([
    "Injection Molding",
    "Quality Control",
    "Blow Molding",
  ]);

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>All Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {skills.map((skill, index) => (
              <li
                key={index}
                className="border p-2 rounded flex justify-between items-center"
              >
                <span>{skill}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
     <Link to="/skills/manage">
  <Button>Manage Skills</Button>
</Link>
    </div>
  );
}
