import { useNavigate } from 'react-router-dom';
import './App.css';

function App() {
    const navigate = useNavigate();

    // สไตล์ CSS แบบ Object สำหรับใช้ใน React
    const styles = {
        container: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: '#003787',
        },
        loginBox: {
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            width: '100%',
            maxWidth: '350px',
            textAlign: 'center',
        },
        title: {
            marginBottom: '20px',
            color: '#333',
        },
        formGroup: {
            marginBottom: '15px',
            textAlign: 'left',
        },
        label: {
            display: 'block',
            marginBottom: '5px',
            color: '#666',
        },
        input: {
            width: '100%',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            boxSizing: 'border-box', // สำคัญ: เพื่อให้ padding ไม่ทำให้ input กว้างเกิน box
        },
        forgetPassword: {
            textAlign: 'right',
            marginBottom: '15px',
        },
        link: {
            color: '#003787',
            textDecoration: 'none',
            fontSize: '0.8rem',
        },
        loginButton: {
            width: '100%',
            padding: '10px',
            backgroundColor: '#003787',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold',
        },
        divider: {
            display: 'flex',
            alignItems: 'center',
            margin: '20px 0',
        },
        dividerLine: {
            flex: 1,
            height: '1px',
            backgroundColor: '#ccc',
        },
        dividerText: {
            margin: '0 10px',
            color: '#888',
            fontSize: '0.9rem',
        },
        ssoButton: {
            width: '100%',
            padding: '10px',
            backgroundColor: '#003787',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
        },
    } as const;

    return (
        <div style={styles.container}>
            <div style={styles.loginBox}>
                <h2 style={styles.title}>Sign In</h2>

                <form>
                    {/* User ID */}
                    <div style={styles.formGroup}>
                        <label style={styles.label}>User ID</label>
                        <input type="text" placeholder="xxxx000x" style={styles.input} />
                    </div>

                    {/* Password */}
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Password</label>
                        <input type="password" placeholder="********" style={styles.input} />
                    </div>

                    {/* Forget Password */}
                    <div style={styles.forgetPassword}>
                        <a href="#" style={styles.link}>Forget Password ?</a>
                    </div>

                    {/* Login Button */}
                    <button type="submit" style={styles.loginButton}>Login</button>
                </form>

                {/* -----OR------ */}
                <div style={styles.divider}>
                    <div style={styles.dividerLine}></div>
                    <div style={styles.dividerText}>OR</div>
                    <div style={styles.dividerLine}></div>
                </div>

                {/* SSO Login Button */}
                <button type="button" style={styles.ssoButton} onClick={() => navigate('/Overview')}>SSO Login</button>
            </div>
        </div>
    );
}

export default App;