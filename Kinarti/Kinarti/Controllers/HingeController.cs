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

    public class HingeController : ApiController
    {
        [System.Web.Http.HttpGet]
        [Route("api/Hinges")]
        public IEnumerable<Hinge> GetHinges()
        {
            Hinge hinge = new Hinge();
            List<Hinge> lm = hinge.getHinges();
            return lm;
        }

        [HttpPost]
        [Route("api/hinges")]
        public void Post([FromBody]Hinge p)
        {
            try {
                p.insert();   //    int someError = Convert.ToInt32("will fail to convert");
            }
            catch (Exception e) {
                throw e; // throw new Exception("Error in posting a new item");
            }
        }

        [HttpPut]
        [Route("api/hinges")]
        public void Put([FromBody]Hinge p, int Id)
        {
            p.updateHinge(Id);
        }

        [System.Web.Http.HttpDelete]
        [Route("api/hinges")]
        public void Delete(int Id)
        {
            Hinge hinge = new Hinge();
            hinge.deleteHinge(Id);
        }

    }
}
