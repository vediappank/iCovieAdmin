using Newtonsoft.Json;
using System;
using System.Collections.Generic;


namespace iCovieApi.Models
{
    public class MenuConfig
    {
        public Header header { get; set; }

        public MenuConfig()
        {
            this.header = new Header();
        }
    }

    public class Header
    {
        public Self self { get; set; }
        public List<MenuItem> items { get; set; }

        public Header()
        {
            this.self = new Self();
            this.items = new List<MenuItem>();
        }
    }

    public class Self
    {

    }

    
    public class MenuItem
    {
        public int menuId { get; set; }

        public int parentMenuId { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string title { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string page { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public Boolean root { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string alignment { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string translate { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string toggle { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string bullet { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string icon { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string ReportsCategory { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public List<MenuItem> submenu { get; set; }
    }

}