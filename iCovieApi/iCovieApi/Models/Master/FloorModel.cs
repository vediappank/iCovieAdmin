using iCovieApi.Models.Master;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iCovieApi.Models
{
    public class FloorModel
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
        public int cid { get; set; }

        public List<FloorBuildingModel> floorcheckedlist { get; set; }

    }
}