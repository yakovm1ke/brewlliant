import { Link } from 'react-router-dom'

import styles from './ErrorPage.module.css'

export const ErrorPage = (): React.ReactElement => {
	return (
		<div className={styles.container}>
			<p className={styles.message}>Кажется такой страницы не существует</p>
			<Link to="/" className={styles.button}>
				К рецептам
			</Link>
		</div>
	)
}
