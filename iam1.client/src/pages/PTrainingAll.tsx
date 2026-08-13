import { useEffect, useState } from 'react';
import './PTraining.css';

interface Training {
    id: number;
    trainingId: string;
    trainingName: string;
    description: string;
}

export function PTrainingAll() {

    const [trainings, setTrainings] = useState<Training[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    //modal popup
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    // confirm delete
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
    // modal form data
    const [showFormModal, setShowFormModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [formData, setFormData] = useState({
            id: 0,
            trainingId: '',
            trainingName: '',
            description: ''
        });
    // alert error training was assigned
    const [assignedRoles, setAssignedRoles] = useState<string[]>([]);

    const formatTrainingId = (id: number) => `TRN-${id.toString().padStart(4, '0')}`;

    const confirmDelete = async () => {
        if (!selectedTraining) {
            return;
        }

        try {
            const response =
                await fetch(
                    `/api/training_all/${selectedTraining.id}`,
                    {
                        method: 'DELETE'
                    }
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

            setTrainings(
                trainings.filter(
                    t =>
                        t.id !==
                        selectedTraining.id
                )
            );
            setShowDeleteModal(false);
        }
        catch {
            setShowDeleteModal(false);
        }
    };

    const saveTraining = async () => {
        const url =
            isEdit
                ? `/api/training_all/${formData.id}`
                : '/api/training_all';

        const method =
            isEdit
                ? 'PUT'
                : 'POST';

        const response =
            await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    formData
                )
            });

        if (!response.ok) {
            alert('Save failed');
            return;
        }
        window.location.reload();
    };

    useEffect(() => {
        fetch('/api/training_all')
            .then((res) => {
                if (!res.ok) {
                    throw new Error(
                        'Failed to fetch training'
                    );
                }

                return res.json();
            })

            .then((data) => {
                setTrainings(data);
                setLoading(false);
            })

            .catch((err) => {
                console.error(err);
                setError(
                    'Error loading training'
                );

                setLoading(false);
            });

    }, []);

    return (
        <div className="training-container">

            {/* HEADER */}
            <div className="training-header">
                <div className="training-header-icon">
                    🎓
                </div>

                <div className="training-header-content">
                    <h2>
                        All Training
                    </h2>

                    <p>
                        View and manage all training courses.
                    </p>
                </div>

                <div className="training-header-actions">
                    <button
                        className="add-training-btn"
                        onClick={() => {
                            setIsEdit(false);

                            setFormData({
                                id: 0,
                                trainingId: '',
                                trainingName: '',
                                description: ''
                            });

                            setShowFormModal(true);
                        }}
                    >
                        + Add Training
                    </button>

                    <div className="training-count">
                        <span className="count-number">
                            {trainings.length}
                        </span>

                        <span className="count-label">
                            Training
                        </span>
                    </div>
                </div>
            </div>

            {/* CONTENT */}

            <div className="training-content">

                {loading ? (
                    <div className="training-state">
                        <div className="loading-spinner"></div>
                        <span>
                            Loading training...
                        </span>
                    </div>

                ) : error ? (
                    <div className="training-state error-state">
                        <span className="error-icon">
                            !
                        </span>

                        <span>
                            {error}
                        </span>
                    </div>

                ) : trainings.length === 0 ? (
                    <div className="training-state">
                        <span className="empty-icon">
                            🎓
                        </span>

                        <span>
                            No training found.
                        </span>
                    </div>

                ) : (
                    <div className="training-table-wrapper">
                        <table className="training-modern-table">
                            <thead>
                                <tr>
                                    <th className="training-col-no">No.</th>
                                    <th>Training ID</th>
                                    <th>Training Name</th>
                                    <th>Description</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {trainings.map(
                                    (
                                        training,
                                        index
                                    ) => (
                                        <tr
                                            key={ training.id}
                                        >

                                            <td className="training-col-no">
                                                {index + 1}
                                            </td>

                                            <td>
                                                {formatTrainingId(training.id)}
                                            </td>

                                            <td className="training-name"> {
                                                    training.trainingName
                                                }
                                            </td>

                                            <td> {
                                                    training.description
                                                }
                                            </td>

                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="edit-btn"
                                                        onClick={() => {
                                                            setIsEdit(true);
                                                            setFormData({
                                                                id: training.id,
                                                                trainingId:
                                                                    training.trainingId ?? '',
                                                                trainingName:
                                                                    training.trainingName,
                                                                description:
                                                                    training.description
                                                            });

                                                            setShowFormModal(true);
                                                        }}
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="delete-btn"
                                                        onClick={() => {

                                                            setSelectedTraining(
                                                                training
                                                            );

                                                            setShowDeleteModal(
                                                                true
                                                            );
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {
                showDeleteModal &&
                selectedTraining && (

                    <div className="modal-overlay">

                        <div className="delete-modal">

                            <div className="delete-icon">
                                🗑️
                            </div>

                            <h3>
                                Delete Training
                            </h3>

                            <p>
                                Are you sure you want
                                to delete
                            </p>

                            <div className="delete-name">
                                {
                                    selectedTraining.trainingName
                                }
                            </div>

                            <div className="delete-actions">

                                <button
                                    className="btn-cancel"
                                    onClick={() =>
                                        setShowDeleteModal(
                                            false
                                        )
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    className="btn-delete"
                                    onClick={
                                        confirmDelete
                                    }
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    </div>

                )
            }

            {showFormModal && (
                <div className="modal-overlay">
                    <div className="form-modal">
                        <div className="modal-header">
                            <h3>
                                {isEdit
                                    ? 'Edit Training'
                                    : 'Add Training'}
                            </h3>
                        </div>

                        <div className="modal-body">
                            <label>
                                Training ID
                            </label>
                            <input
                                value={
                                    selectedTraining
                                        ? formatTrainingId(selectedTraining.id)
                                        : ''
                                }
                                readOnly
                                className="readonly-input"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        trainingId:
                                            e.target.value
                                    })
                                }
                            />

                            <label>
                                Training Name
                            </label>

                            <input
                                value={
                                    formData.trainingName
                                }
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        trainingName:
                                            e.target.value
                                    })
                                }
                            />

                            <label>
                                Description
                            </label>

                            <textarea
                                rows={4}
                                value={
                                    formData.description
                                }
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        description:
                                            e.target.value
                                    })
                                }
                            />

                        </div>

                        <div className="modal-footer">

                            <button
                                className="btn-cancel"
                                onClick={() =>
                                    setShowFormModal(false)
                                }
                            >
                                Cancel
                            </button>

                            <button
                                className="modal-btn"
                                onClick={saveTraining}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {modalOpen && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <div className="modal-header">
                            <h3>
                                {modalTitle}
                            </h3>
                        </div>

                        <div className="modal-body">
                            <p>
                                {modalMessage}
                            </p>

                            {assignedRoles.length > 0 && (
                                <ul className="role-list">
                                    {assignedRoles.map(
                                        (role) => (
                                            <li
                                                key={role}
                                            >
                                                {role}
                                            </li>
                                        )
                                    )}
                                </ul>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button
                                className="modal-btn"
                                onClick={() =>
                                    setModalOpen(false)
                                }
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PTrainingAll;