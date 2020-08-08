using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iCovieApi.Models
{
    public class EMailTemplateModel
    {
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int id { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string email_template_name { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string email_cc_roles { get; set; }


        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string email_contacts { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int isactive { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string email_bcc_roles { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int cuid { get; set; }
    }
}