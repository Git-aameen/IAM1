using System.ComponentModel.DataAnnotations;

namespace IAM1.Server.Models
{
    public class ChangePasswordRequest
    {
        [Required]
        public string EmployeeId { get; set; } = string.Empty;

        [Required]
        public string CurrentPassword { get; set; } = string.Empty;

        [Required]
        public string NewPassword { get; set; } = string.Empty;

        [Required]
        public string ConfirmPassword { get; set; } = string.Empty;
    }
}