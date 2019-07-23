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
    public class IronWork
    {
        public int ID { get; set; }
        public string Type { get; set; }
        public int Cost { get; set; }
        public int Active { get; set; }

        public IronWork(int _id, string _type, int _cost, int _Active)
        {
            ID = _id;
            Type = _type;
            Cost = _cost;
            Active = _Active;
        }
        public IronWork()
        {
        }

        public int insertIronW()
        {
            DBservices dbs = new DBservices();
            int numAffected = dbs.insertIronW(this);
            return numAffected;
        }

        public List<IronWork> getIronWorks()
        {
            DBservices dbs = new DBservices();
            List<IronWork> lp = dbs.getIronWorks("PriceITConnectionString", "ironWorkTbl");
            return lp;
        }

        public int updateIronW(int Id)
        {
            DBservices dbs = new DBservices();
            int numAffected = dbs.updateIronW(this, Id);
            return numAffected;
        }

        public void deleteIronW(int Id)
        {
            DBservices dbs = new DBservices();
            int numAffected = dbs.deleteIronW(Id);

        }

    }
}