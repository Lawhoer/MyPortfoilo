using Microsoft.AspNetCore.Mvc;

namespace MyPortfoilo.Controllers
{
	public class DefaultController : Controller
	{
		public IActionResult Index()
		{
			return View();
		}
	}
}
