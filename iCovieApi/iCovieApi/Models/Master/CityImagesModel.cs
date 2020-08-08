using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iCovieApi.Models
{
    public class CityImagesModel
    {
        //[JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        //public int id { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int cityid { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string imagename { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string imagepath { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string showimagepath { get; set; }

        //[JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        //public int cid { get; set; }
    }
}