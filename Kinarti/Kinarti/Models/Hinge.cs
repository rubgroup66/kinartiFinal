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
    public class Hinge
    {
        public int ID { get; set; }
        public string Type { get; set; }
        public int Cost { get; set; }

        public Hinge(int _id, string _type, int _cost)
        {
            ID = _id;
            Type = _type;
            Cost = _cost;
        }
        public Hinge()
        {
        }

        public int insert()
        {
            DBservices dbs = new DBservices();
            int numAffected = dbs.insertHinge(this);
            return numAffected;
        }

        //--------------------------------------------------------------------------
        // get the list of the boxes
        //--------------------------------------------------------------------------
        public List<Hinge> getHinges()
        {
            DBservices dbs = new DBservices();
            List<Hinge> lp = dbs.getHinges("PriceITConnectionString", "hingeTbl");
            return lp;
        }

        public int updateHinge(int Id)
        {
            DBservices dbs = new DBservices();
            int numAffected = dbs.updateHinge(this, Id);
            return numAffected;
        }

        public void deleteHinge(int Id)
        {
            DBservices dbs = new DBservices();
            int numAffected = dbs.deleteHinge(Id);

        }

    }
}
