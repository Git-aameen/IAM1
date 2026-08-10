using IAM1.Server.Data;
using IAM1.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IAM1.Server.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.EmployeeId))
            {
                return BadRequest(new
                {
                    message = "Please input Employee ID"
                });
            }

            if (string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new
                {
                    message = "Please input Password"
                });
            }

            var employeeId = request.EmployeeId.Trim();

            // Find login account
            var login = await _context.UserLogin
                .FirstOrDefaultAsync(x => x.Username == employeeId);

            if (login == null)
            {
                return Unauthorized(new
                {
                    message = "Invalid Employee ID or Password"
                });
            }

            // Check account status
            if (login.Status != "Active")
            {
                return Unauthorized(new
                {
                    message = "Account is not active"
                });
            }

            // Check password
            if (login.Password != request.Password)
            {
                login.FailedLoginCount++;

                await _context.SaveChangesAsync();

                return Unauthorized(new
                {
                    message = "Invalid Employee ID or Password"
                });
            }

            // Get employee profile
            var profile = await _context.UserProfiles
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == login.UserProfileId);

            if (profile == null)
            {
                return NotFound(new
                {
                    message = "User profile not found"
                });
            }

            // Login success
            login.FailedLoginCount = 0;
            login.LastLoginAt = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss");
            login.UpdatedAt = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss");

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Login successful",
                userProfileId = profile.Id,
                employeeId = profile.EmployeeId,
                fullName = profile.FullName
            });
        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    message = "Please fill in all fields"
                });
            }

            if (request.NewPassword != request.ConfirmPassword)
            {
                return BadRequest(new
                {
                    message = "New password and confirm password do not match"
                });
            }

            if (request.NewPassword.Length < 6)
            {
                return BadRequest(new
                {
                    message = "Password must be at least 6 characters"
                });
            }

            var employeeId = request.EmployeeId.Trim();

            var login = await _context.UserLogin
                .FirstOrDefaultAsync(x => x.Username == employeeId);

            if (login == null)
            {
                return NotFound(new
                {
                    message = "User account not found"
                });
            }

            if (login.Status != "Active")
            {
                return Unauthorized(new
                {
                    message = "Account is not active"
                });
            }

            // Check current password
            if (login.Password != request.CurrentPassword)
            {
                return Unauthorized(new
                {
                    message = "Current password is incorrect"
                });
            }

            // Update password
            login.Password = request.NewPassword;
            login.PasswordChangedAt =
                DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss");
            login.UpdatedAt =
                DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss");

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Password changed successfully"
            });
        }
    }
}