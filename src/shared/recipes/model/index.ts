import type { Step } from '../../step'

export type Recipe = {
	id: string;
	name: string;
	description: string;
	preconditions: string[] | string;
	startDescription: string;
	endDescription: string;
	steps: Step[];
}
