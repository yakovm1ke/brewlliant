import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { Link, Navigate, useNavigate, useOutletContext, useParams } from 'react-router-dom'

import { RECIPES } from '@/shared'
import { playStepEndSound, playSuccessSound } from '@/shared/lib'
import { type LayoutOutletContext } from '@/shared/ui/layout'
import { Modal } from '@/shared/ui'

import styles from './BrewPage.module.css'

const STORAGE_KEY = 'brewlliant_brew_state'

type BrewState = {
	step: number
	timeLeft: number
	isPaused?: boolean
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
	const navigate = useNavigate()
	const { setTopBarLeft } = useOutletContext<LayoutOutletContext>()
	const { id } = useParams<{ id: string }>()
	const recipe = RECIPES.find((r) => r.id === id)

	useLayoutEffect(() => {
		if (!recipe) {
			setTopBarLeft(null)

			return
		}

		setTopBarLeft(
			<Link className={styles.back} to={`/recipe/${recipe.id}`}>
				← К рецепту
			</Link>,
		)

		return () => {
			setTopBarLeft(null)
		}
	}, [setTopBarLeft, recipe?.id])

	const getInitialState = (): { step: number; time: number; isPaused: boolean } => {
		if (!recipe || !id) {
			return { step: 0, time: 0, isPaused: false }
		}

		const storedState = getStoredState(id)

		if (storedState && storedState.step < recipe.steps.length) {
			return { step: storedState.step, time: storedState.timeLeft, isPaused: storedState.isPaused ?? false }
		}

		return { step: 0, time: recipe.steps[0].duration, isPaused: false }
	}

	const initialState = getInitialState()

	const [currentStepIndex, setCurrentStepIndex] = useState(initialState.step)
	const [timeLeft, setTimeLeft] = useState(initialState.time)
	const [isPaused, setIsPaused] = useState(initialState.isPaused)
	const [isCompleted, setIsCompleted] = useState(false)
	const [showFinishModal, setShowFinishModal] = useState(false)
	const [showRestartModal, setShowRestartModal] = useState(false)
	const isFirstRender = useRef(true)

	// Play sound on step change
	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false

			return
		}

		if (!isCompleted) {
			playStepEndSound()
		}
	}, [currentStepIndex, isCompleted])

	// Play success sound on completion
	useEffect(() => {
		if (isCompleted) {
			playSuccessSound()
		}
	}, [isCompleted])

	// Save state to localStorage when step or time changes
	useEffect(() => {
		if (!id || isCompleted) {
			return
		}

		saveState(id, {
			step: currentStepIndex,
			timeLeft,
			isPaused,
		})
	}, [id, currentStepIndex, timeLeft, isPaused, isCompleted])

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
		if (!recipe || isCompleted || isPaused) {
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
	}, [recipe, currentStepIndex, isPaused, isCompleted])

	if (!recipe) {
		return <Navigate replace to="/404" />
	}

	const currentStep = recipe.steps[currentStepIndex]
	const hasPrevStep = currentStepIndex > 0
	const hasNextStep = currentStepIndex + 1 < recipe.steps.length
	const nextStep = hasNextStep ? recipe.steps[currentStepIndex + 1] : null
	const stepDuration = currentStep.duration
	const elapsed = Math.max(0, Math.min(stepDuration, stepDuration - timeLeft))
	const progressPercent = stepDuration > 0 ? (elapsed / stepDuration) * 100 : 0

	const adjustTimeLeft = (deltaSeconds: number): void => {
		setTimeLeft((prev) => {
			const next = prev + deltaSeconds

			return Math.max(0, Math.min(stepDuration, next))
		})
	}

	const handlePrevStep = (): void => {
		if (hasPrevStep) {
			setCurrentStepIndex(currentStepIndex - 1)
			setTimeLeft(recipe.steps[currentStepIndex - 1].duration)
		}
	}

	const handleRestartStep = (): void => {
		setTimeLeft(currentStep.duration)
	}

	const handleTogglePause = (): void => {
		setIsPaused((prev) => !prev)
	}

	const handleNextStep = (): void => {
		if (hasNextStep) {
			setCurrentStepIndex(currentStepIndex + 1)
			setTimeLeft(recipe.steps[currentStepIndex + 1].duration)
		} else {
			setIsCompleted(true)
		}
	}

	const handleFinishClick = (): void => {
		setShowFinishModal(true)
	}

	const handleFinishConfirm = () => {
		setShowFinishModal(false)
		navigate(`/recipe/${recipe!.id}`)
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
				<h1 className={styles.title}>{recipe.name}</h1>
				<div className={styles.completed}>
					<p className={styles.endMessage}>{recipe.endDescription}</p>
					<p className={styles.signature}>Ваш повар Кокур</p>
					<button className={styles.restartLink} type="button" onClick={handleRestartClick}>
						Начать сначала
					</button>
				</div>
				<div className={styles.actions}>
					<Link className={styles.homeLinkBottom} to="/">
						К рецептам
					</Link>
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
			<h1 className={styles.title}>{recipe.name}</h1>

			<div className={styles.timerSection}>
				<div className={styles.progressRow}>
					<button
						aria-label="Добавить 5 секунд"
						className={`${styles.stepControlButton} ${styles.adjustButton}`}
						type="button"
						onClick={() => adjustTimeLeft(5)}
					>
						+5s
					</button>
					<input
						aria-label="Прогресс текущего шага"
						className={styles.progress}
						max={stepDuration}
						min={0}
						step={1}
						style={{ '--progress': `${progressPercent}%` } as React.CSSProperties}
						type="range"
						value={elapsed}
						onChange={() => {}}
					/>
					<button
						aria-label="Убавить 5 секунд"
						className={`${styles.stepControlButton} ${styles.adjustButton}`}
						type="button"
						onClick={() => adjustTimeLeft(-5)}
					>
						−5s
					</button>
				</div>
				<div className={styles.timer}>{timeLeft}</div>
				<p className={styles.currentAction}>{currentStep.action}</p>
				{currentStep.description && (
					<p className={styles.stepDescription}>{currentStep.description}</p>
				)}
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

			<div className={styles.stepControls}>
				<button
					className={styles.stepControlButton}
					disabled={!hasPrevStep}
					type="button"
					onClick={handlePrevStep}
				>
					← Назад
				</button>
				<div className={styles.centerControls}>
					<button
						aria-label={isPaused ? 'Продолжить таймер' : 'Поставить таймер на паузу'}
						aria-pressed={isPaused}
						className={`${styles.stepControlButton} ${isPaused ? styles.primaryControl : ''}`}
						type="button"
						onClick={handleTogglePause}
					>
						{isPaused ? '▶ Продолжить' : '⏸ Пауза'}
					</button>
					<button
						className={styles.stepControlButton}
						type="button"
						onClick={handleRestartStep}
					>
						↻ Заново
					</button>
				</div>
				<button
					className={styles.stepControlButton}
					type="button"
					onClick={handleNextStep}
				>
					Вперёд →
				</button>
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
