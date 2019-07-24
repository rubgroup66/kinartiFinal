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
    public class Facade
    {
        public int ID { get; set; }

        public string Type { get; set; }
        public int Cost { get; set; }
        public int Active { get; set; }

        public Facade(int _id, string _type, int _cost, int _Active)
        {
            ID = _id;
            Type = _type;
            Cost = _cost;
            Active = _Active;
        }
        public Facade()
        {
        }
        public int insertFac()
        {
            DBservices dbs = new DBservices();
            int numAffected = dbs.insertFacade(this);
            return numAffected;
        }

        public List<Facade> getFacades()
        {
            DBservices dbs = new DBservices();
            List<Facade> lp = dbs.getFacades("PriceITConnectionString", "facadeTbl");
            return lp;
        }


        public int updateFac(int Id)
        {
            DBservices dbs = new DBservices();
            int numAffected = dbs.updateFac(this, Id);
            return numAffected;
        }

        public void deleteFac(int Id)
        {
            DBservices dbs = new DBservices();
            int numAffected = dbs.deleteFac(Id);

        }
    }
}
