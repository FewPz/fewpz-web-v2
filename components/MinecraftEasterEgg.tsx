import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const TRIGGER = 'minecraft';
const IGN = 'FewFond_';
const SKIN_URL = `https://mc-heads.net/avatar/${IGN}/64`;

export default function MinecraftEasterEgg() {
  const [show, setShow] = useState(false);
  const [buffer, setBuffer] = useState('');

  const fire = useCallback(() => {
    setShow(true);
    setTimeout(() => setShow(false), 6000);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key.length !== 1) return;

      const next = (buffer + e.key.toLowerCase()).slice(-TRIGGER.length);
      setBuffer(next);

      if (next === TRIGGER) {
        fire();
        setBuffer('');
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [buffer, fire]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="mc-egg"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          onClick={() => setShow(false)}
          className="fixed top-20 right-4 z-[200] cursor-pointer select-none"
          title="Click to dismiss"
        >
          {/* Outer border (dark) */}
          <div
            style={{
              padding: '2px',
              background: '#160F00',
              boxShadow: '0 4px 24px rgba(0,0,0,0.7)',
            }}
          >
            {/* Inner border (gold) */}
            <div
              style={{
                padding: '2px',
                background: 'linear-gradient(135deg, #C89627 0%, #7E5C00 50%, #C89627 100%)',
              }}
            >
              {/* Content */}
              <div
                style={{
                  background: '#160F00',
                  padding: '10px 14px',
                  minWidth: '240px',
                  fontFamily: '"Courier New", Courier, monospace',
                }}
              >
                {/* Header */}
                <p
                  style={{
                    color: '#FFAA00',
                    fontSize: '10px',
                    letterSpacing: '0.04em',
                    marginBottom: '8px',
                    textShadow: '1px 1px 0 #3D2A00',
                  }}
                >
                  Achievement Get!
                </p>

                {/* Body: skin + text */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img
                    src={SKIN_URL}
                    alt={IGN}
                    width={32}
                    height={32}
                    style={{
                      imageRendering: 'pixelated',
                      display: 'block',
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <p
                      style={{
                        color: '#FFFFFF',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        textShadow: '1px 1px 0 #333',
                      }}
                    >
                      Find the Developer
                    </p>
                    <p
                      style={{
                        color: '#AAAAAA',
                        fontSize: '10px',
                        marginTop: '3px',
                        textShadow: '1px 1px 0 #111',
                      }}
                    >
                      {IGN}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
