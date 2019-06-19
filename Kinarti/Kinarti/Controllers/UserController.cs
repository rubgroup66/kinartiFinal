using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using kinarti.Models;
using System.IO;
using System.Web;
using System.Web.Hosting;

namespace kinarti.Controllers
{
    public class UserController : ApiController
    {
        [HttpGet]
        [Route("api/users")]
        public User Get(int Id, string Password)
        {
            User u = new User();
            return u.Exist(Id, Password);
        }


        // POST api/values
        [HttpPost]
        [Route("api/users")]
        public void Post([FromBody]User u)
        {
            u.insert();
        }

        [HttpGet]
        [Route("api/users")]
        public IEnumerable<User> Get()
        {
            User u = new User();
            List<User> list = u.GetAllUsers();
            return list;
        }

        [HttpPut]
        [Route("api/users")]
        public User Put(User u)
        {
            User user = new User();
            user.Put(u);
            return user;
        }

        [HttpDelete]
        [Route("api/users/{id}")]
        public void Delete(string id)
        {
            string userID = id;
            User user = new User();
            user.DeleteUser(userID);
        }

    }

}
