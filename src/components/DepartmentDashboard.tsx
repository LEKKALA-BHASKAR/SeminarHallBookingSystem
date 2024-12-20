import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";

type Hall = {
  id: string;
  name: string;
  capacity: number;
  available: boolean;
};

type Booking = {
  id: string;
  hallName: string;
  date: string;
  status: "pending" | "approved" | "rejected";
  purpose: string;
  attendees: number;
};

// Mock data for demonstration
const mockHalls: Hall[] = [
  {
    id: "1",
    name: "Main Auditorium",
    capacity: 500,
    available: true,
  },
  {
    id: "2",
    name: "Conference Room A",
    capacity: 100,
    available: true,
  },
  {
    id: "3",
    name: "Seminar Hall B",
    capacity: 200,
    available: false,
  },
];

const mockBookings: Booking[] = [
  {
    id: "1",
    hallName: "Main Auditorium",
    date: "2024-03-20",
    status: "pending",
    purpose: "Technical Seminar",
    attendees: 200,
  },
  {
    id: "2",
    hallName: "Conference Room A",
    date: "2024-03-15",
    status: "approved",
    purpose: "Department Meeting",
    attendees: 50,
  },
];

const DepartmentDashboard = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedHall, setSelectedHall] = useState<string | null>(null);
  const [bookings] = useState<Booking[]>(mockBookings);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleBooking = () => {
    if (!selectedDate || !selectedHall) {
      toast({
        title: "Error",
        description: "Please select both a date and a hall",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Booking request submitted successfully",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Bookings</CardTitle>
          <CardDescription>View your booking history and current requests</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hall</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Attendees</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.hallName}</TableCell>
                  <TableCell>{booking.date}</TableCell>
                  <TableCell>{booking.purpose}</TableCell>
                  <TableCell>{booking.attendees}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        booking.status === "approved"
                          ? "secondary"
                          : booking.status === "rejected"
                          ? "destructive"
                          : "default"
                      }
                    >
                      {booking.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Available Halls</CardTitle>
            <CardDescription>Select a hall to make a booking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockHalls.map((hall) => (
                <div
                  key={hall.id}
                  className={`p-4 border rounded-lg cursor-pointer ${
                    selectedHall === hall.id
                      ? "border-primary bg-primary/5"
                      : "hover:border-primary/50"
                  } ${!hall.available && "opacity-50"}`}
                  onClick={() => hall.available && setSelectedHall(hall.id)}
                >
                  <h3 className="font-medium">{hall.name}</h3>
                  <p className="text-sm text-gray-500">
                    Capacity: {hall.capacity} people
                  </p>
                  <Badge variant={hall.available ? "outline" : "secondary"}>
                    {hall.available ? "Available" : "Booked"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
            <CardDescription>Choose a date for your booking</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
            <Button
              className="w-full mt-4"
              onClick={handleBooking}
              disabled={!selectedDate || !selectedHall}
            >
              Request Booking
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DepartmentDashboard;