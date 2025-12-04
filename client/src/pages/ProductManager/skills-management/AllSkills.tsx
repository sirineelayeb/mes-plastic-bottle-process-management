import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import useFetch from "@/hooks/useFetchData";
export default function ListSkills() {

  const {data, loading, error} = useFetch("/skills");

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>All Skills</CardTitle>
        </CardHeader>
        {loading && <CardContent>Loading skills...</CardContent>}
        {data && data.success &&<CardContent>
          <ul className="space-y-2">
            {data.skills.map((skill:any, index:any) => (
              <li
                key={index}
                className="border p-2 rounded flex justify-between items-center"
              >
                <span>{skill.name}</span>
              </li>
            ))}
          </ul>
        </CardContent>}
      </Card>
      
     <Link to="/skills/manage">
  <Button>Manage Skills</Button>
</Link>
    </div>
  );
}
