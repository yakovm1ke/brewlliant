import { Link, Navigate, useParams } from 'react-router-dom'

import { formatDuration, intervalToDuration } from 'date-fns'

import { RECIPES } from '@/shared'
import { sumStepsDuration } from '@/shared/step'

import styles from './RecipePage.module.css'

const formatSeconds = (seconds: number): string => {
	const duration = intervalToDuration({ start: 0, end: seconds * 1000 })

	return formatDuration(duration, {
		format: ['minutes', 'seconds'],
	})
}

export const RecipePage = (): React.ReactElement => {
	const { id } = useParams<{ id: string }>()
	const recipe = RECIPES.find((r) => r.id === id)

	if (!recipe) {
		return <Navigate replace to="/404" />
	}

	return (
		<div className={styles.container}>
			<Link className={styles.back} to="/">
				← Назад
			</Link>

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
			<Link className={styles.startButton} to={`/brew/${recipe.id}`}>
				Начать
			</Link>
		</div>
	)
}
