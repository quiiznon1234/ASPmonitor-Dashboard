using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using ASPMonitor.Controllers;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Windows.Input;
using static Datasource.DashBoardRoom;

[Route("api/[controller]")]
[ApiController]
public class LabController : Controller
{
    public string _connectionString;
    ASPDatasource.ASPDatasource asp = null;
    private readonly ILogger<LoginController> _logger;
    public LabController(IConfiguration configuration, ILogger<LoginController> logger)
    {
        this._connectionString = configuration.GetConnectionString("AppDb");
        asp = new ASPDatasource.ASPDatasource(this._connectionString);
        _logger = logger;
    }

  
    [HttpGet("GetSectionSum")]
    public IActionResult GetSectionSum(int roomID)
    {
        if (roomID == 0)
        {
            return BadRequest(new { message = "❌ Room ID is required" });
        }

        List<object> sectionSums = new List<object>();

        try
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();

                string query = @" SELECT P.SectionName, COUNT(P.SectionName) AS Total FROM SectionRoom S
                                INNER JOIN PatienRoom P ON S.SectionName = P.SectionName
                                WHERE S.DashBoardRoomPK = @RoomID
                                GROUP BY P.SectionName";

                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.Add("@RoomID", SqlDbType.VarChar, 100).Value = roomID;

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            sectionSums.Add(new
                            {
                                SectionName = reader["SectionName"].ToString(),
                                Total = reader["Total"] != DBNull.Value ? Convert.ToInt32(reader["Total"]) : 0
                            });
                        }
                    }
                }
            }
            if (sectionSums.Count == 0)
            {
                sectionSums.Add(new { SectionName = "No Data", total = 0 });
            }
            return Ok(new { roomID, sectionSums });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "❌ Error retrieving data", error = ex.Message });
        }
    }

    [HttpGet("GetTotalRecords")]
    public IActionResult GetTotalRecords(int roomID)
    {
        if (roomID == 0)
        {
            return BadRequest(new { message = "Room ID is required" });
        }

        List<object> sectionRecords = new List<object>();
        try
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                string query = @"
                                SELECT P.SectionName, COUNT(*) AS TotalRecords
                                FROM SectionRoom S
                                INNER JOIN PatienRoom P ON S.SectionName = P.SectionName
                                WHERE S.DashBoardRoomPK = @RoomID
                                GROUP BY P.SectionName";

                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.Add("@RoomID", SqlDbType.Int).Value = roomID;

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            sectionRecords.Add(new
                            {
                                SectionName = reader["SectionName"].ToString(),
                                TotalRecords = Convert.ToInt32(reader["TotalRecords"])
                            });
                        }
                    }
                }
            }
            return Ok(new { sectionRecords });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error retrieving total records", error = ex.Message });
        }
    }

    [HttpGet("GetPatientsBS")]
    public IActionResult GetPatientsBS([FromQuery] string sectionName)
    {
        if (string.IsNullOrEmpty(sectionName))
        {
            return BadRequest(new { message = "Section name is required." });
        }
        List<object> patients = new List<object>();

        try
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                string query = "SELECT PatientName, BarCode, DateTime FROM PatienRoom WHERE SectionName = @SectionName ORDER BY DateTime ASC";
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.Add("@SectionName", SqlDbType.VarChar, 100).Value = sectionName;
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            var patientName = reader["PatientName"] != DBNull.Value ? reader["PatientName"].ToString() : "N/A";
                            var barcode = reader["BarCode"] != DBNull.Value ? reader["BarCode"].ToString() : "N/A";
                            var dateTime = reader["DateTime"] != DBNull.Value
                                ? Convert.ToDateTime(reader["DateTime"]).ToString("dd/MM/yyyy HH:mm:ss")
                                : "N/A";

                            // ✅ ตรวจสอบค่าที่อ่านได้จากฐานข้อมูล
                            Console.WriteLine($"🔍 Data Retrieved: {patientName}, {barcode}, {dateTime}");

                            patients.Add(new
                            {
                                PatientName = patientName,
                                Barcode = barcode,
                                DateTime = dateTime
                            });
                        }
                    }
                }
            }
            return Ok(patients);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error retrieving data", error = ex.Message });
        }
    }

    [HttpGet("GetRecentActivities")]
    public IActionResult GetRecentActivities()
    {
        List<object> activities = new List<object>();

        try
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                string query = @"
                SELECT TOP 5 DateTime, SectionName, BarCode, PatientName
                FROM PatienRoom
                ORDER BY DateTime DESC";

                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            activities.Add(new
                            {
                                Time = Convert.ToDateTime(reader["DateTime"]).ToString("HH:mm:ss"),
                                SectionName = reader["SectionName"].ToString(),
                                SampleID = reader["BarCode"].ToString(),
                                PatientName = reader["PatientName"].ToString()
                            });
                        }
                    }
                }
            }

            if (activities.Count == 0)
            {
                return NotFound(new { message = "No recent activities found." });
            }

            return Ok(activities);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error retrieving activities", error = ex.Message });
        }
    }

    [HttpPost("DeleteCard")]
    public async Task<IActionResult> DeleteCard([FromBody] CardDelete request)
    {
        if (string.IsNullOrEmpty(request.SectionName))
        {
            return BadRequest(new { message = "Section name is required" });
        }

        try
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                string query = "DELETE FROM PatienRoom WHERE SectionName = @SectionName";

                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@SectionName", request.SectionName);

                    int result = await command.ExecuteNonQueryAsync();

                    if (result > 0)
                        return Ok(new { message = "Section deleted successfully" });
                    else
                        return NotFound(new { message = "No data found for this section" });
                }
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
        }
    }
}
