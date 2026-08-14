import '../../styles/ModalStyle.css';
interface Props {
    open: boolean;
    title: string;
    name: string;
    onCancel: () => void;
    onConfirm: () => void;
}

export function ConfirmDeleteModalComponent({
    open,
    title,
    name,
    onCancel,
    onConfirm
}: Props) {

    if (!open) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="delete-modal">
                <div className="delete-icon">
                    🗑️
                </div>

                <h3>{title}</h3>

                <p>Are you sure you want
                    to delete
                </p>

                <div className="delete-name">{name}</div>

                <div className="delete-actions">
                    <button className="btn-cancel" onClick={onCancel}> Cancel </button>
                    <button className="btn-delete" onClick={onConfirm}> Delete </button>
                </div>
            </div>
        </div>
    );
}