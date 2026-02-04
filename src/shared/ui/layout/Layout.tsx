import { type ReactNode, useEffect, useState } from 'react'

import { Outlet } from 'react-router-dom'

import styles from './Layout.module.css'

const THEME_STORAGE_KEY = 'brewlliant_theme'

type Theme = 'light' | 'dark'

const isTheme = (value: string | null): value is Theme => value === 'light' || value === 'dark'

export type LayoutOutletContext = {
	setTopBarLeft: (node: ReactNode | null) => void
}

const getInitialTheme = (): Theme => {
	if (typeof window === 'undefined') {
		return 'light'
	}

	try {
		const stored = localStorage.getItem(THEME_STORAGE_KEY)

		if (isTheme(stored)) {
			return stored
		}
	} catch {
		// ignore storage errors
	}

	try {
		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
	} catch {
		return 'light'
	}
}

const applyTheme = (theme: Theme): void => {
	document.documentElement.dataset.theme = theme

	const metaThemeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')

	if (metaThemeColor) {
		metaThemeColor.setAttribute('content', theme === 'dark' ? '#1f2026' : '#fffcf9')
	}
}

export const Layout = (): React.ReactElement => {
	const [theme, setTheme] = useState<Theme>(() => getInitialTheme())
	const [topBarLeft, setTopBarLeft] = useState<ReactNode | null>(null)

	useEffect(() => {
		applyTheme(theme)

		try {
			localStorage.setItem(THEME_STORAGE_KEY, theme)
		} catch {
			// ignore storage errors
		}
	}, [theme])

	const toggleTheme = (): void => {
		setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
	}

	return (
		<div className={styles.page}>
			<div className={styles.topBar}>
				<div className={styles.topBarLeft}>
					{topBarLeft ?? <span className={styles.brand}>Brewlliant</span>}
				</div>
				<div className={styles.topBarRight}>
					<button
						aria-label={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
						aria-pressed={theme === 'dark'}
						className={styles.themeToggle}
						type="button"
						onClick={toggleTheme}
					>
						{theme === 'dark' ? 'Светлая' : 'Тёмная'}
					</button>
				</div>
			</div>
			<Outlet context={{ setTopBarLeft }} />
		</div>
	)
}
