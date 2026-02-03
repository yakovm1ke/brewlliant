import { Outlet } from 'react-router-dom'

import styles from './Layout.module.css'

export const Layout = (): React.ReactElement => {
	return (
		<div className={styles.page}>
			<Outlet />
		</div>
	)
}
