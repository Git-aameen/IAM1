using System.ComponentModel.DataAnnotations;

namespace IAM1.Server.Models
{
    public class LoginRequest
    {
        [Required]
        public string EmployeeId { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }
}