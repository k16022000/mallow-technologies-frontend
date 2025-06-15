import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
