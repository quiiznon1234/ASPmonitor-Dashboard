using System.Data.SqlClient;
using System.Data;
using Datasource;
using Microsoft.AspNetCore.Mvc;

namespace ASPMonitor.Controllers
{
    public class SettingController : Controller
    {
        public string _connectionString;
        ASPDatasource.ASPDatasource asp = null;
        private readonly ILogger<LoginController> _logger;
        public SettingController(IConfiguration configuration, ILogger<LoginController> logger)
        {
            this._connectionString = configuration.GetConnectionString("AppDb");
            asp = new ASPDatasource.ASPDatasource(this._connectionString);
            _logger = logger;
        }

        public IActionResult Index()
        {
            List<DashBoardRoom> dashBoardRooms = asp.GetRoom();
            return View(dashBoardRooms);
        }
        public List<Sectionroom> sectionrooms(int dashboardpk)
        {
            List<Sectionroom> sectionrooms = asp.GetSection(dashboardpk);
            return sectionrooms;
        }
        public ActionResult addsectionName(string name, int dashboard)
        {
            if (string.IsNullOrEmpty(name))
            {
                return Json(new { success = false, message = "Invalid section name." });
                
            }
                bool result = asp.addSectionRoom(dashboard, name);
            if (!result)
            {
                // Verify the `addSectionRoom` logic for issues
                return Json(new { success = false, message = "Failed to add section to database." });
            }
            return View();
        }
        public JsonResult removeSections([FromBody]List<string> sectionIds)
        {
            try
            {
                bool result = asp.removeSections(sectionIds);

                if (result)
                {
                    return Json(new { success = true });
                }
                else
                {
                    return Json(new { success = false, message = "Failed to remove section." });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
        public JsonResult addDashboard(string dashboardName)
        {
            try
            {
                int newDashboardRoomPK = asp.addDashboard(dashboardName);

                if (newDashboardRoomPK > 0)
                {
                    return Json(new { success = true, DashBoardRoomPK = newDashboardRoomPK });
                }
                else
                {
                    return Json(new { success = false, message = "Failed to add dashboard." });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
        [Route("Setting/SectionRooms/{dashboardpk}")]
        public ActionResult SectionRooms(int dashboardpk)
        {
            if (dashboardpk <= 0)
            {
                return BadRequest("Invalid DashboardRoomPk.");
            }

            List<Sectionroom> sections = asp.GetSection(dashboardpk);

            if (sections == null || sections.Count == 0)
            {
                return NotFound(); // ไม่มีข้อมูล ส่ง 404 กลับไป
            }

            return Ok(sections); // ส่งข้อมูล Section กลับไปยัง Client
        }
    }
}
