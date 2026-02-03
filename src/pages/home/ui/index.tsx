import { RecipeCard } from '@/features/recipe'
import { RECIPES } from '@/shared'

import styles from './HomePage.module.css'

export const HomePage = (): React.ReactElement => {
	return (
		<>
			<header className={styles.hero}>
				<h1 className={styles.heroTitle}>Brewlliant</h1>
				<p className={styles.heroSubtitle}>
					Авторский проект повара Кокура
				</p>
				<p className={styles.heroAuthor} />
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
