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
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Password { get; set; }
        public int UserType { get; set; }
        public int Active { get; set; }


        public User(int _Id, string _Name ,string _Password, int _UserType, int _Active)
        {
            Id = _Id; ;
            Name = _Name;
            Password = _Password;
            UserType = _UserType;
            Active = _Active;
        }

        public User()
        {

        }

        public User Exist(int Id, string Password)
        {
            DBservices dbs = new DBservices();
            return dbs.Exist("PriceITConnectionString", "Users", Id, Password);

        }

        public int insert()
        {
            DBservices dbs = new DBservices();
            int numAffected = dbs.InsertUser(this);
            return numAffected;
        }


        public List<User> GetAllUsers()
        {
            DBservices dbs = new DBservices();
            return dbs.GetAllUsers("PriceITConnectionString", "Users");
        }

        public void DeleteUser(string userID)
        {
            DBservices dbs = new DBservices();
            dbs.DeleteUser(userID);

        }

        public void Put(User u)
        {
            DBservices db = new DBservices();
            db.Put(u);
        }
    }
}
