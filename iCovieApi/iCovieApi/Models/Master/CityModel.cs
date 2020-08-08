using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iCovieApi.Models
{
    public class CityModel
    {
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int id { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int companyid { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string companyname { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int countryid { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string countryname { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int stateid { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string statename { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int timezoneid { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string timezonename { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string cityname { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string shortname { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string imagename { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string imagepath { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string showimagepath { get; set; }


        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int cid { get; set; }
    }
}