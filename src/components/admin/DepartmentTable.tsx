import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

type Department = {
  id: string;
  name: string;
  department: string;
  role: string;
};

const fetchDepartments = async () => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "department");

  if (error) throw error;
  return data as Department[];
};

const DepartmentTable = () => {
  const { data: departments, isLoading } = useQuery({
    queryKey: ["departments"],
    queryFn: fetchDepartments,
  });

  if (isLoading) return <div>Loading departments...</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Department Name</TableHead>
          <TableHead>Contact Person</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {departments?.map((dept) => (
          <TableRow key={dept.id}>
            <TableCell>{dept.department}</TableCell>
            <TableCell>{dept.name}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DepartmentTable;