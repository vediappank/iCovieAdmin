using System;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iCovieApi.Models
{
    public class AminitiesTypeModel
    {
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int id { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int aminitiesid { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string aminitiesname { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string aminitiestype { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string aminitiesimage { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string shortname { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int order { get; set; }


        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int cid { get; set; }
    }
}