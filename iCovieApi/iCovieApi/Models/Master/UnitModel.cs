using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iCovieApi.Models
{
    public class UnitModel
    {
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int id { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int companyid { get; set; }

        
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int locationid { get; set; }

        
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int buildingid { get; set; }

        
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int floorid { get; set; }

        
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string shortname { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string locationname { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string buildingname { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string companyname { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string floorname { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string unitsname { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int bedcount { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string squarefeet { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public decimal price { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int cid { get; set; }

    }
}