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
    public class FacadeMaterialController : ApiController
    {

        [System.Web.Http.HttpGet]
        [Route("api/facadeMaterials")]
        public IEnumerable<FacadeMaterial> GetFacadeMaterial()
        {
            FacadeMaterial facadeMaterial = new FacadeMaterial();
            List<FacadeMaterial> lm = facadeMaterial.getFacadeMaterials();
            return lm;
        }

        [HttpPost]
        [Route("api/facadeMaterials")]
        public void Post([FromBody]FacadeMaterial p)
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
        [Route("api/facadeMaterials")]
        public void Put([FromBody]FacadeMaterial p, int Id)
        {
            p.updateFacadeMaterial(Id);
        }

        [System.Web.Http.HttpDelete]
        [Route("api/facadeMaterials")]
        public void Delete(int Id)
        {
            FacadeMaterial facadeMaterial = new FacadeMaterial();
            facadeMaterial.deleteFacadeMaterial(Id);
        }
    }

}
