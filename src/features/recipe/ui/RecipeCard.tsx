import { useNavigate } from 'react-router-dom'

import { formatDuration, intervalToDuration } from 'date-fns'

import { type Recipe } from '@/shared/recipes'
import { sumStepsDuration } from '@/shared/step'

import styles from './RecipeCard.module.css'

type RecipeCardProps = {
	recipe: Recipe
	index: number
}

const formatSeconds = (seconds: number): string => {
	const duration = intervalToDuration({ start: 0, end: seconds * 1000 })

	return formatDuration(duration, {
		format: ['minutes', 'seconds'],
	})
}

export const RecipeCard = ({ recipe, index }: RecipeCardProps): React.ReactElement => {
	const navigate = useNavigate()

	return (
		<div className={styles.card}>
			<div className={styles.info}>
				<span className={styles.index}>
					{String(index + 1).padStart(2, '0')}
				</span>
				<h2 className={styles.name}>{recipe.name}</h2>
				<span className={styles.time}>
					{formatSeconds(sumStepsDuration(recipe.steps))}
				</span>
			</div>
			<div className={styles.actions}>
				<button
					className={styles.btnSecondary}
					type="button"
					onClick={() => navigate(`/recipe/${recipe.id}`)}
				>
					О рецепте
				</button>
				<button
					className={styles.btnPrimary}
					type="button"
					onClick={() => navigate(`/brew/${recipe.id}`)}
				>
					Начать
				</button>
			</div>
		</div>
	)
}
