import styles from './Modal.module.css'

type ModalProps = {
	title: string
	onConfirm: () => void
	onCancel: () => void
	confirmText?: string
	cancelText?: string
}

export const Modal = ({
	title,
	onConfirm,
	onCancel,
	confirmText = 'Да',
	cancelText = 'Отмена',
}: ModalProps): React.ReactElement => {
	return (
		<div className={styles.overlay} onClick={onCancel}>
			<div className={styles.modal} onClick={(e) => e.stopPropagation()}>
				<p className={styles.title}>{title}</p>
				<div className={styles.actions}>
					<button className={styles.button} onClick={onCancel} type="button">
						{cancelText}
					</button>
					<button className={styles.button} onClick={onConfirm} type="button">
						{confirmText}
					</button>
				</div>
			</div>
		</div>
	)
}
