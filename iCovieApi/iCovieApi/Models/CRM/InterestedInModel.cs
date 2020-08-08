using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iCovieApi.Models
{
    public class InterestedInModel
    {
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int id { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string property_name { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public decimal interested_pricing { get; set; }


        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string property_city { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int isactive { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string api_name { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int cuid { get; set; }
    }
}