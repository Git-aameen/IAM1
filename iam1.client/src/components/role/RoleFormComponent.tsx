interface Props {
    open: boolean;
    isEdit: boolean;
    formData: any;
    setFormData: any;
    onSave: () => void;
    onClose: () => void;
}

export function TrainingFormModal({
    open,
    isEdit,
    formData,
    setFormData,
    onSave,
    onClose
}: Props) {

    if (!open) {
        return null;
    }

    return (
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
                            formData.trainingId
                        }
                        readOnly
                        className="readonly-input"
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
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        className="modal-btn"
                        onClick={onSave}
                    >
                        Save
                    </button>

                </div>

            </div>

        </div>
    );
}