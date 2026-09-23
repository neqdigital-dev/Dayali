import { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import { useTranslation } from 'react-i18next';
import type { AgendaEvent } from '../../stores/useDataStore';
import { supabase } from '../../lib/supabase';
import { Image as ImageIcon, X, Loader2, Download } from 'lucide-react';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: Partial<AgendaEvent>) => void;
  event: AgendaEvent | null;
}

export default function EventModal({ isOpen, onClose, onSave, event }: EventModalProps) {
  const { t, i18n } = useTranslation(['dashboard', 'common']);
  const lang = i18n.language as 'pt' | 'en';

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [category, setCategory] = useState('personal');
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update local state when event changes
  useEffect(() => {
    if (isOpen && event) {
      setTitle(event.title_pt || '');
      setDate(event.date || '');
      setTime(event.time || '');
      setDescription(event.description || event.notes || '');
      setLink(event.link || '');
      setImages(event.images || []);
      setCategory(event.category || 'personal');
    }
  }, [isOpen, event]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title_pt: title, date, time, description, link, images, category });
    onClose();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    const files = Array.from(e.target.files);
    const newImages: string[] = [];

    for (const file of files) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('event_media')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('event_media')
          .getPublicUrl(filePath);

        newImages.push(publicUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Erro ao fazer upload da imagem.');
      }
    }

    setImages(prev => [...prev, ...newImages]);
    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  if (!event) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('event.edit', { ns: 'dashboard', defaultValue: 'Editar Evento' })}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--color-text-secondary)' }}>
            {t('event.title', { ns: 'dashboard', defaultValue: 'Título' })}
          </label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            style={{
              width: '100%',
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg-base)',
              color: 'var(--color-text-primary)',
              fontSize: '1rem',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--color-text-secondary)' }}>
            Categoria
          </label>
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              width: '100%',
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg-base)',
              color: 'var(--color-text-primary)',
              fontSize: '1rem',
              outline: 'none',
            }}
          >
            <option value="personal">Pessoal</option>
            <option value="work">Trabalho</option>
            <option value="college">Faculdade</option>
            <option value="church">Igreja / Moving</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--color-text-secondary)' }}>
              Data
            </label>
            <input 
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{
                width: '100%',
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg-base)',
                color: 'var(--color-text-primary)'
              }}
            />
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--color-text-secondary)' }}>
              Horário
            </label>
            <input 
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              style={{
                width: '100%',
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg-base)',
                color: 'var(--color-text-primary)'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--color-text-secondary)' }}>
            Ideias e Descrição (Notion Style)
          </label>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="Roteiros, observações, links, detalhes do post..."
            style={{
              width: '100%',
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg-base)',
              color: 'var(--color-text-primary)',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--color-text-secondary)' }}>
            Imagens
          </label>
          
          {images.length > 0 && (
            <div style={{ display: 'flex', gap: 'var(--space-2)', overflowX: 'auto', paddingBottom: 'var(--space-2)' }}>
              {images.map((img, idx) => (
                <div key={idx} style={{ position: 'relative', width: '80px', height: '80px', flexShrink: 0, cursor: 'pointer' }} onClick={() => setPreviewImage(img)}>
                  <img 
                    src={img} 
                    alt="Event media" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} 
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      background: 'var(--color-danger)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <input 
              type="file" 
              multiple 
              accept="image/*"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
            >
              {uploading ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
              {uploading ? 'Enviando...' : 'Adicionar Imagens'}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
          <button 
            type="button" 
            onClick={onClose}
            className="btn btn-ghost"
          >
            {t('actions.cancel', { ns: 'common', defaultValue: 'Cancelar' })}
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={!title.trim() || !date || uploading}
          >
            {t('actions.save', { ns: 'common', defaultValue: 'Salvar' })}
          </button>
        </div>
      </form>

      {/* Image Preview Lightbox */}
      {previewImage && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          zIndex: 100000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-4)'
        }} onClick={() => setPreviewImage(null)}>
          <div style={{ position: 'absolute', top: 'var(--space-4)', right: 'var(--space-4)', display: 'flex', gap: 'var(--space-3)' }}>
            <a 
              href={previewImage} 
              target="_blank" 
              rel="noopener noreferrer" 
              download 
              onClick={(e) => e.stopPropagation()}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'white' }}
            >
              <Download size={20} /> Baixar Imagem
            </a>
            <button 
              onClick={(e) => { e.stopPropagation(); setPreviewImage(null); }}
              style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>
          </div>
          <img 
            src={previewImage} 
            alt="Preview" 
            style={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain', borderRadius: 'var(--radius-md)' }}
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </Modal>
  );
}
