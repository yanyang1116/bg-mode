export interface EditNameModalProps {
	isOpen: boolean;
	onClose: () => void;
	currentName: string;
	onSave: (newName: string) => Promise<void>;
}
