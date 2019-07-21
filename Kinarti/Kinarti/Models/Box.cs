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
    public class Box
    {
        public int ID { get; set; }
        public string Type { get; set; }
        public int Height { get; set; }
        public int Width { get; set; }
        public int Depth { get; set; }
<<<<<<< HEAD
        public int Active { get; set; }

        public Box(int _id, string _type, int _height, int _width, int _depth, int _Active) 


=======
        public int isActive { get; set; }
        // public int CostForBasicMaterial { get; set; }
        public Box(int _id, int _type, int _height, int _width, int _depth) //int _costForBasicMaterial)
>>>>>>> 445fe8a218eb4b6225ec527ebdd93248dc8868f1
        {
            ID = _id;
            Type = _type;
            Height = _height;
            Width = _width;
            Depth = _depth;
            Active = _Active;

        }
        public Box()
        {
        }

        public int insertBox()
        {
            DBservices dbs = new DBservices();
            int numAffected = dbs.insertBox(this);
            return numAffected;
        }


        //--------------------------------------------------------------------------
        // get the list of the boxes
        //--------------------------------------------------------------------------
        public List<Box> getBoxes()
        {
            DBservices dbs = new DBservices();
            List<Box> lp = dbs.getBoxes("PriceITConnectionString", "boxTbl");
            return lp;
        }

        public void DeleteBox(int boxID)
        {

            DBservices db = new DBservices();
            int numAffected = db.DeleteBox(boxID);

        }
        

    }
}
