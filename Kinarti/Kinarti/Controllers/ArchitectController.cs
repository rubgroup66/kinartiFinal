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

    public class ArchitectController : ApiController
    {

        [HttpGet]
        [Route("api/architect")]
        public IEnumerable<Architect> Get()
        {
            Architect h = new Architect();
            return h.Read();
        }

    }
}
