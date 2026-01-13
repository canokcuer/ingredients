import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import IngredientCard, { DataPoint } from '../../src/components/IngredientCard';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => {
  const React = require('react');
  return {
    motion: {
      div: React.forwardRef(({ children, animate, initial, exit, transition, ...props }, ref) => (
        <div ref={ref} {...props}>{children}</div>
      )),
      img: React.forwardRef(({ animate, transition, ...props }, ref) => (
        <img ref={ref} {...props} />
      )),
      h4: React.forwardRef(({ children, animate, initial, transition, ...props }, ref) => (
        <h4 ref={ref} {...props}>{children}</h4>
      ))
    },
    AnimatePresence: ({ children }) => <>{children}</>
  };
});

describe('IngredientCard', () => {
  const defaultProps = {
    image: 'https://example.com/image.jpg',
    name: 'Rhodiola Rosea',
    heroTitle: 'Stres Kalkanı',
    subtitle: "Sibirya'nın Altın Kökü",
    origin: 'Sibirya',
    activeCompound: '%3 Rosavins',
    labResult: 'GEÇTİ - Ağır Metal Yok'
  };

  beforeEach(() => {
    jest.useFakeTimers();
    navigator.vibrate = jest.fn();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders the card', () => {
      render(<IngredientCard {...defaultProps} />);
      expect(screen.getByTestId('ingredient-card')).toBeInTheDocument();
    });

    it('renders the image with correct src and alt', () => {
      render(<IngredientCard {...defaultProps} />);
      const image = screen.getByAltText('Rhodiola Rosea');
      expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
    });

    it('renders hero title', () => {
      render(<IngredientCard {...defaultProps} />);
      expect(screen.getByText('Stres Kalkanı')).toBeInTheDocument();
    });

    it('renders subtitle', () => {
      render(<IngredientCard {...defaultProps} />);
      expect(screen.getByText("Sibirya'nın Altın Kökü")).toBeInTheDocument();
    });

    it('has lazy loading on image', () => {
      render(<IngredientCard {...defaultProps} />);
      const image = screen.getByAltText('Rhodiola Rosea');
      expect(image).toHaveAttribute('loading', 'lazy');
    });

    it('has correct accessibility attributes', () => {
      render(<IngredientCard {...defaultProps} />);
      const card = screen.getByTestId('ingredient-card');
      expect(card).toHaveAttribute('role', 'button');
      expect(card).toHaveAttribute('tabIndex', '0');
      expect(card).toHaveAttribute('aria-pressed', 'false');
    });
  });

  describe('Turkish character support', () => {
    it('renders Turkish characters in heroTitle', () => {
      render(<IngredientCard {...defaultProps} heroTitle="Türkçe Başlık" />);
      expect(screen.getByText('Türkçe Başlık')).toBeInTheDocument();
    });

    it('renders Turkish characters in subtitle', () => {
      render(<IngredientCard {...defaultProps} subtitle="şğüöçıİ karakterleri" />);
      expect(screen.getByText('şğüöçıİ karakterleri')).toBeInTheDocument();
    });

    it('renders Turkish characters in origin', () => {
      render(<IngredientCard {...defaultProps} origin="İstanbul, Türkiye" />);

      // Trigger X-Ray mode to see origin
      const card = screen.getByTestId('ingredient-card');
      act(() => {
        fireEvent.mouseDown(card, { button: 0, clientX: 100, clientY: 100 });
        jest.advanceTimersByTime(300);
      });

      expect(screen.getByText('İstanbul, Türkiye')).toBeInTheDocument();
    });

    it('renders Turkish characters in activeCompound', () => {
      render(<IngredientCard {...defaultProps} activeCompound="Özel Bileşik" />);

      const card = screen.getByTestId('ingredient-card');
      act(() => {
        fireEvent.mouseDown(card, { button: 0, clientX: 100, clientY: 100 });
        jest.advanceTimersByTime(300);
      });

      expect(screen.getByText('Özel Bileşik')).toBeInTheDocument();
    });

    it('renders Turkish characters in labResult', () => {
      render(<IngredientCard {...defaultProps} labResult="GEÇTİ - Güvenli" />);

      const card = screen.getByTestId('ingredient-card');
      act(() => {
        fireEvent.mouseDown(card, { button: 0, clientX: 100, clientY: 100 });
        jest.advanceTimersByTime(300);
      });

      expect(screen.getByText('GEÇTİ - Güvenli')).toBeInTheDocument();
    });
  });

  describe('X-Ray interaction', () => {
    it('does not show X-Ray overlay initially', () => {
      render(<IngredientCard {...defaultProps} />);
      expect(screen.queryByTestId('xray-overlay')).not.toBeInTheDocument();
    });

    it('shows X-Ray overlay on long press', () => {
      render(<IngredientCard {...defaultProps} />);
      const card = screen.getByTestId('ingredient-card');

      act(() => {
        fireEvent.mouseDown(card, { button: 0, clientX: 100, clientY: 100 });
        jest.advanceTimersByTime(300);
      });

      expect(screen.getByTestId('xray-overlay')).toBeInTheDocument();
    });

    it('hides X-Ray overlay on release', () => {
      render(<IngredientCard {...defaultProps} />);
      const card = screen.getByTestId('ingredient-card');

      // Press
      act(() => {
        fireEvent.mouseDown(card, { button: 0, clientX: 100, clientY: 100 });
        jest.advanceTimersByTime(300);
      });

      expect(screen.getByTestId('xray-overlay')).toBeInTheDocument();

      // Release
      act(() => {
        fireEvent.mouseUp(card, { clientX: 100, clientY: 100 });
      });

      expect(screen.queryByTestId('xray-overlay')).not.toBeInTheDocument();
    });

    it('shows ingredient name in X-Ray mode', () => {
      render(<IngredientCard {...defaultProps} />);
      const card = screen.getByTestId('ingredient-card');

      act(() => {
        fireEvent.mouseDown(card, { button: 0, clientX: 100, clientY: 100 });
        jest.advanceTimersByTime(300);
      });

      expect(screen.getByText('Rhodiola Rosea')).toBeInTheDocument();
    });

    it('shows origin in X-Ray mode', () => {
      render(<IngredientCard {...defaultProps} />);
      const card = screen.getByTestId('ingredient-card');

      act(() => {
        fireEvent.mouseDown(card, { button: 0, clientX: 100, clientY: 100 });
        jest.advanceTimersByTime(300);
      });

      expect(screen.getByText('Sibirya')).toBeInTheDocument();
      expect(screen.getByText('KÖKENİ')).toBeInTheDocument();
    });

    it('shows active compound in X-Ray mode', () => {
      render(<IngredientCard {...defaultProps} />);
      const card = screen.getByTestId('ingredient-card');

      act(() => {
        fireEvent.mouseDown(card, { button: 0, clientX: 100, clientY: 100 });
        jest.advanceTimersByTime(300);
      });

      expect(screen.getByText('%3 Rosavins')).toBeInTheDocument();
      expect(screen.getByText('AKTİF BİLEŞEN')).toBeInTheDocument();
    });

    it('shows lab result in X-Ray mode', () => {
      render(<IngredientCard {...defaultProps} />);
      const card = screen.getByTestId('ingredient-card');

      act(() => {
        fireEvent.mouseDown(card, { button: 0, clientX: 100, clientY: 100 });
        jest.advanceTimersByTime(300);
      });

      expect(screen.getByText('GEÇTİ - Ağır Metal Yok')).toBeInTheDocument();
      expect(screen.getByText('LABORATUVAR SONUCU')).toBeInTheDocument();
    });

    it('updates aria-pressed when X-Ray is active', () => {
      render(<IngredientCard {...defaultProps} />);
      const card = screen.getByTestId('ingredient-card');

      expect(card).toHaveAttribute('aria-pressed', 'false');

      act(() => {
        fireEvent.mouseDown(card, { button: 0, clientX: 100, clientY: 100 });
        jest.advanceTimersByTime(300);
      });

      expect(card).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('touch events', () => {
    it('shows X-Ray overlay on touch long press', () => {
      render(<IngredientCard {...defaultProps} />);
      const card = screen.getByTestId('ingredient-card');

      act(() => {
        fireEvent.touchStart(card, {
          touches: [{ clientX: 100, clientY: 100 }]
        });
        jest.advanceTimersByTime(300);
      });

      expect(screen.getByTestId('xray-overlay')).toBeInTheDocument();
    });

    it('hides X-Ray overlay on touch end', () => {
      render(<IngredientCard {...defaultProps} />);
      const card = screen.getByTestId('ingredient-card');

      act(() => {
        fireEvent.touchStart(card, {
          touches: [{ clientX: 100, clientY: 100 }]
        });
        jest.advanceTimersByTime(300);
      });

      act(() => {
        fireEvent.touchEnd(card, {
          changedTouches: [{ clientX: 100, clientY: 100 }]
        });
      });

      expect(screen.queryByTestId('xray-overlay')).not.toBeInTheDocument();
    });

    it('cancels X-Ray on touch move (scroll intent)', () => {
      render(<IngredientCard {...defaultProps} />);
      const card = screen.getByTestId('ingredient-card');

      act(() => {
        fireEvent.touchStart(card, {
          touches: [{ clientX: 100, clientY: 100 }]
        });
      });

      // Simulate scroll
      act(() => {
        fireEvent.touchMove(card, {
          touches: [{ clientX: 100, clientY: 150 }]
        });
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(screen.queryByTestId('xray-overlay')).not.toBeInTheDocument();
    });
  });
});

describe('DataPoint', () => {
  it('renders label and value', () => {
    render(
      <DataPoint
        icon={<span data-testid="icon">Icon</span>}
        label="TEST LABEL"
        value="Test Value"
        delay={0}
      />
    );

    expect(screen.getByText('TEST LABEL')).toBeInTheDocument();
    expect(screen.getByText('Test Value')).toBeInTheDocument();
  });

  it('renders icon', () => {
    render(
      <DataPoint
        icon={<span data-testid="test-icon">Icon</span>}
        label="Label"
        value="Value"
        delay={0}
      />
    );

    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('renders as badge when isBadge is true', () => {
    render(
      <DataPoint
        icon={<span>Icon</span>}
        label="Label"
        value="Badge Value"
        delay={0}
        isBadge={true}
      />
    );

    const badge = screen.getByText('Badge Value').closest('.xray-overlay__badge');
    expect(badge).toBeInTheDocument();
  });

  it('renders Turkish characters', () => {
    render(
      <DataPoint
        icon={<span>Icon</span>}
        label="TÜRKÇE ETİKET"
        value="Değer şğüöçıİ"
        delay={0}
      />
    );

    expect(screen.getByText('TÜRKÇE ETİKET')).toBeInTheDocument();
    expect(screen.getByText('Değer şğüöçıİ')).toBeInTheDocument();
  });
});
