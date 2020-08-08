using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iCovieApi.Models
{
    public class SignupTermModel
    {


        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int id { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int signupid { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int isagreetermcondition { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int istempmemebership { get; set; }


        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int ispayfordocumentverification { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int cid { get; set; }
    }
}