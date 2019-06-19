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

    public class SupervisorController : ApiController
    {

        [HttpGet]
        [Route("api/supervisor")]
        public IEnumerable<Supervisor> Get()
        {
            Supervisor h = new Supervisor();
            return h.Read();
        }

    }
}
