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
    public class Supervisor
    {
        public int sup_id { get; set; }
        public string sup_name { get; set; }
        public string sup_phone { get; set; }
        public int Active { get; set; }

        public Supervisor(int _sup_id, string _sup_name, string _sup_phone, int _Active)
        {
            sup_id = _sup_id;
            sup_name = _sup_name;
            sup_phone = _sup_phone;
            Active = _Active;
        }

        public Supervisor()
        {

        }

        public List<Supervisor> Read()
        {
            DBservices dbs = new DBservices();
            return dbs.GetSupervisor("PriceITConnectionString", "supervisor");
        }

        public int insertSup()
        {
            DBservices dbs = new DBservices();
            int numAffected = dbs.insertSup(this);
            return numAffected;
        }

        public void deleteSup(int Id)
        {
            DBservices dbs = new DBservices();
            int numAffected = dbs.deleteSup(Id);

        }
    }
}
