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
    public class Customer
    {
        public int id { get; set; }
        public string first_name { get; set; }
        public string last_name { get; set; }
        public string phone_num { get; set; }
        public string email { get; set; }

        public Customer( int _id, string _first_name, string _last_name, string _phone_num, string _email)
        {
            id = _id;
            first_name = _first_name;
            last_name = _last_name;
            phone_num = _phone_num;
            email = _email;
        }

        public Customer()
        {

        }

        public int insertCust()
        {
            DBservices dbs = new DBservices();
            int numAffected = dbs.insertCust(this);
            return numAffected;
        }

        public List<Customer> GetCustomers()
        {
            DBservices db = new DBservices();
            List<Customer> customerList = new List<Customer>();
            customerList = db.GetCustomers();
            return customerList;
        }

        public void Put(Customer c)
        {
            DBservices db = new DBservices();
            db.Put(c);
        }

        public void DeleteCust(string custID)
        {
            DBservices db = new DBservices();
            db.DeleteCust(custID);
        }
    }
}
