import { createBrowserRouter } from 'react-router-dom';
import { adminRoutes } from './adminRoutes';
import { publicRoutes } from './publicRoutes';

export const router = createBrowserRouter([adminRoutes, publicRoutes]);
