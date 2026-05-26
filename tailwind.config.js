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
  			canvas: 'var(--color-canvas)',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				active: 'var(--color-primary-active)',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			brand: {
  				accent: 'var(--color-brand-accent)'
  			},
  			surface: {
  				soft: 'var(--color-surface-soft)',
  				card: 'var(--color-surface-card)',
  				strong: 'var(--color-surface-strong)',
  				dark: 'var(--color-surface-dark)',
  				'dark-elevated': 'var(--color-surface-dark-elevated)'
  			},
  			hairline: {
  				DEFAULT: 'var(--color-hairline)',
  				soft: 'var(--color-hairline-soft)'
  			},
  			ink: 'var(--color-ink)',
  			body: 'var(--color-body)',
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				soft: 'var(--color-muted-soft)',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			badge: {
  				orange: 'var(--color-badge-orange)',
  				pink: 'var(--color-badge-pink)',
  				violet: 'var(--color-badge-violet)',
  				emerald: 'var(--color-badge-emerald)'
  			},
  			success: 'var(--color-success)',
  			warning: 'var(--color-warning)',
  			error: 'var(--color-error)',
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
  			xs: 'var(--radius-xs)',
  			sm: 'var(--radius-sm)',
  			md: 'var(--radius-md)',
  			lg: 'var(--radius-lg)',
  			xl: 'var(--radius-xl)',
  			pill: 'var(--radius-pill)'
  		},
  		fontFamily: {
  			display: [
  				'var(--font-display)',
  				'Inter',
  				'sans-serif'
  			],
  			body: [
  				'var(--font-body)',
  				'Inter',
  				'sans-serif'
  			],
  			mono: [
  				'var(--font-mono)',
  				'JetBrains Mono',
  				'monospace'
  			]
  		},
  		fontSize: {
  			'display-xl': [
  				'4rem',
  				{
  					lineHeight: '1.05',
  					letterSpacing: '-0.03125em',
  					fontWeight: '600'
  				}
  			],
  			'display-lg': [
  				'3rem',
  				{
  					lineHeight: '1.1',
  					letterSpacing: '-0.03125em',
  					fontWeight: '600'
  				}
  			],
  			'display-md': [
  				'2.25rem',
  				{
  					lineHeight: '1.15',
  					letterSpacing: '-0.02778em',
  					fontWeight: '600'
  				}
  			],
  			'display-sm': [
  				'1.75rem',
  				{
  					lineHeight: '1.2',
  					letterSpacing: '-0.01786em',
  					fontWeight: '600'
  				}
  			],
  			'title-lg': [
  				'1.375rem',
  				{
  					lineHeight: '1.3',
  					letterSpacing: '-0.01364em',
  					fontWeight: '600'
  				}
  			],
  			'title-md': [
  				'1.125rem',
  				{
  					lineHeight: '1.4',
  					fontWeight: '600'
  				}
  			],
  			'title-sm': [
  				'1rem',
  				{
  					lineHeight: '1.4',
  					fontWeight: '600'
  				}
  			],
  			'body-md': [
  				'1rem',
  				{
  					lineHeight: '1.5',
  					fontWeight: '400'
  				}
  			],
  			'body-sm': [
  				'0.875rem',
  				{
  					lineHeight: '1.5',
  					fontWeight: '400'
  				}
  			],
  			caption: [
  				'0.8125rem',
  				{
  					lineHeight: '1.4',
  					fontWeight: '500'
  				}
  			],
  			code: [
  				'0.875rem',
  				{
  					lineHeight: '1.5',
  					fontWeight: '400'
  				}
  			],
  			button: [
  				'0.875rem',
  				{
  					lineHeight: '1',
  					fontWeight: '600'
  				}
  			],
  			'nav-link': [
  				'0.875rem',
  				{
  					lineHeight: '1.4',
  					fontWeight: '500'
  				}
  			]
  		},
  		spacing: {
  			xxs: '0.25rem',
  			xs: '0.5rem',
  			sm: '0.75rem',
  			md: '1rem',
  			lg: '1.5rem',
  			xl: '2rem',
  			xxl: '3rem',
  			section: '6rem'
  		},
  		maxWidth: {
  			content: '75rem'
  		},
  		boxShadow: {
  			soft: '0 1px 2px rgb(0 0 0 / 0.05)',
  			elevated: '0 4px 12px rgb(0 0 0 / 0.08)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
