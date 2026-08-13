import { useEffect, useState } from 'react';
import './PRoleAllProfile.css';

interface Role {
    id: number;
    roleName: string;
    description: string;
    isActive: number;
}

interface Training {
    id: number;
    trainingName: string;
    description: string;
}

interface RoleProfile {
    role: Role;
    trainings: Training[];
}

interface PRoleAllProfileProps {
    roleId: number;
    onBack: () => void;
}

export function PRoleAllProfile({
    roleId,
    onBack,
}: PRoleAllProfileProps) {

    const [roleProfile, setRoleProfile] =
        useState<RoleProfile | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);


    // =========================================================
    // Load Role Profile
    // =========================================================

    useEffect(() => {

        let cancelled = false;

        fetch(
            `/api/role_profile?roleId=${encodeURIComponent(roleId)}`
        )
            .then((res) => {

                if (!res.ok) {
                    throw new Error('Failed to fetch role profile');
                }

                return res.json();
            })
            .then((data: RoleProfile) => {

                if (cancelled) {
                    return;
                }

                setRoleProfile(data);
                setLoading(false);
            })
            .catch((err) => {

                if (cancelled) {
                    return;
                }

                console.error(err);

                setError('Error loading role information');
                setLoading(false);
            });

        return () => {
            cancelled = true;
        };

    }, [roleId]);


    // =========================================================
    // Loading
    // =========================================================

    if (loading) {

        return (
            <div className="role-profile-container">

                <div className="role-state">

                    <div className="loading-spinner"></div>

                    <span>
                        Loading role information...
                    </span>

                </div>

            </div>
        );
    }


    // =========================================================
    // Error
    // =========================================================

    if (error) {

        return (
            <div className="role-profile-container">

                <div className="role-state error-state">

                    <span className="error-icon">
                        !
                    </span>

                    <span>
                        {error}
                    </span>

                </div>

                <button
                    type="button"
                    className="role-back-button error-back-button"
                    onClick={onBack}
                >
                    ← Back to All Roles
                </button>

            </div>
        );
    }


    // =========================================================
    // Role Not Found
    // =========================================================

    if (!roleProfile) {

        return (
            <div className="role-profile-container">

                <div className="role-state">

                    <span className="empty-icon">
                        🛡️
                    </span>

                    <span>
                        Role information not found.
                    </span>

                </div>

                <button
                    type="button"
                    className="role-back-button error-back-button"
                    onClick={onBack}
                >
                    ← Back to All Roles
                </button>

            </div>
        );
    }


    const { role, trainings } = roleProfile;


    return (

        <div className="role-profile-container">

            {/* =====================================================
                HEADER
            ===================================================== */}

            <div className="role-profile-header">

                <button
                    type="button"
                    className="role-back-button"
                    onClick={onBack}
                >
                    ← Back
                </button>

                <div>

                    <h2>
                        Role Details
                    </h2>

                    <p>
                        View role information and assigned training.
                    </p>

                </div>

            </div>


            {/* =====================================================
                ROLE INFORMATION
            ===================================================== */}

            <div className="role-detail-card">

                <div className="role-detail-icon">
                    🛡️
                </div>


                <div className="role-detail-info">

                    <h2>
                        {role.roleName}
                    </h2>

                    <p>
                        {role.description || 'No description available.'}
                    </p>


                    <div className="role-detail-grid">

                        <div className="role-detail-item">

                            <span className="detail-label">
                                Role ID
                            </span>

                            <span className="detail-value">
                                {role.id}
                            </span>

                        </div>


                        <div className="role-detail-item">

                            <span className="detail-label">
                                Status
                            </span>

                            <span
                                className={
                                    role.isActive === 1
                                        ? 'status-badge'
                                        : 'status-badge inactive'
                                }
                            >
                                {role.isActive === 1
                                    ? 'Active'
                                    : 'Inactive'}
                            </span>

                        </div>

                    </div>

                </div>

            </div>


            {/* =====================================================
                TRAINING
            ===================================================== */}

            <div className="role-training-section">

                <div className="role-training-header">

                    <div>

                        <h2>
                            Assigned Training
                        </h2>

                        <p>
                            Training courses assigned to this role.
                        </p>

                    </div>


                    <div className="training-count">

                        <span>
                            {trainings.length}
                        </span>

                        <small>
                            Trainings
                        </small>

                    </div>

                </div>


                {trainings.length === 0 ? (

                    <div className="role-training-empty">

                        <span>
                            🎓
                        </span>

                        <p>
                            No training assigned to this role.
                        </p>

                    </div>

                ) : (

                    <div className="role-training-table-wrapper">

                        <table className="role-training-table">

                            <thead>

                                <tr>

                                    <th className="training-col-no">
                                        No.
                                    </th>

                                    <th>
                                        Training Name
                                    </th>

                                    <th>
                                        Description
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {trainings.map(
                                    (training, index) => (

                                        <tr key={training.id}>

                                            <td className="training-col-no">
                                                {index + 1}
                                            </td>

                                            <td className="training-name">
                                                {training.trainingName}
                                            </td>

                                            <td className="training-description">
                                                {training.description}
                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}

export default PRoleAllProfile;