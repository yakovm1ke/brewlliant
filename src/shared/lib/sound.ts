const audioContext = new window.AudioContext()

export const playFinalSound = (): void => {
	// Нежный звук: C5 + G5 одновременно (квинта)
	const frequencies = [523, 784]

	frequencies.forEach((freq) => {
		const osc = audioContext.createOscillator()
		const gain = audioContext.createGain()

		osc.connect(gain)
		gain.connect(audioContext.destination)

		osc.type = 'sine'
		osc.frequency.setValueAtTime(freq, audioContext.currentTime)

		// Мягкий старт и долгое затухание
		gain.gain.setValueAtTime(0, audioContext.currentTime)
		gain.gain.linearRampToValueAtTime(0.08, audioContext.currentTime + 0.05)
		gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.6)

		osc.start(audioContext.currentTime)
		osc.stop(audioContext.currentTime + 0.6)
	})
}

export const playSuccessSound = (): void => {
	// Милая мелодия: G4 → C5 → E5 → G5 ✨
	const notes = [392, 523, 659, 784]
	const noteDuration = 0.09

	notes.forEach((freq, i) => {
		// Основной тон
		const osc1 = audioContext.createOscillator()
		// Второй тон чуть выше для "искристости"
		const osc2 = audioContext.createOscillator()
		const gainNode = audioContext.createGain()

		osc1.connect(gainNode)
		osc2.connect(gainNode)
		gainNode.connect(audioContext.destination)

		osc1.type = 'triangle'
		osc2.type = 'sine'

		const startTime = audioContext.currentTime + i * noteDuration
		const endTime = startTime + noteDuration * 2.5

		// Основной тон
		osc1.frequency.setValueAtTime(freq, startTime)
		// Детюн +5 центов для мерцания
		osc2.frequency.setValueAtTime(freq * 1.003, startTime)

		// Мягкая атака и плавное затухание
		gainNode.gain.setValueAtTime(0, startTime)
		gainNode.gain.linearRampToValueAtTime(0.12, startTime + 0.02)
		gainNode.gain.setValueAtTime(0.12, startTime + noteDuration * 0.5)
		gainNode.gain.exponentialRampToValueAtTime(0.001, endTime)

		osc1.start(startTime)
		osc2.start(startTime)
		osc1.stop(endTime)
		osc2.stop(endTime)
	})

	// Финальный "блеск" — высокий призвук
	const sparkleStart = audioContext.currentTime + notes.length * noteDuration
	const sparkle = audioContext.createOscillator()
	const sparkleGain = audioContext.createGain()

	sparkle.connect(sparkleGain)
	sparkleGain.connect(audioContext.destination)

	sparkle.type = 'sine'
	sparkle.frequency.setValueAtTime(1568, sparkleStart) // G6

	sparkleGain.gain.setValueAtTime(0, sparkleStart)
	sparkleGain.gain.linearRampToValueAtTime(0.08, sparkleStart + 0.01)
	sparkleGain.gain.exponentialRampToValueAtTime(0.001, sparkleStart + 0.3)

	sparkle.start(sparkleStart)
	sparkle.stop(sparkleStart + 0.3)
}
