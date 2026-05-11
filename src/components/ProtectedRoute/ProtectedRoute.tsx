import { Navigate } from 'react-router-dom';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
};
export default ProtectedRoute;
