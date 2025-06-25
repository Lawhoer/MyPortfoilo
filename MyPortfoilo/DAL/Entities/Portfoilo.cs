namespace MyPortfoilo.DAL.Entities
{
	public class Portfoilo
	{
		public int PortfoiloId { get; set; }
		public string Head { get; set; }
		public string MiniDescription { get; set; }
		public List<string> DescriptionItems { get; set; }
		public string Tech { get; set; }
		public string Date { get; set; }
	}
}
