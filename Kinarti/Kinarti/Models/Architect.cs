using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.Data.SqlClient;
using System.Web.Configuration;
using System.Data;

using System.Text;


namespace kinarti.Models
{
    public class Architect
    {
        public int arc_id { get; set; }
        public string arc_name { get; set; }
        public int Active { get; set; }

        public Architect(int _arc_id, string _arc_name, int _Active)
        {
            arc_id = _arc_id;
            arc_name = _arc_name;
            Active = _Active;
        }

        public Architect()
        {
        }

        public List<Architect> Read()
        {
            DBservices dbs = new DBservices();
            return dbs.getArchitect("PriceITConnectionString", "Architect");
        }

        public int insertArch()
        {
            DBservices dbs = new DBservices();
            int numAffected = dbs.insertArch(this);
            return numAffected;
        }

        public void deleteArc(int Id)
        {
            DBservices dbs = new DBservices();
            int numAffected = dbs.deleteArc(Id);

        }

    }
}
