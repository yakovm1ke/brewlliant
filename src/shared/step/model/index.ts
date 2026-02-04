export type Step = {
	action: string;
	duration: number;
	type: 'wait' | 'action';
	description?: string;
}
