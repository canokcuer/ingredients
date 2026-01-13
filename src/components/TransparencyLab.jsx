import React from 'react';
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
  return (
    <section className="transparency-lab" data-testid="transparency-lab">
      <h2 className="transparency-lab__title">{title}</h2>

      {/* Mobile: Carousel / Desktop: Grid */}
      <div className="transparency-lab__carousel md:transparency-lab__grid">
        {ingredients.length === 0 ? (
          <p className="text-center text-gray-500" data-testid="empty-state">
            Henüz içerik eklenmedi. (No ingredients added yet.)
          </p>
        ) : (
          ingredients.map((ingredient) => (
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
          ))
        )}
      </div>
    </section>
  );
}

export default TransparencyLab;
