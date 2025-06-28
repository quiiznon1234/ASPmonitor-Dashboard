using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Datasource
{
    public class DashBoardRoom
    {
        private int pk;
        private string roomname;
        private int updateby;
        private DateTime updatetime;

        public int Pk {  get => pk; set => pk = value;}
        public string RoomName {  get => roomname; set => roomname = value; }
        public int UpdateBy { get => updateby; set => updateby = value; }
        public DateTime UpDateTime { get => updatetime; set => updatetime = value; }

        private List<Sectionroom> sectionrooms;
        public List<Sectionroom> SectionRooms { get => sectionrooms; set => sectionrooms = value; }
        public DashBoardRoom()
        {
            sectionrooms = new List<Sectionroom>();
        }
        public class CardDelete
        {
            public string SectionName { get; set; }
        }
    }
}
