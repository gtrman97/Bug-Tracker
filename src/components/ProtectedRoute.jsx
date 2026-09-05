import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Wraps any route element that should require a logged-in user. While
// AuthContext is still checking a stored token against the backend
// (see the /auth/me call), we render nothing rather than redirecting
// early — otherwise a page refresh would flash the sign-in page for a
// split second even for someone who's actually still logged in.
export default function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();

  if (loading) return null;
  if (!token) return <Navigate to="/sign-in" replace />;

  return children;
}