import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function App() {
    const navigate = useNavigate();

    const [employeeId, setEmployeeId] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const loginWithEmployeeId = async (id: string) => {

        const trimmedId = id.trim();
        if (!trimmedId) {
            setError('Please input Employee ID');
            return;
        }

        setIsLoading(true);
        setError(null);
        
        try {
            // นำ employeeId ที่กรอกไปค้นหาใน database ผ่าน API
            const response = await fetch(`/api/profile/${encodeURIComponent(trimmedId)}`);

            if (response.ok) {
                // เก็บ employeeId ไว้ใช้ตอนโหลดหน้า Profile
                sessionStorage.setItem('iam1_employeeId', trimmedId);
                navigate('/overview');
            } else if (response.status === 404) {
                setError('Can not find EmployeeID');
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
            loginWithEmployeeId(employeeId);
        }
    };
    // SSO Login: ยังไม่ต่อระบบ SSO จริง จึงล็อกอินด้วย employeeId = "administrator" เสมอ
    const handleSsoLogin = () => {
        loginWithEmployeeId('administrator');
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

                    {/* Password (ยังไม่ใช้งานตอนนี้) */}
                    <div className="login-form-group">
                        <label className="login-label">Password</label>
                        <input type="password" placeholder="********" className="login-input" />
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

                {/* SSO Login Button (ยังไม่ทำงานจริง) */}
                <button type="button" className="login-sso-button" onClick={handleSsoLogin} disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'SSO Login'}
                </button>
            </div>
        </div>
    );
}

export default App;