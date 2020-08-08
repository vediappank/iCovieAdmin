using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iCovieApi.Models
{
    public class RoleModel
    {
        public int id { get; set; }
        public string RoleName { get; set; }
        public string RoleShortName { get; set; }
        //public bool Approver { get; set; }
        public List<MainMenuModel> permissions { get; set; }
        //public List<OrgModel> orgpermissions { get; set; }
        public string isCoreRole { get; set; }

        public Boolean isadmin { get; set; }

        public int privilegeid { get; set; }

        public int companyid { get; set; }

        public int locationid { get; set; }
        public int mainmenuid { get; set; }
        public int roleid { get; set; }
        public int mainmenumappingflag { get; set; }
    }
}