import { RouterProvider } from 'react-router-dom'

import '@/shared/config'

import { router } from './router'
import '@/app/styles/index.css'

export const App = () => {
	return <RouterProvider router={router} />
}
