import { useLayoutEffect } from 'react'

import { Link, Navigate, useOutletContext, useParams } from 'react-router-dom'

import { formatDuration, intervalToDuration } from 'date-fns'

import { RECIPES } from '@/shared'
import { sumStepsDuration } from '@/shared/step'
import { type LayoutOutletContext } from '@/shared/ui/layout'

import styles from './RecipePage.module.css'

const BREW_STORAGE_KEY = 'brewlliant_brew_state'

const formatSeconds = (seconds: number): string => {
	const duration = intervalToDuration({ start: 0, end: seconds * 1000 })

	return formatDuration(duration, {
		format: ['minutes', 'seconds'],
	})
}

const clearBrewState = (recipeId: string): void => {
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

export const RecipePage = (): React.ReactElement => {
	const { setTopBarLeft } = useOutletContext<LayoutOutletContext>()
	const { id } = useParams<{ id: string }>()
	const recipe = RECIPES.find((r) => r.id === id)

	useLayoutEffect(() => {
		if (!recipe) {
			setTopBarLeft(null)

			return
		}

		setTopBarLeft(
			<Link className={styles.back} to="/">
				← Назад
			</Link>,
		)

		return () => {
			setTopBarLeft(null)
		}
	}, [setTopBarLeft, recipe?.id])

	if (!recipe) {
		return <Navigate replace to="/404" />
	}

	return (
		<div className={styles.container}>
			<h1 className={styles.title}>{recipe.name}</h1>
			<p className={styles.time}>{formatSeconds(sumStepsDuration(recipe.steps))}</p>
			<p className={styles.description}>{recipe.description}</p>

			<details open className={styles.details}>
				<summary className={styles.summary}>Подготовка</summary>
				<ul className={styles.preconditions}>
					{(Array.isArray(recipe.preconditions)
						? recipe.preconditions
						: [recipe.preconditions]
					).map((item, index) => (
						<li key={index} className={styles.precondition}>
							{item}
						</li>
					))}
				</ul>
			</details>

			<details className={styles.details}>
				<summary className={styles.summary}>Шаги рецепта</summary>
				<ol className={styles.steps}>
					{recipe.steps.map((step, index) => (
						<li key={index} className={styles.step}>
							<span className={styles.stepAction}>{step.action}</span>
							<span className={styles.stepDuration}>
								{step.duration}
								{' '}
								сек
							</span>
						</li>
					))}
				</ol>
			</details>

		<p className={styles.startHint}>{recipe.startDescription}</p>
		<Link
			className={styles.startButton}
			to={`/brew/${recipe.id}`}
			onClick={() => clearBrewState(recipe.id)}
		>
			Начать
		</Link>
		</div>
	)
}
