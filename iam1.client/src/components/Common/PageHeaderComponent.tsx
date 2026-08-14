import '../../styles/CommonStyle.css';
interface PageHeaderProps {
    icon: string;
    title: string;
    subtitle: string;
    count: number;
    countLabel: string;
    action?: React.ReactNode;
}

export function PageHeaderComponent({
    icon,
    title,
    subtitle,
    count,
    countLabel,
    action
}: PageHeaderProps) {
    return (
        <div className="page-header">
            <div className="page-header-icon">
                {icon}
            </div>

            <div className="page-header-content">
                <h2>{title}</h2>
                <p>{subtitle}</p>
            </div>

            <div className="page-header-actions">
                {action}

                <div className="page-count">
                    <span className="count-number">
                        {count}
                    </span>

                    <span className="count-label">
                        {countLabel}
                    </span>
                </div>
            </div>
        </div>
    );
}