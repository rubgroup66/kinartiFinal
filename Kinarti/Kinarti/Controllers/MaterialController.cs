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
    public class MaterialController : ApiController
    {
        [System.Web.Http.HttpGet]
        [Route("api/materials")]
        public IEnumerable<Material> GetMaterial()
        {
            Material material = new Material();
            List<Material> lm = material.getMaterials();
            return lm;
        }

        [HttpPost]
        [Route("api/materials")]
        public void Post([FromBody]Material p)
        {
            try {
                p.insert();   //    int someError = Convert.ToInt32("will fail to convert");
            }
            catch (Exception e) {
                throw e; // throw new Exception("Error in posting a new item");
            }
        }

        [HttpPut]
        [Route("api/materials")]
        public void Put([FromBody]Material p, int Id)
        {
            p.updateMaterial(Id);
        }

        [System.Web.Http.HttpDelete]
        [Route("api/materials")]
        public void Delete(int Id)
        {
            Material material = new Material();
            material.deleteMaterial(Id);
        }
    }
    
}
