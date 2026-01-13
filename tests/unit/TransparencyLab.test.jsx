import React from 'react';
import { render, screen } from '@testing-library/react';
import TransparencyLab from '../../src/components/TransparencyLab';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => {
  const React = require('react');
  return {
    motion: {
      div: React.forwardRef(({ children, ...props }, ref) => (
        <div ref={ref} {...props}>{children}</div>
      )),
      img: React.forwardRef((props, ref) => <img ref={ref} {...props} />),
      h4: React.forwardRef(({ children, ...props }, ref) => (
        <h4 ref={ref} {...props}>{children}</h4>
      ))
    },
    AnimatePresence: ({ children }) => <>{children}</>
  };
});

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

  beforeEach(() => {
    navigator.vibrate = jest.fn();
  });

  it('renders the section', () => {
    render(<TransparencyLab ingredients={[]} />);
    expect(screen.getByTestId('transparency-lab')).toBeInTheDocument();
  });

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
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
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

  it('renders multiple ingredient cards', () => {
    const multipleIngredients = [
      { ...mockIngredients[0] },
      { ...mockIngredients[0], id: 2, name: 'Ashwagandha', heroTitle: 'Adaptojenik Güç' }
    ];

    render(<TransparencyLab ingredients={multipleIngredients} />);
    expect(screen.getAllByTestId('ingredient-card')).toHaveLength(2);
  });
});
