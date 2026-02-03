import { createBrowserRouter } from 'react-router-dom'

import { BrewPage } from '@/pages/brew'
import { ErrorPage } from '@/pages/error'
import { HomePage } from '@/pages/home'
import { RecipePage } from '@/pages/recipe'
import { Layout } from '@/shared/ui'

export const router = createBrowserRouter(
	[
		{
			path: '/',
			element: <Layout />,
			children: [
				{
					index: true,
					element: <HomePage />,
				},
				{
					path: 'recipe/:id',
					element: <RecipePage />,
				},
				{
					path: 'brew/:id',
					element: <BrewPage />,
				},
				{
					path: '*',
					element: <ErrorPage />,
				},
			],
		},
	],
	{
		basename: import.meta.env.BASE_URL,
	},
)
