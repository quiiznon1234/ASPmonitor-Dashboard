using Microsoft.AspNetCore.Mvc;

namespace ASPMonitor.Controllers
{
    [ApiController]
    [Route("api/Notify")]
    public class NotifyController : Controller
    {
        [HttpGet("{section}")]
        public ActionResult Notify(string section)
        {
            return Ok(section);
        }
        public IActionResult Index()
        {
            return View();
        }
    }
}
