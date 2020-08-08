using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iCovieApi.Models
{
    public class CustomTokenModel
    {
        public int id { get; set; }
        public string username { get; set; }
        public string password { get; set; }
        public string email { get; set; }
        public string expires_in { get; set; }
        public string token_type { get; set; }
        public string refreshToken { get; set; }
        public int userroleid { get; set; }
        public int useractivityid { get; set; }
        public int usersupervisorid { get; set; }
        public int userccroleid { get; set; }

        public int usercompanyid { get; set; }

        public int userlocationid { get; set; }
        public int roleid { get; set; }
        public int cityid { get; set; }
        public int stateid { get; set; }
        public int ccroleid { get; set; }
        public string fullname { get; set; }
        public string firstname { get; set; }
        public string lastname { get; set; }
        public int callcenterid { get; set; }
        public string contactno { get; set; }
        public int activityid { get; set; }




        public string rolename { get; set; }




        public int companyid { get; set; }

        public int locationid { get; set; }
        public string profile_img { get; set; }

        public string companyname { get; set; }
        public string locationname { get; set; }

        public bool isadmin { get; set; }


        public bool issuperadmin { get; set; }
        public string mobile { get; set; }

    }
}