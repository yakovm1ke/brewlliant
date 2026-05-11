const BREW_STORAGE_KEY = 'brewlliant_brew_state'

export const clearBrewState = (recipeId: string): void => {
	try {
		const stored = localStorage.getItem(BREW_STORAGE_KEY)

		if (!stored) {
			return
		}

		const data = JSON.parse(stored) as Record<string, unknown>
		const { [recipeId]: _, ...rest } = data

		void _
		localStorage.setItem(BREW_STORAGE_KEY, JSON.stringify(rest))
	} catch {
		// ignore storage errors
	}
}
