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

export interface ExchangeRequest {
    id: string;
    fromUserId: string;
    toUserId: string;
    fromPieceId: string;
    toPieceId: string;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: string;
    updatedAt: string;
}

export interface CreateExchangeRequestDTO {
    fromPieceId: string;
    toPieceId: string;
    toUserId: string;
}
