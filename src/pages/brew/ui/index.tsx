import { useEffect, useState } from 'react'

import { Link, Navigate, useParams } from 'react-router-dom'

import { RECIPES } from '@/shared'
import { Modal } from '@/shared/ui'

import styles from './BrewPage.module.css'

const STORAGE_KEY = 'brewlliant_brew_state'

type BrewState = {
	step: number
	timeLeft: number
}

type StoredData = Record<string, BrewState>

const getStoredState = (recipeId: string): BrewState | null => {
	try {
		const stored = localStorage.getItem(STORAGE_KEY)

		if (!stored) {
			return null
		}

		const data = JSON.parse(stored) as StoredData

		return data[recipeId] ?? null
	} catch {
		return null
	}
}

const saveState = (recipeId: string, state: BrewState): void => {
	try {
		const stored = localStorage.getItem(STORAGE_KEY)
		const data: StoredData = stored ? JSON.parse(stored) as StoredData : {}

		data[recipeId] = state
		localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
	} catch {
		// Ignore storage errors
	}
}

const clearState = (recipeId: string): void => {
	try {
		const stored = localStorage.getItem(STORAGE_KEY)

		if (!stored) {
			return
		}

		const data = JSON.parse(stored) as StoredData
		const { [recipeId]: removedKey, ...rest } = data

		void removedKey
		localStorage.setItem(STORAGE_KEY, JSON.stringify(rest))
	} catch {
		// Ignore storage errors
	}
}

export const BrewPage = (): React.ReactElement => {
	const { id } = useParams<{ id: string }>()
	const recipe = RECIPES.find((r) => r.id === id)

	const getInitialState = (): { step: number; time: number } => {
		if (!recipe || !id) {
			return { step: 0, time: 0 }
		}

		const storedState = getStoredState(id)

		if (storedState && storedState.step < recipe.steps.length) {
			return { step: storedState.step, time: storedState.timeLeft }
		}

		return { step: 0, time: recipe.steps[0].duration }
	}

	const initialState = getInitialState()

	const [currentStepIndex, setCurrentStepIndex] = useState(initialState.step)
	const [timeLeft, setTimeLeft] = useState(initialState.time)
	const [isCompleted, setIsCompleted] = useState(false)
	const [showFinishModal, setShowFinishModal] = useState(false)
	const [showRestartModal, setShowRestartModal] = useState(false)

	// Save state to localStorage when step or time changes
	useEffect(() => {
		if (!id || isCompleted) {
			return
		}

		saveState(id, {
			step: currentStepIndex,
			timeLeft,
		})
	}, [id, currentStepIndex, timeLeft, isCompleted])

	// Clear state when completed or when leaving the page
	useEffect(() => {
		if (!id) {
			return
		}

		if (isCompleted) {
			clearState(id)
		}

		return () => {
			clearState(id)
		}
	}, [id, isCompleted])

	// Timer
	useEffect(() => {
		if (!recipe || isCompleted) {
			return
		}

		const timer = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 1) {
					const nextIndex = currentStepIndex + 1

					if (nextIndex >= recipe.steps.length) {
						setIsCompleted(true)
						clearInterval(timer)

						return 0
					}

					setCurrentStepIndex(nextIndex)

					return recipe.steps[nextIndex].duration
				}

				return prev - 1
			})
		}, 1000)

		return () => {
			clearInterval(timer)
		}
	}, [recipe, currentStepIndex, isCompleted])

	if (!recipe) {
		return <Navigate replace to="/404" />
	}

	const currentStep = recipe.steps[currentStepIndex]
	const hasNextStep = currentStepIndex + 1 < recipe.steps.length
	const nextStep = hasNextStep ? recipe.steps[currentStepIndex + 1] : null

	const handleFinishClick = () => {
		setShowFinishModal(true)
	}

	const handleFinishConfirm = () => {
		setShowFinishModal(false)
		setIsCompleted(true)
	}

	const handleFinishCancel = () => {
		setShowFinishModal(false)
	}

	const handleRestartClick = () => {
		setShowRestartModal(true)
	}

	const handleRestartConfirm = () => {
		setShowRestartModal(false)
		setCurrentStepIndex(0)
		setTimeLeft(recipe.steps[0].duration)
		setIsCompleted(false)
	}

	const handleRestartCancel = () => {
		setShowRestartModal(false)
	}

	if (isCompleted) {
		return (
			<div className={styles.container}>
				<Link className={styles.back} to={`/recipe/${recipe.id}`}>
					← К рецепту
				</Link>
				<h1 className={styles.title}>{recipe.name}</h1>
				<div className={styles.completed}>
					<p className={styles.endMessage}>{recipe.endDescription}</p>
					<p className={styles.signature}>Ваш повар Кокур</p>
					<Link className={styles.homeLink} to="/">
						К рецептам
					</Link>
				</div>
				<div className={styles.actions}>
					<button className={styles.actionButton} type="button" onClick={handleRestartClick}>
						Начать сначала
					</button>
				</div>

				{showRestartModal && (
					<Modal
						cancelText="Отмена"
						confirmText="Начать"
						title="Начать сначала?"
						onCancel={handleRestartCancel}
						onConfirm={handleRestartConfirm}
					/>
				)}
			</div>
		)
	}

	return (
		<div className={styles.container}>
			<Link className={styles.back} to={`/recipe/${recipe.id}`}>
				← К рецепту
			</Link>
			<h1 className={styles.title}>{recipe.name}</h1>

			<div className={styles.timerSection}>
				<div className={styles.timer}>{timeLeft}</div>
				<p className={styles.currentAction}>{currentStep.action}</p>
				<p className={styles.stepCounter}>
					Шаг
					{' '}
					{currentStepIndex + 1}
					{' '}
					из
					{' '}
					{recipe.steps.length}
				</p>
			</div>

			{nextStep !== null && (
				<div className={styles.nextStep}>
					<span className={styles.nextLabel}>Далее:</span>
					<span className={styles.nextAction}>{nextStep.action}</span>
				</div>
			)}

			<div className={styles.actions}>
				<button className={styles.actionButton} type="button" onClick={handleFinishClick}>
					Завершить
				</button>
				<button className={styles.actionButton} type="button" onClick={handleRestartClick}>
					Начать сначала
				</button>
			</div>

			{showFinishModal && (
				<Modal
					cancelText="Отмена"
					confirmText="Завершить"
					title="Завершить приготовление?"
					onCancel={handleFinishCancel}
					onConfirm={handleFinishConfirm}
				/>
			)}

			{showRestartModal && (
				<Modal
					cancelText="Отмена"
					confirmText="Начать"
					title="Начать сначала?"
					onCancel={handleRestartCancel}
					onConfirm={handleRestartConfirm}
				/>
			)}
		</div>
	)
}
