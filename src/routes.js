import { createBrowserRouter } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import Dashboard from './pages/Dashboard';
import ToDoPage from './pages/ToDoPage';
import KanbanPage from './pages/KanbanPage';
import ProfilePage from './pages/ProfilePage';

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
        element: <Dashboard />
    },
    {
        path: '/dashboard/:id/profile',
        //go to profile page
        element: <ProfilePage />
    },
    {
        path: '/dashboard/:id/todo',
        //go to to do page
        element: <ToDoPage />
    },
    {
        path: '/dashboard/:id/kanban',
        //go to kanban page
        // element: <KanbanPage />
    }
])

export default routes;