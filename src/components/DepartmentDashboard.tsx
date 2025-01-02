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
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type Hall = {
  id: string;
  name: string;
  capacity: number;
  available: boolean;
  image: string;
};

type Booking = {
  id: string;
  hall_name: string;
  date: string;
  status: "pending" | "approved" | "rejected";
  purpose?: string;
  attendees?: number;
};

const fetchHalls = async () => {
  const { data, error } = await supabase.from("halls").select("*");
  if (error) throw error;
  return data as Hall[];
};

const fetchUserBookings = async (department: string) => {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("department", department)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Booking[];
};

const DepartmentDashboard = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedHall, setSelectedHall] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: halls = [] } = useQuery({
    queryKey: ["halls"],
    queryFn: fetchHalls,
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ["bookings", user?.department],
    queryFn: () => fetchUserBookings(user?.department || ""),
    enabled: !!user?.department,
  });

  const createBooking = useMutation({
    mutationFn: async (newBooking: {
      hall_name: string;
      date: string;
      department: string;
    }) => {
      const { error } = await supabase.from("bookings").insert([newBooking]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast({
        title: "Success",
        description: "Booking request submitted successfully",
      });
      setSelectedHall(null);
      setSelectedDate(new Date());
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit booking request",
        variant: "destructive",
      });
      console.error("Error creating booking:", error);
    },
  });

  const handleBooking = () => {
    if (!selectedDate || !selectedHall || !user?.department) {
      toast({
        title: "Error",
        description: "Please select both a date and a hall",
        variant: "destructive",
      });
      return;
    }

    const selectedHallData = halls.find((h) => h.id === selectedHall);
    if (!selectedHallData) return;

    createBooking.mutate({
      hall_name: selectedHallData.name,
      date: selectedDate.toISOString().split("T")[0],
      department: user.department,
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
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.hall_name}</TableCell>
                  <TableCell>{booking.date}</TableCell>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {halls.map((hall) => (
                <div
                  key={hall.id}
                  className={`p-4 border rounded-lg cursor-pointer ${
                    selectedHall === hall.id
                      ? "border-primary bg-primary/5"
                      : "hover:border-primary/50"
                  } ${!hall.available && "opacity-50"}`}
                  onClick={() => hall.available && setSelectedHall(hall.id)}
                >
                  <img
                    src={hall.image}
                    alt={hall.name}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <h3 className="font-medium mt-2">{hall.name}</h3>
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