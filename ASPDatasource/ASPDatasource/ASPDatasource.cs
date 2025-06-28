
using System.Data;
using System.Data.SqlClient;
using Datasource;
namespace ASPDatasource
{
    public class ASPDatasource
    {
        private string _ConnectionString = "";
        public ASPDatasource(string connectionString)
        {
            this._ConnectionString = connectionString;
        }




        public Staff Login(string UserName, string Password)
        {
            Staff staff = new Staff();
            DataTable dtUser = new DataTable();
            using (SqlConnection conn = new SqlConnection(this._ConnectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand("select * from UserAuthorize where UserName='" + UserName + "' and Password='" + Password + "'"))
                {
                    cmd.Connection = conn;
                    SqlDataAdapter da = new SqlDataAdapter();
                    da.SelectCommand = cmd;
                    DataSet ds = new DataSet();
                    try
                    {
                        da.Fill(ds, "UserAuthorize");
                        if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                        {
                            dtUser = ds.Tables["UserAuthorize"];

                            DataRow row = dtUser.Rows[0];

                            staff.Id = Convert.ToInt32(row["id"]);
                            staff.FirstName = row["firstname"].ToString();
                            staff.LastName = row["lastname"].ToString();
                            staff.UserLevel = Convert.ToInt16(row["userlevel"]);
                            staff.Status = Convert.ToInt16(row["status"]);
                            staff.UserName = row["username"].ToString();

                            if (row["createdate"] != DBNull.Value)
                            {
                                staff.CreateDate = Convert.ToDateTime(row["createdate"]);
                            }
                            else
                            {
                                staff.CreateDate = DateTime.Now;
                            }
                            if (row["createby"] != DBNull.Value)
                            {
                                staff.CreateBy = Convert.ToInt32(row["createby"]);
                            }
                            else
                            {
                                staff.CreateBy = 0;
                            }
                            if (row["updateby"] != DBNull.Value)
                            {
                                staff.UpdateBy = Convert.ToInt32(row["updateby"]);
                            }
                            else
                            {
                                staff.UpdateBy = 0;
                            }
                            if (row["updatedate"] != DBNull.Value)
                            {
                                staff.UpdateDate = Convert.ToDateTime(row["updatedate"]);
                            }
                            else
                            {
                                staff.UpdateDate = DateTime.Now;
                            }
                        }
                        dtUser.Rows.Clear();
                        dtUser = null;
                    }
                    catch (Exception e) { throw new Exception(e.Message); }
                }
                conn.Close();

                return staff;
            }
        }
        public List<DashBoardRoom> GetRoom()
        {
            List<DashBoardRoom> room = new List<DashBoardRoom>();
            try
            {
                WritLog("1] GetRoom:" + this._ConnectionString);
                DataTable dtDashBoardRooms = new DataTable();
                using (SqlConnection conn = new SqlConnection(this._ConnectionString))
                {
                    conn.Open();
                    using (SqlCommand cmd = new SqlCommand("select * from DashBoardRooms"))
                    {
                        cmd.Connection = conn;
                        SqlDataAdapter adapter = new SqlDataAdapter();
                        adapter.SelectCommand = cmd;
                        DataSet ds = new DataSet();
                        adapter.Fill(ds, "DashBoardRooms");
                        if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                        {
                            dtDashBoardRooms = ds.Tables["DashBoardRooms"];

                            foreach (DataRow row in dtDashBoardRooms.Rows)
                            {
                                DashBoardRoom rooms = new DashBoardRoom();
                                rooms.Pk = Convert.ToInt32(row["PK"]);
                                rooms.RoomName = row["roomname"].ToString();
                                rooms.UpDateTime = Convert.ToDateTime(row["updatetime"]);
                                rooms.UpdateBy = Convert.ToInt16(row["updateby"]);
                                room.Add(rooms);
                                ;
                            }
                        }
                        dtDashBoardRooms.Rows.Clear();
                        dtDashBoardRooms = null;
                    }
                    conn.Close();

                }
            }
            catch (Exception ex)
            {
                WritLog("2] GetRoom ERR:" + ex.Message);
            }
            return room;
        }
        public List<Sectionroom> GetSection(int dashboardroompk)
        {
            List<Sectionroom> sections = new List<Sectionroom>();

            try
            {
                WritLog("1] GetSection:" + this._ConnectionString);
                using (SqlConnection conn = new SqlConnection(this._ConnectionString))
                {
                    conn.Open();
                    string query = "SELECT * FROM SectionRoom WHERE dashboardroompk = @DashboardRoomPk";
                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@DashboardRoomPk", dashboardroompk);
                        using (SqlDataAdapter adapter = new SqlDataAdapter(cmd))
                        {
                            DataSet ds = new DataSet();
                            adapter.Fill(ds, "SectionRoom");

                            if (ds.Tables["SectionRoom"]?.Rows.Count > 0)
                            {
                                foreach (DataRow row in ds.Tables["SectionRoom"].Rows)
                                {
                                    // Create a new Sectionroom object for each row
                                    Sectionroom section = new Sectionroom
                                    {
                                        DashboardRoomPk = Convert.ToInt32(row["dashboardroompk"]),
                                        SectionroomName = row["sectionname"].ToString()
                                    };
                                    sections.Add(section);
                                }
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                WritLog("2] GetSection ERR:" + ex.Message);
            }
            return sections;
        }
        public bool addSectionRoom(int dashboardroompk, string sectionname)
        {
            bool isseces = false;

            //string connectionString = @"Data Source=MOBILE_01\SQL2019;Initial Catalog=aspdashboard;Integrated Security=true;User Id=sa;Password=N@wee2546";

            using (SqlConnection conn = new SqlConnection(this._ConnectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand("SP_INSERTSECTIONROOM", conn))
                {
                    try
                    {
                        // เปิดการเชื่อมต่อ
                        cmd.CommandType = CommandType.StoredProcedure;
                        SqlParameter[] param = new SqlParameter[2];
                        param[0] = new SqlParameter("@sectionname", SqlDbType.VarChar, 100);
                        param[1] = new SqlParameter("@dashboardroompk", SqlDbType.Int);
                        param[0].Value = sectionname;
                        param[1].Value = dashboardroompk;
                        cmd.Parameters.AddRange(param);

                        // Execute SQL และตรวจสอบผลลัพธ์
                        int rowsAffected = cmd.ExecuteNonQuery();
                        if (rowsAffected > 0)
                        {
                            isseces = true; // ถ้ามีแถวถูกเพิ่มแสดงว่าสำเร็จ
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error: {ex.Message}");
                    }
                    finally
                    {
                        // ปิดการเชื่อมต่อ (สำคัญในกรณีที่ไม่ใช้ using)
                        if (conn.State == System.Data.ConnectionState.Open)
                        {
                            conn.Close();
                        }
                    }
                }
            }
            return isseces;
        }
        public bool removeSections(List<string> sectionIds)
        {
            bool isSuccess = false;

            //string connectionString = @"Data Source=MOBILE_01\SQL2019;Initial Catalog=aspdashboard;Integrated Security=true;User Id=sa;Password=N@wee2546";

            using (SqlConnection conn = new SqlConnection(this._ConnectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand("SP_DELETESECTIONROOMS", conn))
                {
                    try
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        // สร้าง DataTable เพื่อใช้เป็นพารามิเตอร์
                        foreach (string section in sectionIds)
                        {
                            cmd.Parameters.Clear();

                            SqlParameter param = new SqlParameter("@sectionIds", SqlDbType.VarChar, 100)
                            {
                                Value = section
                            };
                            cmd.Parameters.Add(param);
                            int rowsAffected = cmd.ExecuteNonQuery();
                            if (rowsAffected > 0)
                            {
                                isSuccess = true; // ถ้ามีแถวถูกเพิ่มแสดงว่าสำเร็จ
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error: {ex.Message}");
                    }
                    finally
                    {
                        if (conn.State == System.Data.ConnectionState.Open)
                        {
                            conn.Close();
                        }
                    }
                }
            }
            return isSuccess;
        }
        public int addDashboard(string dashboardName)
        {
            int dashboardRoomPK = 0; // ตัวแปรสำหรับเก็บค่า PK ที่ได้จาก Stored Procedure

            //string connectionString = @"Data Source=MOBILE_01\SQL2019;Initial Catalog=aspdashboard;Integrated Security=true;User Id=sa;Password=N@wee2546";

            using (SqlConnection conn = new SqlConnection(this._ConnectionString))
            {
                try
                {
                    conn.Open();

                    using (SqlCommand cmd = new SqlCommand("SP_AddDashboardRoom", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        // เพิ่มพารามิเตอร์สำหรับชื่อ Dashboard
                        cmd.Parameters.Add(new SqlParameter("@dashboardName", SqlDbType.VarChar, 100)
                        {
                            Value = dashboardName
                        });

                        // เพิ่มพารามิเตอร์ OUTPUT สำหรับเก็บค่า PK
                        SqlParameter outputParam = new SqlParameter("@DashBoardRoomPK", SqlDbType.Int)
                        {
                            Direction = ParameterDirection.Output
                        };
                        cmd.Parameters.Add(outputParam);

                        // เรียก Stored Procedure
                        cmd.ExecuteNonQuery();

                        // อ่านค่า OUTPUT จาก Stored Procedure
                        dashboardRoomPK = (int)outputParam.Value;
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error while adding dashboard: {ex.Message}");
                }
            }

            return dashboardRoomPK; // คืนค่า PK กลับไป
        }
        public bool removeDashboard(List<string> dashboardIds)
        {
            bool isSuccess = false; // ตัวแปรสำหรับเก็บสถานะความสำเร็จ
            //string connectionString = @"Data Source=MOBILE_01\SQL2019;Initial Catalog=aspdashboard;Integrated Security=true;User Id=sa;Password=N@wee2546";

            using (SqlConnection conn = new SqlConnection(this._ConnectionString))
            {
                try
                {
                    conn.Open();

                    // ใช้ SqlCommand เพื่อเรียก Stored Procedure
                    using (SqlCommand cmd = new SqlCommand("SP_DELETEDASHBOARDS", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        foreach (var dashboardId in dashboardIds)
                        {
                            cmd.Parameters.Clear(); // ลบพารามิเตอร์เก่าทุกครั้ง
                            cmd.Parameters.Add(new SqlParameter("@DashboardIds", SqlDbType.VarChar, 100)
                            {
                                Value = dashboardId
                            });

                            int rowsAffected = cmd.ExecuteNonQuery();
                            if (rowsAffected > 0)
                            {
                                isSuccess = true; // สำเร็จหากลบข้อมูลได้
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error while deleting dashboards: {ex.Message}");
                }
            }

            return isSuccess;
        }


        private void WritLog(string message)
        {
            try
            {
                string logFolder = @"D:\LogMonitor\" + DateTime.Now.ToString("yyyy") + @"\" + DateTime.Now.ToString("MM");

                if (Directory.Exists(logFolder) == false)
                {
                    Directory.CreateDirectory(logFolder);
                }
                string pathFile = Path.Combine(logFolder, DateTime.Now.ToString("dd") + ".log");
                using (StreamWriter st = new StreamWriter(pathFile, true))
                {
                    st.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " " + message);
                }

            }
            catch (Exception ex)
            {
            }
        }

    }
}
