using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.Data.SqlClient;
using System.Web.Configuration;
using System.Data;

using System.Text;


namespace kinarti.Models
{
    public class Filter
    {
        public int status { get; set; }
        public int customer_id { get; set; }
        public int minPrice { get; set; }
        public int maxPrice { get; set; }


    }
}
