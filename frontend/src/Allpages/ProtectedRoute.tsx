import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../access/access";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  if (!isLoggedIn()) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
}
