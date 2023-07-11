import { Outlet, Navigate } from 'react-router-dom';
export default function PrivateRoutes(){
    let auth=localStorage.getItem("isAuthenticated");
    return auth && auth !== null ? (
        <Outlet />
    ) : (
        <Navigate to="/chatify-frontend/" replace />
    );
}
