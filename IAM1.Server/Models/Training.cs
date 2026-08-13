namespace IAM1.Server.Models
{
    public class Training
    {
        public int TrainingId { get; set; }

        public string TrainingName { get; set; } = "";

        public string Description { get; set; } = "";

        public string CreateBy { get; set; } = "";

        public string UpdateBy { get; set; } = "";

        public DateTime CreatedDate { get; set; }

        public DateTime UpdatedDate { get; set; }
    }
}
