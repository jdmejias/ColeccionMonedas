import { useState } from 'react';
import { useProfile, useUpdateProfile } from './hooks/useProfile';
import { Button } from '../../shared/components/Button';
import { Spinner } from '../../shared/components/Spinner';

const OWNER_ID = 'user-1';

export const ProfilePage = () => {
    const { data: profile, isLoading } = useProfile(OWNER_ID);
    const updateMutation = useUpdateProfile(OWNER_ID);

    const [editing, setEditing] = useState(false);
    const [formName, setFormName] = useState('');
    const [formBio, setFormBio] = useState('');
    const [formPhoto, setFormPhoto] = useState('');

    const handleEdit = () => {
        setFormName(profile?.name ?? '');
        setFormBio(profile?.bio ?? '');
        setFormPhoto(profile?.photoUrl ?? '');
        setEditing(true);
    };

    const handleSave = async () => {
        try {
            await updateMutation.mutateAsync({
                name: formName.trim() || (profile?.name ?? ''),
                bio: formBio.trim(),
                photoUrl: formPhoto.trim(),
            });
            setEditing(false);
        } catch {
            alert('Error al guardar el perfil');
        }
    };

    if (isLoading) return (
        <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>
    );

    const photoUrl = profile?.photoUrl
        ? profile.photoUrl
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name ?? 'Coleccionista')}&size=256&background=f59e0b&color=fff&bold=true`;

    return (
        <div className="max-w-xl mx-auto animate-slide-up">
            <div className="bg-white rounded-3xl shadow-card overflow-hidden">
                {/* Header banner */}
                <div className="h-32 bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400" />

                {/* Content */}
                <div className="px-8 pb-8">
                    {/* Avatar row */}
                    <div className="flex items-end gap-5 -mt-14 mb-6">
                        <img
                            src={photoUrl}
                            alt={profile?.name ?? 'Perfil'}
                            className="w-28 h-28 rounded-full border-4 border-white shadow-xl object-cover bg-amber-100 flex-shrink-0"
                            onError={e => {
                                (e.target as HTMLImageElement).src =
                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name ?? 'C')}&size=256&background=f59e0b&color=fff&bold=true`;
                            }}
                        />
                        <div className="pb-2 flex-1 min-w-0">
                            <h1 className="font-display text-2xl font-bold text-gray-900 truncate">
                                {profile?.name ?? '—'}
                            </h1>
                            <p className="text-sm text-amber-600 font-medium">Ingeniería y Ciencias</p>
                        </div>
                        <div className="pb-2">
                            <Button variant="secondary" onClick={handleEdit} className="text-sm whitespace-nowrap">
                                Editar
                            </Button>
                        </div>
                    </div>

                    {/* Bio */}
                    {profile?.bio ? (
                        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
                            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">Descripción</p>
                            <p className="text-gray-700 text-sm leading-relaxed">{profile.bio}</p>
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-2xl p-5 text-center text-gray-400">
                            <p className="text-sm">Sin descripción. Haz clic en Editar para añadir una.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            {editing && (
                <div className="modal-overlay" onClick={() => setEditing(false)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <h3 className="font-display text-xl font-bold text-gray-900 mb-5">Editar Perfil</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="label text-xs">Nombre</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={formName}
                                    onChange={e => setFormName(e.target.value)}
                                    placeholder="Tu nombre completo"
                                />
                            </div>
                            <div>
                                <label className="label text-xs">Foto (URL)</label>
                                <input
                                    type="url"
                                    className="input"
                                    value={formPhoto}
                                    onChange={e => setFormPhoto(e.target.value)}
                                    placeholder="https://..."
                                />
                                {formPhoto && (
                                    <img
                                        src={formPhoto}
                                        alt="preview"
                                        className="mt-2 w-16 h-16 rounded-full object-cover border-2 border-amber-200"
                                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                    />
                                )}
                            </div>
                            <div>
                                <label className="label text-xs">Descripción</label>
                                <textarea
                                    className="input resize-none"
                                    rows={3}
                                    value={formBio}
                                    onChange={e => setFormBio(e.target.value)}
                                    placeholder="Cuéntanos sobre tu colección..."
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <Button variant="primary" onClick={handleSave} isLoading={updateMutation.isPending} className="flex-1">
                                Guardar cambios
                            </Button>
                            <Button variant="secondary" onClick={() => setEditing(false)}>Cancelar</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
