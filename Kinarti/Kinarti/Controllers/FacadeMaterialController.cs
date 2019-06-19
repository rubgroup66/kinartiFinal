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
        // POST api/values
        //[HttpPost]
        //[Route("api/facadeMaterial")]
        //public void Post([FromBody]Facade m)
        //{
        //    try
        //    {
        //        //    int someError = Convert.ToInt32("will fail to convert");
        //        m.insert();
        //    }
        //    catch (Exception e)
        //    {
        //        throw e;
        //        // throw new Exception("Error in posting a new person");
        //    }
        //}

        [System.Web.Http.HttpGet]
        [Route("api/facadeMaterials")]
        public IEnumerable<FacadeMaterial> GetFacadeMaterial()
        {
            FacadeMaterial facadeMaterial = new FacadeMaterial();
            List<FacadeMaterial> lm = facadeMaterial.getFacadeMaterials();
            return lm;
        }



        //[System.Web.Http.HttpGet]
        //[Route("api/test")]
        //public String GetTest()
        //{

        //    return "success";
        //}


        //[HttpGet]
        //[Route("api/persons")]
        //public Person GetPerson(string email, string password)
        //{
        //    Person person = new Person();
        //    return person.getPerson(email, password);
        //}


        //[HttpPut]
        //[Route("api/persons")]
        //public void Put([System.Web.Http.FromBody]Person p, int Id)
        //{
        //    p.updatePerson(Id);
        //}

        //[HttpPut]
        //[Route("api/materials")]
        //public void Put([System.Web.Http.FromBody]Material m, int Id)
        //{
        //    m.updatefacade(Id);
        //}
    }

}
