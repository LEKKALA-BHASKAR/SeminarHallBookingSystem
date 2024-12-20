import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";

// Types
interface BookingRequest {
  id: string;
  hallName: string;
  department: string;
  date: string;
  status: "pending" | "approved" | "rejected";
  purpose?: string;
  attendees?: number;
}

interface Department {
  id: string;
  name: string;
  email: string;
  contactPerson: string;
}

// Mock data
const mockBookings: BookingRequest[] = [
  {
    id: "1",
    hallName: "Main Auditorium",
    department: "Computer Science",
    date: "2024-03-20",
    status: "pending",
    purpose: "Technical Seminar",
    attendees: 200,
  },
  {
    id: "2",
    hallName: "Conference Room A",
    department: "Physics",
    date: "2024-03-21",
    status: "approved",
    purpose: "Department Meeting",
    attendees: 50,
  },
];

const mockDepartments: Department[] = [
  {
    id: "1",
    name: "Computer Science",
    email: "cs@university.edu",
    contactPerson: "John Doe",
  },
  {
    id: "2",
    name: "Physics",
    email: "physics@university.edu",
    contactPerson: "Jane Smith",
  },
];

const AdminDashboard = () => {
  const [departments] = useState<Department[]>(mockDepartments);
  const [bookings, setBookings] = useState<BookingRequest[]>(mockBookings);
  const { toast } = useToast();

  const handleStatusUpdate = (
    bookingId: string,
    newStatus: "approved" | "rejected"
  ) => {
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      )
    );

    toast({
      title: `Booking ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
      description: `The booking request has been ${newStatus}.`,
    });
  };

  const renderBadge = (status: "pending" | "approved" | "rejected") => {
    const variants = {
      approved: "secondary",
      rejected: "destructive",
      pending: "default",
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const renderActions = (status: string, id: string) => {
    if (status === "pending") {
      return (
        <div className="flex space-x-2">
          <Button size="sm" onClick={() => handleStatusUpdate(id, "approved")}>
            Approve
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleStatusUpdate(id, "rejected")}
          >
            Reject
          </Button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Department Management */}
      <Card>
        <CardHeader>
          <CardTitle>Department Management</CardTitle>
          <CardDescription>View and manage registered departments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department Name</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map((dept) => (
                <TableRow key={dept.id}>
                  <TableCell>{dept.name}</TableCell>
                  <TableCell>{dept.contactPerson}</TableCell>
                  <TableCell>{dept.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Booking Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Requests</CardTitle>
          <CardDescription>Manage seminar hall booking requests</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hall</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Attendees</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.hallName}</TableCell>
                  <TableCell>{booking.department}</TableCell>
                  <TableCell>{booking.date}</TableCell>
                  <TableCell>{booking.purpose || "N/A"}</TableCell>
                  <TableCell>{booking.attendees || "N/A"}</TableCell>
                  <TableCell>{renderBadge(booking.status)}</TableCell>
                  <TableCell>{renderActions(booking.status, booking.id)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
