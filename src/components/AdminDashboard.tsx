import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import BookingTable from "./admin/BookingTable";
import DepartmentTable from "./admin/DepartmentTable";

const AdminDashboard = () => {
  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      <Card className="shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            Department Management
          </CardTitle>
          <CardDescription className="text-gray-600">
            View and manage registered departments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DepartmentTable />
        </CardContent>
      </Card>

      <Card className="shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Booking Requests</CardTitle>
          <CardDescription className="text-gray-600">
           Bhaskar Manage seminar hall booking requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BookingTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
