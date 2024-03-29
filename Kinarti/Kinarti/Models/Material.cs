﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using System.Web.Configuration;
using System.Data;
using System.Text;

namespace kinarti.Models
{
    public class Material
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public int Cost { get; set; }
        public float Coefficient { get; set; }
        public int WorkCost { get; set; }
        public int Active { get; set; }

        public Material(int _id, string _name, string _type, int _cost, float _coefficient, int _WorkCost, int _Active)
        {
            ID = _id;
            Name = _name;
            Type = _type;
            Cost = _cost;
            Coefficient = _coefficient;
            WorkCost = _WorkCost;
            Active = _Active;
        }
        public Material()
        {
        }
        public int insert()
        {
            DBservices dbs = new DBservices();
            int numAffected = dbs.insertMaterial(this);
            return numAffected;
        }
        //--------------------------------------------------------------------------
        // get the list of the persons
        //--------------------------------------------------------------------------
        public List<Material> getMaterials()
        {
            DBservices dbs = new DBservices();
            List<Material> lp = dbs.getMaterials2("PriceITConnectionString", "materialTbl");
            return lp;
        }

        public int updateMaterial(int Id)
        {
            DBservices dbs = new DBservices();
            int numAffected = dbs.updateMaterial(this, Id);
            return numAffected;
        }

        public void deleteMaterial(int Id)
        {
            DBservices dbs = new DBservices();
            int numAffected = dbs.deleteMaterial(Id);

        }

    }
}
