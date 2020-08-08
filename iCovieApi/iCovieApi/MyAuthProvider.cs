using iCovieApi.HelperClass;
using iCovieApi.Models;
using Microsoft.Owin.Security.OAuth;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;


namespace iCovieApi
{
    public class MyAuthProvider : OAuthAuthorizationServerProvider
    {
        private static readonly log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        public override async Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            context.Validated();
        }

        public override Task TokenEndpoint(OAuthTokenEndpointContext context)
        {
            //var userdata = ValidateLoginDetails(context.Identity.Claims.Contains<) ;


            //context.AdditionalResponseParameters.Add("IdentityName","data");
            //context.AdditionalResponseParameters.Add("IdentityName1", context.Identity.Label);



            foreach (Claim property in context.Identity.Claims)
            {
                context.AdditionalResponseParameters.Add(property.Type, property.Value);
            }

            return Task.FromResult<object>(null);

        }

        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            var identity = new ClaimsIdentity(context.Options.AuthenticationType);
            var userdata = ValidateLoginDetails(context.UserName, context.Password);
            if (userdata.id > 0)
            {
                // identity.AddClaim(new Claim(ClaimTypes.Role, userdata.cc_role_name));
                //identity.AddClaim(new Claim(ClaimTypes.Name, userdata.fullname));
                identity.AddClaim(new Claim("id", userdata.id.ToString()));
                identity.AddClaim(new Claim("username", userdata.username));
                identity.AddClaim(new Claim("password", userdata.password));
                identity.AddClaim(new Claim("email", userdata.email));
                identity.AddClaim(new Claim("roleid", userdata.roleid.ToString()));
                identity.AddClaim(new Claim("role_name", userdata.rolename.ToString()));
                identity.AddClaim(new Claim("cityid", userdata.cityid.ToString()));
                identity.AddClaim(new Claim("stateid", userdata.stateid.ToString()));

               identity.AddClaim(new Claim("fullname", userdata.fullname));
                identity.AddClaim(new Claim("profile_img", userdata.profile_img));
                identity.AddClaim(new Claim("companyid", userdata.companyid.ToString()));
                identity.AddClaim(new Claim("locationid", userdata.locationid.ToString()));
                identity.AddClaim(new Claim("isadmin", userdata.isadmin.ToString()));
                identity.AddClaim(new Claim("issuperadmin", userdata.issuperadmin.ToString()));
               // identity.AddClaim(new Claim("mobile", userdata.mobile.ToString()));
                // var dateCulture = CultureInfo.CreateSpecificCulture("en-US");

                // identity.AddClaim(new Claim("IssuedUtc", DateTime.Now.ToString("dddd, dd MMMM yyyy HH:mm:ss", dateCulture)));
                // identity.AddClaim(new Claim("ExpiresUtc", DateTime.Now.AddMinutes(1).ToString("dddd, dd MMMM yyyy HH:mm:ss", dateCulture)));
                context.Validated(identity);
            }
            else
            {
                context.SetError("invalid_grant", "Provided username and password is incorrect");
                context.Rejected();
            }
        }

        public CustomTokenModel ValidateLoginDetails(string UserName, string Password)
        {
            DataTable dtData = null;
            SqlDataAdapter adapter = null;
            CustomTokenModel ObjuserModel = new CustomTokenModel();
            try
            {
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };
                    SqlCommand cmd = new SqlCommand("SP_CHECK_LOGIN", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@i_login_id", UserName);
                    cmd.Parameters.AddWithValue("@i_password", Password);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    adapter = new SqlDataAdapter(cmd);
                    dtData = new DataTable();
                    adapter.Fill(dtData);
                    string errorCode = outErrorCode.Value.ToString();
                    string errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("ValidateLogin Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, ValidateLogin Records returned-{0}", dtData != null ? dtData.Rows.Count : 0);
                    if (dtData.Rows.Count > 0)
                    {
                        ObjuserModel.id = Convert.ToInt32(dtData.Rows[0]["id"].ToString());
                        ObjuserModel.username = dtData.Rows[0]["username"].ToString();
                        ObjuserModel.password = dtData.Rows[0]["password"].ToString();
                        ObjuserModel.email = dtData.Rows[0]["email"].ToString();
                        ObjuserModel.roleid = Convert.ToInt32(dtData.Rows[0]["role_id"]);
                        ObjuserModel.rolename = dtData.Rows[0]["role_name"].ToString();
                        ObjuserModel.fullname = dtData.Rows[0]["first_name"].ToString();
                        ObjuserModel.cityid = StringUtil.getInt(dtData.Rows[0]["cityid"].ToString());
                        ObjuserModel.stateid = StringUtil.getInt(dtData.Rows[0]["stateid"].ToString());
                        
                        // ObjuserModel.cc_name = dtData.Rows[0]["cc_name"].ToString();                     
                        // ObjuserModel.cc_role_name = dtData.Rows[0]["cc_role_name"].ToString();
                        ObjuserModel.profile_img = dtData.Rows[0]["profile_img"].ToString();
                        ObjuserModel.companyid = Convert.ToInt32(dtData.Rows[0]["companyid"].ToString());
                        ObjuserModel.locationid = Convert.ToInt32(dtData.Rows[0]["locationid"].ToString());
                        ObjuserModel.isadmin = Convert.ToBoolean(dtData.Rows[0]["isadmin"].ToString());
                        ObjuserModel.issuperadmin = Convert.ToBoolean(dtData.Rows[0]["issuperadmin"].ToString());
                        // ObjuserModel.Approver = Convert.ToBoolean(dtData.Rows[0]["Approver"].ToString());
                       // ObjuserModel.mobile = dtData.Rows[0]["mobile"].ToString();
                    }
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in GetUserRoles method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return ObjuserModel;
        }

    }
}