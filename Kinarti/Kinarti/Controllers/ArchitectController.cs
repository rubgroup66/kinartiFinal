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

    public class ArchitectController : ApiController
    {

        //[System.Web.Http.HttpGet]
        //[Route("api/architect")]
        //public IEnumerable<Architect> Get()
        //{
        //    Architect h = new Architect();
        //    return h.Read();
        //}
        
        [System.Web.Http.HttpGet]
        [Route("api/architect")]
        public IEnumerable<Architect> Get()
        {
            Architect arc = new Architect();
            List<Architect> ar = arc.Read();
            return ar;
        }

        [HttpPost]
        [Route("api/architect")]
        public void Post([FromBody]Architect A)
        {
            try
            {
                A.insertArch();   //    int someError = Convert.ToInt32("will fail to convert");
            }
            catch (Exception e)
            {
                throw e; // throw new Exception("Error in posting a new item");
            }
        }

        [System.Web.Http.HttpDelete]
        [Route("api/architect")]
        public void Delete(int Id)
        {
            Architect arc = new Architect();
            arc.deleteArc(Id);
        }

    }
}
