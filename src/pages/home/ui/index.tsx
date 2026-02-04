import { RecipeCard } from '@/features/recipe'
import { RECIPES } from '@/shared'

import styles from './HomePage.module.css'

export const HomePage = (): React.ReactElement => {
	return (
		<>
			<header className={styles.hero}>
				<p className={styles.heroSubtitle}>
					Авторский проект повара Кокура
				</p>
			</header>

		<section>
			<h2 className={styles.sectionTitle}>Мои рецепты</h2>
			<div className={styles.recipesGrid}>
				{RECIPES.map((recipe, index) => (
					<RecipeCard key={recipe.id} index={index} recipe={recipe} />
				))}
			</div>
		</section>
		</>
	)
}
