import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, Sparkles } from 'lucide-react';

export default function App() {
  const [isCorrecting, setIsCorrecting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Pronto');

  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Começa a digitar o teu texto aqui para o <strong>Smart Word Editor</strong> analisar...</p>',
  });

  const handleAutoCorrect = async () => {
    if (!editor) return;
    const currentText = editor.getText();
    if (!currentText.trim()) return;

    setIsCorrecting(true);
    setStatusMessage('A analisar e corrigir texto...');

    try {
      const response = await fetch('http://localhost:3000/api/correct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: currentText }),
      });

      const data = await response.json();
      if (data.correctedText) {
        editor.commands.setContent(`<p>${data.correctedText}</p>`);
        setStatusMessage('Texto corrigido com sucesso!');
      }
    } catch (error) {
      console.error('Erro na ligação ao backend:', error);
      setStatusMessage('Erro ao ligar ao servidor backend.');
    } finally {
      setIsCorrecting(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>?? Smart Word Editor</h2>
        <span style={{ fontSize: '14px', color: '#666' }}>{statusMessage}</span>
      </header>

      <div style={{ display: 'flex', gap: '10px', padding: '10px', background: '#f0f0f0', borderRadius: '8px 8px 0 0', border: '1px solid #ccc' }}>
        <button onClick={() => editor?.chain().focus().toggleBold().run()} style={{ padding: '6px 12px', cursor: 'pointer' }}>
          <Bold size={16} />
        </button>
        <button onClick={() => editor?.chain().focus().toggleItalic().run()} style={{ padding: '6px 12px', cursor: 'pointer' }}>
          <Italic size={16} />
        </button>
        <button 
          onClick={handleAutoCorrect} 
          disabled={isCorrecting}
          style={{ padding: '6px 12px', cursor: 'pointer', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Sparkles size={16} /> {isCorrecting ? 'A corrigir...' : 'Autocorrigir com IA'}
        </button>
      </div>

      <div style={{ border: '1px solid #ccc', borderTop: 'none', minHeight: '300px', padding: '20px', borderRadius: '0 0 8px 8px', background: '#fff' }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}