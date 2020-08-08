
using System;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iCovieApi.Models
{
    public class AminitiesNeighbourhoodModel
    {
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int id { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int aminitiesid { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Aminitiesname { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int aminitiestypeid { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Aminitiestypename { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string AminitiesNeighbourhoodname { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int order { get; set; }


        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int cid { get; set; }
    }
}