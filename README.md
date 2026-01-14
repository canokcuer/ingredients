# Ingredient Science Hub

A premium Shopify section for displaying ingredient information with benefits, scientific articles, and lab test results. Built for [Cyrasoul.com](https://cyrasoul.com).

## Features

- **Three-Tab Interface**: Faydalar (Benefits), Makaleler (Articles), Test Sonuçları (Lab Results)
- **Premium Glass-Morphism Design**: Modern, elegant test result cards
- **Animated Progress Bars**: Visual representation of test percentages
- **Staggered Animations**: Smooth fade-in effects for content
- **Fully Responsive**: Mobile-first design with grid layout
- **Turkish Language Support**: Full UTF-8 support for Turkish characters
- **Shopify Theme Editor Compatible**: Easy customization without code
- **Accessibility**: ARIA attributes and keyboard navigation

## Preview

```
┌─────────────────────────────────────────────┐
│  [Faydalar] [Makaleler] [Test Sonuçları]    │
├─────────────────────────────────────────────┤
│                                             │
│  ✓ Bağışıklık sistemini güçlendirir        │
│  ✓ Enerji seviyelerini artırır             │
│  ✓ Stres ve kaygıyı azaltır                │
│                                             │
├─────────────────────────────────────────────┤
│  [Image]  Rhodiola Rosea                    │
│           "Stres Kalkanı"                   │
└─────────────────────────────────────────────┘
```

## Installation

### Option 1: Copy to Shopify Theme

1. Copy the contents of `sections/ingredient-science-hub.liquid`
2. Go to **Shopify Admin** → **Online Store** → **Themes**
3. Click **Actions** → **Edit code**
4. Under **Sections**, click **Add a new section**
5. Name it `ingredient-science-hub.liquid`
6. Paste the code and click **Save**
7. Go to **Theme Editor** and add the "Ingredient Science Hub" section

### Option 2: Use Theme Editor

After adding the section file:
1. Open **Theme Editor** (Customize)
2. Click **Add section**
3. Select **Ingredient Science Hub**
4. Add ingredient blocks and configure settings

## Configuration

### Section Settings

| Setting | Description | Default |
|---------|-------------|---------|
| Title | Main heading | "İçeriklerimizi Keşfedin" |
| Subtitle | Subheading | "Bilim destekli, şeffaf formül" |
| Accent Color | Brand color | #D97706 (Amber) |
| Background Color | Section background | #FFFFFF |
| Text Color | Primary text | #1F2937 |
| Padding | Top/bottom spacing | 60px |

### Ingredient Block Settings

Each ingredient block contains:

#### Basic Info
- **Image**: Ingredient photo (recommended: 400x400px)
- **Name**: Ingredient name (e.g., "Rhodiola Rosea")
- **Tagline**: Short description (e.g., "Stres Kalkanı")

#### Benefits Tab
```
Bağışıklık sistemini güçlendirir
Enerji seviyelerini artırır
Stres ve kaygıyı azaltır
```
*One benefit per line*

#### Articles Tab
```
Article Title|Source Name|https://url.com
Another Article|PubMed|https://pubmed.ncbi.nlm.nih.gov/
```
*Format: Title|Source|URL (one per line)*

#### Test Results Tab
```
Ağır Metal Testi|GEÇTİ|100
Mikrobiyolojik Test|GEÇTİ|100
Saflık Analizi|GEÇTİ|99.2
```
*Format: Test Name|Result|Percentage (one per line)*

- **Certification**: e.g., "ISO 22000"
- **Test Date**: e.g., "Ocak 2024"

## Project Structure

```
cs-ingredient/
├── sections/
│   ├── ingredient-science-hub.liquid  # Main section (USE THIS)
│   └── transparency-lab.liquid        # Original X-Ray concept (backup)
├── src/
│   ├── components/
│   │   ├── IngredientCard.jsx        # React component
│   │   └── TransparencyLab.jsx       # React container
│   └── hooks/
│       └── useLongPress.js           # Press-and-hold hook
├── tests/
│   └── unit/                         # Jest unit tests
├── ralph_task.md                     # Current task tracking
├── guardrails.md                     # Development rules
├── progress.md                       # Progress tracker
└── README.md                         # This file
```

## Development

### Prerequisites
- Node.js 18+
- npm 9+

### Setup
```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Build for production
npm run build
```

### Tech Stack
- **Shopify Liquid**: Template language
- **CSS**: Custom properties, animations, glass-morphism
- **Vanilla JS**: Tab switching, animation triggers
- **React + Framer Motion**: Original X-Ray components (backup)
- **Jest**: Unit testing
- **Playwright**: E2E testing

## Ralph Methodology

This project was built using the Ralph methodology for AI-assisted development:

1. **Iterative Development**: Small, focused iterations
2. **Guardrails**: Document rules learned from mistakes
3. **Progress Tracking**: Clear milestone documentation
4. **Test-Driven**: Tests written for each feature

## Test Coverage

| Metric | Target | Achieved |
|--------|--------|----------|
| Statements | 80% | 98.61% |
| Branches | 80% | 84.44% |
| Functions | 80% | 95%+ |
| Lines | 80% | 98%+ |

## Browser Support

- Chrome 90+
- Safari 14+
- Firefox 88+
- Edge 90+
- iOS Safari 14+
- Chrome for Android 90+

## License

Private - Cyrasoul.com

## Contact

For detailed lab analysis reports:
**info@cyrasoul.com**
