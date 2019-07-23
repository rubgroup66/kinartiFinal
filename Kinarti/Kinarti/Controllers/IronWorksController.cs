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

    public class IronWorksController : ApiController
    {
        [System.Web.Http.HttpGet]
        [Route("api/IronWorks")]
        public IEnumerable<IronWork> GetIronWorks()
        {
            IronWork ironWork = new IronWork();
            List<IronWork> lm = ironWork.getIronWorks();
            return lm;
        }

        [HttpPost]
        [Route("api/IronWorks")]
        public void Post([FromBody]IronWork I)
        {
            try
            {
                I.insertIronW();   //    int someError = Convert.ToInt32("will fail to convert");
            }
            catch (Exception e)
            {
                throw e; // throw new Exception("Error in posting a new item");
            }
        }

        [HttpPut]
        [Route("api/IronWorks")]
        public void Put([FromBody]IronWork I, int Id)
        {
            I.updateIronW(Id);
        }

        [System.Web.Http.HttpDelete]
        [Route("api/IronWorks")]
        public void Delete(int Id)
        {
            IronWork IronW = new IronWork();
            IronW.deleteIronW(Id);
        }

    }
}