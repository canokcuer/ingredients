import React, { useRef, useState, useEffect } from 'react';
import IngredientCard from './IngredientCard';

/**
 * TransparencyLab - Main container component
 *
 * Renders ingredients in a carousel (mobile) or grid (desktop) layout.
 * Each ingredient card supports press-and-hold to reveal X-Ray data.
 *
 * @param {Object} props
 * @param {string} props.title - Section title
 * @param {Array} props.ingredients - Array of ingredient objects
 */
function TransparencyLab({ title = 'Bilimin Doğayla Buluştuğu Nokta', ingredients = [] }) {
  const [isMobile, setIsMobile] = useState(false);
  const carouselRef = useRef(null);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section className="transparency-lab" data-testid="transparency-lab">
      <h2 className="transparency-lab__title">{title}</h2>

      {ingredients.length === 0 ? (
        <p className="text-center text-gray-500 py-8" data-testid="empty-state">
          Henüz içerik eklenmedi. (No ingredients added yet.)
        </p>
      ) : isMobile ? (
        // Mobile: Horizontal Snap Scroll Carousel
        <div
          ref={carouselRef}
          className="transparency-lab__carousel"
          data-testid="carousel"
        >
          {ingredients.map((ingredient) => (
            <IngredientCard
              key={ingredient.id}
              image={ingredient.image}
              name={ingredient.name}
              heroTitle={ingredient.heroTitle}
              subtitle={ingredient.subtitle}
              origin={ingredient.origin}
              activeCompound={ingredient.activeCompound}
              labResult={ingredient.labResult}
            />
          ))}
        </div>
      ) : (
        // Desktop: 3-Column Grid
        <div className="transparency-lab__grid" data-testid="grid">
          {ingredients.map((ingredient) => (
            <IngredientCard
              key={ingredient.id}
              image={ingredient.image}
              name={ingredient.name}
              heroTitle={ingredient.heroTitle}
              subtitle={ingredient.subtitle}
              origin={ingredient.origin}
              activeCompound={ingredient.activeCompound}
              labResult={ingredient.labResult}
            />
          ))}
        </div>
      )}

      {/* Scroll Indicator for Mobile */}
      {isMobile && ingredients.length > 1 && (
        <div className="transparency-lab__scroll-hint" aria-hidden="true">
          <span className="text-xs text-gray-500">
            ← Kaydır →
          </span>
        </div>
      )}
    </section>
  );
}

export default TransparencyLab;
