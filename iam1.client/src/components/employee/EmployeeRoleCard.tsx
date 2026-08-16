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

interface EmployeeRoleCardProps {
    assignedRoles: AssignedRole[];
    availableRoles: AvailableRole[];

    isLoading: boolean;
    error: string | null;

    isEditing: boolean;
    isSaving?: boolean;

    selectedRoleIdToAdd: number;
    primaryRoleId: number | null;

    pendingRemoveRoleIds: Set<number>;

    onRoleSelect: (roleId: number) => void;
    onAddRole: () => void;
    onSetPrimary: (roleId: number) => void;
    onToggleRemoveRole: (roleId: number) => void;
}

export function EmployeeRoleCard({
    assignedRoles,
    availableRoles,
    isLoading,
    error,
    isEditing,
    selectedRoleIdToAdd,
    primaryRoleId,
    pendingRemoveRoleIds,
    onRoleSelect,
    onAddRole,
    onSetPrimary,
    onToggleRemoveRole
}: EmployeeRoleCardProps) {

    const activeAssignedRoles =
        assignedRoles.filter(r => !pendingRemoveRoleIds.has(r.id));

    return (
        <div className="tab-content-stack">
            <div className="card">
                <div className="card-title-row">
                    <h3 className="card-title">
                        Assigned System Roles
                    </h3>

                    {!isLoading && !error && (
                        <span className="trainings-count-badge">
                            {activeAssignedRoles.length}
                        </span>
                    )}
                </div>

                {isLoading ? (
                    <div className="role-tab-state">
                        กำลังโหลดข้อมูล Role...
                    </div>
                ) : error ? (
                    <div className="role-tab-state role-tab-state-error">
                        {error}
                    </div>
                ) : (
                    <>
                        {isEditing && (
                            <div className="role-assign-toolbar">
                                <select
                                    className="role-select"
                                    value={selectedRoleIdToAdd}
                                    onChange={(e) =>
                                        onRoleSelect(Number(e.target.value))
                                    }
                                >
                                    <option value={0}>
                                        Select Role to add
                                    </option>

                                    {availableRoles
                                        .filter(
                                            r =>
                                                !assignedRoles.some(
                                                    ar => ar.id === r.id
                                                ) ||
                                                pendingRemoveRoleIds.has(r.id)
                                        )
                                        .map(role => (
                                            <option
                                                key={role.id}
                                                value={role.id}
                                            >
                                                {role.roleName}
                                            </option>
                                        ))}
                                </select>

                                <button
                                    type="button"
                                    className="btn-add-training"
                                    onClick={onAddRole}
                                >
                                    + Add Role
                                </button>
                            </div>
                        )}

                        {assignedRoles.length === 0 ? (
                            <div className="role-tab-state">
                                พนักงานคนนี้ยังไม่มี Role
                            </div>
                        ) : (
                            <div className="role-badge-container">
                                {assignedRoles.map(role => {
                                    const isMarkedRemove =
                                        pendingRemoveRoleIds.has(role.id);

                                    const isPrimarySelected =
                                        primaryRoleId === role.id;

                                    return (
                                        <div
                                            key={role.id}
                                            className={`role-card ${isMarkedRemove
                                                    ? 'role-card-pending'
                                                    : ''
                                                }`}
                                        >
                                            <div className="role-card-header">
                                                <span className="role-card-title">
                                                    {role.roleName}
                                                </span>

                                                {isPrimarySelected &&
                                                    !isMarkedRemove && (
                                                        <span className="primary-badge">
                                                            Primary
                                                        </span>
                                                    )}
                                            </div>

                                            <p className="role-card-desc">
                                                {role.description}
                                            </p>

                                            {isEditing && (
                                                <div className="role-card-actions">
                                                    {!isMarkedRemove &&
                                                        !isPrimarySelected && (
                                                            <button
                                                                type="button"
                                                                className="role-set-primary-btn"
                                                                onClick={() =>
                                                                    onSetPrimary(
                                                                        role.id
                                                                    )
                                                                }
                                                            >
                                                                Set as Primary
                                                            </button>
                                                        )}

                                                    <button
                                                        type="button"
                                                        className={
                                                            isMarkedRemove
                                                                ? 'undo-btn'
                                                                : 'delete-btn'
                                                        }
                                                        onClick={() =>
                                                            onToggleRemoveRole(
                                                                role.id
                                                            )
                                                        }
                                                    >
                                                        {isMarkedRemove
                                                            ? 'Undo'
                                                            : 'Remove'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default EmployeeRoleCard;