using System;

using System;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iCovieApi.Models
{
    public class BedTypeModel
    {
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int id { get; set; }
        
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string bedtype { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string shortname { get; set; }


        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int cid { get; set; }
    }
}