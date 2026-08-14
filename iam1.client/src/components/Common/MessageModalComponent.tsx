import '../../styles/ModalStyle.css';
interface Props {
    open: boolean;
    title: string;
    message: string;
    roles?: string[];
    onClose: () => void;
}

export function MessageModalComponent({
    open,
    title,
    message,
    roles,
    onClose
}: Props) {

    if (!open) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-box">
                <div className="modal-header">
                    <h3>{title}</h3>
                </div>

                <div className="modal-body">
                    <p>{message}</p>

                    {roles && roles.length > 0 && (
                            <ul className="role-list">
                                {roles.map(role => (
                                    <li key={role}>
                                        {role}
                                    </li>
                                ))}
                            </ul>
                        )}
                </div>

                <div className="modal-footer">
                    <button className="modal-btn" onClick={onClose}> OK </button>
                </div>
            </div>
        </div>
    );
}