
using System.Data;
using Datasource;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;


namespace ASPMonitor.Controllers
{
    public class LoginController : Controller
    {

        public string _connectionString;
        ASPDatasource.ASPDatasource asp = null;
        private readonly ILogger<LoginController> _logger;
        public LoginController(IConfiguration configuration, ILogger<LoginController> logger)
        {
            this._connectionString = configuration.GetConnectionString("AppDb");
            asp = new ASPDatasource.ASPDatasource(this._connectionString);
            _logger = logger;
        }

        public ActionResult Index()
        {
            return View();
        }
        public List<DashBoardRoom> GetDaashboardroom()
        {
            List<DashBoardRoom> dashBoardRooms = asp.GetRoom();
            return dashBoardRooms;
            
        }
        [HttpPost]
        public JsonResult Login(string username, string password, int roomID)
        {
            if (string.IsNullOrWhiteSpace(username))
            {
                return Json(new { status = "0", message = "❌ UserName is required." });
            }
            if (string.IsNullOrWhiteSpace(password))
            {
                return Json(new { status = "0", message = "❌ Password is required." });
            }
            if (roomID <= 0)
            {
                return Json(new { status = "0", message = "❌ Please select a valid RoomID." });
            }

            Staff staff = asp.Login(username, password);

            if (staff == null || staff.Id <= 0)
            {
                return Json(new { status = "0", message = "❌ Incorrect username or password." });
            }
            HttpContext.Session.SetInt32("DashboardRoom", roomID);
            return Json(new { status = "success", redirectUrl = Url.Action("Index", "DashBoard") });
        }
    }
}