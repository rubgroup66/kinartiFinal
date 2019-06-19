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

    public class CustomerController : ApiController
    {

        // POST api/values
        //public void Post([FromBody]string value)
        [Route("api/cust")]
        public void Post([FromBody]Customer cust)
        {
            cust.insertCust();
        }

        [HttpGet]
        [Route("api/getCust")]
        public IEnumerable<Customer> Get()
        {
            Customer cust = new Customer();
            List<Customer> customerList = cust.GetCustomers();
            return customerList;
        }

        [HttpPut]
        [Route("api/putcust")]
        public Customer Put(Customer c)
        {
            Customer cust = new Customer();
            cust.Put(c);
            return cust;
        }

        [HttpDelete]
        [Route("api/customers/{project_name}")]
        public void Delete(string project_name)
        {
            string custID = project_name;
            Customer cust = new Customer();
            cust.DeleteCust(custID);
        }


    }
}
