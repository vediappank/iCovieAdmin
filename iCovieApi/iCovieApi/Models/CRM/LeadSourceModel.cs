using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iCovieApi.Models
{
    public class LeadSourceModel
    {

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int id { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string lead_source_name { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int isactive { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int cuid { get; set; }
    }
}