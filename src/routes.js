import { createBrowserRouter } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import Dashboard from './pages/Dashboard';
import ToDoPage from './pages/ToDoPage';
import KanbanPage from './pages/KanbanPage';
import ProfilePage from './pages/ProfilePage';
import Reauthenticate from './pages/Reauthenticate';
import RecoverPswd from './pages/RecoverPswd';
import NewDashboard from './pages/NewDashboard';
import NotesPage from './pages/NotesPage';

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
        // element: <Dashboard />
        element: <NewDashboard />
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
    },
    {
        path: '/reauthenticate/:action',
        element: <Reauthenticate />
    },
    {
        path: "/recover-my-password",
        element: <RecoverPswd />
    },
    {
        path: "/dashboard/:id/notes",
        element: <NotesPage />
    }
])

export default routes;
