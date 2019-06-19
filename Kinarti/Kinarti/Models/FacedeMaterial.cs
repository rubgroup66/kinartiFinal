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
    public class FacadeMaterial
    {
        public int ID { get; set; }

        public string Name { get; set; }
        public int Cost { get; set; }

        public FacadeMaterial(int _id, string _name, int _cost)
        {
            ID = _id;
            Name = _name;
            Cost = _cost;
        }
        public FacadeMaterial()
        {
        }
        //public int insert()
        //{
        //    DBservices dbs = new DBservices();
        //    int numAffected = dbs.insertFacadeMaterial(this);
        //    return numAffected;
        //}

        //--------------------------------------------------------------------------
        // get the list of the persons
        //--------------------------------------------------------------------------
        public List<FacadeMaterial> getFacadeMaterials()
        {
            DBservices dbs = new DBservices();
            List<FacadeMaterial> lp = dbs.getFacadeMaterials("PriceITConnectionString", "facadeMaterialTbl");
            return lp;
        }


        //public int updateFacade(int Id)
        //{
        //    DBservices dbs = new DBservices();
        //    int numAffected = dbs.updateFacade(this, Id);
        //    return numAffected;
        //}

    }
}
