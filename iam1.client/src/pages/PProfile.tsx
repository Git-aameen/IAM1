import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PProfile.css';

// import components
import EmployeeHeaderCard from '../components/employee/EmployeeHeaderCard';
import EmployeeProfileCard from '../components/employee/EmployeeProfileCard';
import EmployeeRoleCard from '../components/employee/EmployeeRoleCard';

// import models
import type { UserProfile } from '../models/UserProfile';

interface AssignedRole {
    id: number;
    roleName: string;
    description: string;
    isPrimary: boolean;
}

interface AvailableRole {
    id: number;
    roleName: string;
    description: string;
}

interface PProfileProps {
    // ถ้าไม่ส่งมา = หน้า "My Profile" ของ user ที่ login อยู่ (อ่านจาก sessionStorage)
    // ถ้าส่งมา = หน้า "ดูโปรไฟล์ employee คนอื่น" (เช่นกด View จากตาราง All Employee)
    employeeId?: string;

    // มีเฉพาะตอนเปิดจากหน้า All Employee เพื่อกดย้อนกลับไปตาราง
    onBack?: () => void;
}

const initialProfileState: UserProfile = {
    fullName: '',
    employeeId: '',
    gender: '',
    dateOfBirth: '',
    email: '',
    phone: '',
    officeLocation: '',
    department: '',
    position: '',
    managerEmail: '',
    joinedDate: '',
    employeeStatus: '',
    employeeType: ''
};

