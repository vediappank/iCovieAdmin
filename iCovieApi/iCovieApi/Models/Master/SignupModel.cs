using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iCovieApi.Models
{
    public class SignUpModel
    {
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int id { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string firstname { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string lastname { get; set; }


        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string emailid { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string profileimg { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int issubmitsigneddoc { get; set; }


        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int isapprovedmembersipdoc { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int isnotifyapprovalemailsms { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int cid { get; set; }
    }
}