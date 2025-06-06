module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:4173'],
      startServerCommand: 'pnpm preview',
      startServerReadyPattern: 'Local:',
      startServerReadyTimeout: 30000,
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --disable-dev-shm-usage',
        // Use mobile emulation for performance testing
        emulatedFormFactor: 'mobile',
        throttlingMethod: 'simulate',
        // Focus on key metrics for a portfolio site
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.8 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
        // Image optimization checks (important for portfolio)
        'uses-optimized-images': ['warn'],
        'modern-image-formats': ['warn'],
        'uses-responsive-images': ['warn'],
        // Performance metrics specific to image-heavy sites
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        // Accessibility for portfolio sites
        'color-contrast': ['error'],
        'image-alt': ['error'],
        'heading-order': ['error'],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: './lighthouse-results',
    },
  },
};