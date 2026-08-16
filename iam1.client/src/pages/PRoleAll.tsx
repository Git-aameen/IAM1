import { useEffect, useMemo, useState } from 'react';
import './PRole.css';

import { PageHeaderComponent } from '../components/Common/PageHeaderComponent';
import { LoadingStateComponent } from '../components/Common/LoadingStateComponent';
import { DataGridComponent } from '../components/Common/DataGridComponent';
import { RoleFormComponent } from '../components/role/RoleFormComponent';
import { ConfirmDeleteModalComponent } from '../components/Common/ConfirmDeleteModalComponent';

import type {
    ColDef,
    ICellRendererParams
} from 'ag-grid-community';

interface Role {
    id: number;
    roleName: string;
    description: string;
}

interface Training {
    trainingId: number;
    trainingName: string;
    description: string;
}

export function PRoleAll() {

    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [showFormModal, setShowFormModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);

    const [roleTrainings, setRoleTrainings] = useState<Training[]>([]);
    const [availableTrainings, setAvailableTrainings] = useState<Training[]>([]);

    const [formData, setFormData] = useState<Role>({
        id: 0,
        roleName: '',
        description: ''
    });

    useEffect(() => {
        loadRoles();
        loadAvailableTrainings();
    }, []);

    async function loadRoles() {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/role_all');

            if (!response.ok) {
                throw new Error('Failed to fetch roles');
            }

            const data = await response.json();
            setRoles(data);
        }
        catch (error) {
            console.error(error);
            setError('Error loading roles');
        }
        finally {
            setLoading(false);
        }
    }

    async function loadAvailableTrainings() {
        try {
            const response = await fetch('/api/role_all/all-trainings');

            if (!response.ok) {
                throw new Error('Failed to fetch trainings');
            }

            const data = await response.json();
            setAvailableTrainings(data);
        }
        catch (error) {
            console.error(error);
        }
    }

    const saveRole = async (finalTrainings: Training[]) => {

        try {
            const url = isEdit
                ? `/api/role_all/${formData.id}`
                : '/api/role_all';

            const method = isEdit ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    roleName: formData.roleName,
                    description: formData.description
                })
            });

            if (!response.ok) {
                throw new Error('Save failed');
            }

            const savedRole = await response.json();
            const roleId = savedRole.id as number;

            // บันทึก training ที่เหลือจริง (หลังกรองรายการที่ถูก mark ลบออกแล้ว)
            const trainingsResponse = await fetch(
                `/api/role_all/${roleId}/trainings`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(
                        finalTrainings.map(t => t.trainingId)
                    )
                }
            );

            if (!trainingsResponse.ok) {
                throw new Error('Failed to save trainings');
            }

            setShowFormModal(false);
            await loadRoles();
        }
        catch (error) {
            console.error(error);
        }
    };

    const confirmDelete = async () => {
        if (!selectedRole) {
            return;
        }

        try {
            const response = await fetch(
                `/api/role_all/${selectedRole.id}`,
                { method: 'DELETE' }
            );

            if (!response.ok) {
                throw new Error('Delete failed');
            }

            setShowDeleteModal(false);
            await loadRoles();
        }
        catch (error) {
            console.error(error);
        }
    };

    const columnDefs = useMemo<ColDef<Role>[]>(
        () => [
            {
                headerName: 'Role ID',
                width: 110,
                valueGetter: params => (params.node?.rowIndex ?? 0) + 1
            },
            {
                headerName: 'Role Name',
                field: 'roleName',
                flex: 1
            },
            {
                headerName: 'Description',
                field: 'description',
                flex: 2
            },
            {
                headerName: 'Action',
                width: 180,
                sortable: false,
                filter: false,
                resizable: false,

                cellRenderer: (params: ICellRendererParams<Role>) => {
                    if (!params.data) {
                        return null;
                    }

                    const role = params.data;

                    return (
                        <div
                            style={{
                                display: 'flex',
                                gap: '8px',
                                alignItems: 'center',
                                height: '100%'
                            }}
                        >
                            <button
                                className="edit-btn"
                                onClick={async () => {
                                    setIsEdit(true);

                                    setFormData({
                                        id: role.id,
                                        roleName: role.roleName,
                                        description: role.description
                                    });

                                    const response = await fetch(
                                        `/api/role_all/${role.id}/trainings`
                                    );

                                    const trainingData = await response.json();

                                    setRoleTrainings(trainingData);
                                    setShowFormModal(true);
                                }}
                            >
                                Edit
                            </button>

                            <button
                                className="delete-btn"
                                onClick={() => {
                                    setSelectedRole(role);
                                    setShowDeleteModal(true);
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    );
                }
            }
        ],
        []
    );

    return (
        <div className="role-container">
            <PageHeaderComponent
                icon="🛡️"
                title="All Roles"
                subtitle="View and manage all roles in the organization."
                count={roles.length}
                countLabel="Roles"
                action={
                    <button
                        className="add-training-btn"
                        onClick={() => {
                            setIsEdit(false);
                            setRoleTrainings([]);
                            setFormData({ id: 0, roleName: '', description: '' });
                            setShowFormModal(true);
                        }}
                    >
                        + Add Role
                    </button>
                }
            />

            <div className="role-content">
                {loading ? (
                    <LoadingStateComponent message="Loading roles..." />
                ) : error ? (
                    <div className="role-state error-state">{error}</div>
                ) : (
                    <DataGridComponent rowData={roles} columnDefs={columnDefs} />
                )}
            </div>

            <RoleFormComponent
                open={showFormModal}
                isEdit={isEdit}
                formData={formData}
                setFormData={setFormData}
                roleTrainings={roleTrainings}
                setRoleTrainings={setRoleTrainings}
                availableTrainings={availableTrainings}
                onSave={saveRole}
                onClose={() => setShowFormModal(false)}
            />

            <ConfirmDeleteModalComponent
                open={showDeleteModal}
                title="Delete Role"
                name={selectedRole?.roleName ?? ''}
                onCancel={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
            />
        </div>
    );
}

export default PRoleAll;