export function PProfile({ employeeId: employeeIdProp, onBack }: PProfileProps) {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<'profile' | 'role'>('profile');
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    // ถ้าไม่มี prop ส่งมา ให้อ่านจาก sessionStorage (หน้า My Profile ของตัวเอง)
    // ใช้ lazy initializer เพื่อไม่ต้อง setState ซ้อนใน useEffect
    //const [employeeId] = useState<string | null>(() => employeeIdProp ?? sessionStorage.getItem('iam1_employeeId'));
    const employeeId = employeeIdProp ?? sessionStorage.getItem('iam1_employeeId');
    const [profileData, setProfileData] = useState<UserProfile>(initialProfileState);
    const [editForm, setEditForm] = useState<UserProfile>(initialProfileState);

    const [isProfileLoading, setIsProfileLoading] = useState<boolean>(true);
    const [profileFetchError, setProfileFetchError] = useState<string | null>(null);

    // ===== Roles & Permissions tab state =====
    const [assignedRoles, setAssignedRoles] = useState<AssignedRole[]>([]);
    const [availableRoles, setAvailableRoles] = useState<AvailableRole[]>([]);
    const [isRoleLoading, setIsRoleLoading] = useState<boolean>(false);
    const [isRoleSaving, setIsRoleSaving] = useState<boolean>(false);
    const [roleFetchError, setRoleFetchError] = useState<string | null>(null);

    const [isRoleEditing, setIsRoleEditing] = useState<boolean>(false);
    const [selectedRoleIdToAdd, setSelectedRoleIdToAdd] = useState<number>(0);
    const [pendingRemoveRoleIds, setPendingRemoveRoleIds] = useState<Set<number>>(new Set());
    const [primaryRoleId, setPrimaryRoleId] = useState<number | null>(null);

    // ===== โหลดข้อมูล Personal Profile =====
    useEffect(() => {
        if (!employeeId) {
            //setIsProfileLoading(false);
            //setProfileFetchError('ไม่พบ Employee ID');
            return;
        }

        const controller = new AbortController();

        const fetchProfile = async () => {
            try {
                setIsProfileLoading(true);
                setProfileFetchError(null);

                const response = await fetch(
                    `/api/profile/${encodeURIComponent(employeeId)}`,
                    { signal: controller.signal }
                );

                if (response.ok) {
                    const data: UserProfile = await response.json();
                    setProfileData(data);
                    setEditForm(data);
                } else if (response.status === 404) {
                    setProfileFetchError(`ไม่พบข้อมูล Employee ID: ${employeeId}`);
                } else {
                    setProfileFetchError(`โหลดข้อมูลไม่สำเร็จ (status ${response.status})`);
                }
            } catch (error) {
                if ((error as Error).name !== 'AbortError') {
                    console.error('Error fetching profile:', error);
                    setProfileFetchError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
                }
            } finally {
                setIsProfileLoading(false);
            }
        };

        fetchProfile();

        return () => controller.abort();
    }, [employeeId]);

    // ===== โหลด Role เมื่อสลับมาแท็บ Role =====
    useEffect(() => {
        if (activeTab !== 'role' || !employeeId) return;

        const controller = new AbortController();

        const fetchRoles = async () => {
            try {
                setIsRoleLoading(true);
                setRoleFetchError(null);

                const [assignedResponse, availableResponse] = await Promise.all([
                    fetch(`/api/profile/${encodeURIComponent(employeeId)}/roles`, {
                        signal: controller.signal
                    }),
                    fetch('/api/role_all', { signal: controller.signal })
                ]);

                if (!assignedResponse.ok) {
                    throw new Error('Failed to load employee roles');
                }

                if (!availableResponse.ok) {
                    throw new Error('Failed to load available roles');
                }

                const assignedData: AssignedRole[] = await assignedResponse.json();
                const availableData: AvailableRole[] = await availableResponse.json();

                setAssignedRoles(assignedData);
                setAvailableRoles(availableData);

                const primary = assignedData.find(r => r.isPrimary);
                setPrimaryRoleId(primary ? primary.id : null);

                setPendingRemoveRoleIds(new Set());
                setIsRoleEditing(false);
            } catch (error) {
                if ((error as Error).name !== 'AbortError') {
                    console.error(error);
                    setRoleFetchError('ไม่สามารถโหลดข้อมูล Role ได้');
                }
            } finally {
                setIsRoleLoading(false);
            }
        };

        fetchRoles();

        return () => controller.abort();
    }, [activeTab, employeeId]);

    // ===== Personal Profile handlers =====

    const handleInputChange = (field: keyof UserProfile, value: string) => {
        setEditForm(prev => ({ ...prev, [field]: value }));
    };

    const handleStartEdit = () => {
        setEditForm(profileData);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setEditForm(profileData);
        setIsEditing(false);
    };

    const handleSave = async () => {
        if (!employeeId) return;

        try {
            setIsSaving(true);

            const response = await fetch(
                `/api/profile/${encodeURIComponent(employeeId)}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(editForm)
                }
            );

            if (!response.ok) {
                throw new Error();
            }

            setProfileData(editForm);
            setIsEditing(false);
            alert('บันทึกข้อมูลเรียบร้อยแล้ว');
        } catch (error) {
            console.error(error);
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        } finally {
            setIsSaving(false);
        }
    };

    // ===== Roles & Permissions handlers =====

    const handleToggleRemoveRole = (roleId: number) => {
        setPendingRemoveRoleIds(prev => {
            const next = new Set(prev);
            if (next.has(roleId)) {
                next.delete(roleId);
            } else {
                next.add(roleId);
            }
            return next;
        });
    };

    const handleAddRole = () => {
        if (selectedRoleIdToAdd === 0) return;

        const role = availableRoles.find(r => r.id === selectedRoleIdToAdd);
        if (!role) return;

        const alreadyAssigned = assignedRoles.some(r => r.id === role.id);

        if (alreadyAssigned) {
            if (pendingRemoveRoleIds.has(role.id)) {
                handleToggleRemoveRole(role.id);
            }
            setSelectedRoleIdToAdd(0);
            return;
        }

        setAssignedRoles([
            ...assignedRoles,
            { id: role.id, roleName: role.roleName, description: role.description, isPrimary: false }
        ]);

        setSelectedRoleIdToAdd(0);
    };

    const handleSetPrimary = (roleId: number) => {
        setPrimaryRoleId(roleId);
    };

    const handleCancelRoleEdit = () => {
        setPendingRemoveRoleIds(new Set());

        const primary = assignedRoles.find(r => r.isPrimary);
        setPrimaryRoleId(primary ? primary.id : null);

        setSelectedRoleIdToAdd(0);
        setIsRoleEditing(false);
    };

    const handleSaveRoles = async () => {
        if (!employeeId) return;

        const finalRoles = assignedRoles.filter(r => !pendingRemoveRoleIds.has(r.id));
        const finalRoleIds = finalRoles.map(r => r.id);

        const finalPrimaryId =
            primaryRoleId !== null && finalRoleIds.includes(primaryRoleId)
                ? primaryRoleId
                : null;

        try {
            setIsRoleSaving(true);

            const response = await fetch(
                `/api/profile/${encodeURIComponent(employeeId)}/roles`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        roleIds: finalRoleIds,
                        primaryRoleId: finalPrimaryId
                    })
                }
            );

            if (!response.ok) {
                throw new Error('Save failed');
            }

            setAssignedRoles(
                finalRoles.map(r => ({ ...r, isPrimary: r.id === finalPrimaryId }))
            );

            setPendingRemoveRoleIds(new Set());
            setIsRoleEditing(false);
        } catch (error) {
            console.error(error);
            alert('ไม่สามารถบันทึก Role ได้');
        } finally {
            setIsRoleSaving(false);
        }
    };

    // ===== Sign out เฉพาะกรณีเป็นหน้า My Profile (ไม่มี onBack ส่งมา) =====
    const handleSignOut = () => {
        sessionStorage.removeItem('iam1_employeeId');
        navigate('/');
    };

    if (isProfileLoading) {
        return (
            <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                <p>กำลังโหลดข้อมูลโปรไฟล์...</p>
            </div>
        );
    }

    if (profileFetchError) {
        return (
            <div className="container" style={{ padding: '3rem', textAlign: 'center' }}>
                <p style={{ color: '#DC2626', marginBottom: '16px' }}>{profileFetchError}</p>

                {onBack ? (
                    <button className="secondary-btn" onClick={onBack}>
                        ← Back to All Employees
                    </button>
                ) : (
                    <button className="secondary-btn" onClick={handleSignOut}>
                        กลับไปหน้า Login
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="container">

            <EmployeeHeaderCard profile={profileData} onBack={onBack}>

                {activeTab === 'profile' && (
                    isEditing ? (
                        <div className="header-actions-group">
                            <button className="cancel-btn" onClick={handleCancel} disabled={isSaving}>
                                Cancel
                            </button>
                            <button className="primary-btn" onClick={handleSave} disabled={isSaving}>
                                {isSaving ? 'Saving...' : 'Save Profile'}
                            </button>
                        </div>
                    ) : (
                        <button className="secondary-btn" onClick={handleStartEdit}>
                            Edit Profile
                        </button>
                    )
                )}

                {activeTab === 'role' && !isRoleLoading && !roleFetchError && (
                    isRoleEditing ? (
                        <div className="header-actions-group">
                            <button className="cancel-btn" onClick={handleCancelRoleEdit} disabled={isRoleSaving}>
                                Cancel
                            </button>
                            <button className="primary-btn" onClick={handleSaveRoles} disabled={isRoleSaving}>
                                {isRoleSaving ? 'Saving...' : 'Save Roles'}
                            </button>
                        </div>
                    ) : (
                        <button className="secondary-btn" onClick={() => setIsRoleEditing(true)}>
                            Edit Roles
                        </button>
                    )
                )}

            </EmployeeHeaderCard>

            <div className="main-layout">
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

                <div className="content-area">
                    {activeTab === 'profile' ? (
                        <EmployeeProfileCard
                            profile={profileData}
                            editForm={editForm}
                            isEditing={isEditing}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <EmployeeRoleCard
                            assignedRoles={assignedRoles}
                            availableRoles={availableRoles}
                            isLoading={isRoleLoading}
                            error={roleFetchError}
                            isEditing={isRoleEditing}
                            isSaving={isRoleSaving}
                            selectedRoleIdToAdd={selectedRoleIdToAdd}
                            primaryRoleId={primaryRoleId}
                            pendingRemoveRoleIds={pendingRemoveRoleIds}
                            onRoleSelect={setSelectedRoleIdToAdd}
                            onAddRole={handleAddRole}
                            onSetPrimary={handleSetPrimary}
                            onToggleRemoveRole={handleToggleRemoveRole}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

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
    )
};

export default PProfile;