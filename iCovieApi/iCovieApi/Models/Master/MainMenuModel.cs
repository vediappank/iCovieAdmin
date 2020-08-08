using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iCovieApi.Models
{
    public class MainMenuModel
    {
        public int menuId { get; set; }
        public int submenuId { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string title { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int privilegeid { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string privilegename { get; set; }
    }
}