import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <div className="p-6 text-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;

  return children;
}
