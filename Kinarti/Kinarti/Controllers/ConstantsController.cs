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

    public class ConstantsController : ApiController
    {
        [System.Web.Http.HttpGet]
        [Route("api/constants")]
        public IEnumerable<Constants> GetBox()
        {
            Constants constant = new Constants();
            List<Constants> lm = constant.getConstants();
            return lm;
        }

        [HttpPut]
        [Route("api/constants")]
        public void Put([FromBody]Constants p, int Id)
        {
            p.updateConstants(Id);
        }

        //[HttpPut]
        //[Route("api/constants")]
        //public void Put([FromBody]Constants p)
        //{
        //    p.updateConstants();
        //}

        //[System.Web.Http.HttpGet]
        //[Route("api/constants")]
        //public IEnumerable<Constants> UpdateConst()
        //{
        //    Constants constant = new Constants();
        //    List<Constants> lm = constant.UpdateConst();
        //    return lm;
        //}
    }
}
