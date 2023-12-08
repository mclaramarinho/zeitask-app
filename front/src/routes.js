import { createBrowserRouter } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';

const routes = createBrowserRouter([
    {
        path: '/',
        element: <LandingPage />    
    },
    {
        path: '/login',
        element: <LoginPage />
    },
    {
        path: '/signup',
        element: <SignUpPage />
    },
    {
        path: '/recover-password',
        //go to recover pswd page
    },
    {
        path: '/dashboard/:id',
        //go to dashboard page
        //id = displayName of firebase auth info
    },
    {
        path: '/dashboard/:id/profile',
        //go to profile page
    }
])

export default routes;