import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./globals/components/PrivateRoute";

const LoginForm = lazy(() => import("./screens/LoginForm"));
const UserTable = lazy(() => import("./screens/UserTable"));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <UserTable />
            </PrivateRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}

export default App;
