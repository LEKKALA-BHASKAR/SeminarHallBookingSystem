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
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

type Booking = {
  id: string;
  hall_name: string;
  department: string;
  date: string;
  status: "pending" | "approved" | "rejected";
  purpose?: string;
  attendees?: number;
};

const fetchBookings = async () => {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Booking[];
};

const BookingTable = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: fetchBookings,
  });

  const updateBookingStatus = useMutation({
    mutationFn: async ({
      bookingId,
      newStatus,
    }: {
      bookingId: string;
      newStatus: "approved" | "rejected";
    }) => {
      const { error } = await supabase
        .from("bookings")
        .update({ status: newStatus })
        .eq("id", bookingId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast({
        title: "Success",
        description: "Booking status updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive",
      });
      console.error("Error updating booking:", error);
    },
  });

  const renderBadge = (status: "pending" | "approved" | "rejected") => {
    const variants = {
      approved: "secondary",
      rejected: "destructive",
      pending: "default",
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  if (isLoading) return <div>Loading bookings...</div>;

  return (
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
        {bookings?.map((booking) => (
          <TableRow key={booking.id}>
            <TableCell>{booking.hall_name}</TableCell>
            <TableCell>{booking.department}</TableCell>
            <TableCell>{booking.date}</TableCell>
            <TableCell>{booking.purpose || "N/A"}</TableCell>
            <TableCell>{booking.attendees || "N/A"}</TableCell>
            <TableCell>{renderBadge(booking.status)}</TableCell>
            <TableCell>
              {booking.status === "pending" && (
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() =>
                      updateBookingStatus.mutate({
                        bookingId: booking.id,
                        newStatus: "approved",
                      })
                    }
                    className="bg-green-500 hover:bg-green-600"
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    onClick={() =>
                      updateBookingStatus.mutate({
                        bookingId: booking.id,
                        newStatus: "rejected",
                      })
                    }
                    variant="destructive"
                  >
                    Reject
                  </Button>
                </div>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BookingTable;