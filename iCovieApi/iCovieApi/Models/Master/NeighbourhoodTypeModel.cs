
using System;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iCovieApi.Models
{
    public class NeighbourhoodTypeModel
    {
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int id { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int neighbourhoodcategoryid { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string neighbourhoodcategory { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string neighbourhoodtype { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int order { get; set; }


        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int cid { get; set; }
    }
}