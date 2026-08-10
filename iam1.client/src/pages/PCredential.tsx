import { useState } from 'react';
import './PCredential.css';

export function PCredential() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChangePassword = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        setMessage('');
        setError('');

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('New password and confirm password do not match');
            return;
        }

        setIsLoading(true);

        try {
            const employeeId =
                sessionStorage.getItem('iam1_employeeId');

            if (!employeeId) {
                setError('User session not found');
                return;
            }

            const response = await fetch(
                '/api/auth/change-password',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        employeeId,
                        currentPassword,
                        newPassword,
                        confirmPassword,
                    }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);

                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setError(
                    data.message || 'Failed to change password'
                );
            }
        } catch (err) {
            console.error(
                'Change password error:',
                err
            );

            setError('Fail to connect server');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="credential-card">
            <div className="credential-card-header">
                <div className="credential-card-icon">
                    🔑
                </div>
                <div>
                    <h3 className="credential-card-title">
                        Change Password
                    </h3>
                    <p className="credential-card-description">
                        Update your password to keep your account secure.
                    </p>
                </div>
            </div>
            <div>
                <label className="credential-label">
                    <br></br>
                </label>
            </div>
            <form onSubmit={handleChangePassword} className="credential-form">
                <div className="credential-form-group">
                    <label className="credential-label">
                        Current Password
                    </label>

                    <div className="credential-input-wrapper">
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="credential-input"
                            placeholder="Enter current password"
                        />
                    </div>
                </div>

                <div className="credential-form-group">
                    <label className="credential-label">
                        New Password
                    </label>

                    <div className="credential-input-wrapper">
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="credential-input"
                            placeholder="Enter new password"
                        />
                    </div>

                    <p className="credential-password-hint">
                        Password must be at least 6 characters.
                    </p>
                </div>

                <div className="credential-form-group">
                    <label className="credential-label">
                        Confirm New Password
                    </label>

                    <div className="credential-input-wrapper">
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="credential-input"
                            placeholder="Confirm new password"
                        />
                    </div>
                </div>

                {error && (
                    <p className="credential-error">
                        {error}
                    </p>
                )}

                {message && (
                    <p className="credential-success">
                        {message}
                    </p>
                )}

                <div className="credential-actions">
                    <button
                        type="button"
                        className="credential-cancel-btn"
                        onClick={() => {
                            setCurrentPassword('');
                            setNewPassword('');
                            setConfirmPassword('');
                            setError('');
                            setMessage('');
                        }}
                    >
                        Clear
                    </button>

                    <button
                        type="submit"
                        className="credential-primary-btn"
                        disabled={isLoading}
                    >
                        {isLoading
                            ? 'Changing...'
                            : 'Change Password'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default PCredential;