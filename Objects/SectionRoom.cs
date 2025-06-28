using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Datasource
{
    public class Sectionroom
    {
        private int dashboardroompk;
        private string sectionname;

        public int DashboardRoomPk { get => dashboardroompk; set => dashboardroompk = value; }
        public string? SectionroomName { get => sectionname; set => sectionname = value; }
    }
}
