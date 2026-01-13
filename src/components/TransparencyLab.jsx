import React from 'react';

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
  return (
    <section className="transparency-lab">
      <h2 className="transparency-lab__title">{title}</h2>

      {/* Mobile: Carousel / Desktop: Grid */}
      <div className="transparency-lab__carousel md:transparency-lab__grid">
        {ingredients.length === 0 ? (
          <p className="text-center text-gray-500">
            Henüz içerik eklenmedi. (No ingredients added yet.)
          </p>
        ) : (
          ingredients.map((ingredient) => (
            <div
              key={ingredient.id}
              className="ingredient-card"
              data-testid="ingredient-card"
            >
              {/* Image */}
              <img
                src={ingredient.image}
                alt={ingredient.name}
                className="ingredient-card__image"
                loading="lazy"
              />

              {/* Default Content */}
              <div className="ingredient-card__content">
                <h3 className="ingredient-card__hero-title">
                  {ingredient.heroTitle}
                </h3>
                <p className="ingredient-card__subtitle">
                  {ingredient.subtitle}
                </p>
              </div>

              {/* Fingerprint Hint - Placeholder */}
              <div className="ingredient-card__hint" aria-hidden="true">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-white"
                >
                  <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" />
                  <path d="M14 13.12c0 2.38 0 6.38-1 8.88" />
                  <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" />
                  <path d="M2 12a10 10 0 0 1 18-6" />
                  <path d="M2 16h.01" />
                  <path d="M21.8 16c.2-2 .131-5.354 0-6" />
                  <path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2" />
                  <path d="M8.65 22c.21-.66.45-1.32.57-2" />
                  <path d="M9 6.8a6 6 0 0 1 9 5.2c0 .47 0 1.17-.02 2" />
                </svg>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default TransparencyLab;
