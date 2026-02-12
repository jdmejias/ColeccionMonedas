import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreatePiece, useUpdatePiece } from '../hooks/usePieces';
import type { Piece, PieceType, ConservationState } from '../../../shared/types';
import { Input } from '../../../shared/components/Input';
import { Select } from '../../../shared/components/Select';
import { Textarea } from '../../../shared/components/Textarea';
import { Button } from '../../../shared/components/Button';

interface PieceFormProps {
    piece?: Piece;
    mode: 'create' | 'edit';
}

const PIECE_TYPES: { value: PieceType; label: string }[] = [
    { value: 'Moneda', label: 'Moneda' },
    { value: 'Billete', label: 'Billete' },
];

const CONSERVATION_STATES: { value: ConservationState; label: string }[] = [
    { value: 'Excelente', label: 'Excelente' },
    { value: 'Muy Bueno', label: 'Muy Bueno' },
    { value: 'Bueno', label: 'Bueno' },
    { value: 'Regular', label: 'Regular' },
    { value: 'Pobre', label: 'Pobre' },
];

export const PieceForm = ({ piece, mode }: PieceFormProps) => {
    const navigate = useNavigate();
    const createMutation = useCreatePiece();
    const updateMutation = useUpdatePiece();

    const [formData, setFormData] = useState({
        name: piece?.name || '',
        type: piece?.type || '' as PieceType,
        country: piece?.country || '',
        year: piece?.year?.toString() || '',
        conservationState: piece?.conservationState || '' as ConservationState,
        estimatedValue: piece?.estimatedValue?.toString() || '',
        imageUrl: piece?.imageUrl || '',
        description: piece?.description || '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
        if (!formData.type) newErrors.type = 'El tipo es requerido';
        if (!formData.country.trim()) newErrors.country = 'El país es requerido';
        if (!formData.year) newErrors.year = 'El año es requerido';
        else if (isNaN(Number(formData.year)) || Number(formData.year) < 1) {
            newErrors.year = 'El año debe ser un número válido';
        }
        if (!formData.conservationState) {
            newErrors.conservationState = 'El estado de conservación es requerido';
        }
        if (!formData.estimatedValue) {
            newErrors.estimatedValue = 'El valor estimado es requerido';
        } else if (isNaN(Number(formData.estimatedValue)) || Number(formData.estimatedValue) < 0) {
            newErrors.estimatedValue = 'El valor debe ser un número válido';
        }
        if (!formData.imageUrl.trim()) {
            newErrors.imageUrl = 'La URL de la imagen es requerida';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        const data = {
            name: formData.name.trim(),
            type: formData.type,
            country: formData.country.trim(),
            year: Number(formData.year),
            conservationState: formData.conservationState,
            estimatedValue: Number(formData.estimatedValue),
            imageUrl: formData.imageUrl.trim(),
            description: formData.description.trim(),
        };

        try {
            if (mode === 'create') {
                await createMutation.mutateAsync(data);
                alert('¡Pieza creada exitosamente!');
            } else if (piece) {
                await updateMutation.mutateAsync({ id: piece.id, data });
                alert('¡Pieza actualizada exitosamente!');
            }
            navigate('/');
        } catch (error) {
            alert('Error al guardar la pieza. Por favor, intenta de nuevo.');
            console.error('Error:', error);
        }
    };

    const isLoading = createMutation.isPending || updateMutation.isPending;

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {mode === 'create' ? 'Registrar Nueva Pieza' : 'Editar Pieza'}
                </h2>

                <div className="space-y-4">
                    <Input
                        id="name"
                        label="Nombre"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        error={errors.name}
                        required
                        placeholder="Ej: Moneda de 1 peso argentino"
                    />

                    <Select
                        id="type"
                        label="Tipo"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as PieceType })}
                        options={PIECE_TYPES}
                        error={errors.type}
                        required
                    />

                    <Input
                        id="country"
                        label="País"
                        type="text"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        error={errors.country}
                        required
                        placeholder="Ej: Argentina"
                    />

                    <Input
                        id="year"
                        label="Año"
                        type="number"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        error={errors.year}
                        required
                        placeholder="Ej: 1985"
                    />

                    <Select
                        id="conservationState"
                        label="Estado de Conservación"
                        value={formData.conservationState}
                        onChange={(e) =>
                            setFormData({ ...formData, conservationState: e.target.value as ConservationState })
                        }
                        options={CONSERVATION_STATES}
                        error={errors.conservationState}
                        required
                    />

                    <Input
                        id="estimatedValue"
                        label="Valor Estimado (USD)"
                        type="number"
                        step="0.01"
                        value={formData.estimatedValue}
                        onChange={(e) => setFormData({ ...formData, estimatedValue: e.target.value })}
                        error={errors.estimatedValue}
                        required
                        placeholder="Ej: 50.00"
                    />

                    <Input
                        id="imageUrl"
                        label="URL de la Imagen"
                        type="url"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        error={errors.imageUrl}
                        required
                        placeholder="https://ejemplo.com/imagen.jpg"
                    />

                    <Textarea
                        id="description"
                        label="Descripción"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        error={errors.description}
                        placeholder="Descripción detallada de la pieza..."
                    />
                </div>

                <div className="flex gap-4 mt-6">
                    <Button type="submit" variant="primary" isLoading={isLoading} className="flex-1">
                        {mode === 'create' ? 'Crear Pieza' : 'Actualizar Pieza'}
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => navigate('/')}
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>
                </div>
            </div>
        </form>
    );
};
