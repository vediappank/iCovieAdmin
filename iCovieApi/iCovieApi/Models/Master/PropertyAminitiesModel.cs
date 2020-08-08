using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iCovieApi.Models
{
    public class PropertyAminitiesModel
    {
        //[JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        //public int id { get; set; }

        //[JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        //public int propertyid { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int aminitiesid { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int aminitiestypeid { get; set; }

        //[JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        //public int cid { get; set; }
    }
}