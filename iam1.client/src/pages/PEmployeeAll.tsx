import { useEffect, useState } from 'react';
import './PEmployee.css';
import { PEmployeeAllProfile } from './PEmployeeAllProfile';

interface Employee {
    id: number;
    employeeId: string;
    fullName: string;
    department: string;
    position: string;
}

export function PEmployeeAll() {
    const [currentUserId] = useState<string | null>(() =>
        sessionStorage.getItem('iam1_employeeId')
    );

    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(() => !!currentUserId);
    const [error, setError] = useState<string | null>(
        () =>
            currentUserId
                ? null
                : 'User ID not found in session'
    );

    // Selected employee
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

    useEffect(() => {
        if (!currentUserId) {
            return;
        }

        fetch(
            `/api/employee_all?currentUserId=${encodeURIComponent(
                currentUserId
            )}`
        )
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to fetch data');
                }

                return res.json();
            })
            .then((data) => {
                setEmployees(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError('Error loading employees');
                setLoading(false);
            });
    }, [currentUserId]);

    // Click Employee ID
    const handleEmployeeClick = (emp: Employee) => {
        console.log('Clicked Employee:', emp);
        setSelectedEmployeeId(emp.employeeId);
    };

    // Show Employee Profile
    if (selectedEmployeeId) {
        return (
            <PEmployeeAllProfile
                employeeId={selectedEmployeeId}
                onBack={() => setSelectedEmployeeId(null)}
            />
        );
    }

    return (
        <div className="employee-container">

            {/* ================= HEADER ================= */}
            <div className="employee-header">

                <div className="employee-header-icon">
                    👥
                </div>

                <div className="employee-header-content">
                    <h2>All Employees</h2>
                    <p>
                        View and manage all employees in the organization.
                    </p>
                </div>

                <div className="employee-count">
                    <span className="count-number">
                        {employees.length}
                    </span>

                    <span className="count-label">
                        Employees
                    </span>
                </div>

            </div>


            {/* ================= CONTENT ================= */}
            <div className="employee-content">
                {/* ================= TABLE ================= */}
                {loading ? (

                    <div className="employee-state">
                        <div className="loading-spinner"></div>
                        <span>Loading employees data...</span>
                    </div>

                ) : error ? (

                    <div className="employee-state error-state">
                        <span className="error-icon">!</span>
                        <span>{error}</span>
                    </div>

                ) : employees.length === 0 ? (

                    <div className="employee-state">
                        <span className="empty-icon">👥</span>
                        <span>No employees found.</span>
                    </div>

                ) : (

                    <div className="table-wrapper">

                        <table className="modern-table">

                            <thead>
                                <tr>
                                    <th className="col-no">No.</th>
                                    <th>Employee ID</th>
                                    <th>Full Name</th>
                                    <th>Department</th>
                                    <th>Position</th>
                                </tr>
                            </thead>

                            <tbody>

                                {employees.map((emp, index) => (

                                    <tr key={emp.id || emp.employeeId}>

                                        <td className="col-no">
                                            {index + 1}
                                        </td>

                                        <td>
                                            <button
                                                type="button"
                                                className="emp-id-link"
                                                onClick={() =>
                                                    handleEmployeeClick(emp)
                                                }
                                            >
                                                {emp.employeeId}
                                            </button>
                                        </td>

                                        <td className="employee-name">
                                            {emp.fullName}
                                        </td>

                                        <td className="employee-department">
                                            {emp.department}
                                        </td>

                                        <td>
                                            <span className="position-badge">
                                                {emp.position}
                                            </span>
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}

export default PEmployeeAll;