import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PProfile.css';

// 1. Interface สำหรับโครงสร้างข้อมูลโปรไฟล์
export interface UserProfile {
    fullName: string;
    employeeId: string;
    gender: string;
    dateOfBirth: string;
    email: string;
    phone: string;
    officeLocation: string;
    department: string;
    position: string;
    manager: string;
    joinedDate: string;
    employmentStatus: string;
}

// แปลง ISO date string จาก backend ("1992-05-14T00:00:00") ให้เป็นรูปแบบอ่านง่าย ("14 May 1992")
const formatDate = (dateString?: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
};

export function PProfile() {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<'profile' | 'role'>('profile');
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [fetchError, setFetchError] = useState<string | null>(null);

    // อ่านค่า employeeId จาก sessionStorage ตั้งแต่ตอน render ครั้งแรกเลย (lazy initializer)
    // แทนที่จะ setState ซ้อนใน useEffect ซึ่งทำให้เกิด cascading render warning
    const [employeeId] = useState<string | null>(() => sessionStorage.getItem('iam1_employeeId'));

    // Master state ข้อมูลหลักที่ดึงมาจาก Backend
    const [profileData, setProfileData] = useState<UserProfile>({
        fullName: '',
        employeeId: '',
        gender: '',
        dateOfBirth: '',
        email: '',
        phone: '',
        officeLocation: '',
        department: '',
        position: '',
        manager: '',
        joinedDate: '',
        employmentStatus: ''
    });

    // Temporary state สำหรับการแก้ไขข้อมูล (ไม่กระทบข้อมูลจริงจนกว่าจะกด Save)
    const [editForm, setEditForm] = useState<UserProfile>(profileData);

    // 2. ใช้ employeeId ที่เก็บไว้ตอน login ค้นหาข้อมูล Profile จาก API
    useEffect(() => {
        if (!employeeId) {
            // ไม่มี employeeId (เข้าหน้านี้ตรงๆ โดยไม่ login) -> เด้งกลับหน้า login
            navigate('/');
            return;
        }

        const controller = new AbortController();

        const fetchProfile = async () => {
            try {
                setIsLoading(true);
                setFetchError(null);

                const response = await fetch(`/api/profile/${encodeURIComponent(employeeId)}`, {
                    signal: controller.signal
                });

                if (response.ok) {
                    const data: UserProfile = await response.json();
                    setProfileData(data);
                    setEditForm(data);
                } else if (response.status === 404) {
                    setFetchError(`ไม่พบข้อมูลพนักงาน Employee ID: ${employeeId}`);
                } else {
                    console.error('Failed to fetch profile. Status:', response.status);
                    setFetchError(`ไม่สามารถโหลดข้อมูลได้ (สถานะ ${response.status})`);
                }
            } catch (error) {
                if ((error as Error).name !== 'AbortError') {
                    console.error('Error fetching profile:', error);
                    setFetchError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();

        return () => controller.abort();
    }, [employeeId, navigate]);

    // คำนวณอักษรย่อสำหรับ Avatar (เช่น "Dracule Mihawk" -> "DM")
    const getInitials = (name: string) => {
        if (!name) return 'U';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    // จัดการอัปเดตฟิลด์ในโหมดแก้ไข
    const handleInputChange = (field: keyof UserProfile, value: string) => {
        setEditForm((prev) => ({ ...prev, [field]: value }));
    };

    // เริ่มต้นแก้ไข
    const handleStartEdit = () => {
        setEditForm({ ...profileData });
        setIsEditing(true);
    };

    // ยกเลิกการแก้ไข
    const handleCancel = () => {
        setEditForm({ ...profileData });
        setIsEditing(false);
    };

    // ออกจากระบบ -> เคลียร์ employeeId แล้วกลับไปหน้า login
    const handleSignOut = () => {
        sessionStorage.removeItem('iam1_employeeId');
        navigate('/');
    };

    // 3. ยิง API บันทึกข้อมูล
    const handleSave = async () => {
        if (!employeeId) return;

        try {
            setIsSaving(true);
            const response = await fetch(`/api/profile/${encodeURIComponent(employeeId)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editForm),
            });

            if (response.ok) {
                setProfileData(editForm);
                setIsEditing(false);
                alert('บันทึกข้อมูลเรียบร้อยแล้ว');
            } else {
                alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                <p>กำลังโหลดข้อมูลโปรไฟล์...</p>
            </div>
        );
    }

    if (fetchError) {
        return (
            <div className="container" style={{ padding: '3rem', textAlign: 'center' }}>
                <p style={{ color: '#DC2626', marginBottom: '16px' }}>{fetchError}</p>
                <button className="secondary-btn" onClick={handleSignOut}>กลับไปหน้า Login</button>
            </div>
        );
    }

    return (
        <div className="container">
            {/* Header Banner & Profile Card */}
            <div className="header-card">
                <div className="header-banner"></div>
                <div className="header-content">
                    <div className="avatar-wrapper">
                        <div className="avatar">
                            <span>{getInitials(profileData.fullName)}</span>
                        </div>
                    </div>
                    <div className="user-main-info">
                        <div className="name-row">
                            <h2 className="user-name">{profileData.fullName || 'Unassigned Name'}</h2>
                            <span className="status-badge">Active</span>
                        </div>
                        <p className="user-role-text">
                            {profileData.position || 'No Position'} • {profileData.department || 'No Department'}
                        </p>
                    </div>
                    <div className="header-actions">
                        {/* แสดงปุ่ม Edit/Save/Cancel เฉพาะหน้า Personal Profile Tab */}
                        {activeTab === 'profile' && (
                            isEditing ? (
                                <div className="header-actions-group">
                                    <button
                                        className="cancel-btn"
                                        onClick={handleCancel}
                                        disabled={isSaving}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="primary-btn"
                                        onClick={handleSave}
                                        disabled={isSaving}
                                    >
                                        {isSaving ? 'Saving...' : 'Save Profile'}
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
                {/* Left Sub-sidebar Tabs */}
                <div className="sub-sidebar">
                    <button
                        type="button"
                        className={`tab-button ${activeTab === 'profile' ? 'tab-button-active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        {ProfileIcons.User}
                        <span>Personal Profile</span>
                    </button>

                    <button
                        type="button"
                        className={`tab-button ${activeTab === 'role' ? 'tab-button-active' : ''}`}
                        onClick={() => setActiveTab('role')}
                    >
                        {ProfileIcons.Shield}
                        <span>Roles & Permissions</span>
                    </button>
                </div>

                {/* Right Content Area */}
                <div className="content-area">
                    {activeTab === 'profile' ? (
                        /* TAB 1: Personal Profile Information */
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
                                                value={editForm.fullName}
                                                onChange={(e) => handleInputChange('fullName', e.target.value)}
                                            />
                                        ) : (
                                            <span className="value">{profileData.fullName}</span>
                                        )}
                                    </div>

                                    <div className="info-item">
                                        <span className="label">Employee ID</span>
                                        <span className="value">{profileData.employeeId}</span>
                                    </div>

                                    <div className="info-item">
                                        <span className="label">Gender</span>
                                        {isEditing ? (
                                            <input
                                                className="text-input"
                                                type="text"
                                                value={editForm.gender}
                                                onChange={(e) => handleInputChange('gender', e.target.value)}
                                            />
                                        ) : (
                                            <span className="value">{profileData.gender}</span>
                                        )}
                                    </div>

                                    <div className="info-item">
                                        <span className="label">Date of Birth</span>
                                        {isEditing ? (
                                            <input
                                                className="text-input"
                                                type="text"
                                                value={editForm.dateOfBirth}
                                                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                            />
                                        ) : (
                                            <span className="value">{formatDate(profileData.dateOfBirth)}</span>
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
                                                value={editForm.email}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                            />
                                        ) : (
                                            <span className="value value-with-icon">
                                                {ProfileIcons.Mail} {profileData.email}
                                            </span>
                                        )}
                                    </div>

                                    <div className="info-item">
                                        <span className="label">Phone Number</span>
                                        {isEditing ? (
                                            <input
                                                className="text-input"
                                                type="text"
                                                value={editForm.phone}
                                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                            />
                                        ) : (
                                            <span className="value value-with-icon">
                                                {ProfileIcons.Phone} {profileData.phone}
                                            </span>
                                        )}
                                    </div>

                                    <div className="info-item">
                                        <span className="label">Office Location</span>
                                        {isEditing ? (
                                            <input
                                                className="text-input"
                                                type="text"
                                                value={editForm.officeLocation}
                                                onChange={(e) => handleInputChange('officeLocation', e.target.value)}
                                            />
                                        ) : (
                                            <span className="value">{profileData.officeLocation}</span>
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
                                                value={editForm.department}
                                                onChange={(e) => handleInputChange('department', e.target.value)}
                                            />
                                        ) : (
                                            <span className="value">{profileData.department}</span>
                                        )}
                                    </div>

                                    <div className="info-item">
                                        <span className="label">Position / Title</span>
                                        {isEditing ? (
                                            <input
                                                className="text-input"
                                                type="text"
                                                value={editForm.position}
                                                onChange={(e) => handleInputChange('position', e.target.value)}
                                            />
                                        ) : (
                                            <span className="value">{profileData.position}</span>
                                        )}
                                    </div>

                                    <div className="info-item">
                                        <span className="label">Manager / Supervisor</span>
                                        {isEditing ? (
                                            <input
                                                className="text-input"
                                                type="text"
                                                value={editForm.manager}
                                                onChange={(e) => handleInputChange('manager', e.target.value)}
                                            />
                                        ) : (
                                            <span className="value">{profileData.manager}</span>
                                        )}
                                    </div>

                                    <div className="info-item">
                                        <span className="label">Joined Date</span>
                                        {isEditing ? (
                                            <input
                                                className="text-input"
                                                type="text"
                                                value={editForm.joinedDate}
                                                onChange={(e) => handleInputChange('joinedDate', e.target.value)}
                                            />
                                        ) : (
                                            <span className="value">{formatDate(profileData.joinedDate)}</span>
                                        )}
                                    </div>

                                    <div className="info-item">
                                        <span className="label">Employment Status</span>
                                        {isEditing ? (
                                            <input
                                                className="text-input"
                                                type="text"
                                                value={editForm.employmentStatus}
                                                onChange={(e) => handleInputChange('employmentStatus', e.target.value)}
                                            />
                                        ) : (
                                            <span className="value">{profileData.employmentStatus}</span>
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


// SVG Icons สำหรับใช้งานใน Tabs และ Sections
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
    CheckCircle: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
    )
};

export default PProfile;