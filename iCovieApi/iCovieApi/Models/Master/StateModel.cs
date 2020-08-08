using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iCovieApi.Models
{
    public class StateModel
    {
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int id { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int companyid { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string companyname { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int countryid { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string countryname { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string statename { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string shortname { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int cid { get; set; }
    }
}