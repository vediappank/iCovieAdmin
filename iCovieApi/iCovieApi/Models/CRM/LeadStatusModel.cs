using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iCovieApi.Models
{
    public class LeadStatusModel
    {

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int id { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string lead_status_name { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string lead_status_stage { get; set; }


        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public decimal lead_status_persentage { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int isactive { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string allowed_activity { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string allowed_followup_activity { get; set; }


        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int email_template_id { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int cuid { get; set; }
    }
}