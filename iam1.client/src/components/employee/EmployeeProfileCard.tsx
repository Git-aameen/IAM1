import type { UserProfile } from '../../models/UserProfile';

interface EmployeeProfileCardProps {
    profile: UserProfile;
    editForm: UserProfile;
    isEditing: boolean;
    onChange: (field: keyof UserProfile, value: string) => void;
}

const formatDate = (dateString?: string | null) => {
    if (!dateString) return '-';

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        return dateString;
    }

    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
};

export function EmployeeProfileCard({
    profile,
    editForm,
    isEditing,
    onChange
}: EmployeeProfileCardProps) {
    return (
        <div className="grid-two-columns">

            {/* Personal information */}
            <div className="card">
                <h3 className="card-title">
                    Personal Information
                </h3>
                <div className="info-list">
                    <div className="info-item">
                        <span className="label">
                            Employee ID
                        </span>
                        <span className="value">
                            {profile.employeeId}
                        </span>
                    </div>

                    <div className="info-item">
                        <span className="label">
                            Full Name
                        </span>

                        {isEditing ? (
                            <input
                                className="text-input"
                                type="text"
                                value={editForm.fullName}
                                onChange={(e) =>
                                    onChange('fullName', e.target.value)
                                }
                            />
                        ) : (
                            <span className="value">
                                {profile.fullName}
                            </span>
                        )}
                    </div>

                    <div className="info-item">
                        <span className="label">
                            Gender
                        </span>

                        {isEditing ? (
                            <input
                                className="text-input"
                                type="text"
                                value={editForm.gender}
                                onChange={(e) =>
                                    onChange('gender', e.target.value)
                                }
                            />
                        ) : (
                            <span className="value">
                                {profile.gender}
                            </span>
                        )}
                    </div>

                    <div className="info-item">
                        <span className="label">
                            Date of Birth
                        </span>
                        <span className="value">
                            {formatDate(profile.dateOfBirth)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Contact Information */}
            <div className="card">
                <h3 className="card-title">
                    Contact Information
                </h3>
                <div className="info-list">
                    <div className="info-item">
                        <span className="label">
                            Email
                        </span>

                        {isEditing ? (
                            <input
                                className="text-input"
                                type="email"
                                value={editForm.email}
                                onChange={(e) =>
                                    onChange('email', e.target.value)
                                }
                            />
                        ) : (
                            <span className="value">
                                {profile.email}
                            </span>
                        )}
                    </div>

                    <div className="info-item">
                        <span className="label">
                            Phone
                        </span>

                        {isEditing ? (
                            <input
                                className="text-input"
                                type="text"
                                value={editForm.phone}
                                onChange={(e) =>
                                    onChange('phone', e.target.value)
                                }
                            />
                        ) : (
                            <span className="value">
                                {profile.phone}
                            </span>
                        )}
                    </div>

                    <div className="info-item">
                        <span className="label">
                            Office Location
                        </span>
                        <span className="value">
                            {profile.officeLocation}
                        </span>
                    </div>
                </div>
            </div>

            {/* Employment Details */}
            <div className="card card-span-two">
                <h3 className="card-title">
                    Employment Details
                </h3>

                <div className="grid-three-columns">
                    <div className="info-item">
                        <span className="label">
                            Department
                        </span>

                        {isEditing ? (
                            <input
                                className="text-input"
                                type="text"
                                value={editForm.department}
                                onChange={(e) =>
                                    onChange('department', e.target.value)
                                }
                            />
                        ) : (
                            <span className="value">
                                {profile.department}
                            </span>
                        )}
                    </div>

                    <div className="info-item">
                        <span className="label">
                            Position
                        </span>
                        <span className="value">
                            {profile.position}
                        </span>
                    </div>

                    <div className="info-item">
                        <span className="label">
                            Manager
                        </span>
                        <span className="value">
                            {profile.managerEmail}
                        </span>
                    </div>

                    <div className="info-item">
                        <span className="label">
                            Joined Date
                        </span>
                        <span className="value">
                            {formatDate(profile.joinedDate)}
                        </span>
                    </div>

                    <div className="info-item">
                        <span className="label">Employee Status</span>
                        <input
                            className="text-input"
                            type="text"
                            value={
                                isEditing
                                    ? editForm.employeeStatus
                                    : profile.employeeStatus
                            }
                            readOnly={!isEditing}
                            onChange={(e) =>
                                onChange('employeeStatus', e.target.value)
                            }
                        />
                    </div>

                    <div className="info-item">
                        <span className="label">Employee Type</span>
                        <input
                            className="text-input"
                            type="text"
                            value={
                                isEditing
                                    ? editForm.employeeType
                                    : profile.employeeType
                            }
                            readOnly={!isEditing}
                            onChange={(e) =>
                                onChange('employeeType', e.target.value)
                            }
                        />
                    </div>

                </div>
            </div>
        </div>
    );
}

export default EmployeeProfileCard;