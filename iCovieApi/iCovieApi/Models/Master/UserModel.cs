using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iCovieApi.Models
{
    public class UserModel
    {
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int id { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string membershipid { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int companyid { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int locationid { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int propertyid { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int roleid { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string password { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string confirmpassword { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string socialmedia { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string gender { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public DateTime dob { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string pancardno { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string pancardimagepath { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string aadharno { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string aadharimagepath { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string permenentaddress { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string permenentaddressimagepath { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int cityid { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int stateid { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int countryid { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string profileimg { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string firstname { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string lastname { get; set; }

      
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string email { get; set; }

      

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string username { get; set; }



        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int cid { get; set; }
    }
}