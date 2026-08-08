using IAM1.Server.Data;
using IAM1.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IAM1.Server.Controllers
{
    [ApiController]
    [Route("api/employee_all")]
    public class EmployeeController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EmployeeController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/employee_all?currentUserId=EMP-LM-0000
        [HttpGet]
        public async Task<IActionResult> GetAllEmployees([FromQuery] string currentUserId)
        {
            if (string.IsNullOrEmpty(currentUserId))
            {
                return BadRequest("Current user ID is required.");
            }

            // 1. ดึงข้อมูลพนักงานทั้งหมดจาก Database ขึ้นมาก่อน
            var allEmployees = await _context.UserProfiles.ToListAsync();

            // ตรวจสอบว่ามีผู้ใช้งานนี้ในระบบหรือไม่
            var currentUser = allEmployees.FirstOrDefault(e => e.EmployeeId == currentUserId);
            if (currentUser == null)
            {
                return NotFound("User not found.");
            }

            List<UserProfiles> result = new List<UserProfiles>();

            // เงื่อนไขที่ 1: หาก Login เป็น Admin (เช็คจาก EmployeeId หรือ Position/Role ตามที่คุณตั้งไว้)
            if (currentUser.EmployeeId.Equals("administrator", StringComparison.OrdinalIgnoreCase) ||
                (currentUser.Position != null && currentUser.Position.Equals("Administrator", StringComparison.OrdinalIgnoreCase)))
            {
                // เห็นทุกคน ยกเว้น administrator
                result = allEmployees
                    .Where(e => !e.EmployeeId.Equals("administrator", StringComparison.OrdinalIgnoreCase))
                    .ToList();
            }
            // เงื่อนไขที่ 2 & 3: หากเป็น Employee ปกติ
            else
            {
                // ดึงพนักงานทั้งหมดที่อยู่ภายใต้สายการบังคับบัญชาแบบ Recursive
                result = GetSubordinatesRecursive(allEmployees, currentUserId);
            }

            return Ok(result);
        }

        /// <summary>
        /// Helper Function ค้นหาลูกน้องทั้งสายตรงและสายอ้อมแบบ Recursive
        /// </summary>
        private List<UserProfiles> GetSubordinatesRecursive(List<UserProfiles> allEmployees, string managerId)
        {
            var subordinates = new List<UserProfiles>();

            // 1. หาคนที่มี ManagerID ตรงกับ managerId ปัจจุบัน (ลูกน้องสายตรง)
            var directReports = allEmployees
                .Where(e => string.Equals(e.ManagerID, managerId, StringComparison.OrdinalIgnoreCase))
                .ToList();

            foreach (var report in directReports)
            {
                subordinates.Add(report);

                // 2. ค้นหาลูกน้องของพนักงานคนนี้ต่อลงไปเรื่อยๆ (ลูกน้องสายอ้อม)
                var nestedSubordinates = GetSubordinatesRecursive(allEmployees, report.EmployeeId);
                subordinates.AddRange(nestedSubordinates);
            }

            return subordinates;
        }
    }
}