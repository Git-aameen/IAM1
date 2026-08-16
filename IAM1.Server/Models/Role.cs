namespace IAM1.Server.Models
{
    public class Role
    {
        public int RoleId { get; set; }

        public string RoleName { get; set; } = "";

        public string Description { get; set; } = "";

        public string CreateBy { get; set; } = "";

        public string UpdateBy { get; set; } = "";

        public DateTime CreatedDate { get; set; }

        public DateTime UpdatedDate { get; set; }
    }
}