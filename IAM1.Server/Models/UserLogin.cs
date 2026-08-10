using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IAM1.Server.Models
{
    public class UserLogin
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserProfileId { get; set; }

        [Required]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;

        [Required]
        public string Status { get; set; } = "Active";

        public string? LastLoginAt { get; set; }

        public string? PasswordChangedAt { get; set; }

        public int FailedLoginCount { get; set; } = 0;

        public string? LockedUntil { get; set; }

        [Required]
        public string CreatedAt { get; set; } = string.Empty;

        [Required]
        public string UpdatedAt { get; set; } = string.Empty;

        // Relationship to UserProfiles
        [ForeignKey(nameof(UserProfileId))]
        public virtual UserProfiles? UserProfile { get; set; }
    }
}