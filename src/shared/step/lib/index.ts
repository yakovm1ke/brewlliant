import type { Step } from '../model'

export const sumStepsDuration = (steps: Step[]) => {
	let totalTime = 0

	steps.forEach((step) => {
		totalTime += step.duration
	})

	return totalTime
}
