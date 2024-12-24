import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 animate-fade-in">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg transform transition-all duration-500 hover:shadow-xl animate-slide-in">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-primary animate-fade-in">
            Seminar Hall Booking System
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 animate-fade-in">
            Please sign in to continue
          </p>
        </div>
        <form className="mt-8 space-y-6 animate-fade-in" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div className="animate-slide-in">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />
            </div>
            <div className="animate-slide-in">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="animate-bounce-in">
            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-all">
              Sign in
            </Button>
          </div>
        </form>
        <div className="text-center mt-4 animate-fade-in">
          <Link to="/register" className="text-primary hover:underline">
            Don't have an account? Register
          </Link>
        </div>
      </div>
    </div>
  );
}


