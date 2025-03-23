import { Outlet, Navigate } from 'react-router-dom';

const GuestRoute = () => {
  const token = localStorage.getItem('token');
  console.log(token);

  return token ? <Navigate to="/" replace /> : <Outlet />;
};

export default GuestRoute;
