import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '../features/layout/Layout';
import { CollectionListPage } from '../features/collection/pages/CollectionListPage';
import { CreatePiecePage } from '../features/collection/pages/CreatePiecePage';
import { EditPiecePage } from '../features/collection/pages/EditPiecePage';
import { PieceDetailPage } from '../features/collection/pages/PieceDetailPage';
import { CreateExchangePage } from '../features/exchanges/pages/CreateExchangePage';
import { ExchangeListPage } from '../features/exchanges/pages/ExchangeListPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout><CollectionListPage /></Layout>,
    },
    {
        path: '/pieces/new',
        element: <Layout><CreatePiecePage /></Layout>,
    },
    {
        path: '/pieces/:id',
        element: <Layout><PieceDetailPage /></Layout>,
    },
    {
        path: '/pieces/:id/edit',
        element: <Layout><EditPiecePage /></Layout>,
    },
    {
        path: '/exchanges',
        element: <Layout><ExchangeListPage /></Layout>,
    },
    {
        path: '/exchanges/new',
        element: <Layout><CreateExchangePage /></Layout>,
    },
]);
