export type PieceType = 'Moneda' | 'Billete';

export type ConservationState =
    | 'Excelente'
    | 'Muy Bueno'
    | 'Bueno'
    | 'Regular'
    | 'Pobre';

export interface Piece {
    id: string;
    name: string;
    type: PieceType;
    country: string;
    year: number;
    conservationState: ConservationState;
    estimatedValue: number;
    imageUrl: string;
    description: string;
    availableForExchange: boolean;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreatePieceDTO {
    name: string;
    type: PieceType;
    country: string;
    year: number;
    conservationState: ConservationState;
    estimatedValue: number;
    imageUrl: string;
    description: string;
}

export interface UpdatePieceDTO extends Partial<CreatePieceDTO> {
    availableForExchange?: boolean;
}

export type ExchangeStatus = 'pending' | 'accepted' | 'rejected' | 'countered' | 'counter_accepted' | 'counter_rejected';

export interface ExchangeRequest {
    id: string;
    fromUserId: string;
    toUserId: string;
    fromPieceId: string;
    toPieceId: string;
    status: ExchangeStatus;
    requesterName: string;
    requesterEmail: string;
    message?: string;
    counterOffer?: string;
    counterResponse?: string;
    completedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateExchangeRequestDTO {
    fromPieceId: string;
    toPieceId: string;
    toUserId: string;
    requesterName: string;
    requesterEmail: string;
    message?: string;
}

export interface PieceFilters {
    search?: string;
    country?: string;
    type?: PieceType | '';
    yearFrom?: number;
    yearTo?: number;
    availableForExchange?: boolean;
    conservationState?: ConservationState | '';
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'owner' | 'visitor';
}
