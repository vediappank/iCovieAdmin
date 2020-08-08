using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace iCovieApi.Models
{
    public class MenuTreeConfig
    {
        public List<MenuItems> items { get; set; }
        public MenuTreeConfig()
        {
            this.items = new List<MenuItems>();
        }
    }

    public class MenuItems
    {
        public int menuId { get; set; }

        public int parentMenuId { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string title { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string page { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int privilegeid { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public Boolean root { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string privilegename { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int privilege_option { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public List<MenuItems> submenu { get; set; }
    }

}