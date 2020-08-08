using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace iCovieApi.Models
{
    public class GeoLocationModel
    {
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int id { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int buildingid { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string buildingname { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string geolocation { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string shortname { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int cid { get; set; }
    }
}