using kinarti.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using HttpPostAttribute = System.Web.Mvc.HttpPostAttribute;
using HttpPutAttribute = System.Web.Mvc.HttpPutAttribute;
using RouteAttribute = System.Web.Http.RouteAttribute;

using System.Data;

using System.Net;
using System.Net.Http;

namespace kinarti.Controllers
{

    public class SupervisorController : ApiController
    {

        [System.Web.Http.HttpGet]
        [Route("api/supervisor")]
        public IEnumerable<Supervisor> Get()
        {
            Supervisor sup = new Supervisor();
            List<Supervisor> sp = sup.Read();
            return sp;
        }

        [HttpPost]
        [Route("api/supervisor")]
        public void Post([FromBody]Supervisor S)
        {
            try
            {
                S.insertSup();   //    int someError = Convert.ToInt32("will fail to convert");
            }
            catch (Exception e)
            {
                throw e; // throw new Exception("Error in posting a new item");
            }
        }

        [System.Web.Http.HttpDelete]
        [Route("api/supervisor")]
        public void Delete(int Id)
        {
            Supervisor sup = new Supervisor();
            sup.deleteSup(Id);
        }

    }
}
