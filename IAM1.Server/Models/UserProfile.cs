namespace IAM1.Server.Models
{
    public class UserProfiles
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string EmployeeId { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public DateTime? DateOfBirth { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string OfficeLocation { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public string Manager { get; set; } = string.Empty;
        public DateTime JoinedDate { get; set; }
        public string EmploymentStatus { get; set; } = string.Empty;
    }
}
