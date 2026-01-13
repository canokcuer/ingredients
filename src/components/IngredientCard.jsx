import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, MapPin, FlaskConical, ShieldCheck } from 'lucide-react';
import useLongPress from '../hooks/useLongPress';

/**
 * IngredientCard - Individual ingredient card with X-Ray interaction
 *
 * Supports press-and-hold to reveal scientific data about the ingredient.
 *
 * @param {Object} props
 * @param {string} props.image - URL of the ingredient image
 * @param {string} props.name - Ingredient name (for alt text)
 * @param {string} props.heroTitle - Display title (e.g., "Stres Kalkanı")
 * @param {string} props.subtitle - Subtitle text
 * @param {string} props.origin - Origin location
 * @param {string} props.activeCompound - Active compound info
 * @param {string} props.labResult - Lab test result
 */
function IngredientCard({
  image,
  name,
  heroTitle,
  subtitle,
  origin,
  activeCompound,
  labResult
}) {
  const { isPressed, handlers } = useLongPress({
    threshold: 300,
    moveThreshold: 10
  });

  return (
    <div
      className="ingredient-card"
      data-testid="ingredient-card"
      {...handlers}
      role="button"
      tabIndex={0}
      aria-pressed={isPressed}
      aria-label={`${heroTitle} - ${subtitle}. Detayları görmek için basılı tutun.`}
    >
      {/* Background Image */}
      <motion.img
        src={image}
        alt={name}
        className="ingredient-card__image"
        loading="lazy"
        animate={{
          filter: isPressed ? 'blur(8px) brightness(0.4)' : 'blur(0px) brightness(1)',
          scale: isPressed ? 1.05 : 1
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />

      {/* Default State Content */}
      <AnimatePresence>
        {!isPressed && (
          <motion.div
            className="ingredient-card__content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="ingredient-card__hero-title">{heroTitle}</h3>
            <p className="ingredient-card__subtitle">{subtitle}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fingerprint Hint (pulsing) */}
      <AnimatePresence>
        {!isPressed && (
          <motion.div
            className="ingredient-card__hint"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            aria-hidden="true"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              <Fingerprint size={24} className="text-white" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* X-Ray Overlay */}
      <AnimatePresence>
        {isPressed && (
          <motion.div
            className="xray-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            data-testid="xray-overlay"
          >
            {/* Scanner Line */}
            <motion.div
              className="xray-overlay__scanner"
              initial={{ top: 0 }}
              animate={{ top: '100%' }}
              transition={{
                duration: 1.5,
                ease: 'linear',
                repeat: Infinity
              }}
              aria-hidden="true"
            />

            {/* Ingredient Name */}
            <motion.h4
              className="text-xl font-bold text-white mb-6 text-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {name}
            </motion.h4>

            {/* Data Points */}
            <div className="xray-overlay__data">
              <DataPoint
                icon={<MapPin size={18} />}
                label="KÖKENİ"
                value={origin}
                delay={0.2}
              />
              <DataPoint
                icon={<FlaskConical size={18} />}
                label="AKTİF BİLEŞEN"
                value={activeCompound}
                delay={0.3}
              />
              <DataPoint
                icon={<ShieldCheck size={18} />}
                label="LABORATUVAR SONUCU"
                value={labResult}
                delay={0.4}
                isBadge
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * DataPoint - Individual data item in the X-Ray overlay
 */
function DataPoint({ icon, label, value, delay, isBadge = false }) {
  return (
    <motion.div
      className="xray-overlay__item"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      <div className="flex-shrink-0 text-amber-500">{icon}</div>
      <div className="flex-1">
        <span className="xray-overlay__label block">{label}</span>
        {isBadge ? (
          <span className="xray-overlay__badge">
            <ShieldCheck size={12} />
            {value}
          </span>
        ) : (
          <span className="xray-overlay__value">{value}</span>
        )}
      </div>
    </motion.div>
  );
}

export default IngredientCard;
export { DataPoint };
