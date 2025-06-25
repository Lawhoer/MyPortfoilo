using Microsoft.EntityFrameworkCore;
using MyPortfoilo.DAL.Entities;

namespace MyPortfoilo.DAL.Context
{
	public class PortfoiloContext : DbContext
	{
		protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
		{
			optionsBuilder.UseSqlServer("Server=MACHINEWHO\\PORTFOILOSQL19;initial Catalog=MyPortfoiloDb;integrated Security=true;TrustServerCertificate=True;");
		}
		public DbSet<About> Abouts { get; set; }
		public DbSet<Experience> Experiences { get; set; }
		public DbSet<Feature> Features { get; set; }
		public DbSet<Portfoilo> Portfoilos { get; set; }
		public DbSet<Profil> Profils { get; set; }
	}											
}
