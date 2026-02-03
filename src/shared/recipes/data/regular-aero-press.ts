import { type Recipe } from '../model'

export const REGULAR_AERO_PRESS_RECIPE: Recipe = {
	id: 'regular-aeropress',
	name: 'Классический аэропресс',
	description: 'Мягкий и насыщенный кофе с чистым вкусом',
	preconditions: [
		'Приготовь аэропресс, пару бумажных фильтров и лопатку для помешивания',
		'Слегка смочи фильтры чистой водой и аккуратно установи их в крышку',
		'Поставь чайник — мы начнём, как только вода закипит',
	],
	startDescription: 'Когда чайник вскипит — самое время начинать',
	endDescription: 'Готово! Наслаждайся своим кофе ☕',
	steps: [
		{
			action: 'Пусть вода немного остынет — так кофе не будет горчить',
			duration: 90,
			type: 'wait',
		},
		{
			action: 'Плавно залей воду на треть объёма',
			duration: 10,
			type: 'action',
		},
		{
			action: 'Подожди — кофе раскрывается',
			duration: 20,
			type: 'wait',
		},
		{
			action: 'Долей воду до самого верха',
			duration: 10,
			type: 'action',
		},
		{
			action: 'Надень поршень сверху, чтобы сохранить тепло',
			duration: 10,
			type: 'action',
		},
		{
			action: 'Ещё немного терпения...',
			duration: 30,
			type: 'wait',
		},
		{
			action: 'Сними поршень и аккуратно перемешай лопаткой',
			duration: 15,
			type: 'action',
		},
		{
			action: 'Верни поршень и медленно продавливай до лёгкого шипения',
			duration: 40,
			type: 'action',
		},
	],
}
