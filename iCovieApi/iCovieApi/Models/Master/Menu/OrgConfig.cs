using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iCovieApi.Models
{
   public class OrgConfig
    {
        public long orgId { get; set; }

        public int parentOrgId { get; set; }

        public int assignedOrg { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Organization { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public Boolean root { get; set; }
        public List<OrgItem> subOrg { get; set; }
        public OrgConfig()
        {
            this.subOrg = new List<OrgItem>();
        }
    }
 


    public class OrgItem
    {
        public long orgId { get; set; }

        public int parentOrgId { get; set; }

        public int assignedOrg { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Organization { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]     
        public Boolean root { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public List<OrgItem> subOrg { get; set; }

        
    }
}