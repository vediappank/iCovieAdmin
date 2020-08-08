using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iCovieApi.Models
{
    public class CompanyModel
    {
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int id { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int cityid { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string cityname { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string shortname { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string address1 { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string address2 { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string pincode { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string companyname { get; set; }        

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int cid { get; set; }

        
    }
}