import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Share2, BadgeCheck, Fingerprint } from "lucide-react";
import { ROLES, BADGE_COLORS, BRAND_NAME } from "../constants";
import type { PledgeSignature } from "../types";

interface PledgeModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (sig: PledgeSignature) => void;
  existing?: PledgeSignature | null;
}

export default function PledgeModal({ open, onClose, onSave, existing }: PledgeModalProps) {
  const [name, setName] = useState(existing?.name || "");
  const [role, setRole] = useState(existing?.role || ROLES[0]);
  const [badgeColor, setBadgeColor] = useState(existing?.badgeColor || BADGE_COLORS[0].value);
  const [signed, setSigned] = useState(!!existing);
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    if (existing) {
      setName(existing.name);
      setRole(existing.role);
      setBadgeColor(existing.badgeColor);
      setSigned(true);
    }
  }, [existing]);

  const handleSign = () => {
    if (!name.trim()) return;
    const sig: PledgeSignature = {
      name: name.trim(),
      role,
      badgeColor,
      timestamp: Date.now(),
      completed: true,
    };
    onSave(sig);
    setSigned(true);
    setShowCertificate(true);
  };

  const handleDownload = () => {
    const cert = document.getElementById("novaheart-certificate");
    if (!cert) return;
    import("html2canvas").then((mod) => {
      mod.default(cert, { scale: 2 }).then((canvas) => {
        const link = document.createElement("a");
        link.download = `novaheart-pledge-${name.trim().replace(/\s+/g, "-")}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      });
    });
  };

  const handleShare = async () => {
    const text = `I signed the ${BRAND_NAME} Movement Pledge as a ${role}! Join me in advancing human progress through innovation, education, and action.`;
    if (navigator.share) {
      await navigator.share({ title: `${BRAND_NAME} Pledge`, text });
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative w-full max-w-lg rounded-2xl border border-zinc-700/50 bg-zinc-900/95 p-6 shadow-2xl"
            initial={{ scale: 0.9, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 40, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
            >
              <X className="h-5 w-5" />
            </button>

            {!showCertificate ? (
              <>
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500">
                    <Fingerprint className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Sign the Pledge</h3>
                    <p className="text-sm text-zinc-400">Commit to advancing human progress</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-zinc-300">Your Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-zinc-300">Your Impact Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r} className="bg-zinc-900">
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-zinc-300">Badge Color</label>
                    <div className="flex gap-2">
                      {BADGE_COLORS.map((bc) => (
                        <button
                          key={bc.label}
                          onClick={() => setBadgeColor(bc.value)}
                          className={`h-8 w-8 rounded-full bg-gradient-to-br ${bc.value} ring-2 ring-offset-2 ring-offset-zinc-900 transition-all ${
                            badgeColor === bc.value ? "ring-white scale-110" : "ring-transparent hover:scale-105"
                          }`}
                          title={bc.label}
                        />
                      ))}
                    </div>
                  </div>

                  <motion.button
                    onClick={handleSign}
                    disabled={!name.trim()}
                    className="relative mt-2 w-full overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all hover:shadow-cyan-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
                    whileHover={{ scale: name.trim() ? 1.02 : 1 }}
                    whileTap={{ scale: name.trim() ? 0.98 : 1 }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <BadgeCheck className="h-4 w-4" />
                      Sign the Novaheart Movement Pledge
                    </span>
                  </motion.button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div
                  id="novaheart-certificate"
                  className="relative overflow-hidden rounded-xl border border-zinc-700/50 bg-gradient-to-br from-zinc-900 to-zinc-950 p-6"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(6,182,212,0.08),transparent_70%)] pointer-events-none" />
                  <div className="relative z-10 text-center">
                    <div className={`mx-auto mb-4 h-16 w-16 rounded-2xl bg-gradient-to-br ${badgeColor} flex items-center justify-center shadow-lg`}>
                      <BadgeCheck className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-white">{BRAND_NAME}</h4>
                    <p className="mb-1 text-xs text-zinc-500">Movement Pledge Certificate</p>
                    <div className="my-3 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
                    <p className="text-sm text-zinc-400">This certifies that</p>
                    <p className="mt-1 text-xl font-bold text-white">{name}</p>
                    <p className="mt-1 text-sm text-zinc-400">has pledged to advance human progress as a</p>
                    <p className={`mt-1 inline-block rounded-full bg-gradient-to-r ${badgeColor} px-3 py-0.5 text-xs font-semibold text-white`}>
                      {role}
                    </p>
                    <p className="mt-3 text-xs text-zinc-600">
                      Signed on {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                    <div className="mt-3 flex items-center justify-center gap-2 text-zinc-600">
                      <Fingerprint className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-mono">{name.length * 7 + role.length * 3}NOVAHEART</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <motion.button
                    onClick={handleDownload}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </motion.button>
                  <motion.button
                    onClick={handleShare}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </motion.button>
                  <motion.button
                    onClick={onClose}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-2.5 text-xs font-medium text-white transition-all hover:shadow-lg hover:shadow-cyan-500/20"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Close
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}