import { useEffect, useMemo, useState } from 'react';
import type { ColDef } from 'ag-grid-community';

import './PTraining.css';

import type { Training } from '../models/Training';

import { PageHeaderComponent } from '../components/Common/PageHeaderComponent';
import { DataGridComponent } from '../components/Common/DataGridComponent';
import { LoadingStateComponent } from '../components/Common/LoadingStateComponent';
import { MessageModalComponent } from '../components/Common/MessageModalComponent';
import { ConfirmDeleteModalComponent } from '../components/Common/ConfirmDeleteModalComponent';
import { TrainingFormComponent } from '../components/training/TrainingFormComponent';

export function PTrainingAll() {
    const [, setError] = useState<string | null>(null);
    const [trainings, setTrainings] = useState<Training[]>([]);

    const [loading, setLoading] = useState(true);
    const [showFormModal, setShowFormModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [assignedRoles, setAssignedRoles] = useState<string[]>([]);

    const [formData, setFormData] = useState<Training>({
            trainingId: 0,
            trainingName: '',
            description: ''
        });

    const formatTrainingId = (id: number) =>
        `TRN-${id.toString().padStart(4, '0')}`;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/training_all');
                const data = await response.json();

                setTrainings(data);
            }
            catch {
                setError('Error loading training');
            }
            finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const saveTraining = async () => {
        try {
            const url = isEdit ? `/api/training_all/${formData.trainingId}` : '/api/training_all';
            const method = isEdit ? 'PUT' : 'POST';
            console.log(formData);
            console.log(typeof formData.trainingId);
            const response = await fetch(url, {
                                        method,
                                        headers: {'Content-Type': 'application/json'},
                                        body: JSON.stringify(formData)
                                        });

            if (!response.ok) {
                throw new Error('Save failed');
            }

            setShowFormModal(false);

            // show popup add or update success
            setModalTitle('Success');
            setModalMessage(isEdit ? 'Training updated successfully.' : 'Training created successfully.');
            setAssignedRoles([]);
            setModalOpen(true);

            await loadTraining();
        }
        catch (error) {
            console.error(error);
        }
    };

    const confirmDelete =
        async () => {
            if (!selectedTraining) {
                return;
            }

            try {
                const response = await fetch(
                        `/api/training_all/${selectedTraining.trainingId}`,
                        {method: 'DELETE'}
                    );

                const result =
                    await response.json();

                if (!response.ok) {
                    setModalTitle('Unable to Delete Training');
                    setModalMessage(result.message);
                    setAssignedRoles(result.assignedRoles || []);
                    setModalOpen(true);
                    setShowDeleteModal(false);
                    return;
                }

                setTrainings(trainings.filter(t => t.trainingId !== selectedTraining.trainingId));
                setShowDeleteModal(false);

                // show popup delete success
                setModalTitle('Success');
                setModalMessage('Training deleted successfully.');
                setAssignedRoles([]);
                setModalOpen(true);
                await loadTraining();
            }
            catch (error) {
                console.error(error);
            }
        };

        const loadTraining = async () => {const response = await fetch('/api/training_all');
        const data = await response.json();
        setTrainings(data);
    };

    const columnDefs = useMemo<ColDef[]>( () => [
                {
                    headerName: 'Training ID',
                    field: 'trainingId',
                    width: 150,
                    valueFormatter: params => formatTrainingId(params.value)
                },
                {
                    headerName: 'Training Name',
                    field: 'trainingName',
                    flex: 1,
                    minWidth: 220
                },
                {
                    headerName: 'Description',
                    field: 'description',
                    flex: 2,
                    minWidth: 350
                },
                {
                    headerName: 'Action',
                    width: 180,
                    minWidth: 180,
                    sortable: false,
                    filter: false,
                    cellRenderer:
                        ( params: {data: Training;}) => (
                            <div style={{display: 'flex', gap: '8px', marginTop: '6px'}}>
                                <button className="edit-btn"
                                    onClick={() => {setIsEdit(true);
                                    setFormData(params.data);
                                    setShowFormModal(true);
                                    }}>
                                    Edit
                                </button>

                                <button className="delete-btn"
                                    onClick={() => {setSelectedTraining(params.data);
                                    setShowDeleteModal(true);
                                    }}>
                                    Delete
                                </button>
                            </div>
                        )
                }
            ],
            [trainings]
        );

    if (loading) {
        return (<LoadingStateComponent message="Loading training..." />);
    }

    return (
        <div className="training-container">
            <PageHeaderComponent
                icon="🎓"
                title="All Training"
                subtitle="View and manage all training courses."
                count={trainings.length}
                countLabel="Training"
                action={
                    <button className="add-training-btn"
                        onClick={() => {setIsEdit(false);
                        setFormData({trainingId: 0,
                                     trainingName: '',
                                     description: ''});
                        setShowFormModal(true);
                        }}>
                        + Add Training
                    </button>
                }
            />

            <div className="training-content">
                <DataGridComponent rowData={trainings} columnDefs={columnDefs}/>
            </div>

            <TrainingFormComponent
                open={showFormModal}
                isEdit={isEdit}
                formData={formData}
                setFormData={setFormData}
                onSave={saveTraining}
                onClose={() => setShowFormModal(false)}
            />

            <ConfirmDeleteModalComponent
                open={ showDeleteModal}
                title="Delete Training"
                name={ selectedTraining ?.trainingName || '' }
                onCancel={() => setShowDeleteModal(false)}
                onConfirm={
                    confirmDelete
                }
            />

            <MessageModalComponent
                open={ modalOpen }
                title={ modalTitle }
                message={ modalMessage }
                roles={ assignedRoles }
                onClose={() => setModalOpen(false)}
            />

        </div>
    );
}

export default PTrainingAll;