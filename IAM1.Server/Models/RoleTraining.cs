namespace IAM1.Server.Models
{
    public class RoleTraining
    {
        public int RoleId { get; set; }

        public int TrainingId { get; set; }

        public string CreateBy { get; set; } = "";

        public string UpdateBy { get; set; } = "";

        public DateTime CreatedDate { get; set; }

        public DateTime UpdatedDate { get; set; }
    }
}