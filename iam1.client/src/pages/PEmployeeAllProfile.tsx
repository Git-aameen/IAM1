import { PProfile } from './PProfile';

interface PEmployeeAllProfileProps {
    employeeId: string;
    onBack?: () => void;
}

/**
 * หน้าดูโปรไฟล์ของ employee คนอื่น (เปิดจากตาราง All Employee แล้วกด View)
 * ใช้ PProfile component ตัวเดียวกับหน้า "My Profile" ของ user ที่ login อยู่
 * ต่างกันแค่ส่ง employeeId ที่เลือกจากตารางเข้าไปแทนการอ่านจาก sessionStorage
 */
export function PEmployeeAllProfile({ employeeId, onBack }: PEmployeeAllProfileProps) {
    return (
        <PProfile
            employeeId={employeeId}
            onBack={onBack}
        />
    );
}

export default PEmployeeAllProfile;