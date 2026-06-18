import { useRef } from 'react';
import Editor from '@monaco-editor/react';
import { HiOutlineClipboardDocument } from 'react-icons/hi2';

export default function CodeEditor({ value, onChange, readOnly = false, language = 'javascript', label }) {
  const editorRef = useRef(null);

  return (
    <div className="relative rounded-3xl border border-white/10 bg-card p-2 shadow-glow">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-text">{label}</div>
          <div className="text-xs text-secondary">{readOnly ? 'Read-only snapshot' : 'Your editable solution'}</div>
        </div>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(value || '');
          }}
          className="rounded-2xl bg-white/5 px-3 py-2 text-sm text-text hover:bg-white/10"
        >
          <HiOutlineClipboardDocument className="mr-2 inline h-4 w-4" /> Copy
        </button>
      </div>
      <div className="h-[420px] overflow-hidden rounded-3xl border border-white/10 bg-[#0f172a]">
        <Editor
          theme="vs-dark"
          value={value}
          onChange={onChange}
          options={{
            readOnly,
            minimap: { enabled: false },
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 13,
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            smoothScrolling: true,
          }}
          language={language}
          onMount={(editor) => {
            editorRef.current = editor;
          }}
        />
      </div>
    </div>
  );
}
