import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, Twitter, Linkedin, Copy, Download, FileText, Check, MessageCircle } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useGamification } from '../context/GamificationContext';

export default function ShareTerminal({ targetRef }: { targetRef: React.RefObject<HTMLDivElement> }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { level, xp, streak } = useGamification();

  const shareText = `SYS.USER STATUS: CLEARANCE_LVL [${level}] | DATA_FRAGMENTS [${xp}] | SYNC_STREAK [${streak} CYCLES]. Can you bypass my firewall?`;
  const shareUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  const handleLinkedInShare = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    window.open(url, '_blank');
  };

  const exportAsImage = async () => {
    if (!targetRef.current) return;
    try {
      const canvas = await html2canvas(targetRef.current, {
        backgroundColor: '#000000',
        scale: 2,
        logging: false,
        useCORS: true,
      });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `SYS_PROFILE_LVL${level}.png`;
      link.click();
      
      // Save to local history
      saveToHistory('IMAGE_EXPORT');
    } catch (err) {
      console.error('Failed to export image', err);
    }
  };

  const exportAsPDF = async () => {
    if (!targetRef.current) return;
    try {
      const canvas = await html2canvas(targetRef.current, {
        backgroundColor: '#000000',
        scale: 2,
        logging: false,
        useCORS: true,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`SYS_PROFILE_LVL${level}.pdf`);
      
      // Save to local history
      saveToHistory('PDF_EXPORT');
    } catch (err) {
      console.error('Failed to export PDF', err);
    }
  };

  const saveToHistory = (action: string) => {
    const history = JSON.parse(localStorage.getItem('SYS_SHARE_HISTORY') || '[]');
    history.push({
      action,
      timestamp: new Date().toISOString(),
      level,
      xp
    });
    localStorage.setItem('SYS_SHARE_HISTORY', JSON.stringify(history));
  };

  return (
    <div className="relative mt-4 w-full max-w-[460px]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-3 bg-black border-2 border-cyan-500 text-cyan-400 font-display tracking-widest uppercase text-sm flex items-center justify-center gap-2 hover:bg-cyan-900/30 transition-all shadow-[0_0_10px_#0ff]"
      >
        <Share2 className="w-4 h-4" />
        [ BROADCAST_STATUS ]
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="overflow-hidden border-x-2 border-b-2 border-cyan-500 bg-black/90 backdrop-blur-md"
          >
            <div className="p-4 flex flex-col gap-4">
              <div className="text-xs text-magenta-500 font-medium uppercase tracking-widest border-b border-magenta-500/30 pb-2">
                // SELECT_TRANSMISSION_PROTOCOL
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <ShareButton icon={<Twitter className="w-4 h-4" />} label="TWITTER" onClick={handleTwitterShare} color="cyan" />
                <ShareButton icon={<Linkedin className="w-4 h-4" />} label="LINKEDIN" onClick={handleLinkedInShare} color="cyan" />
                <ShareButton icon={<MessageCircle className="w-4 h-4" />} label="WHATSAPP" onClick={handleWhatsAppShare} color="cyan" />
                <ShareButton 
                  icon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} 
                  label={copied ? "COPIED" : "COPY_LINK"} 
                  onClick={handleCopyLink} 
                  color="magenta" 
                />
              </div>

              <div className="text-xs text-magenta-500 font-medium uppercase tracking-widest border-b border-magenta-500/30 pb-2 mt-2">
                // EXPORT_DATA_FRAGMENTS
              </div>

              <div className="grid grid-cols-2 gap-2">
                <ShareButton icon={<Download className="w-4 h-4" />} label="AS_IMAGE" onClick={exportAsImage} color="magenta" />
                <ShareButton icon={<FileText className="w-4 h-4" />} label="AS_PDF" onClick={exportAsPDF} color="magenta" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ShareButton({ icon, label, onClick, color }: { icon: React.ReactNode, label: string, onClick: () => void, color: 'cyan' | 'magenta' }) {
  const hoverClass = color === 'cyan' ? 'hover:bg-cyan-900/40 hover:text-cyan-300 border-cyan-500/50' : 'hover:bg-magenta-900/40 hover:text-magenta-300 border-magenta-500/50';
  const textClass = color === 'cyan' ? 'text-cyan-500' : 'text-magenta-500';
  
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 p-2 border bg-black/50 text-[10px] font-display tracking-widest uppercase transition-all ${textClass} ${hoverClass}`}
    >
      {icon}
      {label}
    </button>
  );
}
