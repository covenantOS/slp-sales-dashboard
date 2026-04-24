import {
  Save,
  RotateCcw,
  Download,
  FolderOpen,
  Copy,
  ExternalLink,
  Check,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
  onSave: () => Promise<void> | void;
  onReset: () => void;
  onLoad: () => void;
  onExportJSON: () => void;
  onOpenProposal: () => void;
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
  onOpenProposal,
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
          if (quoteId) setCopied(true);
        }}
        title={quoteId ? 'Copy client proposal link' : 'Save first'}
      >
        {copied ? <Check size={15} /> : <Copy size={15} />}
        {copied ? 'Copied' : 'Share'}
      </button>
      <button className="btn-ghost" onClick={onExportJSON}>
        <Download size={15} /> JSON
      </button>
      <button className="btn-outline" onClick={onOpenProposal}>
        <ExternalLink size={15} /> Client Proposal
      </button>
      <button className="btn-ghost" onClick={onReset}>
        <RotateCcw size={15} />
      </button>
      <button
        className="btn-red"
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
