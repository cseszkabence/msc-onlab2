namespace PCPartPicker.Models
{
    public class EmailModel
    {
        public string? From { get; set; } = "cseszkabence@edu.bme.hu";
        public string? ToEmail { get; set; }
        public string? Subject { get; set; }
        public string? Body { get; set; }
        public bool IsHtml { get; set; } = true;
    }
}
