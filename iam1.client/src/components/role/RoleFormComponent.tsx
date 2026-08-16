import {
    useState,
    type Dispatch,
    type SetStateAction
} from 'react';

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

interface Props {
    open: boolean;
    isEdit: boolean;

    formData: Role;
    setFormData: Dispatch<SetStateAction<Role>>;

    roleTrainings: Training[];
    setRoleTrainings: Dispatch<SetStateAction<Training[]>>;

    availableTrainings: Training[];

    onSave: (finalTrainings: Training[]) => void;
    onClose: () => void;
}

export function RoleFormComponent({
    open,
    isEdit,
    formData,
    setFormData,
    roleTrainings,
    setRoleTrainings,
    availableTrainings,
    onSave,
    onClose
}: Props) {

    const [selectedTrainingId, setSelectedTrainingId] = useState<number>(0);
    const [pendingRemoveIds, setPendingRemoveIds] = useState<Set<number>>(new Set());

    // เก็บ "signature" ของ modal session ปัจจุบันไว้เทียบตอน render
    // (แทนการใช้ useEffect เพื่อ setState เมื่อ open/formData.id เปลี่ยน)
    const sessionKey = `${open ? 'open' : 'closed'}-${formData.id}`;
    const [lastSessionKey, setLastSessionKey] = useState(sessionKey);

    if (sessionKey !== lastSessionKey) {
        // เปิด modal ใหม่ หรือสลับไป role คนละอัน -> เคลียร์สถานะ mark ลบ
        setLastSessionKey(sessionKey);
        setPendingRemoveIds(new Set());
        setSelectedTrainingId(0);
    }

    if (!open) {
        return null;
    }

    const togglePendingRemove = (trainingId: number) => {
        setPendingRemoveIds(prev => {
            const next = new Set(prev);
            if (next.has(trainingId)) {
                next.delete(trainingId);
            } else {
                next.add(trainingId);
            }
            return next;
        });
    };

    const handleAddTraining = () => {
        const training = availableTrainings.find(
            t => t.trainingId === selectedTrainingId
        );

        if (!training) {
            return;
        }

        const exists = roleTrainings.some(
            t => t.trainingId === training.trainingId
        );

        if (exists) {
            if (pendingRemoveIds.has(training.trainingId)) {
                togglePendingRemove(training.trainingId);
            }
            setSelectedTrainingId(0);
            return;
        }

        setRoleTrainings([...roleTrainings, training]);
        setSelectedTrainingId(0);
    };

    const handleToggleRemoveTraining = (trainingId: number) => {
        togglePendingRemove(trainingId);
    };

    const handleSaveClick = () => {
        const finalTrainings = roleTrainings.filter(
            t => !pendingRemoveIds.has(t.trainingId)
        );

        setRoleTrainings(finalTrainings);
        onSave(finalTrainings);
    };

    const activeCount = roleTrainings.filter(
        t => !pendingRemoveIds.has(t.trainingId)
    ).length;

    return (
        <div className="modal-overlay">

            <div className="form-modal">

                <div className="modal-header">
                    <h3>{isEdit ? 'Edit Role' : 'Add Role'}</h3>
                </div>

                <div className="modal-body">

                    <div className="modal-body-top">

                        <div className="field-group">
                            <label>Role ID</label>
                            <input
                                value={
                                    formData.id > 0
                                        ? formData.id
                                        : 'Auto Generate'
                                }
                                readOnly
                                className="readonly-input"
                            />
                        </div>

                        <div className="field-group">
                            <label>Role Name</label>
                            <input
                                value={formData.roleName}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        roleName: e.target.value
                                    })
                                }
                            />
                        </div>

                        <div className="field-group">
                            <label>Description</label>
                            <textarea
                                rows={3}
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        description: e.target.value
                                    })
                                }
                            />
                        </div>

                        {isEdit && <hr className="section-divider" />}
                    </div>

                    {isEdit && (
                        <div className="trainings-section">

                            <div className="trainings-section-header">
                                <h4>
                                    Assigned Trainings
                                    <span className="trainings-count-badge">
                                        {activeCount}
                                    </span>
                                </h4>
                            </div>

                            <div className="training-add-row">
                                <select
                                    value={selectedTrainingId}
                                    onChange={(e) =>
                                        setSelectedTrainingId(
                                            Number(e.target.value)
                                        )
                                    }
                                >
                                    <option value={0}>Select Training</option>

                                    {availableTrainings
                                        .filter(
                                            t =>
                                                !roleTrainings.some(
                                                    rt =>
                                                        rt.trainingId ===
                                                        t.trainingId
                                                ) ||
                                                pendingRemoveIds.has(
                                                    t.trainingId
                                                )
                                        )
                                        .map(training => (
                                            <option
                                                key={training.trainingId}
                                                value={training.trainingId}
                                            >
                                                {training.trainingName}
                                            </option>
                                        ))}
                                </select>

                                <button
                                    type="button"
                                    className="btn-add-training"
                                    onClick={handleAddTraining}
                                >
                                    + Add Training
                                </button>
                            </div>

                            <div className="training-table-scroll">
                                <table className="role-modern-table">
                                    <thead>
                                        <tr>
                                            <th style={{ width: 50 }}>No.</th>
                                            <th style={{ width: 130 }}>Training ID</th>
                                            <th>Training Name</th>
                                            <th style={{ width: 110 }}>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {roleTrainings.length === 0 ? (
                                            <tr>
                                                <td colSpan={4}>
                                                    <div className="training-empty-state">
                                                        No Training Assigned
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            roleTrainings.map((training, index) => {

                                                const isMarkedRemove =
                                                    pendingRemoveIds.has(
                                                        training.trainingId
                                                    );

                                                return (
                                                    <tr
                                                        key={training.trainingId}
                                                        className={
                                                            isMarkedRemove
                                                                ? 'training-row-removed'
                                                                : ''
                                                        }
                                                    >
                                                        <td>{index + 1}</td>

                                                        <td>
                                                            <span className="training-id-pill">
                                                                TRN-
                                                                {training.trainingId
                                                                    .toString()
                                                                    .padStart(4, '0')}
                                                            </span>
                                                        </td>

                                                        <td>
                                                            <span className="training-name-text">
                                                                {training.trainingName}
                                                            </span>
                                                        </td>

                                                        <td>
                                                            <button
                                                                type="button"
                                                                className={
                                                                    isMarkedRemove
                                                                        ? 'undo-btn'
                                                                        : 'delete-btn'
                                                                }
                                                                onClick={() =>
                                                                    handleToggleRemoveTraining(
                                                                        training.trainingId
                                                                    )
                                                                }
                                                            >
                                                                {isMarkedRemove
                                                                    ? 'Undo'
                                                                    : 'Remove'}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    )}

                </div>

                <div className="modal-footer">
                    <button className="btn-cancel" onClick={onClose}>
                        Cancel
                    </button>

                    <button className="modal-btn" onClick={handleSaveClick}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RoleFormComponent;