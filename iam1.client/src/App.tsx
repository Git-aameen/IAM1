import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function App() {
    const navigate = useNavigate();

    const [employeeId, setEmployeeId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const loginWithEmployeeId = async (id: string, password: string) => {
        const trimmedId = id.trim();

        if (!trimmedId) {
            setError('Please input Employee ID');
            return;
        }

        if (!password) {
            setError('Please input Password');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    employeeId: trimmedId,
                    password: password,
                }),
            });

            if (response.ok) {
                const data = await response.json();

                sessionStorage.setItem(
                    'iam1_employeeId',
                    data.employeeId
                );

                sessionStorage.setItem(
                    'iam1_userProfileId',
                    data.userProfileId.toString()
                );

                navigate('/overview');
            } else if (response.status === 401) {
                setError('Invalid Employee ID or Password');
            } else if (response.status === 404) {
                setError('User profile not found');
            } else {
                setError(`Failed (status: ${response.status})`);
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Fail to connect server');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (employeeId === 'administrator') {
            setError('not allow to login by administrator on this module');
            return;
        } else {
            loginWithEmployeeId(employeeId, password);
        }
    };
    // SSO Login: not wired to a real SSO provider yet, always logs in as "administrator"
    const handleSsoLogin = () => {
        loginWithEmployeeId('administrator', 'administrator');
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="login-title">Sign In</h2>

                <form onSubmit={handleLogin}>
                    {/* User ID */}
                    <div className="login-form-group">
                        <label className="login-label">Employee ID</label>
                        <input
                            type="text"
                            placeholder="xxxx000x"
                            className="login-input"
                            value={employeeId}
                            onChange={(e) => setEmployeeId(e.target.value)}
                        />
                    </div>

                    {/* Password  (not used yet) */}
                    <div className="login-form-group">
                        <label className="login-label">Password</label>
                        <input
                            type="password"
                            placeholder="********"
                            className="login-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {/* Forget Password */}
                    <div className="login-forget-password">
                        <a href="#" className="login-link">Forget Password ?</a>
                    </div>

                    {/* Error message */}
                    {error && <p className="login-error">{error}</p>}

                    {/* Login Button */}
                    <button type="submit" className="login-button" disabled={isLoading}>
                        {isLoading ? 'Loading...' : 'Login'}
                    </button>
                </form>

                {/* -----OR------ */}
                <div className="login-divider">
                    <div className="login-divider-line"></div>
                    <div className="login-divider-text">OR</div>
                    <div className="login-divider-line"></div>
                </div>

                {/* SSO Login Button: always logs in with employeeId = "administrator" */}
                <button type="button" className="login-sso-button" onClick={handleSsoLogin} disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'SSO Login'}
                </button>
            </div>
        </div>
    );
}

export default App;