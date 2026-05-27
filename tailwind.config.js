/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			/* ── Core ── */
  			canvas: '#ffffff',
  			'inverse-canvas': '#111111',
  			primary: {
  				DEFAULT: '#111111',
  				active: '#242424',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			'on-primary': '#ffffff',
  			'accent-magenta': '#e040a0',
  			'brand-accent': '#111111',

  			/* ── Surface ── */
  			surface: {
  				soft: '#f5f5f5',
  				card: '#f5f5f5',
  				strong: '#e5e7eb',
  				dark: '#101010',
  				'dark-elevated': '#1a1a1a',
  			},
  			hairline: {
  				DEFAULT: '#e5e7eb',
  				soft: '#f3f4f6',
  			},

  			/* ── Pastel color blocks ── */
  			block: {
  				lime:   '#d5f37a',
  				lilac:  '#e6d0ff',
  				cream:  '#fdf4e3',
  				mint:   '#c5f5e1',
  				pink:   '#ffd6eb',
  				coral:  '#ffc8a0',
  				navy:   '#1e1b4b',
  			},

  			/* ── Text ── */
  			ink: '#111111',
  			'inverse-ink': '#ffffff',
  			'on-inverse-soft': 'var(--color-on-inverse-soft)',
  			body: '#374151',
  			muted: {
  				DEFAULT: '#6b7280',
  				soft: '#898989',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			'on-dark': '#ffffff',
  			'on-dark-soft': '#a1a1aa',

  			/* ── Badge ── */
  			badge: {
  				orange: '#fb923c',
  				pink:   '#ec4899',
  				violet: '#8b5cf6',
  				emerald:'#34d399',
  			},

  			/* ── Semantic ── */
  			'semantic-success': '#22c55e',
  			success: '#10b981',
  			warning: '#f59e0b',
  			error:   '#ef4444',

  			/* ── shadcn ── */
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},

  		borderRadius: {
  			xs:   'var(--radius-xs)',
  			sm:   'var(--radius-sm)',
  			md:   'var(--radius-md)',
  			lg:   'var(--radius-lg)',
  			xl:   'var(--radius-xl)',
  			'2xl':'var(--radius-2xl)',
  			pill: 'var(--radius-pill)',
  			full: 'var(--radius-full)',
  		},

  		fontFamily: {
  			display: ['var(--font-display)', 'Inter', 'sans-serif'],
  			body:    ['var(--font-body)',    'Inter', 'sans-serif'],
  			mono:    ['var(--font-mono)',    'JetBrains Mono', 'monospace'],
  		},

  		/* ── Typography (Figma spec, Inter substitute) ── */
  		fontSize: {
  			/* Display */
  			'display-xl': ['5.375rem', { lineHeight: '1.00', letterSpacing: '-1.72px', fontWeight: '400' }],
  			'display-lg': ['4rem',     { lineHeight: '1.10', letterSpacing: '-0.96px', fontWeight: '400' }],
  			/* Headline inside color blocks */
  			headline:     ['1.625rem', { lineHeight: '1.35', letterSpacing: '-0.26px', fontWeight: '500' }],
  			subhead:      ['1.625rem', { lineHeight: '1.35', letterSpacing: '-0.26px', fontWeight: '400' }],
  			'card-title': ['1.5rem',   { lineHeight: '1.45', letterSpacing: '0',       fontWeight: '700' }],
  			/* Body */
  			'body-lg':    ['1.25rem',  { lineHeight: '1.40', letterSpacing: '-0.14px', fontWeight: '300' }],
  			body:         ['1.125rem', { lineHeight: '1.45', letterSpacing: '-0.26px', fontWeight: '300' }],
  			'body-sm':    ['1rem',     { lineHeight: '1.45', letterSpacing: '-0.14px', fontWeight: '300' }],
  			/* Interactive */
  			link:         ['1.25rem',  { lineHeight: '1.40', letterSpacing: '-0.10px', fontWeight: '500' }],
  			button:       ['1.25rem',  { lineHeight: '1.40', letterSpacing: '-0.10px', fontWeight: '500' }],
  			/* Mono labels */
  			eyebrow:      ['1.125rem', { lineHeight: '1.30', letterSpacing: '0.54px',  fontWeight: '400' }],
  			caption:      ['0.75rem',  { lineHeight: '1.00', letterSpacing: '0.60px',  fontWeight: '400' }],
  			/* Legacy aliases kept */
  			'display-md': ['2.25rem',  { lineHeight: '1.15', letterSpacing: '-0.02778em', fontWeight: '600' }],
  			'display-sm': ['1.75rem',  { lineHeight: '1.20', letterSpacing: '-0.01786em', fontWeight: '600' }],
  			'title-lg':   ['1.375rem', { lineHeight: '1.30', letterSpacing: '-0.01364em', fontWeight: '600' }],
  			'title-md':   ['1.125rem', { lineHeight: '1.40', fontWeight: '600' }],
  			'title-sm':   ['1rem',     { lineHeight: '1.40', fontWeight: '600' }],
  			'body-md':    ['1rem',     { lineHeight: '1.50', fontWeight: '400' }],
  			code:         ['0.875rem', { lineHeight: '1.50', fontWeight: '400' }],
  			'nav-link':   ['0.875rem', { lineHeight: '1.40', fontWeight: '500' }],
  		},

  		/* ── Spacing (8px base) ── */
  		spacing: {
  			hair:    '1px',
  			xxs:     '0.25rem',
  			xs:      '0.5rem',
  			sm:      '0.75rem',
  			md:      '1rem',
  			lg:      '1.5rem',
  			xl:      '2rem',
  			xxl:     '3rem',
  			section: '4rem',
  		},

  		maxWidth: {
  			content: '80rem',
  		},

  		boxShadow: {
  			soft:     '0 1px 2px rgb(0 0 0 / 0.05)',
  			elevated: '0 4px 16px rgb(0 0 0 / 0.06)',
  			modal:    '0 12px 48px rgb(0 0 0 / 0.18)',
  		},
  	}
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
}
