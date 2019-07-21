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

    public class BoxController : ApiController
    {
        [System.Web.Http.HttpGet]
        [Route("api/boxes")]
        public IEnumerable<Box> GetBox()
        {
            Box box = new Box();
            List<Box> lm = box.getBoxes();
            return lm;
        }

        [Route("api/boxes")]
        public void Post([FromBody]Box box)
        {
            box.insertBox();
        }

        [HttpDelete]
        [Route("api/boxes/{id}")]
        public int Delete(int id)
        {

            Box box = new Box();
            box.DeleteBox(id);
            return 1;
        }
    }
}
