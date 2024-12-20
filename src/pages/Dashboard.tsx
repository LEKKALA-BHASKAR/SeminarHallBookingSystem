import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import AdminDashboard from "@/components/AdminDashboard";
import DepartmentDashboard from "@/components/DepartmentDashboard";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-primary text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-semibold">
                Seminar Hall Booking System
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span>{user?.name}</span>
              <Button
                variant="secondary"
                onClick={logout}
                className="bg-secondary hover:bg-secondary/90"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome, {user?.name}
          </h1>
          <p className="mt-1 text-gray-600">
            {user?.role === "admin"
              ? "Manage booking requests and hall status"
              : "Book a seminar hall for your department"}
          </p>
        </div>

        {user?.role === "admin" ? <AdminDashboard /> : <DepartmentDashboard />}
      </main>
    </div>
  );
}