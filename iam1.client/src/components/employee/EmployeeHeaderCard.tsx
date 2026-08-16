import type { ReactNode } from 'react';
import type { UserProfile } from '../../models/UserProfile';
import '../../styles/Employee.css';

interface EmployeeHeaderCardProps {
    profile: UserProfile;
    children?: ReactNode;
    onBack?: () => void; // แสดงปุ่ม Back เฉพาะเมื่อมีค่านี้ส่งมา (เปิดจากหน้า All Employee)
}

const getInitials = (name: string) => {
    if (!name) return 'U';

    const parts = name.trim().split(' ');

    if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }

    return name.substring(0, 2).toUpperCase();
};

export function EmployeeHeaderCard({
    profile,
    children,
    onBack
}: EmployeeHeaderCardProps) {
    return (
        <div className="header-card">
            <div className="header-banner">
                {onBack && (
                    <button
                        type="button"
                        className="header-back-btn"
                        onClick={onBack}
                    >
                        ← Back to All Employees
                    </button>
                )}
            </div>

            <div className="header-content">
                <div className="avatar-wrapper">
                    <div className="avatar">
                        <span>{getInitials(profile.fullName)}</span>
                    </div>
                </div>

                <div className="user-main-info">
                    <div className="name-row">
                        <h2 className="user-name">
                            {profile.fullName || 'Unassigned Name'}
                        </h2>

                        <span className="status-badge">
                            {profile.employeeStatus || 'Active'}
                        </span>
                    </div>

                    <p className="user-role-text">
                        {profile.position || 'No Position'} •{' '}
                        {profile.department || 'No Department'}
                    </p>
                </div>

                <div className="header-actions">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default EmployeeHeaderCard;