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
    public class FacadeController : ApiController
    {
        // POST api/values
        [HttpPost]
        [Route("api/facade")]
        public void Post([FromBody]Facade m)
        {
            try
            {
                //    int someError = Convert.ToInt32("will fail to convert");
                m.insertFac();
            }
            catch (Exception e)
            {
                throw e;
                // throw new Exception("Error in posting a new person");
            }
        }

        [System.Web.Http.HttpGet]
        [Route("api/facade")]
        public IEnumerable<Facade> GetFacade()
        {
            Facade facade = new Facade();
            List<Facade> lm = facade.getFacades();
            return lm;
        }


        [HttpPut]
        [Route("api/facade")]
        public void Put([FromBody]Facade p, int Id)
        {
            p.updateFac(Id);
        }

        [System.Web.Http.HttpDelete]
        [Route("api/facade")]
        public void Delete(int Id)
        {
            Facade fac = new Facade();
            fac.deleteFac(Id);
        }
    }
    
}
