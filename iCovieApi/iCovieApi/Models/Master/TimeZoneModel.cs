using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iCovieApi.Models
{
    public class TimeZoneModel
    {
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int id { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string timezone { get; set; }      

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int cid { get; set; }
    }
}