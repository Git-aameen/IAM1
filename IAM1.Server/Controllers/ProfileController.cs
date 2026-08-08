using IAM1.Server.Data;
using IAM1.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IAM1.Server.Controllers
{
    [ApiController]
    [Route("api/profile")]
    public class ProfileController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProfileController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("{employeeId}")]
        public async Task<IActionResult> GetProfile(string employeeId)
        {
            if (string.IsNullOrWhiteSpace(employeeId))
            {
                return BadRequest(new { message = "Please input Employee ID" });
            }

            var profile = await _context.UserProfiles
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.EmployeeId == employeeId);

            if (profile == null)
            {
                return NotFound(new { message = $"Cannot find Employee ID: {employeeId}" });
            }

            return Ok(profile);
        }

        [HttpPut("{employeeId}")]
        public async Task<IActionResult> UpdateProfile(string employeeId, [FromBody] UserProfiles updatedProfile)
        {
            var profile = await _context.UserProfiles
                .FirstOrDefaultAsync(u => u.EmployeeId == employeeId);

            if (profile == null)
            {
                return NotFound(new { message = $"Cannot find Employee ID: {employeeId}" });
            }

            // field allow to update
            profile.FullName = updatedProfile.FullName;
            profile.Gender = updatedProfile.Gender;
            profile.DateOfBirth = updatedProfile.DateOfBirth;
            profile.Email = updatedProfile.Email;
            profile.Phone = updatedProfile.Phone;
            profile.OfficeLocation = updatedProfile.OfficeLocation;
            profile.Department = updatedProfile.Department;
            profile.Position = updatedProfile.Position;
            profile.Manager = updatedProfile.Manager;
            profile.JoinedDate = updatedProfile.JoinedDate;
            profile.EmploymentStatus = updatedProfile.EmploymentStatus;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Save success", data = profile });
        }
    }
}