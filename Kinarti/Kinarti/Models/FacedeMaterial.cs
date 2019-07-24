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
        public int FacadeID { get; set; }
        public int Active { get; set; }

        public FacadeMaterial(int _id, string _name, int _cost, int _FacadeID, int _Active)
        {
            ID = _id;
            Name = _name;
            Cost = _cost;
            FacadeID = _FacadeID;
            Active = _Active;
        }
        public FacadeMaterial()
        {
        }
        public int insert()
        {
            DBservices dbs = new DBservices();
            int numAffected = dbs.insertFacadeMaterial(this);
            return numAffected;
        }

        //--------------------------------------------------------------------------
        // get the list of the persons
        //--------------------------------------------------------------------------
        public List<FacadeMaterial> getFacadeMaterials()
        {
            DBservices dbs = new DBservices();
            List<FacadeMaterial> lp = dbs.getFacadeMaterials("PriceITConnectionString", "facadeMaterialTbl");
            return lp;
        }

        public int updateFacadeMaterial(int Id)
        {
            DBservices dbs = new DBservices();
            int numAffected = dbs.updateFacadeMaterial(this, Id);
            return numAffected;
        }

        public void deleteFacadeMaterial(int Id)
        {
            DBservices dbs = new DBservices();
            int numAffected = dbs.deleteFacadeMaterial(Id);

        }

    }
}
