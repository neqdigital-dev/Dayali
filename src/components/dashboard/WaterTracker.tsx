import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { Droplets, Plus } from 'lucide-react';

const DEFAULT_GOAL = 8;

export default function WaterTracker() {
  const { t } = useTranslation('dashboard');
  const [cups, setCups] = useState(4); // Demo: 4 of 8
  const goal = DEFAULT_GOAL;
  const isComplete = cups >= goal;

  const addCup = () => {
    if (cups < goal) {
      setCups((c) => c + 1);
    }
  };

  const toggleCup = (index: number) => {
    // Click on a filled cup to remove, or on an empty cup to fill up to that point
    if (index < cups) {
      setCups(index);
    } else {
      setCups(index + 1);
    }
  };

  return (
    <div className={`water-tracker ${isComplete ? 'water-complete' : ''}`}>
      <div className="water-icon">
        <Droplets size={22} />
      </div>

      <div className="water-info">
        <span className="water-label">{t('water.title')}</span>
        <span className="water-count">
          {cups} / {goal} <span className="water-unit">{t('water.cups')}</span>
        </span>
      </div>

      <div className="water-cups">
        {Array.from({ length: goal }).map((_, i) => (
          <motion.button
            key={i}
            className={`water-cup ${i < cups ? 'filled' : ''}`}
            onClick={() => toggleCup(i)}
            whileTap={{ scale: 0.85 }}
            aria-label={`Cup ${i + 1}`}
          />
        ))}
      </div>

      <AnimatePresence>
        {isComplete ? (
          <motion.span
            className="water-goal-text"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--weight-medium)',
              color: 'var(--color-success)',
              whiteSpace: 'nowrap',
            }}
          >
            {t('water.goal_reached')}
          </motion.span>
        ) : (
          <motion.button
            className="water-add-btn"
            onClick={addCup}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.08 }}
            aria-label={t('water.add_cup')}
          >
            <Plus size={18} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
