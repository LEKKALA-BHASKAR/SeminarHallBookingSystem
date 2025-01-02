import { Badge } from "@/components/ui/badge";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Hall = {
  id: string;
  name: string;
  capacity: number;
  available: boolean;
  image: string;
};

type HallSelectionProps = {
  halls: Hall[];
  selectedHall: string | null;
  onSelectHall: (hallId: string) => void;
};

export const HallSelection = ({
  halls,
  selectedHall,
  onSelectHall,
}: HallSelectionProps) => {
  return (
    <>
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
              onClick={() => hall.available && onSelectHall(hall.id)}
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
    </>
  );
};