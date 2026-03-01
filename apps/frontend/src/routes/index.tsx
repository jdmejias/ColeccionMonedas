import { createBrowserRouter, Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { Layout } from '../features/layout/Layout';
import { LoginPage } from '../features/auth/LoginPage';
import { ProtectedRoute } from '../shared/components/ProtectedRoute';
import { CollectionListPage } from '../features/collection/pages/CollectionListPage';
import { CreatePiecePage } from '../features/collection/pages/CreatePiecePage';
import { EditPiecePage } from '../features/collection/pages/EditPiecePage';
import { PieceDetailPage } from '../features/collection/pages/PieceDetailPage';
import { TopCollectionPage } from '../features/collection/pages/TopCollectionPage';
import { CreateExchangePage } from '../features/exchanges/pages/CreateExchangePage';
import { ExchangeListPage } from '../features/exchanges/pages/ExchangeListPage';
import { ExchangeHistoryPage } from '../features/exchanges/pages/ExchangeHistoryPage';
import { ProfilePage } from '../features/profile/ProfilePage';

const withLayout = (element: ReactNode) => (
    <ProtectedRoute>
        <Layout>{element}</Layout>
    </ProtectedRoute>
);

const ownerOnly = (element: ReactNode) => (
    <ProtectedRoute ownerOnly>
        <Layout>{element}</Layout>
    </ProtectedRoute>
);

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/',
        element: withLayout(<CollectionListPage />),
    },
    {
        path: '/pieces/new',
        element: ownerOnly(<CreatePiecePage />),
    },
    {
        path: '/pieces/:id',
        element: withLayout(<PieceDetailPage />),
    },
    {
        path: '/pieces/:id/edit',
        element: ownerOnly(<EditPiecePage />),
    },
    {
        path: '/top',
        element: withLayout(<TopCollectionPage />),
    },
    {
        path: '/exchanges',
        element: withLayout(<ExchangeListPage />),
    },
    {
        path: '/exchanges/new',
        element: withLayout(<CreateExchangePage />),
    },
    {
        path: '/exchanges/history',
        element: ownerOnly(<ExchangeHistoryPage />),
    },
    {
        path: '/profile',
        element: withLayout(<ProfilePage />),
    },
    {
        path: '*',
        element: <Navigate to="/" replace />,
    },
]);

