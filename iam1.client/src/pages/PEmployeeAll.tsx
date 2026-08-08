import { useEffect, useState } from 'react';
import './PEmployeeAll.css';
import { PEmployeeAllProfile } from './PEmployeeAllProfile';

interface Employee {
    id: number;
    employeeId: string;
    fullName: string;
    department: string;
    position: string;
}

export function PEmployeeAll() {
    const [currentUserId] = useState<string | null>(() => sessionStorage.getItem('iam1_employeeId'));
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(() => currentUserId ? null : 'User ID not found in session');

    // record employeeID
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

    useEffect(() => {
        // 1. เช็คว่ามี currentUserId ใน sessionStorage หรือยัง
        if (!currentUserId) return;

        // 2. ส่ง currentUserId แนบไปกับ URL API
        fetch(`/api/employee_all?currentUserId=${encodeURIComponent(currentUserId)}`)
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch data');
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

    // setup while click employeeID
    const handleEmployeeClick = (emp: Employee) => {
        console.log('Clicked Employee:', emp);
        setSelectedEmployeeId(emp.employeeId);
    };
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
            <div className="page-header">
                <h2>All Employees</h2>
                <span className="employee-count">{employees.length} Total</span>
            </div>
            {/* Table employees */}
            {loading ? (
                <div className="loading">Loading employees data...</div>
            ) : error ? (
                <div className="error">{error}</div>
            ) : (
                <div className="table-card">
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
                                    <td className="col-no">{index + 1}</td>
                                    <td>
                                        <button
                                            type="button"
                                            className="emp-id-link"
                                            onClick={() => handleEmployeeClick(emp)}
                                        >
                                            {emp.employeeId}
                                        </button>
                                    </td>
                                    <td className="emp-name-cell">{emp.fullName}</td>
                                    <td className="emp-name-cell">{emp.department}</td>
                                    <td>
                                        <span className="position-badge">{emp.position}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default PEmployeeAll;