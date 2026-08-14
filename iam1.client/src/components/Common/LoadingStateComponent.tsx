import '../../styles/ModalStyle.css';

interface Props { message: string; }

export function LoadingStateComponent({
    message
}: Props) {
    return (
        <div className="training-state">
            <div className="loading-spinner"></div>
            <span>{message}</span>
        </div>
    );
}