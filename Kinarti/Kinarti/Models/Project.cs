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
    public class Project
    {
        public int ID { get; set; }
        public string project_name { get; set; }
        public DateTime create_date { get; set; }
        public string description { get; set; }
        public int cost { get; set; }
        public int status { get; set; }
        public int customer_id { get; set; }
        public string architect { get; set; }
        public string supervisor { get; set; }

        public Project(string _project_name, DateTime _create_date, string _description, int _cost, int _status, int _customer_id, string _architect, string _supervisor, int _projectID)
        {
            ID = _projectID;
            project_name = project_name;
            create_date = _create_date;
            description = _description;
            cost = _cost;
            status = _status;
            customer_id = _customer_id;
            supervisor = _supervisor;
            architect = _architect;
        }

        public Project()
        {

        }

        public int insertProject()
        {
            DBservices dbs = new DBservices();
            int numAffected = dbs.insertProject(this);
                return numAffected;
        }

        public List<Project> GetProjects()
        {
            DBservices db = new DBservices();
            List<Project> projectsList = new List<Project>();
            projectsList = db.GetProjects();
            return projectsList;
        }

        public List<Project> filter(Filter status)
        {
            DBservices dbs = new DBservices();
            List<Project> listProj = dbs.filterProj(status);
            return listProj;
        }

        public List<Project> filterC(Filter cust)
        {
            DBservices dbs = new DBservices();
            List<Project> listProj = dbs.filterProjC(cust);
            return listProj;
        }

        public List<Project> filterP(Filter price)
        {
            DBservices dbs = new DBservices();
            List<Project> listProj = dbs.filterProjP(price);
            return listProj;
        }


        //    public List<Customer> GetCustomers()
        //    {
        //        DBservices db = new DBservices();
        //        List<Customer> customerList = new List<Customer>();
        //        customerList = db.GetCustomers();
        //        return customerList;
        //    }

        //    public void Put(Customer c)
        //    {
        //        DBservices db = new DBservices();
        //        db.Put(c);
        //    }

        //    public void DeleteCust(string custID)
        //    {
        //        DBservices db = new DBservices();
        //        db.DeleteCust(custID);
        //    }
        //}
        public int SwitchActive(int isActive, int ProjectId)
        {
            DBservices dbs = new DBservices();
            int numAffected = dbs.SwitchActive(isActive, ProjectId);
            return numAffected;
        }


        public Project getProject(int id)
        {
            DBservices dbs = new DBservices();
            return dbs.getProject("PriceITConnectionString", "Project2", id);
        }

        public int updateProject(int Id)
        {
            DBservices dbs = new DBservices();
            int numAffected = dbs.updateProject(this, Id);
            return numAffected;
        }
    }
}
