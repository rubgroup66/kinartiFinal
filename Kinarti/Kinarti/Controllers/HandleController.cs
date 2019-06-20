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

namespace WebApplication1.Controllers
{

    public class HandleController : ApiController
    {
        [System.Web.Http.HttpGet]
        [Route("api/handles")]
        public IEnumerable<Handle> GetHandle()
        {
            Handle handle = new Handle();
            List<Handle> lm = handle.getHandles();
            return lm;
        }

        [HttpPost]
        [Route("api/handles")]
        public void Post([FromBody]Handle p)
        {
            try
            {
                p.insert();   //    int someError = Convert.ToInt32("will fail to convert");
            }
            catch (Exception e)
            {
                throw e; // throw new Exception("Error in posting a new item");
            }
        }

        [HttpPut]
        [Route("api/handles")]
        public void Put([FromBody]Handle p, int Id)
        {
            p.updateHandle(Id);
        }

        [System.Web.Http.HttpDelete]
        [Route("api/handles")]
        public void Delete(int Id)
        {
            Handle handle = new Handle();
            handle.deleteHandle(Id);
        }

    }
}
