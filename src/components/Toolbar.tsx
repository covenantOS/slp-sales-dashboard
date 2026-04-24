import {
  Save,
  RotateCcw,
  Download,
  FolderOpen,
  Copy,
  FileText,
  Check,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
  onSave: () => Promise<void> | void;
  onReset: () => void;
  onLoad: () => void;
  onExportJSON: () => void;
  onExportProposal: () => void;
  onCopyLink: () => void;
  saving?: boolean;
  lastSavedAt?: string | null;
  quoteId?: string | null;
}

export function Toolbar({
  onSave,
  onReset,
  onLoad,
  onExportJSON,
  onExportProposal,
  onCopyLink,
  saving,
  lastSavedAt,
  quoteId,
}: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button className="btn-ghost" onClick={onLoad}>
        <FolderOpen size={15} /> Load
      </button>
      <button
        className="btn-ghost"
        onClick={() => {
          onCopyLink();
          setCopied(true);
        }}
        disabled={!quoteId}
        title={quoteId ? 'Copy shareable link' : 'Save first to get a link'}
      >
        {copied ? <Check size={15} /> : <Copy size={15} />}
        {copied ? 'Copied' : 'Share'}
      </button>
      <button className="btn-ghost" onClick={onExportJSON}>
        <Download size={15} /> JSON
      </button>
      <button className="btn-ghost" onClick={onExportProposal}>
        <FileText size={15} /> Proposal
      </button>
      <button className="btn-ghost" onClick={onReset}>
        <RotateCcw size={15} /> Reset
      </button>
      <button
        className="btn-brand"
        onClick={() => onSave()}
        disabled={saving}
        title={lastSavedAt ? `Last saved ${lastSavedAt}` : 'Save quote'}
      >
        <Save size={15} />
        {saving ? 'Saving…' : quoteId ? 'Update' : 'Save Quote'}
      </button>
    </div>
  );
}
