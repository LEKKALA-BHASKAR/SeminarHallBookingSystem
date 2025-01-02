import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookingStatusMessage } from "./BookingStatusMessage";

type Booking = {
  id: string;
  hall_name: string;
  date: string;
  status: "pending" | "approved" | "rejected";
};

type BookingsTableProps = {
  bookings: Booking[];
};

export const BookingsTable = ({ bookings }: BookingsTableProps) => {
  const hasPendingBooking = bookings.some(
    (booking) => booking.status === "pending"
  );

  return (
    <>
      {hasPendingBooking && <BookingStatusMessage status="pending" />}
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
    </>
  );
};