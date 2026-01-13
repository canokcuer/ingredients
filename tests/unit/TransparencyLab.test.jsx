import React from 'react';
import { render, screen } from '@testing-library/react';
import TransparencyLab from '../../src/components/TransparencyLab';

describe('TransparencyLab', () => {
  const mockIngredients = [
    {
      id: 1,
      image: 'test-image.jpg',
      name: 'Rhodiola Rosea',
      heroTitle: 'Stres Kalkanı',
      subtitle: "Sibirya'nın Altın Kökü",
      origin: 'Sibirya',
      activeCompound: '%3 Rosavins',
      labResult: 'GEÇTİ'
    }
  ];

  it('renders the section title', () => {
    render(<TransparencyLab title="Test Başlık" ingredients={[]} />);
    expect(screen.getByText('Test Başlık')).toBeInTheDocument();
  });

  it('renders default title when not provided', () => {
    render(<TransparencyLab ingredients={[]} />);
    expect(screen.getByText('Bilimin Doğayla Buluştuğu Nokta')).toBeInTheDocument();
  });

  it('renders empty state when no ingredients', () => {
    render(<TransparencyLab ingredients={[]} />);
    expect(screen.getByText(/Henüz içerik eklenmedi/)).toBeInTheDocument();
  });

  it('renders ingredient cards', () => {
    render(<TransparencyLab ingredients={mockIngredients} />);
    expect(screen.getByTestId('ingredient-card')).toBeInTheDocument();
  });

  it('renders hero title on card', () => {
    render(<TransparencyLab ingredients={mockIngredients} />);
    expect(screen.getByText('Stres Kalkanı')).toBeInTheDocument();
  });

  it('renders subtitle on card', () => {
    render(<TransparencyLab ingredients={mockIngredients} />);
    expect(screen.getByText("Sibirya'nın Altın Kökü")).toBeInTheDocument();
  });

  it('renders Turkish characters correctly', () => {
    const turkishIngredient = {
      id: 1,
      image: 'test.jpg',
      name: 'Test',
      heroTitle: 'Türkçe İçerik',
      subtitle: 'şğüöçıİ karakterleri',
      origin: 'Türkiye',
      activeCompound: 'Test',
      labResult: 'GEÇTİ'
    };

    render(<TransparencyLab ingredients={[turkishIngredient]} />);
    expect(screen.getByText('Türkçe İçerik')).toBeInTheDocument();
    expect(screen.getByText('şğüöçıİ karakterleri')).toBeInTheDocument();
  });

  it('lazy loads images', () => {
    render(<TransparencyLab ingredients={mockIngredients} />);
    const image = screen.getByAltText('Rhodiola Rosea');
    expect(image).toHaveAttribute('loading', 'lazy');
  });
});
