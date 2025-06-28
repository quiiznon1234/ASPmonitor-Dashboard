using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Datasource
{
    public class Staff
    {
        private int id;
        private string firstname;
        private string lastname;
        private string username;
        private string password;
        private Int16 userlevel;
        private Int16 status;
        private DateTime createdate;
        private DateTime updatedate;
        private int createby;
        private int updateby;

        public int Id { get => id; set => id = value; }
        public string FirstName { get => firstname; set => firstname = value; }
        public string LastName { get => lastname; set => lastname = value; }
        public string UserName { get => username; set => username = value; }
        public string PassWord { get => password; set => password = value; }
        public short UserLevel { get => userlevel; set => userlevel = value; }
        public short Status { get => status; set => status = value; }
        public DateTime CreateDate { get => createdate; set => createdate = value; }
        public DateTime UpdateDate { get => updatedate; set => updatedate = value; }
        public int CreateBy { get => createby; set => createby = value; }
        public int UpdateBy { get => updateby; set => updateby = value; }
    }
}
