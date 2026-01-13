import React from 'react';
import { createRoot } from 'react-dom/client';
import TransparencyLab from './components/TransparencyLab';
import './styles/transparency-lab.css';

// Sample data for development
const sampleIngredients = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400&h=500&fit=crop',
    name: 'Rhodiola Rosea',
    heroTitle: 'Stres Kalkanı',
    subtitle: "Sibirya'nın Altın Kökü",
    origin: 'Sibirya',
    activeCompound: '%3 Rosavins',
    labResult: 'GEÇTİ - Ağır Metal Yok'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=400&h=500&fit=crop',
    name: 'Ashwagandha',
    heroTitle: 'Adaptojenik Güç',
    subtitle: 'Hint Ginsengi',
    origin: 'Hindistan',
    activeCompound: '%5 Withanolides',
    labResult: 'GEÇTİ - Saflık Onaylı'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400&h=500&fit=crop',
    name: 'Marine Collagen',
    heroTitle: 'Cilt Yenileyici',
    subtitle: 'Okyanus Peptitleri',
    origin: 'Kuzey Atlantik',
    activeCompound: 'Tip I & III Kolajen',
    labResult: 'GEÇTİ - Sürdürülebilir Kaynak'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&h=500&fit=crop',
    name: 'Lion\'s Mane',
    heroTitle: 'Beyin Gücü',
    subtitle: 'Aslan Yelesi Mantarı',
    origin: 'Organik Çiftlik',
    activeCompound: '%30 Beta-Glucans',
    labResult: 'GEÇTİ - Organik Sertifikalı'
  }
];

// Mount the app
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <TransparencyLab
        title="Bilimin Doğayla Buluştuğu Nokta"
        ingredients={sampleIngredients}
      />
    </React.StrictMode>
  );
}

// Export for Shopify integration
export { TransparencyLab };
