import { useEffect, useState } from 'react';
import './PRole.css';
import { PRoleAllProfile } from './PRoleAllProfile';

interface Role {
    id: number;
    roleName: string;
    description: string;
}

export function PRoleAll() {

    const [roles, setRoles] = useState<Role[]>([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState<string | null>(null);

    // Selected Role
    const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);


    // =========================================================
    // Load Roles
    // =========================================================

    useEffect(() => {

        fetch('/api/role_all')

            .then((res) => {

                if (!res.ok) {
                    throw new Error('Failed to fetch roles');
                }

                return res.json();
            })

            .then((data) => {

                setRoles(data);

                setLoading(false);
            })

            .catch((err) => {

                console.error(err);

                setError('Error loading roles');

                setLoading(false);
            });

    }, []);


    // =========================================================
    // Click Role
    // =========================================================

    const handleRoleClick = (role: Role) => {

        console.log('Clicked Role:', role);

        setSelectedRoleId(role.id);
    };


    // =========================================================
    // Show Role Profile
    // =========================================================

    if (selectedRoleId !== null) {
        return (
            <PRoleAllProfile
                roleId={selectedRoleId}
                onBack={() => setSelectedRoleId(null)}
            />
        );
    }


    // =========================================================
    // All Roles
    // =========================================================

    return (
        <div className="role-container">

            {/* =====================================================
                HEADER
            ===================================================== */}

            <div className="role-header">
                <div className="role-header-icon">
                    🛡️
                </div>

                <div className="role-header-content">
                    <h2>
                        All Roles
                    </h2>

                    <p>
                        View and manage all roles in the organization.
                    </p>
                </div>


                <div className="role-count">
                    <span className="count-number">
                        {roles.length}
                    </span>

                    <span className="count-label">
                        Roles
                    </span>
                </div>

            </div>


            {/* =====================================================
                CONTENT
            ===================================================== */}

            <div className="role-content">
                {loading ? (
                    <div className="role-state">
                        <div className="loading-spinner"></div>
                        <span>
                            Loading roles data...
                        </span>
                    </div>

                ) : error ? (
                    <div className="role-state error-state">
                        <span className="error-icon">
                            !
                        </span>

                        <span>
                            {error}
                        </span>
                    </div>

                ) : roles.length === 0 ? (
                    <div className="role-state">
                        <span className="empty-icon">
                            🛡️
                        </span>

                        <span>
                            No roles found.
                        </span>
                    </div>

                ) : (
                    <div className="role-table-wrapper">
                        <table className="role-modern-table">
                            <thead>
                                <tr>
                                    <th className="role-col-no">
                                        No.
                                    </th>

                                    <th>
                                        Role Name
                                    </th>

                                    <th>
                                        Description
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {roles.map((role, index) => (
                                    <tr key={role.id}>
                                        <td className="role-col-no">
                                            {index + 1}
                                        </td>

                                        <td>
                                            <button
                                                type="button"
                                                className="role-name-link"
                                                onClick={() =>
                                                    handleRoleClick(role)
                                                }
                                            >
                                                {role.roleName}
                                            </button>
                                        </td>

                                        <td className="role-description">
                                            {role.description}
                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PRoleAll;