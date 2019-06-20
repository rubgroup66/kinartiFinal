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
    public class Handle
    {
        public int ID { get; set; }
        public string Type { get; set; }
        public int Cost { get; set; }
        public Handle(int _id, string _type, int _cost)
        {
            ID = _id;
            Type = _type;

            Cost = _cost;

        }
        public Handle()
        {
        }

        public List<Handle> getHandles()
        {
            DBservices dbs = new DBservices();
            List<Handle> lp = dbs.getHandles("PriceITConnectionString", "handleTbl");
            return lp;
        }

        public int insert()
        {
            DBservices dbs = new DBservices();
            int numAffected = dbs.insertHandle(this);
            return numAffected;
        }

        public int updateHandle(int Id)
        {
            DBservices dbs = new DBservices();
            int numAffected = dbs.updateHandle(this, Id);
            return numAffected;
        }

        public void deleteHandle(int Id)
        {
            DBservices dbs = new DBservices();
            int numAffected = dbs.deleteHandle(Id);

        }
    }
}
