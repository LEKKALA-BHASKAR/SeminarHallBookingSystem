import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type BookingStatusMessageProps = {
  status: "pending" | "approved" | "rejected";
};

export const BookingStatusMessage = ({ status }: BookingStatusMessageProps) => {
  if (status === "pending") {
    return (
      <Card className="p-4 bg-yellow-50 border-yellow-200 mb-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-yellow-100">
            Pending
          </Badge>
          <p className="text-sm text-yellow-800">
            Bhaskar will confirm your booking
          </p>
        </div>
      </Card>
    );
  }
  return null;
};