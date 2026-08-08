namespace IAM1.Server.Models
{
    public class UserProfiles
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string EmployeeId { get; set; } = string.Empty;
        public string? Gender { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? OfficeLocation { get; set; }
        public string? Department { get; set; }
        public string? Position { get; set; }
        public string? ManagerEmail { get; set; }
        public string? ManagerID { get; set; }
        public DateTime? JoinedDate { get; set; }
        public string EmployeeStatus { get; set; } = string.Empty;
        public string EmployeeType { get; set; } = string.Empty;
    }
}
