using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iCovieApi.Models
{
    public class PrivilegeModel
    {
        public int menu_id { get; set; }

        public string menu_name { get; set; }

        public int privilege_id { get; set; }

        public string privilege_name { get; set; }

        public string privilege_description { get; set; }
    }
}