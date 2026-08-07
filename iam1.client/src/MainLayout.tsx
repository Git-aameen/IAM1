import { useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';

// SVG Icons matching main menu topics
const Icons = {
    Overview: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
    ),
    Profile: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-person-vcard" viewBox="0 0 16 16">
            <path d="M5 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4m4-2.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5M9 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4A.5.5 0 0 1 9 8m1 2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5" />
            <path d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM1 4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H8.96q.04-.245.04-.5C9 10.567 7.21 9 5 9c-2.086 0-3.8 1.398-3.984 3.181A1 1 0 0 1 1 12z" />
        </svg>
    ),
    Credential: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
    ),
    Employees: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
    ),
    Roles: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
    ),
    Assets: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
    ),
    Training: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
    ),
    SignOut: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
    )
};

export function MainLayout() {
    const navigate = useNavigate();
    const location = useLocation(); // To check the current route for active styling

    // Toggle states for sidebar main menus
    const [isEmployeeOpen, setIsEmployeeOpen] = useState(false);
    const [isRoleOpen, setIsRoleOpen] = useState(false);
    const [isAssetOpen, setIsAssetOpen] = useState(false);
    const [isTrainingOpen, setIsTrainingOpen] = useState(false);

    // Sidebar background color
    const sidebarBgColor = '#003787';

    // Sign Out Handler
    const handleSignOut = () => {
    // Clear authentication state or tokens here if applicable
    // localStorage.removeItem('token');
        navigate('/');
    };

    // Dynamic style handler for main menu items (Active state)
    const getWhiteMenuStyle = (path: string): React.CSSProperties => {
        const isActive = location.pathname.startsWith(path);

        return {
            ...styles.menuItem,
            color: isActive ? 'white' : '#A0CFFF', // White for active, light blue for inactive
            //border: isActive ? '1px solid white' : '1px solid transparent', // White border on active
        };
    };

    // Dynamic style handler for submenu items (Active state)
    const getDarkMenuStyle = (path: string): React.CSSProperties => {
        const isActive = location.pathname === path;

        return {
            ...styles.subMenuItem,
            color: isActive ? '#003787' : 'white', // Inverted text color when active
            backgroundColor: isActive ? 'white' : 'transparent', // White background when active
        };
    };

    return (
        <div style={styles.layout}>
            {/* Header */}
            <header style={styles.header}>
                <h2 style={styles.headerTitle}>Identify and Access Management</h2>

                {/* Sign Out Button Top-Right */}
                <button
                    style={styles.signOutBtn}
                    onClick={handleSignOut}
                    className="sign-out-btn-hover"
                    title="Sign Out"
                >
                    {Icons.SignOut}
                    <span>Sign Out</span>
                </button>
            </header>

            {/* Body */}
            <div style={styles.body}>

                {/* Minimal Sidebar */}
                <aside style={{ ...styles.sidebar, backgroundColor: sidebarBgColor }}>
                    <ul style={styles.menuList}>

                        {/* Overview */}
                        <li>
                            <div
                                style={getDarkMenuStyle('/overview')}
                                onClick={() => navigate('/overview')}
                                className="menu-item-hover"
                            >
                                <div style={styles.menuTitleGroup}>
                                    {Icons.Overview}
                                    <span>Overview</span>
                                </div>
                            </div>
                        </li>
                        {/* Profile */}
                        <li>
                            <div
                                style={getDarkMenuStyle('/profile')}
                                onClick={() => navigate('/profile')}
                                className="menu-item-hover"
                            >
                                <div style={styles.menuTitleGroup}>
                                    {Icons.Profile}
                                    <span>Profile</span>
                                </div>
                            </div>
                        </li>
                        {/* Credential */}
                        <li>
                            <div
                                style={getDarkMenuStyle('/credential')}
                                onClick={() => navigate('/credential')}
                                className="menu-item-hover"
                            >
                                <div style={styles.menuTitleGroup}>
                                    {Icons.Credential}
                                    <span>Credential</span>
                                </div>
                            </div>
                        </li>

                        <div style={styles.divider}>
                            <div style={styles.dividerLine}></div>
                        </div>

                        {/* 1. Employee Menu */}
                        <li>
                            <div
                                style={getWhiteMenuStyle('/employee')}
                                onClick={() => setIsEmployeeOpen(!isEmployeeOpen)}
                                className="menu-item-hover"
                            >
                                <div style={styles.menuTitleGroup}>
                                    {Icons.Employees}
                                    <span>Employees</span>
                                </div>
                                <span>{isEmployeeOpen ? '▲' : '▼'}</span>
                            </div>
                            {isEmployeeOpen && (
                                <ul style={styles.subMenuContainer}>
                                    <li
                                        style={getDarkMenuStyle('/employee/all')}
                                        onClick={() => navigate('/employee/all')}
                                        className="sub-menu-item-hover"
                                    >
                                        All Employee
                                    </li>
                                    <li
                                        style={getDarkMenuStyle('/employee/add')}
                                        onClick={() => navigate('/employee/add')}
                                        className="sub-menu-item-hover"
                                    >
                                        Add New Employee
                                    </li>
                                </ul>
                            )}
                        </li>

                        {/* 2. Role Menu */}
                        <li>
                            <div
                                style={getWhiteMenuStyle('/role')}
                                onClick={() => setIsRoleOpen(!isRoleOpen)}
                                className="menu-item-hover"
                            >
                                <div style={styles.menuTitleGroup}>
                                    {Icons.Roles}
                                    <span>Roles</span>
                                </div>
                                <span>{isRoleOpen ? '▲' : '▼'}</span>
                            </div>
                            {isRoleOpen && (
                                <ul style={styles.subMenuContainer}>
                                    <li
                                        style={getDarkMenuStyle('/role/all')}
                                        onClick={() => navigate('/role/all')}
                                        className="sub-menu-item-hover"
                                    >
                                        All Role
                                    </li>
                                    <li
                                        style={getDarkMenuStyle('/role/add')}
                                        onClick={() => navigate('/role/add')}
                                        className="sub-menu-item-hover"
                                    >
                                        Add New Role
                                    </li>
                                </ul>
                            )}
                        </li>

                        {/* 3. Asset Menu */}
                        <li>
                            <div
                                style={getWhiteMenuStyle('/asset')}
                                onClick={() => setIsAssetOpen(!isAssetOpen)}
                                className="menu-item-hover"
                            >
                                <div style={styles.menuTitleGroup}>
                                    {Icons.Assets}
                                    <span>Assets</span>
                                </div>
                                <span>{isAssetOpen ? '▲' : '▼'}</span>
                            </div>
                            {isAssetOpen && (
                                <ul style={styles.subMenuContainer}>
                                    <li style={styles.subMenuItem} className="sub-menu-item-hover">All Asset</li>
                                    <li style={styles.subMenuItem} className="sub-menu-item-hover">Add New Asset</li>
                                </ul>
                            )}
                        </li>

                        {/* 4. Training Course Menu */}
                        <li>
                            <div
                                style={getWhiteMenuStyle('/training')}
                                onClick={() => setIsTrainingOpen(!isTrainingOpen)}
                                className="menu-item-hover"
                            >
                                <div style={styles.menuTitleGroup}>
                                    {Icons.Training}
                                    <span>Training Courses</span>
                                </div>
                                <span>{isTrainingOpen ? '▲' : '▼'}</span>
                            </div>
                            {isTrainingOpen && (
                                <ul style={styles.subMenuContainer}>
                                    <li style={styles.subMenuItem} className="sub-menu-item-hover">All Training</li>
                                    <li style={styles.subMenuItem} className="sub-menu-item-hover">Add New Training</li>
                                </ul>
                            )}
                        </li>

                        <div style={styles.divider}>
                            <div style={styles.dividerLine}></div>
                        </div>

                    </ul>
                </aside>

                {/* Main Content Area */}
                <main style={styles.content}>
                    <Outlet />
                </main>
            </div>

            {/* Embedded CSS for Hover Effects */}
            <style>
                {`
                .menu-item-hover:hover {
                    border: 1px solid white !important;
                    color: white !important;
                }
                .sub-menu-item-hover:hover {
                    color: #003787 !important;
                    background-color: white !important;
                }
                `}
            </style>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    layout: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100vh',
        boxSizing: 'border-box',
        gap: '8px',
        padding: '8px',
        backgroundColor: '#F3F4F6', // Light gray outer layout background
    },
    // Header section
    header: {
        height: '60px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end', // ดัน Element ลูกทั้งหมดไปชิดขวาสุด
        padding: '0 24px',
        backgroundColor: '#003787',
        position: 'relative', // เพื่อให้ h2 จัดกึ่งกลางตามความกว้าง Header
    },
    headerTitle: {
        margin: 0,
        color: 'white',
        fontSize: '20px',
        position: 'absolute', // จัดกึ่งกลางหน้าจอแน่นอนโดยไม่ถูกปุ่มดัน
        left: '50%',
        transform: 'translateX(-50%)',
        pointerEvents: 'none',
    },
    signOutBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        color: '#FFFFFF',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        padding: '6px 14px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '500',
        transition: 'all 0.2s ease',
        zIndex: 1, // ให้อยู่เหนือ Title และกดได้ปกติ
    },
    body: {
        display: 'flex',
        flex: 1,
        gap: '8px',
        overflow: 'hidden',
    },
    // Sidebar section
    sidebar: {
        width: '260px',
        borderRadius: '8px',
        padding: '20px 10px',
        boxSizing: 'border-box',
        overflowY: 'auto',
    },
    menuList: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    menuItem: {
        padding: '12px 16px',
        marginBottom: '4px',
        borderRadius: '12px',
        cursor: 'pointer',
        fontWeight: '500',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        userSelect: 'none',
        fontSize: '14px',
        transition: 'all 0.2s ease',
    },
    menuTitleGroup: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    arrowIcon: {
        fontSize: '10px',
        opacity: 0.8,
    },
    subMenuContainer: {
        listStyle: 'none',
        paddingLeft: '24px',
        marginTop: '2px',
        marginBottom: '6px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        position: 'relative',
        borderLeft: '1px solid rgba(255, 255, 255, 0.25)', // Vertical connecting line
        marginLeft: '22px',
    },
    subMenuItem: {
        position: 'relative',
        padding: '10px 14px',
        color: 'white',
        backgroundColor: 'transparent',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '500',
        transition: 'all 0.2s ease',
    },
    // Curved/horizontal connection line towards each item
    treeLineHorizontal: {
        position: 'absolute',
        left: '-12px',
        top: '50%',
        width: '8px',
        height: '1px',
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
    },

    divider: {
        display: 'flex',
        alignItems: 'center',
        margin: '5px 0',
    },
    dividerLine: {
        flex: 1,
        height: '1px',
        backgroundColor: '#ccc',
    },
    dividerText: {
        margin: '0 10px',
        color: '#888',
        fontSize: '0.9rem',
    },
    // Main Content section
    content: {
        flex: 1,
        borderRadius: '8px',
        padding: '0px',
        boxSizing: 'border-box',
        backgroundColor: 'white', // White main content background
        overflowY: 'auto',
    }
};

export default MainLayout;