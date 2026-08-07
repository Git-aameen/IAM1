import { useState } from 'react';
import './PProfile.css';

// SVG Icons for Profile Tabs and Sections
const ProfileIcons = {
    User: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
        </svg>
    ),
    Shield: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
    ),
    Mail: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
        </svg>
    ),
    Phone: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
        </svg>
    ),
    Briefcase: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
    ),
    CheckCircle: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
    )
};

export function PProfile() {
    // Active Tab State: 'profile' or 'role'
    const [activeTab, setActiveTab] = useState<'profile' | 'role'>('profile');

    // Edit Mode State
    const [isEditing, setIsEditing] = useState(false);

    // Profile Form Data State
    const [formData, setFormData] = useState({
        fullName: 'Monkey D Luffy',
        employeeId: 'EMP-2024-0089',
        gender: 'Male',
        dateOfBirth: '14 May 1992',
        email: 'johnathan.s@company.com',
        phone: '+66 81 234 5678',
        officeLocation: 'Headquarter, Floor 12, Tech Tower',
        department: 'Information Technology',
        position: 'Senior System Administrator',
        manager: 'Sarah Jenkins (IT Director)',
        joinedDate: '15 January 2021',
        employmentStatus: 'Full-Time Permanent'
    });

    // Temp state to revert edits if canceled
    const [tempData, setTempData] = useState(formData);

    const handleInputChange = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleStartEdit = () => {
        setTempData(formData);
        setIsEditing(true);
    };

    const handleSave = () => {
        setIsEditing(false);
        // Add your save API call logic here if needed
    };

    const handleCancel = () => {
        setFormData(tempData);
        setIsEditing(false);
    };

    return (
        <div className="container">
            {/* Header Banner & Profile Card */}
            <div className="header-card">
                <div className="header-banner"></div>
                <div className="header-content">
                    <div className="avatar-wrapper">
                        <div className="avatar">
                            <span>JS</span>
                        </div>
                    </div>
                    <div className="user-main-info">
                        <div className="name-row">
                            <h2 className="user-name">{formData.fullName}</h2>
                            <span className="status-badge">Active</span>
                        </div>
                        <p className="user-role-text">{formData.position} • {formData.department}</p>
                    </div>
                    <div className="header-actions">
                        {/* Show Edit/Save buttons ONLY when on Personal Profile tab */}
                        {activeTab === 'profile' && (
                            isEditing ? (
                                <div className="header-actions-group">
                                    <button className="cancel-btn" onClick={handleCancel}>
                                        Cancel
                                    </button>
                                    <button className="primary-btn" onClick={handleSave}>
                                        Save Profile
                                    </button>
                                </div>
                            ) : (
                                <button className="secondary-btn" onClick={handleStartEdit}>
                                    Edit Profile
                                </button>
                            )
                        )}
                    </div>
                </div>
            </div>

            {/* Main Body Section: Left Sub-menu + Right Content Area */}
            <div className="main-layout">
                {/* Left Sub-menu Tabs */}
                <div className="sub-sidebar">
                    <button
                        className={`tab-button ${activeTab === 'profile' ? 'tab-button-active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        {ProfileIcons.User}
                        <span>Personal Profile</span>
                    </button>

                    <button
                        className={`tab-button ${activeTab === 'role' ? 'tab-button-active' : ''}`}
                        onClick={() => setActiveTab('role')}
                    >
                        {ProfileIcons.Shield}
                        <span>Roles & Permissions</span>
                    </button>
                </div>

                {/* Right Dynamic Content Area */}
                <div className="content-area">
                    {activeTab === 'profile' ? (
                        /* TAB 1: Profile Information */
                        <div className="grid-two-columns">
                            {/* Personal Details Card */}
                            <div className="card">
                                <h3 className="card-title">Personal Information</h3>
                                <div className="info-list">
                                    <div className="info-item">
                                        <span className="label">Full Name</span>
                                        {isEditing ? (
                                            <input
                                                className="text-input"
                                                type="text"
                                                value={formData.fullName}
                                                onChange={(e) => handleInputChange('fullName', e.target.value)}
                                            />
                                        ) : (
                                            <span className="value">{formData.fullName}</span>
                                        )}
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Employee ID</span>
                                        {isEditing ? (
                                            <input
                                                className="text-input"
                                                type="text"
                                                value={formData.employeeId}
                                                onChange={(e) => handleInputChange('employeeId', e.target.value)}
                                            />
                                        ) : (
                                            <span className="value">{formData.employeeId}</span>
                                        )}
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Gender</span>
                                        {isEditing ? (
                                            <input
                                                className="text-input"
                                                type="text"
                                                value={formData.gender}
                                                onChange={(e) => handleInputChange('gender', e.target.value)}
                                            />
                                        ) : (
                                            <span className="value">{formData.gender}</span>
                                        )}
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Date of Birth</span>
                                        {isEditing ? (
                                            <input
                                                className="text-input"
                                                type="text"
                                                value={formData.dateOfBirth}
                                                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                            />
                                        ) : (
                                            <span className="value">{formData.dateOfBirth}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Contact Details Card */}
                            <div className="card">
                                <h3 className="card-title">Contact Information</h3>
                                <div className="info-list">
                                    <div className="info-item">
                                        <span className="label">Email Address</span>
                                        {isEditing ? (
                                            <input
                                                className="text-input"
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                            />
                                        ) : (
                                            <span className="value value-with-icon">
                                                {ProfileIcons.Mail} {formData.email}
                                            </span>
                                        )}
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Phone Number</span>
                                        {isEditing ? (
                                            <input
                                                className="text-input"
                                                type="text"
                                                value={formData.phone}
                                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                            />
                                        ) : (
                                            <span className="value value-with-icon">
                                                {ProfileIcons.Phone} {formData.phone}
                                            </span>
                                        )}
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Office Location</span>
                                        {isEditing ? (
                                            <input
                                                className="text-input"
                                                type="text"
                                                value={formData.officeLocation}
                                                onChange={(e) => handleInputChange('officeLocation', e.target.value)}
                                            />
                                        ) : (
                                            <span className="value">{formData.officeLocation}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Employment Details Card */}
                            <div className="card card-span-two">
                                <h3 className="card-title">Employment Details</h3>
                                <div className="grid-three-columns">
                                    <div className="info-item">
                                        <span className="label">Department</span>
                                        {isEditing ? (
                                            <input
                                                className="text-input"
                                                type="text"
                                                value={formData.department}
                                                onChange={(e) => handleInputChange('department', e.target.value)}
                                            />
                                        ) : (
                                            <span className="value">{formData.department}</span>
                                        )}
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Position / Title</span>
                                        {isEditing ? (
                                            <input
                                                className="text-input"
                                                type="text"
                                                value={formData.position}
                                                onChange={(e) => handleInputChange('position', e.target.value)}
                                            />
                                        ) : (
                                            <span className="value">{formData.position}</span>
                                        )}
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Manager / Supervisor</span>
                                        {isEditing ? (
                                            <input
                                                className="text-input"
                                                type="text"
                                                value={formData.manager}
                                                onChange={(e) => handleInputChange('manager', e.target.value)}
                                            />
                                        ) : (
                                            <span className="value">{formData.manager}</span>
                                        )}
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Joined Date</span>
                                        {isEditing ? (
                                            <input
                                                className="text-input"
                                                type="text"
                                                value={formData.joinedDate}
                                                onChange={(e) => handleInputChange('joinedDate', e.target.value)}
                                            />
                                        ) : (
                                            <span className="value">{formData.joinedDate}</span>
                                        )}
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Employment Status</span>
                                        {isEditing ? (
                                            <input
                                                className="text-input"
                                                type="text"
                                                value={formData.employmentStatus}
                                                onChange={(e) => handleInputChange('employmentStatus', e.target.value)}
                                            />
                                        ) : (
                                            <span className="value">{formData.employmentStatus}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* TAB 2: Roles & Permissions Information */
                        <div className="tab-content-stack">
                            <div className="card">
                                <h3 className="card-title">Assigned System Roles</h3>
                                <div className="role-badge-container">
                                    <div className="role-card">
                                        <div className="role-card-header">
                                            <span className="role-card-title">System Administrator</span>
                                            <span className="primary-badge">Primary</span>
                                        </div>
                                        <p className="role-card-desc">Full access to user management, system logs, and security policy settings.</p>
                                    </div>

                                    <div className="role-card">
                                        <div className="role-card-header">
                                            <span className="role-card-title">Asset Manager</span>
                                        </div>
                                        <p className="role-card-desc">Read & Write access to IT hardware, licenses, and equipment allocations.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="card">
                                <h3 className="card-title">Access Rights Summary</h3>
                                <div className="permission-grid">
                                    <div className="permission-item">
                                        {ProfileIcons.CheckCircle}
                                        <span>User Management (Create / Edit / Delete)</span>
                                    </div>
                                    <div className="permission-item">
                                        {ProfileIcons.CheckCircle}
                                        <span>Role & Access Policy Configuration</span>
                                    </div>
                                    <div className="permission-item">
                                        {ProfileIcons.CheckCircle}
                                        <span>Asset Management & Inventory Allocation</span>
                                    </div>
                                    <div className="permission-item">
                                        {ProfileIcons.CheckCircle}
                                        <span>Audit Logs & Security Monitoring Read</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PProfile;