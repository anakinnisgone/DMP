import { useState } from 'react';
import { StickyNote, Plus, Trash2 } from 'lucide-react';
import type { Note } from '../../types';
import { useData } from '../../store/DataContext';
import { formatDate } from '../../utils/helpers';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { SectionTitle, EmptyState } from '../ui/Common';
import { Modal } from '../ui/Modal';

interface StaffNotesSectionProps {
  staffId: string;
  notes: Note[];
}

export function StaffNotesSection({ staffId, notes }: StaffNotesSectionProps) {
  const { addNote, deleteNote } = useData();
  const [noteModal, setNoteModal] = useState(false);
  const [noteText, setNoteText] = useState('');

  const handleAddNote = () => {
    if (noteText.trim()) {
      addNote(staffId, noteText.trim());
      setNoteText('');
      setNoteModal(false);
    }
  };

  return (
    <>
      <Card padding="lg">
        <SectionTitle
          icon={StickyNote}
          action={<Button variant="primary" size="sm" icon={Plus} onClick={() => setNoteModal(true)}>Not Ekle</Button>}
        >
          Notlar ({notes.length})
        </SectionTitle>

        {notes.length === 0 ? (
          <EmptyState title="Not yok" description="Henüz hiçbir not eklenmemiş" />
        ) : (
          <div className="space-y-2">
            {notes.map((note) => (
              <div key={note.id} className="rounded-lg border border-discord-border bg-discord-elevated/50 p-3">
                <div className="mb-1.5 flex items-start justify-between">
                  <p className="text-xs font-semibold text-discord-muted">{note.author}</p>
                  <Button variant="ghost" size="sm" icon={Trash2} onClick={() => deleteNote(note.id)} className="!p-0 !h-auto" />
                </div>
                <p className="text-sm text-discord-text">{note.content}</p>
                <p className="mt-1.5 text-[11px] text-discord-faint">{formatDate(note.createdAt)}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal
        open={noteModal}
        onClose={() => {
          setNoteModal(false);
          setNoteText('');
        }}
        title="Not Ekle"
        footer={
          <>
            <Button variant="ghost" onClick={() => setNoteModal(false)}>
              Vazgeç
            </Button>
            <Button variant="primary" onClick={handleAddNote} disabled={!noteText.trim()}>
              Ekle
            </Button>
          </>
        }
      >
        <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} className="input-base min-h-[120px] resize-none" placeholder="Notu yazın..." autoFocus />
      </Modal>
    </>
  );
}
