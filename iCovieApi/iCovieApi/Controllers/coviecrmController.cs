using iCovieApi.HelperClass;
using iCovieApi.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace iCovieApi.Controllers
{
    public class coviecrmController : ApiController
    {
        private static readonly log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        #region "Company"
        [HttpGet]
        [ActionName("GetAllCompany")]
        public List<CompanyModel> GetAllCompany(int cityID)
        {
            DataTable dtData = null;
            List<CompanyModel> mItems = new List<CompanyModel>();
            CompanyModel mItem = null;
            SqlDataAdapter adapter = null;
            string jsonData = string.Empty;
            try
            {
                log.DebugFormat("Retrieving GetAllCompany ");
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };
                    SqlCommand cmd = new SqlCommand("SP_GET_ALL_MCOMPANY", con);
                    cmd.Parameters.AddWithValue("@I_CITYID", cityID);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    adapter = new SqlDataAdapter(cmd);
                    dtData = new DataTable();
                    adapter.Fill(dtData);
                    if (dtData.Rows.Count > 0)
                    {
                        mItems = new List<CompanyModel>();
                        for (int i = 0; i < dtData.Rows.Count; i++)
                        {
                            var vals = dtData.Rows[i].ItemArray;
                            mItem = new CompanyModel
                            {
                                cityid = StringUtil.getInt(vals[0].ToString()),
                                cityname = StringUtil.nullIfEmpty(vals[1].ToString()),
                                id = StringUtil.getInt(vals[2].ToString()),
                                companyname = StringUtil.nullIfEmpty(vals[3].ToString()),
                                shortname = StringUtil.nullIfEmpty(vals[4].ToString()),
                                address1 = StringUtil.nullIfEmpty(vals[5].ToString()),
                                address2 = StringUtil.nullIfEmpty(vals[6].ToString()),
                                pincode = StringUtil.nullIfEmpty(vals[7].ToString())
                            };
                            mItems.Add(mItem);
                        }
                    }

                    string errorCode = outErrorCode.Value.ToString();
                    string errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("GetAllCompany Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, GetAllCompany Records returned-{0}", dtData != null ? dtData.Rows.Count : 0);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in GetAllCompany method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return mItems;
        }

        [HttpPost]
        [ActionName("InsertCompany")]
        public HttpResponseMessage InsertCompany(CompanyModel company)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Insert Company");
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MCOMPANY_INSERT", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", company.id);
                    cmd.Parameters.AddWithValue("@I_COMPANYNAME", company.companyname);
                    cmd.Parameters.AddWithValue("@I_SHORTNAME", company.shortname);
                    cmd.Parameters.AddWithValue("@I_CID", company.cid);
                    cmd.Parameters.AddWithValue("@I_CITYID", company.cityid);
                    cmd.Parameters.AddWithValue("@I_ADDRESS1", company.address1);
                    cmd.Parameters.AddWithValue("@I_ADDRESS2", company.address2);
                    cmd.Parameters.AddWithValue("@I_PINCODE", company.pincode);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Insert company Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Insert company Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in InsertUsers method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpPost]
        [ActionName("UpdateCompany")]
        public HttpResponseMessage UpdateCompany(CompanyModel company)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Update Company ");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MCOMPANY_UPDATE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", company.id);
                    cmd.Parameters.AddWithValue("@I_COMPANYNAME", company.companyname);
                    cmd.Parameters.AddWithValue("@I_SHORTNAME", company.shortname);
                    cmd.Parameters.AddWithValue("@I_CID", company.cid);
                    cmd.Parameters.AddWithValue("@I_CITYID", company.cityid);
                    cmd.Parameters.AddWithValue("@I_ADDRESS1", company.address1);
                    cmd.Parameters.AddWithValue("@I_ADDRESS2", company.address2);
                    cmd.Parameters.AddWithValue("@I_PINCODE", company.pincode);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Update company Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Update company Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in Update company method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpGet]
        [ActionName("DeleteCompany")]
        public HttpResponseMessage DeleteCompany(int CompanyID)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Delete Company");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_COMPANY_DELETE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", CompanyID);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Delete company Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Delete company Records returned-{0}", errorDesc);
                    log.Info("Delete records Data:::" + CompanyID);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in DeleteRole method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }
        #endregion

        #region "Region"
        [HttpGet]
        [ActionName("GetAllRegion")]
        public List<RegionModel> GetAllRegion()
        {
            DataTable dtData = null;
            List<RegionModel> mItems = new List<RegionModel>();
            RegionModel mItem = null;
            SqlDataAdapter adapter = null;
            string jsonData = string.Empty;
            try
            {
                log.DebugFormat("Retrieving GetAllRegion ");
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };
                    SqlCommand cmd = new SqlCommand("SP_GET_ALL_MREGION", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    adapter = new SqlDataAdapter(cmd);
                    dtData = new DataTable();
                    adapter.Fill(dtData);
                    if (dtData.Rows.Count > 0)
                    {
                        mItems = new List<RegionModel>();
                        for (int i = 0; i < dtData.Rows.Count; i++)
                        {
                            var vals = dtData.Rows[i].ItemArray;
                            mItem = new RegionModel
                            {
                                countryid = StringUtil.getInt(vals[0].ToString()),
                                countryname = StringUtil.nullIfEmpty(vals[1].ToString()),
                                id = StringUtil.getInt(vals[2].ToString()),
                                regionname = StringUtil.nullIfEmpty(vals[3].ToString()),
                                shortname = StringUtil.nullIfEmpty(vals[4].ToString())

                            };
                            mItems.Add(mItem);
                        }
                    }

                    string errorCode = outErrorCode.Value.ToString();
                    string errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("GetAllRegion Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, GetAllRegion Records returned-{0}", dtData != null ? dtData.Rows.Count : 0);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in GetAllRegion method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return mItems;
        }

        [HttpPost]
        [ActionName("InsertRegion")]
        public HttpResponseMessage InsertRegion(RegionModel Region)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Insert Region");
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MREGION_INSERT", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", Region.id);
                    cmd.Parameters.AddWithValue("@I_COUNTRYID", Region.countryid);
                    cmd.Parameters.AddWithValue("@I_REGION", Region.regionname);
                    cmd.Parameters.AddWithValue("@I_SHORTNAME", Region.shortname);
                    cmd.Parameters.AddWithValue("@I_CID", Region.cid);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Insert REGION Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Insert REGION Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in InsertUsers method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpPost]
        [ActionName("UpdateRegion")]
        public HttpResponseMessage UpdateRegion(RegionModel Region)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Update Region ");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MREGION_UPDATE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", Region.id);
                    cmd.Parameters.AddWithValue("@I_COUNTRYID", Region.countryid);
                    cmd.Parameters.AddWithValue("@I_REGION", Region.regionname);
                    cmd.Parameters.AddWithValue("@I_SHORTNAME", Region.shortname);
                    cmd.Parameters.AddWithValue("@I_CID", Region.cid);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Update REGION Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Update REGION Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in Update REGION method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpGet]
        [ActionName("DeleteRegion")]
        public HttpResponseMessage DeleteRegion(int RegionID)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Delete Region");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_REGION_DELETE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", RegionID);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Delete REGION Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Delete REGION Records returned-{0}", errorDesc);
                    log.Info("Delete records Data:::" + RegionID);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in DeleteRole method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }
        #endregion

        #region "Country"
        [HttpGet]
        [ActionName("GetAllCountry")]
        public List<CountryModel> GetAllCountry()
        {
            DataTable dtData = null;
            List<CountryModel> mItems = new List<CountryModel>();
            CountryModel mItem = null;
            SqlDataAdapter adapter = null;
            string jsonData = string.Empty;
            try
            {
                log.DebugFormat("Retrieving GetAllCountry ");
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };
                    SqlCommand cmd = new SqlCommand("SP_GET_ALL_MCOUNTRY", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    adapter = new SqlDataAdapter(cmd);
                    dtData = new DataTable();
                    adapter.Fill(dtData);
                    if (dtData.Rows.Count > 0)
                    {
                        mItems = new List<CountryModel>();
                        for (int i = 0; i < dtData.Rows.Count; i++)
                        {
                            var vals = dtData.Rows[i].ItemArray;
                            mItem = new CountryModel
                            {
                                companyid = StringUtil.getInt(vals[0].ToString()),
                                companyname = StringUtil.nullIfEmpty(vals[1].ToString()),
                                id = StringUtil.getInt(vals[2].ToString()),
                                countryname = StringUtil.nullIfEmpty(vals[3].ToString()),
                                shortname = StringUtil.nullIfEmpty(vals[4].ToString())

                            };
                            mItems.Add(mItem);
                        }
                    }

                    string errorCode = outErrorCode.Value.ToString();
                    string errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("GetAllCountry Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, GetAllCountry Records returned-{0}", dtData != null ? dtData.Rows.Count : 0);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in GetAllCountry method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return mItems;
        }

        [HttpPost]
        [ActionName("InsertCountry")]
        public HttpResponseMessage InsertCountry(CountryModel company)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Insert Country");
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MCOUNTRY_INSERT", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", company.id);
                    cmd.Parameters.AddWithValue("@I_COMPANYID", company.companyid);
                    cmd.Parameters.AddWithValue("@I_COUNTRY", company.countryname);
                    cmd.Parameters.AddWithValue("@I_SHORTNAME", company.shortname);
                    cmd.Parameters.AddWithValue("@I_CID", company.cid);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Insert company Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Insert country Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in InsertUsers method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpPost]
        [ActionName("UpdateCountry")]
        public HttpResponseMessage UpdateCountry(CountryModel company)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Update Country ");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MCOUNTRY_UPDATE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", company.id);
                    cmd.Parameters.AddWithValue("@I_COMPANYID", company.companyid);
                    cmd.Parameters.AddWithValue("@I_COUNTRY", company.countryname);
                    cmd.Parameters.AddWithValue("@I_SHORTNAME", company.shortname);
                    cmd.Parameters.AddWithValue("@I_CID", company.cid);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Update country Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Update company Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in Update country method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpGet]
        [ActionName("DeleteCountry")]
        public HttpResponseMessage DeleteCountry(int CountryID)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Delete Country");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MCOUNTRY_DELETE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", CountryID);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Delete country Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Delete country Records returned-{0}", errorDesc);
                    log.Info("Delete records Data:::" + CountryID);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in DeleteRole method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }
        #endregion

        #region "State"
        [HttpGet]
        [ActionName("GetAllState")]
        public List<StateModel> GetAllState()
        {
            DataTable dtData = null;
            List<StateModel> mItems = new List<StateModel>();
            StateModel mItem = null;
            SqlDataAdapter adapter = null;
            string jsonData = string.Empty;
            try
            {
                log.DebugFormat("Retrieving GetAllState ");
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };
                    SqlCommand cmd = new SqlCommand("SP_GET_ALL_MSTATE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    adapter = new SqlDataAdapter(cmd);
                    dtData = new DataTable();
                    adapter.Fill(dtData);
                    if (dtData.Rows.Count > 0)
                    {
                        mItems = new List<StateModel>();
                        for (int i = 0; i < dtData.Rows.Count; i++)
                        {
                            var vals = dtData.Rows[i].ItemArray;
                            mItem = new StateModel
                            {
                                countryid = StringUtil.getInt(vals[0].ToString()),
                                countryname = StringUtil.nullIfEmpty(vals[1].ToString()),
                                id = StringUtil.getInt(vals[2].ToString()),
                                statename = StringUtil.nullIfEmpty(vals[3].ToString()),
                                shortname = StringUtil.nullIfEmpty(vals[4].ToString())

                            };
                            mItems.Add(mItem);
                        }
                    }

                    string errorCode = outErrorCode.Value.ToString();
                    string errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("GetAllState Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, GetAllState Records returned-{0}", dtData != null ? dtData.Rows.Count : 0);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in GetAllState method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return mItems;
        }

        [HttpPost]
        [ActionName("InsertState")]
        public HttpResponseMessage InsertState(StateModel State)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Insert State");
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MSTATE_INSERT", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", State.id);
                    cmd.Parameters.AddWithValue("@I_COUNTRYID", State.countryid);
                    cmd.Parameters.AddWithValue("@I_STATE", State.statename);
                    cmd.Parameters.AddWithValue("@I_SHORTNAME", State.shortname);
                    cmd.Parameters.AddWithValue("@I_CID", State.cid);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Insert State Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Insert State Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in InsertState method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpPost]
        [ActionName("UpdateState")]
        public HttpResponseMessage UpdateState(StateModel State)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Update State ");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MSTATE_UPDATE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", State.id);
                    cmd.Parameters.AddWithValue("@I_COUNTRYID", State.countryid);
                    cmd.Parameters.AddWithValue("@I_STATE", State.statename);
                    cmd.Parameters.AddWithValue("@I_SHORTNAME", State.shortname);
                    cmd.Parameters.AddWithValue("@I_CID", State.cid);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Update State Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Update State Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in Update State method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpGet]
        [ActionName("DeleteState")]
        public HttpResponseMessage DeleteState(int StateID)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Delete State");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MSTATE_DELETE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", StateID);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Delete State Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Delete State Records returned-{0}", errorDesc);
                    log.Info("Delete records Data:::" + StateID);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in DeleteState method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }
        #endregion

        #region "TimeZone"
        [HttpGet]
        [ActionName("GetAllTimeZone")]
        public List<TimeZoneModel> GetAllTimeZone()
        {
            DataTable dtData = null;
            List<TimeZoneModel> mItems = new List<TimeZoneModel>();
            TimeZoneModel mItem = null;
            SqlDataAdapter adapter = null;
            string jsonData = string.Empty;
            try
            {
                log.DebugFormat("Retrieving GetAllTimeZone ");
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };
                    SqlCommand cmd = new SqlCommand("SP_GET_ALL_MTIMEZONE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    adapter = new SqlDataAdapter(cmd);
                    dtData = new DataTable();
                    adapter.Fill(dtData);
                    if (dtData.Rows.Count > 0)
                    {
                        mItems = new List<TimeZoneModel>();
                        for (int i = 0; i < dtData.Rows.Count; i++)
                        {
                            var vals = dtData.Rows[i].ItemArray;
                            mItem = new TimeZoneModel
                            {
                                id = StringUtil.getInt(vals[0].ToString()),
                                timezone = StringUtil.nullIfEmpty(vals[1].ToString()),
                                //shortname = StringUtil.nullIfEmpty(vals[2].ToString())

                            };
                            mItems.Add(mItem);
                        }
                    }

                    string errorCode = outErrorCode.Value.ToString();
                    string errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("GetAllTimeZone Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, GetAllTimeZone Records returned-{0}", dtData != null ? dtData.Rows.Count : 0);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in GetAllTimeZone method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return mItems;
        }

        [HttpPost]
        [ActionName("InsertTimeZone")]
        public HttpResponseMessage InsertTimeZone(TimeZoneModel TimeZone)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Insert TimeZone");
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MTIMEZONE_INSERT", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    // cmd.Parameters.AddWithValue("@I_ID", TimeZone.id);                    
                    cmd.Parameters.AddWithValue("@I_TIMEZONE", TimeZone.timezone);

                    cmd.Parameters.AddWithValue("@I_CID", TimeZone.cid);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Insert TimeZone Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Insert TimeZone Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in InsertTimeZone method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpPost]
        [ActionName("UpdateTimeZone")]
        public HttpResponseMessage UpdateTimeZone(TimeZoneModel TimeZone)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Update TimeZone ");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MTIMEZONE_UPDATE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", TimeZone.id);
                    cmd.Parameters.AddWithValue("@I_TIMEZONE", TimeZone.timezone);

                    cmd.Parameters.AddWithValue("@I_CID", TimeZone.cid);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Update TimeZone Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Update TimeZone Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in Update TimeZone method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpGet]
        [ActionName("DeleteTimeZone")]
        public HttpResponseMessage DeleteTimeZone(int TimeZoneID)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Delete TimeZone");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MTIMEZONE_DELETE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", TimeZoneID);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Delete TimeZone Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Delete TimeZone Records returned-{0}", errorDesc);
                    log.Info("Delete records Data:::" + TimeZoneID);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in DeleteTimeZone method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }
        #endregion

        #region "City"
        [HttpGet]
        [ActionName("GetAllCity")]
        public List<CityModel> GetAllCity()
        {
            DataTable dtData = null;
            List<CityModel> mItems = new List<CityModel>();
            CityModel mItem = null;
            SqlDataAdapter adapter = null;
            string jsonData = string.Empty;
            try
            {
                log.DebugFormat("Retrieving GetAllCity ");
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };
                    SqlCommand cmd = new SqlCommand("SP_GET_ALL_MCITY", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    adapter = new SqlDataAdapter(cmd);
                    dtData = new DataTable();
                    adapter.Fill(dtData);
                    if (dtData.Rows.Count > 0)
                    {
                        mItems = new List<CityModel>();
                        for (int i = 0; i < dtData.Rows.Count; i++)
                        {
                            var vals = dtData.Rows[i].ItemArray;
                            mItem = new CityModel
                            {
                                countryid = StringUtil.getInt(vals[0].ToString()),
                                countryname = StringUtil.nullIfEmpty(vals[1].ToString()),
                                stateid = StringUtil.getInt(vals[2].ToString()),
                                statename = StringUtil.nullIfEmpty(vals[3].ToString()),
                                timezoneid = StringUtil.getInt(vals[4].ToString()),
                                timezonename = StringUtil.nullIfEmpty(vals[5].ToString()),
                                id = StringUtil.getInt(vals[6].ToString()),
                                cityname = StringUtil.nullIfEmpty(vals[7].ToString()),
                                shortname = StringUtil.nullIfEmpty(vals[8].ToString())
                            };
                            mItems.Add(mItem);
                        }
                    }

                    string errorCode = outErrorCode.Value.ToString();
                    string errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("GetAllCity Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, GetAllCity Records returned-{0}", dtData != null ? dtData.Rows.Count : 0);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in GetAllCity method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return mItems;
        }

        [HttpPost]
        [ActionName("InsertCity")]
        public HttpResponseMessage InsertCity(CityModel City)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Insert City");
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MCITY_INSERT", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", City.id);
                    cmd.Parameters.AddWithValue("@I_COUNTRYID", City.countryid);
                    cmd.Parameters.AddWithValue("@I_STATEID", City.stateid);
                    cmd.Parameters.AddWithValue("@I_TIMEZONEID", City.timezoneid);
                    cmd.Parameters.AddWithValue("@I_CITY", City.cityname);
                    cmd.Parameters.AddWithValue("@I_SHORTNAME", City.shortname);
                    cmd.Parameters.AddWithValue("@I_CID", City.cid);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Insert City Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Insert City Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in Insert City method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpPost]
        [ActionName("UpdateCity")]
        public HttpResponseMessage UpdateCity(CityModel City)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Update City ");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MCITY_UPDATE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", City.id);
                    cmd.Parameters.AddWithValue("@I_COUNTRYID", City.countryid);
                    cmd.Parameters.AddWithValue("@I_STATEID", City.stateid);
                    cmd.Parameters.AddWithValue("@I_TIMEZONEID", City.timezoneid);
                    cmd.Parameters.AddWithValue("@I_CITY", City.cityname);
                    cmd.Parameters.AddWithValue("@I_SHORTNAME", City.shortname);
                    cmd.Parameters.AddWithValue("@I_CID", City.cid);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Update City Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Update City Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in Update City method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpGet]
        [ActionName("DeleteCity")]
        public HttpResponseMessage DeleteCity(int CityID)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Delete City");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MCITY_DELETE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", CityID);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Delete City Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Delete City Records returned-{0}", errorDesc);
                    log.Info("Delete records Data:::" + CityID);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in Delete City method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }
        #endregion

        #region "Location"
        [HttpGet]
        [ActionName("GetAllLocation")]
        public List<LocationModel> GetAllLocation()
        {
            DataTable dtData = null;
            List<LocationModel> mItems = new List<LocationModel>();
            LocationModel mItem = null;
            SqlDataAdapter adapter = null;
            string jsonData = string.Empty;
            try
            {
                log.DebugFormat("Retrieving GetAllLocation ");
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };
                    SqlCommand cmd = new SqlCommand("SP_GET_ALL_MLOCATION", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    adapter = new SqlDataAdapter(cmd);
                    dtData = new DataTable();
                    adapter.Fill(dtData);
                    if (dtData.Rows.Count > 0)
                    {
                        mItems = new List<LocationModel>();
                        for (int i = 0; i < dtData.Rows.Count; i++)
                        {
                            var vals = dtData.Rows[i].ItemArray;
                            mItem = new LocationModel
                            {
                                companyid = StringUtil.getInt(vals[0].ToString()),
                                companyname = StringUtil.nullIfEmpty(vals[1].ToString()),
                                companyids = StringUtil.nullIfEmpty(vals[0].ToString()),
                                id = StringUtil.getInt(vals[2].ToString()),
                                locationname = StringUtil.nullIfEmpty(vals[3].ToString()),
                                shortname = StringUtil.nullIfEmpty(vals[4].ToString())

                            };
                            mItems.Add(mItem);
                        }
                    }

                    string errorCode = outErrorCode.Value.ToString();
                    string errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("GetAllLocation Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, GetAllLocation Records returned-{0}", dtData != null ? dtData.Rows.Count : 0);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in Get AllLocation method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return mItems;
        }

        [HttpPost]
        [ActionName("InsertLocation")]
        public HttpResponseMessage InsertLocation(LocationModel Location)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Insert Location");
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MLOCATION_INSERT", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", Location.id);
                    cmd.Parameters.AddWithValue("@I_COMPANYID", Location.companyid);
                    cmd.Parameters.AddWithValue("@I_LOCATION", Location.locationname);
                    cmd.Parameters.AddWithValue("@I_SHORTNAME", Location.shortname);
                    cmd.Parameters.AddWithValue("@I_CID", Location.cid);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Insert Location Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Insert Location Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in Insert Location method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpPost]
        [ActionName("UpdateLocation")]
        public HttpResponseMessage UpdateLocation(LocationModel Location)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Update Location ");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MLOCATION_UPDATE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", Location.id);
                    cmd.Parameters.AddWithValue("@I_COMPANYID", Location.companyid);
                    cmd.Parameters.AddWithValue("@I_LOCATION", Location.locationname);
                    cmd.Parameters.AddWithValue("@I_SHORTNAME", Location.shortname);
                    cmd.Parameters.AddWithValue("@I_CID", Location.cid);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Update Location Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Update Location Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in Update Location method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpGet]
        [ActionName("DeleteLocation")]
        public HttpResponseMessage DeleteLocation(int LocationID)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Delete Location");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MLocation_DELETE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", LocationID);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Delete Location Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Delete Location Records returned-{0}", errorDesc);
                    log.Info("Delete records Data:::" + LocationID);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in Delete Location method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }
        #endregion

        #region "Building"
        [HttpPost]
        [ActionName("InsertBuilding")]
        public HttpResponseMessage InsertBuilding(BuildingModel Building)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Insert Building");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MBuilding_INSERT", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", Building.id);
                    cmd.Parameters.AddWithValue("@i_CompanyID", Building.companyid);
                    cmd.Parameters.AddWithValue("@I_LOCATIONID", Building.locationid);
                    cmd.Parameters.AddWithValue("@I_BUILDING", Building.buildingname);
                    //cmd.Parameters.AddWithValue("@I_BUILDINGNAME", Building.buildingimage == null ? string.Empty: Building.buildingimage);
                    cmd.Parameters.AddWithValue("@I_SHORTNAME", Building.shortname);
                    cmd.Parameters.AddWithValue("@I_CID", Building.cid);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Insert Building Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Insert Building Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in InsertUsers method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }

            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpPost]
        [ActionName("UpdateBuilding")]
        public HttpResponseMessage UpdateBuilding(BuildingModel Building)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Update Building ");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MBuilding_UPDATE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", Building.id);
                    cmd.Parameters.AddWithValue("@i_CompanyID", Building.companyid);
                    cmd.Parameters.AddWithValue("@I_LOCATIONID", Building.locationid);
                    cmd.Parameters.AddWithValue("@I_BUILDING", Building.buildingname);
                    //                    cmd.Parameters.AddWithValue("@I_BUILDINGNAME", Building.buildingimage == null ? string.Empty : Building.buildingimage);
                    cmd.Parameters.AddWithValue("@I_SHORTNAME", Building.shortname);
                    cmd.Parameters.AddWithValue("@I_CID", Building.cid);

                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Update Building Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Update Building Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in Update Building method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }

            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpGet]
        [ActionName("DeleteBuilding")]
        public HttpResponseMessage DeleteBuilding(int BuildingID)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Delete Building");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MBuilding_DELETE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@ID", BuildingID);

                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Delete Building Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Delete Building Records returned-{0}", errorDesc);
                    log.Info("Delete records Data:::" + BuildingID);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in DeleteRole method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpGet]
        [ActionName("GetAllBuilding")]
        public List<BuildingModel> GetAllBuilding()
        {
            DataTable dtData = null;

            List<BuildingModel> mItems = new List<BuildingModel>();
            BuildingModel mItem = null;
            SqlDataAdapter adapter = null;
            string jsonData = string.Empty;
            try
            {
                log.DebugFormat("Retrieving GetAllBuilding ");
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };
                    SqlCommand cmd = new SqlCommand("SP_GET_ALL_BUILDING", con);
                    //cmd.Parameters.AddWithValue("@i_CompanyID", companyid);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    adapter = new SqlDataAdapter(cmd);
                    dtData = new DataTable();
                    adapter.Fill(dtData);
                    if (dtData.Rows.Count > 0)
                    {
                        mItems = new List<BuildingModel>();
                        for (int i = 0; i < dtData.Rows.Count; i++)
                        {
                            var vals = dtData.Rows[i].ItemArray;
                            mItem = new BuildingModel
                            {
                                companyid = StringUtil.getInt(vals[0].ToString()),
                                companyname = StringUtil.nullIfEmpty(vals[1].ToString()),
                                locationid = StringUtil.getInt(vals[2].ToString()),
                                locationname = StringUtil.nullIfEmpty(vals[3].ToString()),
                                id = StringUtil.getInt(vals[4].ToString()),
                                buildingname = StringUtil.nullIfEmpty(vals[5].ToString()),
                                shortname = StringUtil.nullIfEmpty(vals[6].ToString())
                            };
                            mItems.Add(mItem);
                        }
                    }

                    string errorCode = outErrorCode.Value.ToString();
                    string errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("GetAllBuilding Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, GetAllBuilding Records returned-{0}", dtData != null ? dtData.Rows.Count : 0);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in GetAllBuilding method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }

            return mItems;
        }
        #endregion

        #region "GeoLocation"
        [HttpGet]
        [ActionName("GetAllGeoLocation")]
        public List<GeoLocationModel> GetAllGeoLocation()
        {
            DataTable dtData = null;
            List<GeoLocationModel> mItems = new List<GeoLocationModel>();
            GeoLocationModel mItem = null;
            SqlDataAdapter adapter = null;
            string jsonData = string.Empty;
            try
            {
                log.DebugFormat("Retrieving GetAllGeoLocation ");
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };
                    SqlCommand cmd = new SqlCommand("SP_GET_ALL_STATE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    adapter = new SqlDataAdapter(cmd);
                    dtData = new DataTable();
                    adapter.Fill(dtData);
                    if (dtData.Rows.Count > 0)
                    {
                        mItems = new List<GeoLocationModel>();
                        for (int i = 0; i < dtData.Rows.Count; i++)
                        {
                            var vals = dtData.Rows[i].ItemArray;
                            mItem = new GeoLocationModel
                            {
                                buildingid = StringUtil.getInt(vals[0].ToString()),
                                buildingname = StringUtil.nullIfEmpty(vals[1].ToString()),
                                id = StringUtil.getInt(vals[2].ToString()),
                                geolocation = StringUtil.nullIfEmpty(vals[3].ToString()),
                                shortname = StringUtil.nullIfEmpty(vals[4].ToString())

                            };
                            mItems.Add(mItem);
                        }
                    }

                    string errorCode = outErrorCode.Value.ToString();
                    string errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("GetAllGeoLocation Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, GetAllGeoLocation Records returned-{0}", dtData != null ? dtData.Rows.Count : 0);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in GetAllGeoLocation method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return mItems;
        }

        [HttpPost]
        [ActionName("InsertGeoLocation")]
        public HttpResponseMessage InsertGeoLocation(GeoLocationModel GeoLocation)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Insert GeoLocation");
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_GEOLOCATION_INSERT", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", GeoLocation.id);
                    cmd.Parameters.AddWithValue("@I_BUILDINGID", GeoLocation.buildingid);
                    cmd.Parameters.AddWithValue("@I_GEOLOCATION", GeoLocation.geolocation);
                    cmd.Parameters.AddWithValue("@I_SHORTNAME", GeoLocation.shortname);
                    cmd.Parameters.AddWithValue("@I_CID", GeoLocation.cid);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Insert GeoLocation Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Insert GeoLocation Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in InsertGeoLocation method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpPost]
        [ActionName("UpdateGeoLocation")]
        public HttpResponseMessage UpdateGeoLocation(GeoLocationModel GeoLocation)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Update GeoLocation ");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_GEOLOCATION_UPDATE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", GeoLocation.id);
                    cmd.Parameters.AddWithValue("@I_BUILDINGID", GeoLocation.buildingid);
                    cmd.Parameters.AddWithValue("@I_GEOLOCATION", GeoLocation.geolocation);
                    cmd.Parameters.AddWithValue("@I_SHORTNAME", GeoLocation.shortname);
                    cmd.Parameters.AddWithValue("@I_CID", GeoLocation.cid);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Update GeoLocation Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Update GeoLocation Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in Update GeoLocation method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpGet]
        [ActionName("DeleteGeoLocation")]
        public HttpResponseMessage DeleteGeoLocation(int GeoLocationID)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Delete GeoLocation");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_GEOLOCATION_DELETE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", GeoLocationID);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Delete GeoLocation Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Delete GeoLocation Records returned-{0}", errorDesc);
                    log.Info("Delete records Data:::" + GeoLocationID);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in DeleteGeoLocation method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }
        #endregion

        #region "Floor"

        [HttpPost]
        [ActionName("InsertFloor")]
        public HttpResponseMessage InsertFloor(FloorModel Floor)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Insert Floor");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MFloor_INSERT", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", Floor.id);
                    cmd.Parameters.AddWithValue("@I_CompanyID", Floor.companyid);
                    cmd.Parameters.AddWithValue("@I_LocationID", Floor.locationid);
                    cmd.Parameters.AddWithValue("@I_BuildingID", Floor.buildingid);
                    cmd.Parameters.AddWithValue("@I_FloorName", Floor.floorname);
                    cmd.Parameters.AddWithValue("@I_SHORTNAME", Floor.shortname);
                    cmd.Parameters.AddWithValue("@I_CID", Floor.cid);


                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Insert Floor Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Insert Floor Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in InsertUsers method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }

            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpPost]
        [ActionName("UpdateFloor")]
        public HttpResponseMessage UpdateFloor(FloorModel Floor)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Update Floor ");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MFloor_UPDATE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", Floor.id);
                    cmd.Parameters.AddWithValue("@I_CompanyID", Floor.companyid);
                    cmd.Parameters.AddWithValue("@I_LocationID", Floor.locationid);
                    cmd.Parameters.AddWithValue("@I_BuildingID", Floor.buildingid);
                    cmd.Parameters.AddWithValue("@I_FloorName", Floor.floorname);
                    cmd.Parameters.AddWithValue("@I_SHORTNAME", Floor.shortname);
                    cmd.Parameters.AddWithValue("@I_CID", Floor.cid);

                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Update Floor Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Update Floor Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in Update Floor method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }

            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpGet]
        [ActionName("DeleteFloor")]
        public HttpResponseMessage DeleteFloor(int FloorID)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Delete Floor");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MFloor_DELETE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", FloorID);

                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Delete Floor Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Delete Floor Records returned-{0}", errorDesc);
                    log.Info("Delete records Data:::" + FloorID);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in DeleteRole method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpGet]
        [ActionName("GetAllFloor")]
        public List<FloorModel> GetAllFloor()
        {
            DataTable dtData = null;
            FloorModel objMenuConfig = null;
            List<FloorModel> mItems = new List<FloorModel>();
            FloorModel mItem = null;
            SqlDataAdapter adapter = null;
            string jsonData = string.Empty;
            try
            {
                log.DebugFormat("Retrieving GetAllFloor ");
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };
                    SqlCommand cmd = new SqlCommand("SP_GET_ALL_MFloor", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    adapter = new SqlDataAdapter(cmd);
                    dtData = new DataTable();
                    adapter.Fill(dtData);
                    if (dtData.Rows.Count > 0)
                    {
                        mItems = new List<FloorModel>();
                        for (int i = 0; i < dtData.Rows.Count; i++)
                        {
                            var vals = dtData.Rows[i].ItemArray;
                            mItem = new FloorModel
                            {
                                companyid = StringUtil.getInt(vals[0].ToString()),
                                companyname = StringUtil.nullIfEmpty(vals[1].ToString()),
                                locationid = StringUtil.getInt(vals[2].ToString()),
                                locationname = StringUtil.nullIfEmpty(vals[3].ToString()),
                                buildingid = StringUtil.getInt(vals[4].ToString()),
                                buildingname = StringUtil.nullIfEmpty(vals[5].ToString()),
                                id = StringUtil.getInt(vals[6].ToString()),
                                floorname = StringUtil.nullIfEmpty(vals[7].ToString()),
                                shortname = StringUtil.nullIfEmpty(vals[8].ToString())
                            };
                            mItems.Add(mItem);
                        }
                    }

                    string errorCode = outErrorCode.Value.ToString();
                    string errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("GetAllFloor Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, GetAllFloor Records returned-{0}", dtData != null ? dtData.Rows.Count : 0);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in GetAllFloor method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }

            return mItems;
        }

        #endregion

        #region "Units"

        [HttpPost]
        [ActionName("InsertUnit")]
        public HttpResponseMessage InsertUnit(UnitModel Unit)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Insert Unit");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MUnit_INSERT", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_Units", Unit.unitsname);
                    cmd.Parameters.AddWithValue("@I_ShortName", Unit.shortname);
                    cmd.Parameters.AddWithValue("@I_CompanyID", Unit.companyid);
                    cmd.Parameters.AddWithValue("@I_LocationID", Unit.locationid);
                    cmd.Parameters.AddWithValue("@I_BuildingID", Unit.buildingid);
                    cmd.Parameters.AddWithValue("@I_FloorID", Unit.floorid);
                    cmd.Parameters.AddWithValue("@I_CID", Unit.cid);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Insert Unit Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Insert Unit Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in InsertUsers method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }

            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpPost]
        [ActionName("UpdateUnit")]
        public HttpResponseMessage UpdateUnit(UnitModel Unit)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Update Unit ");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MUnit_UPDATE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", Unit.id);
                    cmd.Parameters.AddWithValue("@I_Units", Unit.unitsname);
                    cmd.Parameters.AddWithValue("@I_ShortName", Unit.shortname);
                    cmd.Parameters.AddWithValue("@I_CompanyID", Unit.companyid);
                    cmd.Parameters.AddWithValue("@I_LocationID", Unit.locationid);
                    cmd.Parameters.AddWithValue("@I_BuildingID", Unit.buildingid);
                    cmd.Parameters.AddWithValue("@I_FloorID", Unit.floorid);
                    cmd.Parameters.AddWithValue("@I_CID", Unit.cid);


                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Update Unit Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Update Unit Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in Update Unit method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }

            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpGet]
        [ActionName("DeleteUnit")]
        public HttpResponseMessage DeleteUnit(int UnitID)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Delete Unit");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MUNIT_DELETE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_UNITID", UnitID);

                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Delete Unit Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Delete Unit Records returned-{0}", errorDesc);
                    log.Info("Delete records Data:::" + UnitID);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in DeleteRole method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpGet]
        [ActionName("GetAllUnit")]
        public List<UnitModel> GetAllUnit()
        {
            DataTable dtData = null;

            List<UnitModel> mItems = new List<UnitModel>();
            UnitModel mItem = null;
            SqlDataAdapter adapter = null;
            string jsonData = string.Empty;
            try
            {
                log.DebugFormat("Retrieving GetAllUnit ");
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };
                    SqlCommand cmd = new SqlCommand("SP_GET_ALL_MUnit", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    adapter = new SqlDataAdapter(cmd);
                    dtData = new DataTable();
                    adapter.Fill(dtData);
                    if (dtData.Rows.Count > 0)
                    {
                        mItems = new List<UnitModel>();
                        for (int i = 0; i < dtData.Rows.Count; i++)
                        {
                            var vals = dtData.Rows[i].ItemArray;
                            mItem = new UnitModel
                            {
                                companyid = StringUtil.getInt(vals[0].ToString()),
                                companyname = StringUtil.nullIfEmpty(vals[1].ToString()),
                                locationid = StringUtil.getInt(vals[2].ToString()),
                                locationname = StringUtil.nullIfEmpty(vals[3].ToString()),
                                buildingid = StringUtil.getInt(vals[4].ToString()),
                                buildingname = StringUtil.nullIfEmpty(vals[5].ToString()),
                                floorid = StringUtil.getInt(vals[6].ToString()),
                                floorname = StringUtil.nullIfEmpty(vals[7].ToString()),
                                id = StringUtil.getInt(vals[8].ToString()),
                                unitsname = StringUtil.nullIfEmpty(vals[9].ToString()),
                                shortname = StringUtil.nullIfEmpty(vals[10].ToString())
                            };
                            mItems.Add(mItem);
                        }
                    }

                    string errorCode = outErrorCode.Value.ToString();
                    string errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("GetAllUnit Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, GetAllUnit Records returned-{0}", dtData != null ? dtData.Rows.Count : 0);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in GetAllUnit method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }

            return mItems;
        }
        #endregion

        #region "Units_Type"
        [HttpGet]
        [ActionName("GetAllUnits_Type")]
        public List<UnitsTypeModel> GetAllUnits_Type()
        {
            DataTable dtData = null;
            List<UnitsTypeModel> mItems = new List<UnitsTypeModel>();
            UnitsTypeModel mItem = null;
            SqlDataAdapter adapter = null;
            string jsonData = string.Empty;
            try
            {
                log.DebugFormat("Retrieving GetAllUnits_Type ");
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };
                    SqlCommand cmd = new SqlCommand("SP_GET_ALL_MUNIT_TYPE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    adapter = new SqlDataAdapter(cmd);
                    dtData = new DataTable();
                    adapter.Fill(dtData);
                    if (dtData.Rows.Count > 0)
                    {
                        mItems = new List<UnitsTypeModel>();
                        for (int i = 0; i < dtData.Rows.Count; i++)
                        {
                            var vals = dtData.Rows[i].ItemArray;
                            mItem = new UnitsTypeModel
                            {
                                unitsid = StringUtil.getInt(vals[0].ToString()),
                                units = StringUtil.nullIfEmpty(vals[1].ToString()),
                                id = StringUtil.getInt(vals[2].ToString()),
                                unitstype = StringUtil.nullIfEmpty(vals[3].ToString())
                                // shortname = StringUtil.nullIfEmpty(vals[4].ToString())

                            };
                            mItems.Add(mItem);
                        }
                    }

                    string errorCode = outErrorCode.Value.ToString();
                    string errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("GetAllUnits_Type Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, GetAllUnits_Type Records returned-{0}", dtData != null ? dtData.Rows.Count : 0);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in GetAllUnits_Type method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return mItems;
        }

        [HttpPost]
        [ActionName("InsertUnits_Type")]
        public HttpResponseMessage InsertUnits_Type(UnitsTypeModel Units_Type)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Insert Units_Type");
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MUNIT_TYPE_INSERT", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    //cmd.Parameters.AddWithValue("@I_ID", Units_Type.id);
                    cmd.Parameters.AddWithValue("@I_UNITID", Units_Type.unitsid);
                    cmd.Parameters.AddWithValue("@I_Units_Type", Units_Type.unitstype);
                    //cmd.Parameters.AddWithValue("@I_SHORTNAME", Units_Type.shortname);
                    cmd.Parameters.AddWithValue("@I_CID", Units_Type.cid);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Insert Units_Type Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Insert Units_Type Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in InsertUnits_Type method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpPost]
        [ActionName("UpdateUnits_Type")]
        public HttpResponseMessage UpdateUnits_Type(UnitsTypeModel Units_Type)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Update Units_Type ");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MUNIT_TYPE_UPDATE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", Units_Type.id);
                    cmd.Parameters.AddWithValue("@I_UNITID", Units_Type.unitsid);
                    cmd.Parameters.AddWithValue("@I_UNITTYPE", Units_Type.unitstype);
                    //cmd.Parameters.AddWithValue("@I_SHORTNAME", Units_Type.shortname);
                    cmd.Parameters.AddWithValue("@I_CID", Units_Type.cid);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Update Units_Type Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Update Units_Type Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in Update Units_Type method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpGet]
        [ActionName("DeleteUnits_Type")]
        public HttpResponseMessage DeleteUnits_Type(int Units_TypeID)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Delete Units_Type");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MUNIT_TYPE_DELETE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", Units_TypeID);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Delete Units_Type Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Delete Units_Type Records returned-{0}", errorDesc);
                    log.Info("Delete records Data:::" + Units_TypeID);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in DeleteUnits_Type method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }
        #endregion

        #region "Aminities"
        [HttpGet]
        [ActionName("GetAllAminities")]
        public List<AminitiesModel> GetAllAminities()
        {
            DataTable dtData = null;
            List<AminitiesModel> mItems = new List<AminitiesModel>();
            AminitiesModel mItem = null;
            SqlDataAdapter adapter = null;
            string jsonData = string.Empty;
            try
            {
                log.DebugFormat("Retrieving GetAllAminities ");
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };
                    SqlCommand cmd = new SqlCommand("SP_GET_ALL_MAMINITIES", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    adapter = new SqlDataAdapter(cmd);
                    dtData = new DataTable();
                    adapter.Fill(dtData);
                    if (dtData.Rows.Count > 0)
                    {
                        mItems = new List<AminitiesModel>();
                        for (int i = 0; i < dtData.Rows.Count; i++)
                        {
                            var vals = dtData.Rows[i].ItemArray;
                            mItem = new AminitiesModel
                            {

                                id = StringUtil.getInt(vals[0].ToString()),
                                aminities = StringUtil.nullIfEmpty(vals[1].ToString()),
                                shortname = StringUtil.nullIfEmpty(vals[2].ToString())

                            };
                            mItems.Add(mItem);
                        }
                    }

                    string errorCode = outErrorCode.Value.ToString();
                    string errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("GetAllAminities Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, GetAllAminities Records returned-{0}", dtData != null ? dtData.Rows.Count : 0);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in GetAllAminities method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return mItems;
        }

        [HttpPost]
        [ActionName("InsertAminities")]
        public HttpResponseMessage InsertAminities(AminitiesModel Aminities)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Insert Aminities");
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MAMINITIES_INSERT", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", Aminities.id);
                    cmd.Parameters.AddWithValue("@I_AMINITIES", Aminities.aminities);
                    // cmd.Parameters.AddWithValue("@I_SHORTNAME", Aminities.shortname);
                    cmd.Parameters.AddWithValue("@I_CID", Aminities.cid);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Insert Aminities Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Insert Aminities Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in InsertAminities method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpPost]
        [ActionName("UpdateAminities")]
        public HttpResponseMessage UpdateAminities(AminitiesModel Aminities)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Update Aminities ");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MAMINITIES_UPDATE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", Aminities.id);
                    cmd.Parameters.AddWithValue("@I_AMINITIES", Aminities.aminities);
                    //cmd.Parameters.AddWithValue("@I_SHORTNAME", Aminities.shortname);
                    cmd.Parameters.AddWithValue("@I_CID", Aminities.cid);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Update Aminities Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Update Aminities Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in Update Aminities method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpGet]
        [ActionName("DeleteAminities")]
        public HttpResponseMessage DeleteAminities(int AminitiesID)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Delete Aminities");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MAMINITIES_DELETE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", AminitiesID);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Delete Aminities Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Delete Aminities Records returned-{0}", errorDesc);
                    log.Info("Delete records Data:::" + AminitiesID);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in DeleteAminities method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }
        #endregion

        #region "AminitiesType"
        [HttpGet]
        [ActionName("GetAllAminitiesType")]
        public List<AminitiesTypeModel> GetAllAminitiesType()
        {
            DataTable dtData = null;
            List<AminitiesTypeModel> mItems = new List<AminitiesTypeModel>();
            AminitiesTypeModel mItem = null;
            SqlDataAdapter adapter = null;
            string jsonData = string.Empty;
            try
            {
                log.DebugFormat("Retrieving GetAllAminitiesType ");
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };
                    SqlCommand cmd = new SqlCommand("SP_GET_ALL_MAMINITIES_TYPE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    adapter = new SqlDataAdapter(cmd);
                    dtData = new DataTable();
                    adapter.Fill(dtData);
                    if (dtData.Rows.Count > 0)
                    {
                        mItems = new List<AminitiesTypeModel>();
                        for (int i = 0; i < dtData.Rows.Count; i++)
                        {
                            var vals = dtData.Rows[i].ItemArray;
                            mItem = new AminitiesTypeModel
                            {
                                aminitiesid = StringUtil.getInt(vals[0].ToString()),
                                aminitiesname = StringUtil.nullIfEmpty(vals[1].ToString()),
                                id = StringUtil.getInt(vals[2].ToString()),
                                aminitiestype = StringUtil.nullIfEmpty(vals[3].ToString()),
                                aminitiesimage = StringUtil.nullIfEmpty(vals[4].ToString())


                            };
                            mItems.Add(mItem);
                        }
                    }

                    string errorCode = outErrorCode.Value.ToString();
                    string errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("GetAllAminitiesType Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, GetAllAminitiesType Records returned-{0}", dtData != null ? dtData.Rows.Count : 0);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in GetAllAminitiesType method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return mItems;
        }

        [HttpPost]
        [ActionName("InsertAminitiesType")]
        public HttpResponseMessage InsertAminitiesType(AminitiesTypeModel AminitiesType)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Insert AminitiesType");
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MAMINITIES_TYPE_INSERT", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", AminitiesType.id);
                    cmd.Parameters.AddWithValue("@I_AMINITIESID", AminitiesType.aminitiesid);
                    cmd.Parameters.AddWithValue("@I_AMINITIES_TYPE", AminitiesType.aminitiestype);
                    cmd.Parameters.AddWithValue("@I_Image", AminitiesType.aminitiesimage == null ? string.Empty : AminitiesType.aminitiesimage);

                    cmd.Parameters.AddWithValue("@I_CID", AminitiesType.cid);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Insert AminitiesType Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Insert AminitiesType Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in InsertAminitiesType method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpPost]
        [ActionName("UpdateAminitiesType")]
        public HttpResponseMessage UpdateAminitiesType(AminitiesTypeModel AminitiesType)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Update AminitiesType ");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MAMINITIES_TYPE_UPDATE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", AminitiesType.id);
                    cmd.Parameters.AddWithValue("@I_AMINITIESID", AminitiesType.aminitiesid);
                    cmd.Parameters.AddWithValue("@I_AMINITIES_TYPE", AminitiesType.aminitiestype);
                    cmd.Parameters.AddWithValue("@I_Image", AminitiesType.aminitiesimage == null ? string.Empty : AminitiesType.aminitiesimage);

                    cmd.Parameters.AddWithValue("@I_CID", AminitiesType.cid);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Update AminitiesType Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Update AminitiesType Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in Update AminitiesType method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpGet]
        [ActionName("DeleteAminitiesType")]
        public HttpResponseMessage DeleteAminitiesType(int AminitiesTypeID)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Delete AminitiesType");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_AMINITIES_TYPE_DELETE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", AminitiesTypeID);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Delete AminitiesType Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Delete AminitiesType Records returned-{0}", errorDesc);
                    log.Info("Delete records Data:::" + AminitiesTypeID);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in DeleteAminitiesType method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }
        #endregion

        #region "Neighbourhood_Type"
        [HttpGet]
        [ActionName("GetAllNeighbourhoodType")]
        public List<NeighbourhoodTypeModel> GetAllNeighbourhoodType()
        {
            DataTable dtData = null;
            List<NeighbourhoodTypeModel> mItems = new List<NeighbourhoodTypeModel>();
            NeighbourhoodTypeModel mItem = null;
            SqlDataAdapter adapter = null;
            string jsonData = string.Empty;
            try
            {
                log.DebugFormat("Retrieving GetAllNeighbourhoodType");
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };
                    SqlCommand cmd = new SqlCommand("SP_GET_ALL_MNEIGHBOURHOOD_TYPE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    adapter = new SqlDataAdapter(cmd);
                    dtData = new DataTable();
                    adapter.Fill(dtData);
                    if (dtData.Rows.Count > 0)
                    {
                        mItems = new List<NeighbourhoodTypeModel>();
                        for (int i = 0; i < dtData.Rows.Count; i++)
                        {
                            var vals = dtData.Rows[i].ItemArray;
                            mItem = new NeighbourhoodTypeModel
                            {
                                neighbourhoodcategoryid = StringUtil.getInt(vals[0].ToString()),
                                neighbourhoodcategory = StringUtil.nullIfEmpty(vals[1].ToString()),
                                id = StringUtil.getInt(vals[2].ToString()),
                                neighbourhoodtype = StringUtil.nullIfEmpty(vals[3].ToString())
                            };
                            mItems.Add(mItem);
                        }
                    }

                    string errorCode = outErrorCode.Value.ToString();
                    string errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("GetAllNeighbourhoodType Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, GetAllNeighbourhoodType Records returned-{0}", dtData != null ? dtData.Rows.Count : 0);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in GetAllNeighbourhoodType method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return mItems;
        }

        [HttpPost]
        [ActionName("InsertNeighbourhoodType")]
        public HttpResponseMessage InsertNeighbourhoodType(NeighbourhoodTypeModel InsertNeighbourhoodType)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Insert InsertNeighbourhoodType");
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MNEIGHBOURHOOD_TYPE_INSERT", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", InsertNeighbourhoodType.id);
                    cmd.Parameters.AddWithValue("@I_NEIGHBOURHOODcategoryID", InsertNeighbourhoodType.neighbourhoodcategoryid);
                    cmd.Parameters.AddWithValue("@I_NEIGHBOURHOOD", InsertNeighbourhoodType.neighbourhoodtype);

                    cmd.Parameters.AddWithValue("@I_CID", InsertNeighbourhoodType.cid);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Insert AminitiesNeighbourhood Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Insert AminitiesNeighbourhood Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in InsertAminitiesNeighbourhood method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpPost]
        [ActionName("UpdateNeighbourhoodType")]
        public HttpResponseMessage UpdateNeighbourhoodType(NeighbourhoodTypeModel UpdateNeighbourhoodType)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Update AminitiesNeighbourhood ");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MNEIGHBOURHOOD_TYPE_UPDATE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", UpdateNeighbourhoodType.id);
                    cmd.Parameters.AddWithValue("@I_NEIGHBOURHOODcategoryID", UpdateNeighbourhoodType.neighbourhoodcategoryid);
                    cmd.Parameters.AddWithValue("@I_NEIGHBOURHOOD", UpdateNeighbourhoodType.neighbourhoodtype);

                    cmd.Parameters.AddWithValue("@I_CID", UpdateNeighbourhoodType.cid);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Update UpdateNeighbourhoodType Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Update UpdateNeighbourhoodType Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in Update UpdateNeighbourhoodType method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpGet]
        [ActionName("DeleteNeighbourhoodType")]
        public HttpResponseMessage DeleteNeighbourhoodType(int AminitiesNeighbourhoodID)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving DeleteNeighbourhoodType");
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MNEIGHBOURHOOD_TYPE_DELETE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@ID", AminitiesNeighbourhoodID);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Delete DeleteNeighbourhoodType Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Delete DeleteNeighbourhoodType Records returned-{0}", errorDesc);
                    log.Info("Delete records Data:::" + AminitiesNeighbourhoodID);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in DeleteNeighbourhoodType method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }
        #endregion

        #region "NegihbourhoodCategory"
        [HttpGet]
        [ActionName("GetAllNeighbourhood_category")]
        public List<NeighbourhoodCategoryModel> GetAllNeighbourhood_category()
        {
            DataTable dtData = null;
            List<NeighbourhoodCategoryModel> mItems = new List<NeighbourhoodCategoryModel>();
            NeighbourhoodCategoryModel mItem = null;
            SqlDataAdapter adapter = null;
            string jsonData = string.Empty;
            try
            {
                log.DebugFormat("Retrieving GetAllNeighbourhood_category ");
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };
                    SqlCommand cmd = new SqlCommand("SP_GET_ALL_MNEIGHBOURHOOD_CATEGORY", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    adapter = new SqlDataAdapter(cmd);
                    dtData = new DataTable();
                    adapter.Fill(dtData);
                    if (dtData.Rows.Count > 0)
                    {
                        mItems = new List<NeighbourhoodCategoryModel>();
                        for (int i = 0; i < dtData.Rows.Count; i++)
                        {
                            var vals = dtData.Rows[i].ItemArray;
                            mItem = new NeighbourhoodCategoryModel
                            {
                                id = StringUtil.getInt(vals[0].ToString()),
                                neighbourhoodcategory = StringUtil.nullIfEmpty(vals[1].ToString())


                            };
                            mItems.Add(mItem);
                        }
                    }

                    string errorCode = outErrorCode.Value.ToString();
                    string errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("GetAllNeighbourhood_category Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, GetAllNeighbourhood_category Records returned-{0}", dtData != null ? dtData.Rows.Count : 0);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in GetAllNeighbourhood_category method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return mItems;
        }

        [HttpPost]
        [ActionName("InsertNeighbourhood_category")]
        public HttpResponseMessage InsertNeighbourhood_category(NeighbourhoodCategoryModel Neighbourhood_category)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Insert Neighbourhood_category");
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MNEIGHBOURHOOD_CATEGORY_INSERT", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", Neighbourhood_category.id);
                    cmd.Parameters.AddWithValue("@I_neigbourhoodcategory", Neighbourhood_category.neighbourhoodcategory);
                    // cmd.Parameters.AddWithValue("@I_SHORTNAME", Neighbourhood_category.shortname);
                    cmd.Parameters.AddWithValue("@I_CID", Neighbourhood_category.cid);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Insert Neighbourhood_category Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Insert Neighbourhood_category Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in InsertNeighbourhood_category method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpPost]
        [ActionName("UpdateNeighbourhood_category")]
        public HttpResponseMessage UpdateNeighbourhood_category(NeighbourhoodCategoryModel Neighbourhood_category)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Update Neighbourhood_category ");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MNEIGHBOURHOOD_CATEGORY_UPDATE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", Neighbourhood_category.id);
                    cmd.Parameters.AddWithValue("@I_neigbourhoodcategory", Neighbourhood_category.neighbourhoodcategory);
                    //cmd.Parameters.AddWithValue("@I_SHORTNAME", Neighbourhood_category.shortname);
                    cmd.Parameters.AddWithValue("@I_CID", Neighbourhood_category.cid);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Update Neighbourhood_category Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Update Neighbourhood_category Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in Update Neighbourhood_category method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpGet]
        [ActionName("DeleteNeighbourhood_category")]
        public HttpResponseMessage DeleteNeighbourhood_category(int Neighbourhood_categoryID)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Delete Neighbourhood_category");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MNEIGHBOURHOOD_CATEGORY_DELETE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@ID", Neighbourhood_categoryID);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Delete Neighbourhood_category Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Delete Neighbourhood_category Records returned-{0}", errorDesc);
                    log.Info("Delete records Data:::" + Neighbourhood_categoryID);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in DeleteNeighbourhood_category method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }
        #endregion

        #region "BedType"
        [HttpGet]
        [ActionName("GetAllBedType")]
        public List<BedTypeModel> GetAllBedType()
        {
            DataTable dtData = null;
            List<BedTypeModel> mItems = new List<BedTypeModel>();
            BedTypeModel mItem = null;
            SqlDataAdapter adapter = null;
            string jsonData = string.Empty;
            try
            {
                log.DebugFormat("Retrieving GetAllBedType ");
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };
                    SqlCommand cmd = new SqlCommand("SP_GET_ALL_MBED_TYPE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    adapter = new SqlDataAdapter(cmd);
                    dtData = new DataTable();
                    adapter.Fill(dtData);
                    if (dtData.Rows.Count > 0)
                    {
                        mItems = new List<BedTypeModel>();
                        for (int i = 0; i < dtData.Rows.Count; i++)
                        {
                            var vals = dtData.Rows[i].ItemArray;
                            mItem = new BedTypeModel
                            {
                                id = StringUtil.getInt(vals[0].ToString()),
                                bedtype = StringUtil.nullIfEmpty(vals[1].ToString()),
                                shortname = StringUtil.nullIfEmpty(vals[2].ToString())

                            };
                            mItems.Add(mItem);
                        }
                    }

                    string errorCode = outErrorCode.Value.ToString();
                    string errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("GetAllBedType Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, GetAllBedType Records returned-{0}", dtData != null ? dtData.Rows.Count : 0);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in GetAllBedType method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return mItems;
        }

        [HttpPost]
        [ActionName("InsertBedType")]
        public HttpResponseMessage InsertBedType(BedTypeModel BedType)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Insert BedType");
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MBED_TYPE_INSERT", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", BedType.id);
                    cmd.Parameters.AddWithValue("@I_BEDTYPE", BedType.bedtype);
                    cmd.Parameters.AddWithValue("@I_CID", BedType.cid);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Insert BedType Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Insert BedType Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in InsertBedType method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpPost]
        [ActionName("UpdateBedType")]
        public HttpResponseMessage UpdateBedType(BedTypeModel BedType)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Update BedType ");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MBED_TYPE_UPDATE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", BedType.id);
                    cmd.Parameters.AddWithValue("@I_BEDTYPE", BedType.bedtype);

                    cmd.Parameters.AddWithValue("@I_CID", BedType.cid);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Update BedType Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Update BedType Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in Update BedType method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpGet]
        [ActionName("DeleteBedType")]
        public HttpResponseMessage DeleteBedType(int BedTypeID)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Delete BedType");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MBED_TYPE_DELETE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", BedTypeID);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Delete BedType Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Delete BedType Records returned-{0}", errorDesc);
                    log.Info("Delete records Data:::" + BedTypeID);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in DeleteBedType method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }
        #endregion

        #region "PropertyCategory"
        [HttpGet]
        [ActionName("GetAllPropertyCategory")]
        public List<PropertyCategoryModel> GetAllPropertyCategory()
        {
            DataTable dtData = null;
            List<PropertyCategoryModel> mItems = new List<PropertyCategoryModel>();
            PropertyCategoryModel mItem = null;
            SqlDataAdapter adapter = null;
            string jsonData = string.Empty;
            try
            {
                log.DebugFormat("Retrieving GetAllPropertyCategory ");
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };
                    SqlCommand cmd = new SqlCommand("SP_GET_ALL_MPROPERTY_CATEGORY", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    adapter = new SqlDataAdapter(cmd);
                    dtData = new DataTable();
                    adapter.Fill(dtData);
                    if (dtData.Rows.Count > 0)
                    {
                        mItems = new List<PropertyCategoryModel>();
                        for (int i = 0; i < dtData.Rows.Count; i++)
                        {
                            var vals = dtData.Rows[i].ItemArray;
                            mItem = new PropertyCategoryModel
                            {
                                id = StringUtil.getInt(vals[0].ToString()),
                                propertycategory = StringUtil.nullIfEmpty(vals[1].ToString()),
                                shortname = StringUtil.nullIfEmpty(vals[2].ToString())

                            };
                            mItems.Add(mItem);
                        }
                    }

                    string errorCode = outErrorCode.Value.ToString();
                    string errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("GetAllPropertyCategory Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, GetAllPropertyCategory Records returned-{0}", dtData != null ? dtData.Rows.Count : 0);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in GetAllPropertyCategory method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return mItems;
        }

        [HttpPost]
        [ActionName("InsertPropertyCategory")]
        public HttpResponseMessage InsertPropertyCategory(PropertyCategoryModel PropertyCategory)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Insert PropertyCategory");
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MPROPERTY_CATEGORY_INSERT", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", PropertyCategory.id);
                    cmd.Parameters.AddWithValue("@I_PROPERTYCATEGORY", PropertyCategory.propertycategory);
                    //cmd.Parameters.AddWithValue("@I_SHORTNAME", PropertyCategory.shortname);
                    cmd.Parameters.AddWithValue("@I_CID", PropertyCategory.cid);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Insert PropertyCategory Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Insert PropertyCategory Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in InsertPropertyCategory method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpPost]
        [ActionName("UpdatePropertyCategory")]
        public HttpResponseMessage UpdatePropertyCategory(PropertyCategoryModel PropertyCategory)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Update PropertyCategory ");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MPROPERTY_CATEGORY_UPDATE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", PropertyCategory.id);
                    cmd.Parameters.AddWithValue("@I_PROPERTYCATEGORY", PropertyCategory.propertycategory);
                    //cmd.Parameters.AddWithValue("@I_SHORTNAME", PropertyCategory.shortname);
                    cmd.Parameters.AddWithValue("@I_CID", PropertyCategory.cid);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Update PropertyCategory Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Update PropertyCategory Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in Update PropertyCategory method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpGet]
        [ActionName("DeletePropertyCategory")]
        public HttpResponseMessage DeletePropertyCategory(int PropertyCategoryID)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Delete PropertyCategory");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MPROPERTY_CATEGORY_DELETE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@ID", PropertyCategoryID);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Delete PropertyCategory Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Delete PropertyCategory Records returned-{0}", errorDesc);
                    log.Info("Delete records Data:::" + PropertyCategoryID);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in DeletePropertyCategory method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }
        #endregion

        #region "PropertyType"
        [HttpGet]
        [ActionName("GetAllPropertyType")]
        public List<PropertyTypeModel> GetAllPropertyType()
        {
            DataTable dtData = null;
            List<PropertyTypeModel> mItems = new List<PropertyTypeModel>();
            PropertyTypeModel mItem = null;
            SqlDataAdapter adapter = null;
            string jsonData = string.Empty;
            try
            {
                log.DebugFormat("Retrieving GetAllPropertyType ");
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };
                    SqlCommand cmd = new SqlCommand("SP_GET_ALL_MPROPERTY_TYPE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    adapter = new SqlDataAdapter(cmd);
                    dtData = new DataTable();
                    adapter.Fill(dtData);
                    if (dtData.Rows.Count > 0)
                    {
                        mItems = new List<PropertyTypeModel>();
                        for (int i = 0; i < dtData.Rows.Count; i++)
                        {
                            var vals = dtData.Rows[i].ItemArray;
                            mItem = new PropertyTypeModel
                            {
                                id = StringUtil.getInt(vals[0].ToString()),
                                propertytype = StringUtil.nullIfEmpty(vals[1].ToString()),
                                shortname = StringUtil.nullIfEmpty(vals[2].ToString())

                            };
                            mItems.Add(mItem);
                        }
                    }

                    string errorCode = outErrorCode.Value.ToString();
                    string errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("GetAllPropertyType Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, GetAllPropertyType Records returned-{0}", dtData != null ? dtData.Rows.Count : 0);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in GetAllPropertyType method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return mItems;
        }

        [HttpPost]
        [ActionName("InsertPropertyType")]
        public HttpResponseMessage InsertPropertyType(PropertyTypeModel PropertyType)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Insert PropertyType");
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MPROPERTY_TYPE_INSERT", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", PropertyType.id);
                    cmd.Parameters.AddWithValue("@I_PROPERTYTYPE", PropertyType.propertytype);
                    //cmd.Parameters.AddWithValue("@I_SHORTNAME", PropertyType.shortname);
                    cmd.Parameters.AddWithValue("@I_CID", PropertyType.cid);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Insert PropertyType Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Insert PropertyType Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in InsertPropertyType method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpPost]
        [ActionName("UpdatePropertyType")]
        public HttpResponseMessage UpdatePropertyType(PropertyTypeModel PropertyType)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Update PropertyType ");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MPROPERTY_TYPE_UPDATE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", PropertyType.id);
                    cmd.Parameters.AddWithValue("@I_PROPERTYTYPE", PropertyType.propertytype);
                    //cmd.Parameters.AddWithValue("@I_SHORTNAME", PropertyType.shortname);
                    cmd.Parameters.AddWithValue("@I_CID", PropertyType.cid);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Update PropertyType Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Update PropertyType Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in Update PropertyType method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpGet]
        [ActionName("DeletePropertyType")]
        public HttpResponseMessage DeletePropertyType(int PropertyTypeID)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Delete PropertyType");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MPROPERTY_TYPE_DELETE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@ID", PropertyTypeID);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Delete PropertyType Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Delete PropertyType Records returned-{0}", errorDesc);
                    log.Info("Delete records Data:::" + PropertyTypeID);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in DeletePropertyType method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }
        #endregion

        #region "GuestType"
        [HttpGet]
        [ActionName("GetAllGuestType")]
        public List<GuestTypeModel> GetAllGuestType()
        {
            DataTable dtData = null;
            List<GuestTypeModel> mItems = new List<GuestTypeModel>();
            GuestTypeModel mItem = null;
            SqlDataAdapter adapter = null;
            string jsonData = string.Empty;
            try
            {
                log.DebugFormat("Retrieving GetAllGuestType ");
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };
                    SqlCommand cmd = new SqlCommand("SP_GET_ALL_MGUEST_TYPE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    adapter = new SqlDataAdapter(cmd);
                    dtData = new DataTable();
                    adapter.Fill(dtData);
                    if (dtData.Rows.Count > 0)
                    {
                        mItems = new List<GuestTypeModel>();
                        for (int i = 0; i < dtData.Rows.Count; i++)
                        {
                            var vals = dtData.Rows[i].ItemArray;
                            mItem = new GuestTypeModel
                            {
                                id = StringUtil.getInt(vals[0].ToString()),
                                guesttype = StringUtil.nullIfEmpty(vals[1].ToString()),
                                shortname = StringUtil.nullIfEmpty(vals[2].ToString())

                            };
                            mItems.Add(mItem);
                        }
                    }

                    string errorCode = outErrorCode.Value.ToString();
                    string errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("GetAllGuestType Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, GetAllGuestType Records returned-{0}", dtData != null ? dtData.Rows.Count : 0);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in GetAllGuestType method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return mItems;
        }

        [HttpPost]
        [ActionName("InsertGuestType")]
        public HttpResponseMessage InsertGuestType(GuestTypeModel GuestType)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Insert GuestType");
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MGUEST_TYPE_INSERT", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", GuestType.id);
                    cmd.Parameters.AddWithValue("@I_GUESTTYPE", GuestType.guesttype);
                    //cmd.Parameters.AddWithValue("@I_SHORTNAME", GuestType.shortname);
                    cmd.Parameters.AddWithValue("@I_CID", GuestType.cid);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Insert GuestType Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Insert GuestType Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in InsertGuestType method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpPost]
        [ActionName("UpdateGuestType")]
        public HttpResponseMessage UpdateGuestType(GuestTypeModel GuestType)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Update GuestType ");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MGUEST_TYPE_UPDATE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", GuestType.id);
                    cmd.Parameters.AddWithValue("@I_GUESTTYPE", GuestType.guesttype);
                    //cmd.Parameters.AddWithValue("@I_SHORTNAME", GuestType.shortname);
                    cmd.Parameters.AddWithValue("@I_CID", GuestType.cid);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Update GuestType Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Update GuestType Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in Update GuestType method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpGet]
        [ActionName("DeleteGuestType")]
        public HttpResponseMessage DeleteGuestType(int GuestTypeID)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Delete GuestType");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MGUEST_TYPE_DELETE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@ID", GuestTypeID);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Delete GuestType Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Delete GuestType Records returned-{0}", errorDesc);
                    log.Info("Delete records Data:::" + GuestTypeID);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in DeleteGuestType method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }
        #endregion

        #region "BusinessCategory"
        [HttpGet]
        [ActionName("GetAllBusinessCategory")]
        public List<BusinessCategoryModel> GetAllBusinessCategory()
        {
            DataTable dtData = null;
            List<BusinessCategoryModel> mItems = new List<BusinessCategoryModel>();
            BusinessCategoryModel mItem = null;
            SqlDataAdapter adapter = null;
            string jsonData = string.Empty;
            try
            {
                log.DebugFormat("Retrieving GetAllBusinessCategory ");
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };
                    SqlCommand cmd = new SqlCommand("SP_GET_ALL_MBUSINESS_CATEGORY", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    adapter = new SqlDataAdapter(cmd);
                    dtData = new DataTable();
                    adapter.Fill(dtData);
                    if (dtData.Rows.Count > 0)
                    {
                        mItems = new List<BusinessCategoryModel>();
                        for (int i = 0; i < dtData.Rows.Count; i++)
                        {
                            var vals = dtData.Rows[i].ItemArray;
                            mItem = new BusinessCategoryModel
                            {
                                id = StringUtil.getInt(vals[0].ToString()),
                                businesscategory = StringUtil.nullIfEmpty(vals[1].ToString()),
                                shortname = StringUtil.nullIfEmpty(vals[2].ToString())

                            };
                            mItems.Add(mItem);
                        }
                    }

                    string errorCode = outErrorCode.Value.ToString();
                    string errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("GetAllBusinessCategory Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, GetAllBusinessCategory Records returned-{0}", dtData != null ? dtData.Rows.Count : 0);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in GetAllBusinessCategory method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return mItems;
        }

        [HttpPost]
        [ActionName("InsertBusinessCategory")]
        public HttpResponseMessage InsertBusinessCategory(BusinessCategoryModel BusinessCategory)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Insert BusinessCategory");
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MBUSINESS_CATEGORY_INSERT", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", BusinessCategory.id);
                    cmd.Parameters.AddWithValue("@I_BUSINESSCATEGORY", BusinessCategory.businesscategory);
                    // cmd.Parameters.AddWithValue("@I_SHORTNAME", BusinessCategory.shortname);
                    cmd.Parameters.AddWithValue("@I_CID", BusinessCategory.cid);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Insert BusinessCategory Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Insert BusinessCategory Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in InsertBusinessCategory method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpPost]
        [ActionName("UpdateBusinessCategory")]
        public HttpResponseMessage UpdateBusinessCategory(BusinessCategoryModel BusinessCategory)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Update BusinessCategory ");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MBUSINESS_CATEGORY_UPDATE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", BusinessCategory.id);
                    cmd.Parameters.AddWithValue("@I_BUSINESSCATEGORY", BusinessCategory.businesscategory);
                    //cmd.Parameters.AddWithValue("@I_SHORTNAME", BusinessCategory.shortname);
                    cmd.Parameters.AddWithValue("@I_CID", BusinessCategory.cid);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Update BusinessCategory Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Update BusinessCategory Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in Update BusinessCategory method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpGet]
        [ActionName("DeleteBusinessCategory")]
        public HttpResponseMessage DeleteBusinessCategory(int BusinessCategoryID)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Delete BusinessCategory");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MBUSINESS_CATEGORY_DELETE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@ID", BusinessCategoryID);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Delete BusinessCategory Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Delete BusinessCategory Records returned-{0}", errorDesc);
                    log.Info("Delete records Data:::" + BusinessCategoryID);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in DeleteBusinessCategory method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }
        #endregion

        #region "Property"
        [HttpGet]
        [ActionName("GetAllProperty")]
        public List<PropertyModel> GetAllProperty()
        {
            DataTable dtData = null;
            List<PropertyModel> mItems = new List<PropertyModel>();
            PropertyModel mItem = null;
            SqlDataAdapter adapter = null;
            string jsonData = string.Empty;
            try
            {
                log.DebugFormat("Retrieving GetAllProperty ");
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };
                    SqlCommand cmd = new SqlCommand("SP_GET_ALL_MPROPERTY", con);

                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    adapter = new SqlDataAdapter(cmd);
                    dtData = new DataTable();
                    adapter.Fill(dtData);
                    if (dtData.Rows.Count > 0)
                    {
                        mItems = new List<PropertyModel>();
                        for (int i = 0; i < dtData.Rows.Count; i++)
                        {
                            var vals = dtData.Rows[i].ItemArray;
                            mItem = new PropertyModel
                            {
                                companyid = StringUtil.getInt(vals[0].ToString()),
                                companyname = StringUtil.nullIfEmpty(vals[1].ToString()),
                                locationid = StringUtil.getInt(vals[2].ToString()),
                                locationname = StringUtil.nullIfEmpty(vals[3].ToString()),
                                buildingid = StringUtil.getInt(vals[4].ToString()),
                                buildingname = StringUtil.nullIfEmpty(vals[5].ToString()),
                                floorid = StringUtil.getInt(vals[6].ToString()),
                                floorname = StringUtil.nullIfEmpty(vals[7].ToString()),
                                unitsid = StringUtil.getInt(vals[8].ToString()),
                                unitname = StringUtil.nullIfEmpty(vals[9].ToString()),
                                address = StringUtil.nullIfEmpty(vals[10].ToString()),
                                noofbeds = StringUtil.nullIfEmpty(vals[11].ToString()),
                                noofboths = StringUtil.nullIfEmpty(vals[12].ToString()),
                                sqft = StringUtil.getDecimal(vals[13].ToString()),
                                cost = StringUtil.getDecimal(vals[14].ToString()),
                                facilitymangerid = StringUtil.getInt(vals[15].ToString()),
                                facilityuserid = StringUtil.getInt(vals[16].ToString()),
                                communitymangerid = StringUtil.getInt(vals[17].ToString()),
                                communityuserid = StringUtil.getInt(vals[18].ToString()),
                                pincode = StringUtil.nullIfEmpty(vals[19].ToString()),
                                description = StringUtil.nullIfEmpty(vals[20].ToString()),
                                coordinates = StringUtil.getDecimal(vals[21].ToString()),
                                pricing = StringUtil.getDecimal(vals[22].ToString()),
                                phoneno1 = StringUtil.nullIfEmpty(vals[23].ToString()),
                                phoneno2 = StringUtil.nullIfEmpty(vals[24].ToString()),
                                phoneno3 = StringUtil.nullIfEmpty(vals[25].ToString()),
                                id = StringUtil.getInt(vals[26].ToString()),
                                AminitsTypeList = GetAllPropertyAminities(StringUtil.getInt(vals[26].ToString())),
                                ImagesList = GetAllPropertyImages(StringUtil.getInt(vals[26].ToString()))
                            };
                            mItems.Add(mItem);
                        }
                    }

                    string errorCode = outErrorCode.Value.ToString();
                    string errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("GetAllProperty Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, GetAllProperty Records returned-{0}", dtData != null ? dtData.Rows.Count : 0);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in GetAllProperty method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return mItems;
        }

        [HttpPost]
        [ActionName("InsertProperty")]
        public int InsertProperty(PropertyModel Property)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Insert Property");
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MPROPERTY_INSERT", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", Property.id);
                    cmd.Parameters.AddWithValue("@I_COMPANYID", Property.companyid);
                    cmd.Parameters.AddWithValue("@I_LOCATIONID", Property.locationid);
                    cmd.Parameters.AddWithValue("@I_BUILDINGID", Property.buildingid);
                    cmd.Parameters.AddWithValue("@I_FLOORID", Property.floorid);
                    cmd.Parameters.AddWithValue("@I_UNITID", Property.unitsid);
                    cmd.Parameters.AddWithValue("@I_ADDRESS", Property.address);
                    cmd.Parameters.AddWithValue("@I_NOOFBEDS", Property.noofbeds);
                    cmd.Parameters.AddWithValue("@I_NOOFBOTHS", Property.noofboths);
                    cmd.Parameters.AddWithValue("@I_SQFT", Property.sqft);
                    cmd.Parameters.AddWithValue("@I_COST", Property.cost);
                    cmd.Parameters.AddWithValue("@I_FACILITYMANGERID", Property.facilitymangerid);
                    cmd.Parameters.AddWithValue("@I_FACILITYUSERID", Property.facilityuserid);
                    cmd.Parameters.AddWithValue("@I_COMMUNITYMANGERID", Property.communitymangerid);
                    cmd.Parameters.AddWithValue("@I_COMMUNITYUSERID", Property.communityuserid);
                    cmd.Parameters.AddWithValue("@I_PINCODE", Property.pincode);
                    cmd.Parameters.AddWithValue("@I_DESCRIPTION", Property.description);
                    cmd.Parameters.AddWithValue("@I_COORDINATES", Property.coordinates);
                    cmd.Parameters.AddWithValue("@I_PRICING", Property.pricing);
                    cmd.Parameters.AddWithValue("@I_PHONENO1", Property.phoneno1);
                    cmd.Parameters.AddWithValue("@I_PHONENO2", Property.phoneno2);
                    cmd.Parameters.AddWithValue("@I_PHONENO3", Property.phoneno3);
                    cmd.Parameters.AddWithValue("@I_CID", Property.cid);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    errorDesc = InsertPropertyAminities(Property.AminitsTypeList, Convert.ToInt32(errorCode));
                    log.DebugFormat("Insert Property Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Insert Property Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in InsertProperty method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Convert.ToInt32(errorCode);
        }

        [HttpPost]
        [ActionName("UpdateProperty")]
        public HttpResponseMessage UpdateProperty(PropertyModel Property)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Update Property ");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MPROPERTY_UPDATE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", Property.id);
                    cmd.Parameters.AddWithValue("@I_COMPANYID", Property.companyid);
                    cmd.Parameters.AddWithValue("@I_LOCATIONID", Property.locationid);
                    cmd.Parameters.AddWithValue("@I_BUILDINGID", Property.buildingid);
                    cmd.Parameters.AddWithValue("@I_FLOORID", Property.floorid);
                    cmd.Parameters.AddWithValue("@I_UNITID", Property.unitsid);
                    cmd.Parameters.AddWithValue("@I_ADDRESS", Property.address);
                    cmd.Parameters.AddWithValue("@I_NOOFBEDS", Property.noofbeds);
                    cmd.Parameters.AddWithValue("@I_NOOFBOTHS", Property.noofboths);
                    cmd.Parameters.AddWithValue("@I_SQFT", Property.sqft);
                    cmd.Parameters.AddWithValue("@I_COST", Property.cost);
                    cmd.Parameters.AddWithValue("@I_FACILITYMANGERID", Property.facilitymangerid);
                    cmd.Parameters.AddWithValue("@I_FACILITYUSERID", Property.facilityuserid);
                    cmd.Parameters.AddWithValue("@I_COMMUNITYMANGERID", Property.communitymangerid);
                    cmd.Parameters.AddWithValue("@I_COMMUNITYUSERID", Property.communityuserid);
                    cmd.Parameters.AddWithValue("@I_PINCODE", Property.pincode);
                    cmd.Parameters.AddWithValue("@I_DESCRIPTION", Property.description);
                    cmd.Parameters.AddWithValue("@I_COORDINATES", Property.coordinates);
                    cmd.Parameters.AddWithValue("@I_PRICING", Property.pricing);
                    cmd.Parameters.AddWithValue("@I_PHONENO1", Property.phoneno1);
                    cmd.Parameters.AddWithValue("@I_PHONENO2", Property.phoneno2);
                    cmd.Parameters.AddWithValue("@I_PHONENO3", Property.phoneno3);
                    cmd.Parameters.AddWithValue("@I_CID", Property.cid);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    errorDesc = InsertPropertyAminities(Property.AminitsTypeList, Convert.ToInt32(errorCode));
                    log.DebugFormat("Update Property Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Update Property Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in Update Property method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorCode, "application/json");
        }

        [HttpGet]
        [ActionName("DeleteProperty")]
        public HttpResponseMessage DeleteProperty(int PropertyID)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Delete Property");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_MPROPERTY_DELETE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", PropertyID);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Delete Property Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Delete Property Records returned-{0}", errorDesc);
                    log.Info("Delete records Data:::" + PropertyID);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in DeleteProperty method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }
        #endregion

        #region "PropertyAminities"

        public List<PropertyAminitiesModel> GetAllPropertyAminities(int propertyid)
        {
            DataTable dtData = null;
            List<PropertyAminitiesModel> mItems = new List<PropertyAminitiesModel>();
            PropertyAminitiesModel mItem = null;
            SqlDataAdapter adapter = null;
            string jsonData = string.Empty;
            try
            {
                log.DebugFormat("Retrieving GetAllPropertyAminities ");
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };
                    SqlCommand cmd = new SqlCommand("SP_GET_ALL_MPROPERTY_AMINITIES", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_PROPERTYID", propertyid);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    adapter = new SqlDataAdapter(cmd);
                    dtData = new DataTable();
                    adapter.Fill(dtData);
                    if (dtData.Rows.Count > 0)
                    {
                        mItems = new List<PropertyAminitiesModel>();
                        for (int i = 0; i < dtData.Rows.Count; i++)
                        {
                            var vals = dtData.Rows[i].ItemArray;
                            mItem = new PropertyAminitiesModel
                            {
                                // propertyid = StringUtil.getInt(vals[0].ToString()),
                                aminitiesid = StringUtil.getInt(vals[1].ToString()),
                                aminitiestypeid = StringUtil.getInt(vals[2].ToString())

                            };
                            mItems.Add(mItem);
                        }
                    }

                    string errorCode = outErrorCode.Value.ToString();
                    string errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("GetAllPropertyAminities Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, GetAllPropertyAminities Records returned-{0}", dtData != null ? dtData.Rows.Count : 0);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in GetAllPropertyAminities method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return mItems;
        }


        public string InsertPropertyAminities(List<PropertyAminitiesModel> propertyAminities, int propertyid)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                string Flag = "Y";
                log.DebugFormat("Retrieving Insert PropertyAminities");
                foreach (PropertyAminitiesModel objAminities in propertyAminities)
                {
                    using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                    {
                        SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                        SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                        SqlCommand cmd = new SqlCommand("SP_MPROPERTY_AMINITIES_INSERT", con);
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@I_PROPERTYID", propertyid);
                        cmd.Parameters.AddWithValue("@I_AMINITIESTYPEID", objAminities.aminitiestypeid);
                        cmd.Parameters.AddWithValue("@I_AMINITIESID", objAminities.aminitiesid);
                        cmd.Parameters.AddWithValue("@I_FLAG", Flag);
                        cmd.Parameters.Add(outErrorCode);
                        cmd.Parameters.Add(outErrorDesc);
                        con.Open();
                        cmd.ExecuteNonQuery();
                        errorCode = outErrorCode.Value.ToString();
                        errorDesc = outErrorDesc.Value.ToString();
                        log.DebugFormat("Insert PropertyAminities Result:{0}", errorDesc);
                        log.DebugFormat("Procedure executed successfully, Insert PropertyAminities Records returned-{0}", errorDesc);
                        log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                    }
                    Flag = "N";
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in InsertPropertyAminities method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return errorDesc;
        }

        //[HttpPost]
        //[ActionName("UpdatePropertyAminities")]
        //public HttpResponseMessage UpdatePropertyAminities(PropertyAminitiesModel PropertyAminities)
        //{
        //    string errorDesc = string.Empty;
        //    string errorCode = string.Empty;
        //    try
        //    {
        //        log.DebugFormat("Retrieving Update PropertyAminities ");

        //        using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
        //        {
        //            SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
        //            SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

        //            SqlCommand cmd = new SqlCommand("SP_PROPERTY_AMINITIES_UPDATE", con);
        //            cmd.CommandType = CommandType.StoredProcedure;
        //            cmd.Parameters.AddWithValue("@I_ID", PropertyAminities.id);
        //            cmd.Parameters.AddWithValue("@I_PROPERTYID", PropertyAminities.propertyid);
        //            cmd.Parameters.AddWithValue("@I_AMINITIESID", PropertyAminities.aminitiesid);
        //            cmd.Parameters.AddWithValue("@I_CID", PropertyAminities.cid);
        //            cmd.Parameters.Add(outErrorCode);
        //            cmd.Parameters.Add(outErrorDesc);
        //            con.Open();
        //            cmd.ExecuteNonQuery();
        //            errorCode = outErrorCode.Value.ToString();
        //            errorDesc = outErrorDesc.Value.ToString();
        //            log.DebugFormat("Update PropertyAminities Result:{0}", errorDesc);
        //            log.DebugFormat("Procedure executed successfully, Update PropertyAminities Records returned-{0}", errorDesc);
        //            log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        log.ErrorFormat("Exception in Update PropertyAminities method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
        //    }
        //    return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        //}

        //[HttpGet]
        //[ActionName("DeletePropertyAminities")]
        //public HttpResponseMessage DeletePropertyAminities(int PropertyAminitiesID)
        //{
        //    string errorDesc = string.Empty;
        //    string errorCode = string.Empty;
        //    try
        //    {
        //        log.DebugFormat("Retrieving Delete PropertyAminities");

        //        using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
        //        {
        //            SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
        //            SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

        //            SqlCommand cmd = new SqlCommand("SP_PROPERTY_AMINITIES_DELETE", con);
        //            cmd.CommandType = CommandType.StoredProcedure;
        //            cmd.Parameters.AddWithValue("@I_ID", PropertyAminitiesID);
        //            cmd.Parameters.Add(outErrorCode);
        //            cmd.Parameters.Add(outErrorDesc);
        //            con.Open();
        //            cmd.ExecuteNonQuery();
        //            errorCode = outErrorCode.Value.ToString();
        //            errorDesc = outErrorDesc.Value.ToString();
        //            log.DebugFormat("Delete PropertyAminities Result:{0}", errorDesc);
        //            log.DebugFormat("Procedure executed successfully, Delete PropertyAminities Records returned-{0}", errorDesc);
        //            log.Info("Delete records Data:::" + PropertyAminitiesID);
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        log.ErrorFormat("Exception in DeletePropertyAminities method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
        //    }
        //    return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        //}
        #endregion

        #region "PropertyImages"

        public List<PropertyImagesModel> GetAllPropertyImages(int propertyid)
        {
            DataTable dtData = null;
            List<PropertyImagesModel> mItems = new List<PropertyImagesModel>();
            PropertyImagesModel mItem = null;
            SqlDataAdapter adapter = null;
            string jsonData = string.Empty;
            try
            {
                log.DebugFormat("Retrieving GetAllPropertyImages ");
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };
                    SqlCommand cmd = new SqlCommand("SP_GET_ALL_MPROPERTY_IMAGES", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_PROPERTYID", propertyid);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    adapter = new SqlDataAdapter(cmd);
                    dtData = new DataTable();
                    adapter.Fill(dtData);
                    if (dtData.Rows.Count > 0)
                    {
                        mItems = new List<PropertyImagesModel>();
                        for (int i = 0; i < dtData.Rows.Count; i++)
                        {
                            var vals = dtData.Rows[i].ItemArray;
                            mItem = new PropertyImagesModel
                            {

                                propertyid = StringUtil.getInt(vals[0].ToString()),
                                imagename = StringUtil.nullIfEmpty(vals[1].ToString()),
                                imagepath = StringUtil.nullIfEmpty(vals[2].ToString()),
                                showimagepath = StringUtil.nullIfEmpty(vals[3].ToString())

                            };
                            mItems.Add(mItem);
                        }
                    }

                    string errorCode = outErrorCode.Value.ToString();
                    string errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("GetAllPropertyImages Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, GetAllPropertyImages Records returned-{0}", dtData != null ? dtData.Rows.Count : 0);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in GetAllPropertyImages method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return mItems;
        }


        public HttpResponseMessage InsertPropertyImages(List<PropertyImagesModel> PropertyImages)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                string Flag = "Y";
                log.DebugFormat("Retrieving Insert PropertyImages");
                foreach (PropertyImagesModel objimages in PropertyImages)
                {
                    using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                    {
                        SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                        SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                        SqlCommand cmd = new SqlCommand("SP_MPROPERTY_IMAGES_INSERT", con);
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@I_PROPERTYID", objimages.propertyid);
                        cmd.Parameters.AddWithValue("@I_IMAGENAME", objimages.imagename);
                        cmd.Parameters.AddWithValue("@I_IMAGEPATH", objimages.imagepath);
                        cmd.Parameters.AddWithValue("@I_FLAG", Flag);
                        cmd.Parameters.Add(outErrorCode);
                        cmd.Parameters.Add(outErrorDesc);
                        con.Open();
                        cmd.ExecuteNonQuery();
                        errorCode = outErrorCode.Value.ToString();
                        errorDesc = outErrorDesc.Value.ToString();
                        log.DebugFormat("Insert PropertyImages Result:{0}", errorDesc);
                        log.DebugFormat("Procedure executed successfully, Insert PropertyImages Records returned-{0}", errorDesc);
                        log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                    }
                    Flag = "N";
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in InsertPropertyImages method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpPost]
        [ActionName("UpdatePropertyImages")]
        public HttpResponseMessage UpdatePropertyImages(List<PropertyImagesModel> PropertyImages)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                string Flag = "Y";
                log.DebugFormat("Retrieving Insert PropertyImages");
                foreach (PropertyImagesModel objimages in PropertyImages)
                {
                    using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                    {
                        SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                        SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                        SqlCommand cmd = new SqlCommand("SP_MPROPERTY_IMAGES_UPDATE", con);
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@I_PROPERTYID", objimages.propertyid);
                        cmd.Parameters.AddWithValue("@I_IMAGENAME", objimages.imagename);
                        cmd.Parameters.AddWithValue("@I_IMAGEPATH", objimages.imagepath);
                        cmd.Parameters.AddWithValue("@I_FLAG", Flag);
                        cmd.Parameters.Add(outErrorCode);
                        cmd.Parameters.Add(outErrorDesc);
                        con.Open();
                        cmd.ExecuteNonQuery();
                        errorCode = outErrorCode.Value.ToString();
                        errorDesc = outErrorDesc.Value.ToString();
                        log.DebugFormat("Insert PropertyImages Result:{0}", errorDesc);
                        log.DebugFormat("Procedure executed successfully, Insert PropertyImages Records returned-{0}", errorDesc);
                        log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                    }
                    Flag = "N";
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in Update PropertyImages method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpGet]
        [ActionName("DeletePropertyImages")]
        public HttpResponseMessage DeletePropertyImages(int PropertyImagesID)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Delete PropertyImages");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_PROPERTY_IMAGES_DELETE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", PropertyImagesID);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Delete PropertyImages Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Delete PropertyImages Records returned-{0}", errorDesc);
                    log.Info("Delete records Data:::" + PropertyImagesID);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in DeletePropertyImages method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }
        #endregion

        #region "Role"
        [HttpGet]
        [ActionName("GetRole")]
        public HttpResponseMessage GetRoleCollection()
        {
            DataTable dtData = null;
            SqlDataAdapter adapter = null;
            try
            {
                log.DebugFormat("Retrieving Role Collections");
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };
                    SqlCommand cmd = new SqlCommand("SP_GET_ALL_Roles", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    adapter = new SqlDataAdapter(cmd);
                    dtData = new DataTable();
                    adapter.Fill(dtData);
                    string errorCode = outErrorCode.Value.ToString();
                    string errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("GetRoleCollection Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, GetRoleCollection Records returned-{0}", dtData != null ? dtData.Rows.Count : 0);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in GetRoleCollection method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, dtData);
        }

        //[HttpPost]
        //[ActionName("RoleInsert")]
        //public HttpResponseMessage RoleMenuMappingUserInsert(RoleModel rmmodel)
        //{
        //    string errorDesc = string.Empty;
        //    string errorCode = string.Empty;
        //    string roleid = string.Empty;
        //    string commonroleid = string.Empty;
        //    try
        //    {
        //        log.DebugFormat("Retrieving RoleInsert ");
        //        string i_mapping_flag = "N";

        //        //foreach (var mappinpItem in rmmodel.permissions)
        //        //{
        //            using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
        //            {
        //                SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
        //                SqlParameter outroleid = new SqlParameter("@o_roleid", SqlDbType.Int) { Direction = ParameterDirection.Output };
        //                SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };
        //                SqlCommand cmd = new SqlCommand("SP_ROLE_INSERT", con);
        //                cmd.CommandType = CommandType.StoredProcedure;
        //                cmd.Parameters.AddWithValue("@i_privilege_id", 0);
        //                cmd.Parameters.AddWithValue("@i_company_id", rmmodel.companyid);
        //                cmd.Parameters.AddWithValue("@i_location_id", rmmodel.locationid);

        //                cmd.Parameters.AddWithValue("@i_role_name", rmmodel.rolename);
        //                cmd.Parameters.AddWithValue("@i_isadmin", rmmodel.isadmin);
        //                //cmd.Parameters.AddWithValue("@i_isapprover", rmmodel.Approver);
        //                cmd.Parameters.AddWithValue("@i_role_description", rmmodel.shortname);
        //                cmd.Parameters.AddWithValue("@i_role_id", rmmodel.id);
        //                cmd.Parameters.AddWithValue("@i_mapping_flag", i_mapping_flag);
        //                cmd.Parameters.AddWithValue("@i_mapping_flag", i_mapping_flag);
        //                cmd.Parameters.Add(outErrorCode);
        //                cmd.Parameters.Add(outErrorDesc);
        //                cmd.Parameters.Add(outroleid);
        //                con.Open();
        //                cmd.ExecuteNonQuery();
        //                errorCode = outErrorCode.Value.ToString();
        //                errorDesc = outErrorDesc.Value.ToString();
        //                roleid = outroleid.Value.ToString();
        //               // log.DebugFormat("RoleInsert update records:::: RoleID - {0} Menu ID- {1}", roleid, mappinpItem.submenuId);
        //                log.DebugFormat("RoleInsert Result:{0}", errorDesc);
        //                log.DebugFormat("Procedure executed successfully, RoleInsert Records returned-{0}", errorDesc);

        //            }
        //            if (i_mapping_flag == "N")
        //            {
        //                i_mapping_flag = "Y";
        //                commonroleid = roleid;
        //            }
        //        //}

        //    }
        //    catch (Exception ex)
        //    {
        //        log.ErrorFormat("Exception in RoleInsert method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
        //    }
        //    //return new CreateResponse(HttpStatusCode.OK,) { Content = new StringContent(errorDesc) };
        //    return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        //}

        //[HttpPost]
        //[ActionName("RoleUpdate")]
        //public HttpResponseMessage RoleMenuMappingUserUpdate(RoleModel rmmodel)
        //{
        //    string errorDesc = string.Empty;
        //    string errorCode = string.Empty;
        //    try
        //    {
        //        log.DebugFormat("Retrieving RoleUpdate ");
        //        string i_mapping_flag = "N";
        //        if (rmmodel.id > 0)
        //        {
        //            //foreach (var mappinpItem in rmmodel.permissions)
        //            //{
        //                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
        //                {
        //                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
        //                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };
        //                    SqlCommand cmd = new SqlCommand("SP_ROLE_UPDATE", con);
        //                    cmd.CommandType = CommandType.StoredProcedure;
        //                    cmd.Parameters.AddWithValue("@i_privilege_id", 0);
        //                    cmd.Parameters.AddWithValue("@i_company_id", rmmodel.companyid);
        //                    cmd.Parameters.AddWithValue("@i_location_id", rmmodel.locationid);

        //                    cmd.Parameters.AddWithValue("@i_role_name", rmmodel.rolename);
        //                    cmd.Parameters.AddWithValue("@i_isadmin", rmmodel.isadmin);
        //                    //cmd.Parameters.AddWithValue("@i_isapprover", rmmodel.Approver);
        //                    cmd.Parameters.AddWithValue("@i_role_description", rmmodel.shortname);
        //                    cmd.Parameters.AddWithValue("@i_role_id", rmmodel.id);
        //                    cmd.Parameters.AddWithValue("@i_mapping_flag", i_mapping_flag);
        //                    cmd.Parameters.Add(outErrorCode);
        //                    cmd.Parameters.Add(outErrorDesc);
        //                    con.Open();
        //                    cmd.ExecuteNonQuery();
        //                    errorCode = outErrorCode.Value.ToString();
        //                    errorDesc = outErrorDesc.Value.ToString();

        //                    log.DebugFormat("RoleUpdate Result:{0}", errorDesc);
        //                    log.DebugFormat("Procedure executed successfully, RoleUpdate Records returned-{0}", errorDesc);

        //                }
        //                if (i_mapping_flag == "N")
        //                    i_mapping_flag = "Y";
        //            }

        //        //}
        //        log.Info("Update Data:::" + JsonConvert.SerializeObject("Success"));
        //    }
        //    catch (Exception ex)
        //    {
        //        log.ErrorFormat("Exception in RoleUpdate method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
        //    }
        //    //return new CreateResponse(HttpStatusCode.OK,) { Content = new StringContent(errorDesc) };
        //    return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        //}

        [HttpPost]
        [ActionName("RoleMainMenuMappingInsert")]
        public HttpResponseMessage RoleMenuMappingUserInsert(RoleModel rmmodel)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            string roleid = string.Empty;
            string commonroleid = string.Empty;
            try
            {
                log.DebugFormat("Retrieving RoleMainMenuMappingInsert ");
                string i_mapping_flag = "N";

                foreach (var mappinpItem in rmmodel.permissions)
                {
                    using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                    {
                        SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                        SqlParameter outroleid = new SqlParameter("@o_roleid", SqlDbType.Int) { Direction = ParameterDirection.Output };
                        SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };
                        SqlCommand cmd = new SqlCommand("SP_ROLE_MENU_MAPPING_INSERT", con);
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@i_privilege_id", mappinpItem.privilegeid);
                        cmd.Parameters.AddWithValue("@i_company_id", rmmodel.companyid);
                        cmd.Parameters.AddWithValue("@i_location_id", rmmodel.locationid);
                        if (mappinpItem.submenuId == 0)
                            cmd.Parameters.AddWithValue("@i_menu_id", mappinpItem.menuId);
                        else
                            cmd.Parameters.AddWithValue("@i_menu_id", mappinpItem.submenuId);
                        cmd.Parameters.AddWithValue("@i_role_name", rmmodel.RoleName);
                        cmd.Parameters.AddWithValue("@i_isadmin", rmmodel.isadmin);
                        //  cmd.Parameters.AddWithValue("@i_isapprover", rmmodel.Approver);
                        cmd.Parameters.AddWithValue("@i_role_description", rmmodel.RoleShortName);
                        cmd.Parameters.AddWithValue("@i_mapping_flag", i_mapping_flag);
                        cmd.Parameters.Add(outErrorCode);
                        cmd.Parameters.Add(outErrorDesc);
                        cmd.Parameters.Add(outroleid);
                        con.Open();
                        cmd.ExecuteNonQuery();
                        errorCode = outErrorCode.Value.ToString();
                        errorDesc = outErrorDesc.Value.ToString();
                        roleid = outroleid.Value.ToString();
                        log.DebugFormat("RoleMainMenuMappingInsert update records:::: RoleID - {0} Menu ID- {1}", roleid, mappinpItem.submenuId);
                        log.DebugFormat("RoleMainMenuMappingInsert Result:{0}", errorDesc);
                        log.DebugFormat("Procedure executed successfully, RoleMainMenuMappingInsert Records returned-{0}", errorDesc);

                    }
                    if (i_mapping_flag == "N")
                    {
                        i_mapping_flag = "Y";
                        commonroleid = roleid;
                    }
                }

            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in RoleMainMenuMappingInsert method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            //return new CreateResponse(HttpStatusCode.OK,) { Content = new StringContent(errorDesc) };
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpPost]
        [ActionName("RoleMainMenuMappingUpdate")]
        public HttpResponseMessage RoleMenuMappingUserUpdate(RoleModel rmmodel)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving RoleMainMenuMappingUpdate ");
                string i_mapping_flag = "N";
                if (rmmodel.id > 0)
                {
                    foreach (var mappinpItem in rmmodel.permissions)
                    {
                        using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                        {
                            SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                            SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };
                            SqlCommand cmd = new SqlCommand("SP_ROLE_MENU_MAPPING_UPDATE", con);
                            cmd.CommandType = CommandType.StoredProcedure;
                            cmd.Parameters.AddWithValue("@i_privilege_id", mappinpItem.privilegeid);
                            cmd.Parameters.AddWithValue("@i_company_id", rmmodel.companyid);
                            cmd.Parameters.AddWithValue("@i_location_id", rmmodel.locationid);
                            if (mappinpItem.submenuId == 0)
                                cmd.Parameters.AddWithValue("@i_menu_id", mappinpItem.menuId);
                            else
                                cmd.Parameters.AddWithValue("@i_menu_id", mappinpItem.submenuId);
                            cmd.Parameters.AddWithValue("@i_role_name", rmmodel.RoleName);
                            cmd.Parameters.AddWithValue("@i_isadmin", rmmodel.isadmin);
                            //cmd.Parameters.AddWithValue("@i_isapprover", rmmodel.Approver);
                            cmd.Parameters.AddWithValue("@i_role_description", rmmodel.RoleShortName);
                            cmd.Parameters.AddWithValue("@i_role_id", rmmodel.id);
                            cmd.Parameters.AddWithValue("@i_mapping_flag", i_mapping_flag);
                            cmd.Parameters.Add(outErrorCode);
                            cmd.Parameters.Add(outErrorDesc);
                            con.Open();
                            cmd.ExecuteNonQuery();
                            errorCode = outErrorCode.Value.ToString();
                            errorDesc = outErrorDesc.Value.ToString();
                            log.DebugFormat("RoleMainMenuMappingUpdate update records:::: RoleID - {0} Menu ID- {1}", rmmodel.roleid, mappinpItem.submenuId);
                            log.DebugFormat("RoleMainMenuMappingUpdate Result:{0}", errorDesc);
                            log.DebugFormat("Procedure executed successfully, RoleMainMenuMappingUpdate Records returned-{0}", errorDesc);

                        }
                        if (i_mapping_flag == "N")
                            i_mapping_flag = "Y";
                    }

                }
                log.Info("Update Data:::" + JsonConvert.SerializeObject("Success"));
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in RoleMainMenuMappingUpdate method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            //return new CreateResponse(HttpStatusCode.OK,) { Content = new StringContent(errorDesc) };
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpGet]
        [ActionName("DeleteRole")]
        public HttpResponseMessage DeleteRole(int role_id)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving DeleteRole ");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_ROLE_DELETE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@i_role_id", role_id);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("DeleteCCRole Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, DeleteRole Records returned-{0}", errorDesc);
                    log.Info("Delete records Data:::" + role_id);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in DeleteRole method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpGet]
        [ActionName("GetAllPrivileges")]
        public List<PrivilegeModel> GetAllPrivileges()
        {
            DataTable dtData = null;
            PrivilegeModel mItem = null;
            List<PrivilegeModel> mItems = null;
            SqlDataAdapter adapter = null;
            try
            {
                log.DebugFormat("Retrieving GetAllPrivileges");
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };
                    SqlCommand cmd = new SqlCommand("SP_GET_ALL_PRIVILEGES", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    adapter = new SqlDataAdapter(cmd);
                    dtData = new DataTable();
                    adapter.Fill(dtData);
                    if (dtData.Rows.Count > 0)
                    {
                        mItems = new List<PrivilegeModel>();
                        for (int i = 0; i < dtData.Rows.Count; i++)
                        {
                            var vals = dtData.Rows[i].ItemArray;
                            mItem = new PrivilegeModel
                            {
                                privilege_id = StringUtil.getInt(vals[0].ToString()),
                                privilege_name = StringUtil.nullIfEmpty(vals[1].ToString()),
                                privilege_description = StringUtil.nullIfEmpty(vals[2].ToString())
                            };

                            mItems.Add(mItem);

                        }
                    }
                    string errorCode = outErrorCode.Value.ToString();
                    string errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("GetAllPrivileges Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, GetAllPrivileges Records returned-{0}", dtData != null ? dtData.Rows.Count : 0);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in GetAllPrivileges method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return mItems;
        }

        #endregion

        #region "User"
        [HttpPost]
        [ActionName("InsertUser")]
        public HttpResponseMessage InsertUsers(UserModel user)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving InsertUsers ");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_USER_INSERT", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    //cmd.Parameters.AddWithValue("@i_id", user.id);
                    cmd.Parameters.AddWithValue("@i_membershipid", user.membershipid == null ? string.Empty : user.membershipid);
                    cmd.Parameters.AddWithValue("@i_company_id", user.companyid);
                    cmd.Parameters.AddWithValue("@i_location_id", user.locationid);
                    //cmd.Parameters.AddWithValue("@i_propertyid", user.propertyid);
                    cmd.Parameters.AddWithValue("@i_role_id", user.roleid);
                    cmd.Parameters.AddWithValue("@i_profile_img", user.profileimg == null ? string.Empty : user.profileimg);
                    cmd.Parameters.AddWithValue("@i_username", user.username);
                    cmd.Parameters.AddWithValue("@i_first_name", user.firstname);
                    cmd.Parameters.AddWithValue("@i_last_name", user.lastname);
                    cmd.Parameters.AddWithValue("@i_email_id", user.email == null ? string.Empty : user.email);
                    cmd.Parameters.AddWithValue("@i_socialmedia", user.socialmedia == null ? string.Empty : user.socialmedia);
                    cmd.Parameters.AddWithValue("@i_gender", user.gender == null ? string.Empty : user.gender);
                    //cmd.Parameters.AddWithValue("@i_dob", user.dob == null ? DateTime.Now.ToShortDateString() : user.confirmpassword);
                    cmd.Parameters.AddWithValue("@i_pancard", user.pancardno == null ? string.Empty : user.pancardno);
                    cmd.Parameters.AddWithValue("@i_pancardpath", user.pancardimagepath == null ? string.Empty : user.pancardimagepath);
                    cmd.Parameters.AddWithValue("@i_aadharno", user.aadharno == null ? string.Empty : user.aadharno);
                    cmd.Parameters.AddWithValue("@i_aadharnopath", user.aadharimagepath == null ? string.Empty : user.aadharimagepath);
                    cmd.Parameters.AddWithValue("@i_permenentaddress", user.permenentaddress == null ? string.Empty : user.permenentaddress);
                    cmd.Parameters.AddWithValue("@i_permenentaddresspath", user.permenentaddressimagepath == null ? string.Empty : user.permenentaddressimagepath);
                    cmd.Parameters.AddWithValue("@i_password", user.password);
                    cmd.Parameters.AddWithValue("@i_confirmpassword", user.confirmpassword == null ? string.Empty : user.confirmpassword);



                    cmd.Parameters.AddWithValue("@i_cityid", user.cityid);
                    cmd.Parameters.AddWithValue("@i_stateid", user.stateid);

                    cmd.Parameters.AddWithValue("@i_cid", user.cid);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("InsertUsers Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, InsertUsers Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in InsertUsers method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            //return new CreateResponse(HttpStatusCode.OK,) { Content = new StringContent(errorDesc) };
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpPost]
        [ActionName("UpdateUser")]
        public HttpResponseMessage UpdateUser(UserModel user)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving UpdateUser ");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_USER_UPDATE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@i_id", user.id);
                    cmd.Parameters.AddWithValue("@i_membershipid", user.membershipid == null ? string.Empty : user.membershipid);
                    cmd.Parameters.AddWithValue("@i_company_id", user.companyid);
                    cmd.Parameters.AddWithValue("@i_location_id", user.locationid);
                    //cmd.Parameters.AddWithValue("@i_propertyid", user.propertyid);
                    cmd.Parameters.AddWithValue("@i_role_id", user.roleid);
                    cmd.Parameters.AddWithValue("@i_profile_img", user.profileimg == null ? string.Empty : user.profileimg);
                    cmd.Parameters.AddWithValue("@i_username", user.username);
                    cmd.Parameters.AddWithValue("@i_first_name", user.firstname);
                    cmd.Parameters.AddWithValue("@i_last_name", user.lastname);
                    cmd.Parameters.AddWithValue("@i_email_id", user.email == null ? string.Empty : user.email);
                    cmd.Parameters.AddWithValue("@i_socialmedia", user.socialmedia == null ? string.Empty : user.socialmedia);
                    cmd.Parameters.AddWithValue("@i_gender", user.gender == null ? string.Empty : user.gender);
                    cmd.Parameters.AddWithValue("@i_dob", user.dob == null ? string.Empty : user.confirmpassword);
                    cmd.Parameters.AddWithValue("@i_pancard", user.pancardno == null ? string.Empty : user.pancardno);
                    cmd.Parameters.AddWithValue("@i_pancardpath", user.pancardimagepath == null ? string.Empty : user.pancardimagepath);
                    cmd.Parameters.AddWithValue("@i_aadharno", user.aadharno == null ? string.Empty : user.aadharno);
                    cmd.Parameters.AddWithValue("@i_aadharnopath", user.aadharimagepath == null ? string.Empty : user.aadharimagepath);
                    cmd.Parameters.AddWithValue("@i_permenentaddress", user.permenentaddress == null ? string.Empty : user.permenentaddress);
                    cmd.Parameters.AddWithValue("@i_permenentaddresspath", user.permenentaddressimagepath == null ? string.Empty : user.permenentaddressimagepath);
                    cmd.Parameters.AddWithValue("@i_password", user.password);
                    cmd.Parameters.AddWithValue("@i_confirmpassword", user.confirmpassword == null ? string.Empty : user.confirmpassword);



                    cmd.Parameters.AddWithValue("@i_cityid", user.cityid);
                    cmd.Parameters.AddWithValue("@i_stateid", user.stateid);

                    cmd.Parameters.AddWithValue("@i_cid", user.cid);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("UpdateUser Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, UpdateUser Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in UpdateUser method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            //return new CreateResponse(HttpStatusCode.OK,) { Content = new StringContent(errorDesc) };
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpGet]
        [ActionName("GetAllUser")]
        public HttpResponseMessage GetAllUserCollection()
        {
            DataTable dtData = null;
            SqlDataAdapter adapter = null;
            IList<UserModel> UserCollection = new List<UserModel>();
            UserModel ObjuserModel = new UserModel();
            try
            {
                log.DebugFormat("Retrieving All User Collections");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_GET_ALL_USER", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    adapter = new SqlDataAdapter(cmd);
                    dtData = new DataTable();
                    adapter.Fill(dtData);
                    string errorCode = outErrorCode.Value.ToString();
                    string errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("GetAllUserCollection Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, GetAllUserCollection Records returned-{0}", dtData != null ? dtData.Rows.Count : 0);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in GetAllUser method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, dtData);
        }

        [HttpGet]
        [ActionName("GetUser")]
        public HttpResponseMessage GetUserByUserID(int UserId)
        {
            DataTable dtData = null;
            SqlDataAdapter adapter = null;
            try
            {
                log.DebugFormat("Retrieving Data GetUser Collections");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };
                    SqlCommand cmd = new SqlCommand("SP_GET_MUSER", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@i_user_id", UserId);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    adapter = new SqlDataAdapter(cmd);
                    dtData = new DataTable();
                    adapter.Fill(dtData);
                    string errorCode = outErrorCode.Value.ToString();
                    string errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("GetUser Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, GetUser Records returned-{0}", dtData != null ? dtData.Rows.Count : 0);

                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in GetUser method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, dtData);
        }
        #endregion

        #region "SignUp"
        [HttpPost]
        [ActionName("InsertSignUp")]
        public HttpResponseMessage InsertSignUps(SignUpModel user)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving InsertSignUps ");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_SignUp_INSERT", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@i_id", user.id);
                    cmd.Parameters.AddWithValue("@i_isnotifyapprovalemailsms", user.isnotifyapprovalemailsms);
                    cmd.Parameters.AddWithValue("@i_isapprovedmembersipdoc", user.isapprovedmembersipdoc);
                    cmd.Parameters.AddWithValue("@i_profileimg", user.profileimg);
                    cmd.Parameters.AddWithValue("@i_issubmitsigneddoc", user.issubmitsigneddoc);
                    cmd.Parameters.AddWithValue("@i_firstname", user.firstname);
                    cmd.Parameters.AddWithValue("@i_lastname", user.lastname);
                    cmd.Parameters.AddWithValue("@i_emailid", user.emailid);
                    cmd.Parameters.AddWithValue("@i_cid", user.cid);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("InsertSignUps Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, InsertSignUps Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in InsertSignUps method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            //return new CreateResponse(HttpStatusCode.OK,) { Content = new StringContent(errorDesc) };
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpPost]
        [ActionName("UpdateSignUp")]
        public HttpResponseMessage UpdateSignUp(SignUpModel user)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving UpdateSignUp ");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_SignUp_UPDATE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@i_id", user.id);
                    cmd.Parameters.AddWithValue("@i_isnotifyapprovalemailsms", user.isnotifyapprovalemailsms);
                    cmd.Parameters.AddWithValue("@i_isapprovedmembersipdoc", user.isapprovedmembersipdoc);
                    cmd.Parameters.AddWithValue("@i_profileimg", user.profileimg);
                    cmd.Parameters.AddWithValue("@i_issubmitsigneddoc", user.issubmitsigneddoc);
                    cmd.Parameters.AddWithValue("@i_firstname", user.firstname);
                    cmd.Parameters.AddWithValue("@i_lastname", user.lastname);
                    cmd.Parameters.AddWithValue("@i_emailid", user.emailid);
                    cmd.Parameters.AddWithValue("@i_cid", user.cid);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("UpdateSignUp Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, UpdateSignUp Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in UpdateSignUp method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            //return new CreateResponse(HttpStatusCode.OK,) { Content = new StringContent(errorDesc) };
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpGet]
        [ActionName("GetAllSignUp")]
        public HttpResponseMessage GetAllSignUpCollection()
        {
            DataTable dtData = null;
            SqlDataAdapter adapter = null;
            IList<SignUpModel> SignUpCollection = new List<SignUpModel>();
            SignUpModel ObjuserModel = new SignUpModel();
            try
            {
                log.DebugFormat("Retrieving All SignUp Collections");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_GET_ALL_SignUp", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    adapter = new SqlDataAdapter(cmd);
                    dtData = new DataTable();
                    adapter.Fill(dtData);
                    string errorCode = outErrorCode.Value.ToString();
                    string errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("GetAllSignUpCollection Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, GetAllSignUpCollection Records returned-{0}", dtData != null ? dtData.Rows.Count : 0);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in GetAllSignUp method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, dtData);
        }

        [HttpGet]
        [ActionName("GetSignUp")]
        public HttpResponseMessage GetSignUpBySignUpID(int SignUpId)
        {
            DataTable dtData = null;
            SqlDataAdapter adapter = null;
            try
            {
                log.DebugFormat("Retrieving Data GetSignUp Collections");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };
                    SqlCommand cmd = new SqlCommand("SP_GET_SignUp", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@i_user_id", SignUpId);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    adapter = new SqlDataAdapter(cmd);
                    dtData = new DataTable();
                    adapter.Fill(dtData);
                    string errorCode = outErrorCode.Value.ToString();
                    string errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("GetSignUp Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, GetSignUp Records returned-{0}", dtData != null ? dtData.Rows.Count : 0);

                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in GetSignUp method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, dtData);
        }
        #endregion

        #region "SignUpTerms"
        [HttpPost]
        [ActionName("InsertSignUpTerms")]
        public HttpResponseMessage InsertSignUpTermss(SignupTermModel user)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving InsertSignUpTermss ");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_SignUpTerms_INSERT", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@i_id", user.id);
                    cmd.Parameters.AddWithValue("@i_signupid", user.signupid);
                    cmd.Parameters.AddWithValue("@i_isagreetermcondition", user.isagreetermcondition);
                    cmd.Parameters.AddWithValue("@i_istempmemebership", user.istempmemebership);
                    cmd.Parameters.AddWithValue("@i_ispayfordocumentverification", user.ispayfordocumentverification);

                    cmd.Parameters.AddWithValue("@i_cid", user.cid);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("InsertSignUpTermss Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, InsertSignUpTermss Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in InsertSignUpTermss method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            //return new CreateResponse(HttpStatusCode.OK,) { Content = new StringContent(errorDesc) };
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpPost]
        [ActionName("UpdateSignUpTerms")]
        public HttpResponseMessage UpdateSignUpTerms(SignupTermModel user)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving UpdateSignUpTerms ");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_SignUpTerms_UPDATE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@i_id", user.id);
                    cmd.Parameters.AddWithValue("@i_signupid", user.signupid);
                    cmd.Parameters.AddWithValue("@i_isagreetermcondition", user.isagreetermcondition);
                    cmd.Parameters.AddWithValue("@i_istempmemebership", user.istempmemebership);
                    cmd.Parameters.AddWithValue("@i_ispayfordocumentverification", user.ispayfordocumentverification);

                    cmd.Parameters.AddWithValue("@i_cid", user.cid);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("UpdateSignUpTerms Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, UpdateSignUpTerms Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in UpdateSignUpTerms method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            //return new CreateResponse(HttpStatusCode.OK,) { Content = new StringContent(errorDesc) };
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpGet]
        [ActionName("GetAllSignUpTerms")]
        public HttpResponseMessage GetAllSignUpTermsCollection()
        {
            DataTable dtData = null;
            SqlDataAdapter adapter = null;
            IList<SignupTermModel> SignUpTermsCollection = new List<SignupTermModel>();
            SignupTermModel ObjuserModel = new SignupTermModel();
            try
            {
                log.DebugFormat("Retrieving All SignUpTerms Collections");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_GET_ALL_SignUpTerms", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    adapter = new SqlDataAdapter(cmd);
                    dtData = new DataTable();
                    adapter.Fill(dtData);
                    string errorCode = outErrorCode.Value.ToString();
                    string errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("GetAllSignUpTermsCollection Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, GetAllSignUpTermsCollection Records returned-{0}", dtData != null ? dtData.Rows.Count : 0);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in GetAllSignUpTerms method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, dtData);
        }

        [HttpGet]
        [ActionName("GetSignUpTerms")]
        public HttpResponseMessage GetSignUpTermsBySignUpTermsID(int SignUpTermsId)
        {
            DataTable dtData = null;
            SqlDataAdapter adapter = null;
            try
            {
                log.DebugFormat("Retrieving Data GetSignUpTerms Collections");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };
                    SqlCommand cmd = new SqlCommand("SP_GET_SignUpTerms", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@i_user_id", SignUpTermsId);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    adapter = new SqlDataAdapter(cmd);
                    dtData = new DataTable();
                    adapter.Fill(dtData);
                    string errorCode = outErrorCode.Value.ToString();
                    string errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("GetSignUpTerms Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, GetSignUpTerms Records returned-{0}", dtData != null ? dtData.Rows.Count : 0);

                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in GetSignUpTerms method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, dtData);
        }
        #endregion

        #region "menu"
        [HttpGet]
        [ActionName("GetAllMainMenu")]
        public List<MenuItems> GetMainMenuCollection(int role_id)
        {
            DataTable dtData = null;
            MenuTreeConfig objMenuConfig = null;
            List<MenuItems> mItems = new List<MenuItems>();
            MenuItems mItem = null;
            SqlDataAdapter adapter = null;
            string jsonData = string.Empty;
            try
            {
                log.DebugFormat("Retrieving GetMenuConfigCollection ");
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };
                    SqlCommand cmd = new SqlCommand("SP_GET_ALL_MENUS", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@i_role_id", role_id);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    adapter = new SqlDataAdapter(cmd);
                    dtData = new DataTable();
                    adapter.Fill(dtData);
                    if (dtData.Rows.Count > 0)
                    {
                        mItems = new List<MenuItems>();
                        for (int i = 0; i < dtData.Rows.Count; i++)
                        {
                            var vals = dtData.Rows[i].ItemArray;
                            mItem = new MenuItems
                            {
                                menuId = StringUtil.getInt(vals[0].ToString()),
                                parentMenuId = StringUtil.getInt(vals[1].ToString()),
                                title = StringUtil.nullIfEmpty(vals[2].ToString()),
                                //page = StringUtil.nullIfEmpty(vals[3].ToString()),
                                privilegeid = StringUtil.getInt(vals[4].ToString()),
                                privilegename = StringUtil.nullIfEmpty(vals[5].ToString()),
                                root = StringUtil.getBoolean(vals[3].ToString()),
                                privilege_option = StringUtil.getInt(vals[6].ToString()),
                            };
                            mItems.Add(mItem);
                        }
                    }

                    if (mItems != null)
                    {
                        objMenuConfig = new MenuTreeConfig();
                        foreach (MenuItems mis in mItems)
                        {
                            log.DebugFormat("List Menu Item Result:{0}", mis);
                            if (mis.root)
                            {
                                mis.submenu = GetTreeSubMenus(mis, mItems);
                                objMenuConfig.items.Add(mis);
                            }
                        }
                    }

                    string errorCode = outErrorCode.Value.ToString();
                    string errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("GetMenuConfigCollection Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, GetMenuConfigCollection Records returned-{0}", dtData != null ? dtData.Rows.Count : 0);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in GetMenuConfigCollection method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            //return Request.CreateResponse(HttpStatusCode.OK, dtData);
            return objMenuConfig.items;
        }
        private List<MenuItems> GetTreeSubMenus(MenuItems mi, List<MenuItems> mItems)
        {
            List<MenuItems> res = new List<MenuItems>();
            try
            {
                if (mItems != null && mItems.Count > 0)
                {
                    foreach (MenuItems mItem in mItems)
                    {
                        if (mItem.parentMenuId == mi.menuId)
                        {
                            mItem.submenu = GetTreeSubMenus(mItem, mItems);
                            res.Add(mItem);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in GetSubMenus:{0}|{1}", ex.Message, ex.StackTrace);
            }
            if (res.Count == 0)
                res = null;
            return res;
        }

        [HttpGet]
        [ActionName("GetMenuConfig")]
        public MenuConfig GetMenuConfigCollection(int role_id)
        {
            DataTable dtData = null;
            MenuConfig objMenuConfig = null;
            List<MenuItem> mItems = null;
            MenuItem mItem = null;

            SqlDataAdapter adapter = null;
            string jsonData = string.Empty;
            try
            {
                log.DebugFormat("Retrieving GetMenuConfigCollection ");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_GET_ROLE_MENUS", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@i_role_id", role_id);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    adapter = new SqlDataAdapter(cmd);
                    dtData = new DataTable();
                    adapter.Fill(dtData);

                    if (dtData.Rows.Count > 0)
                    {
                        mItems = new List<MenuItem>();
                        for (int i = 0; i < dtData.Rows.Count; i++)
                        {
                            var vals = dtData.Rows[i].ItemArray;
                            mItem = new MenuItem
                            {
                                menuId = StringUtil.getInt(vals[0].ToString()),
                                parentMenuId = StringUtil.getInt(vals[1].ToString()),
                                title = StringUtil.nullIfEmpty(vals[2].ToString()),
                                page = StringUtil.nullIfEmpty(vals[3].ToString()),
                                root = StringUtil.getBoolean(vals[4].ToString()),
                                alignment = StringUtil.nullIfEmpty(vals[5].ToString()),
                                translate = StringUtil.nullIfEmpty(vals[6].ToString()),
                                toggle = StringUtil.nullIfEmpty(vals[7].ToString()),
                                bullet = StringUtil.nullIfEmpty(vals[8].ToString()),
                                icon = StringUtil.nullIfEmpty(vals[9].ToString())
                            };
                            mItems.Add(mItem);
                        }
                    }

                    if (mItems != null)
                    {
                        objMenuConfig = new MenuConfig();
                        foreach (MenuItem mi in mItems)
                        {
                            if (mi.root)
                            {
                                mi.submenu = GetSubMenus(mi, mItems);
                                objMenuConfig.header.items.Add(mi);
                            }
                        }
                    }

                    string errorCode = outErrorCode.Value.ToString();
                    string errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("GetMenuConfigCollection Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, GetMenuConfigCollection Records returned-{0}", dtData != null ? dtData.Rows.Count : 0);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in GetMenuConfigCollection method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            //return Request.CreateResponse(HttpStatusCode.OK, dtData);
            return objMenuConfig;
        }

        private List<MenuItem> GetSubMenus(MenuItem mi, List<MenuItem> mItems)
        {
            List<MenuItem> res = new List<MenuItem>();
            try
            {
                if (mItems != null && mItems.Count > 0)
                {
                    foreach (MenuItem mItem in mItems)
                    {
                        if (mItem.parentMenuId == mi.menuId)
                        {
                            mItem.submenu = GetSubMenus(mItem, mItems);
                            res.Add(mItem);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in GetSubMenus:{0}|{1}", ex.Message, ex.StackTrace);
            }
            if (res.Count == 0)
                res = null;
            return res;
        }


        #endregion

        #region "UploadImages"
        [HttpPost]
        [ActionName("AddImage")]
        public List<PropertyImagesModel> AddImage()
        {
            string ErrorMessage = string.Empty;
            List<PropertyImagesModel> objListModel = new List<PropertyImagesModel>();
            try
            {
                string root = ConfigurationManager.AppSettings["PropertyImgPath"].ToString();
                if (!System.IO.Directory.Exists(root))
                {
                    System.IO.Directory.CreateDirectory(root);
                }


                var httpRequest = HttpContext.Current.Request;
                if (httpRequest.Files.Count < 1)
                {
                    return objListModel;
                }
                PropertyImagesModel objModel = new PropertyImagesModel();

                foreach (string file in httpRequest.Files)
                {
                    objModel = new PropertyImagesModel();
                    var postedFile = httpRequest.Files[file];
                    var filePath = System.IO.Path.Combine(root, postedFile.FileName);
                    postedFile.SaveAs(filePath);
                    objModel.imagepath = root + "\\" + postedFile.FileName;
                    objModel.imagename = postedFile.FileName;
                    objModel.showimagepath = "./assets/UploadProperty/" + postedFile.FileName;
                    objModel.propertyid = Convert.ToInt32(file.Split('-')[1]);
                    objListModel.Add(objModel);
                    //Stream strm = postedFile.InputStream;
                    //var targetFile = root;
                    //Based on scalefactor image size will vary  
                    //GenerateThumbnails(0.5, strm, targetFile);  
                }
                //InsertPropertyImages(objListModel);
                // ErrorMessage = "Success";
            }
            catch (Exception Ex)
            {
                return objListModel;
                // ErrorMessage = "Failure";
            }

            return objListModel;

        }
        //        private void GenerateThumbnails(double scaleFactor, Stream sourcePath,
        //string targetPath)
        //        {
        //            using (var image = Image.FromStream(sourcePath))
        //            {
        //                // can given width of image as we want  
        //                var newWidth = (int)(image.Width * scaleFactor);
        //                // can given height of image as we want  
        //                var newHeight = (int)(image.Height * scaleFactor);
        //                var thumbnailImg = new Bitmap(newWidth, newHeight);
        //                var thumbGraph = Graphics.FromImage(thumbnailImg);
        //                thumbGraph.CompositingQuality = CompositingQuality.HighQuality;
        //                thumbGraph.SmoothingMode = SmoothingMode.HighQuality;
        //                thumbGraph.InterpolationMode = InterpolationMode.HighQualityBicubic;
        //                var imageRectangle = new Rectangle(0, 0, newWidth, newHeight);
        //                thumbGraph.DrawImage(image, imageRectangle);
        //                thumbnailImg.Save(targetPath, image.RawFormat);
        //            }
        //        }   

        #endregion

        #region "InterestedIn"
        [HttpPost]
        [ActionName("InsertInterestedIn")]
        public HttpResponseMessage InsertInterestedIns(InterestedInModel user)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving InsertInterestedIns ");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_InterestedIn_INSERT", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@i_id", user.id);
                    cmd.Parameters.AddWithValue("@i_property_name", user.property_name);
                    cmd.Parameters.AddWithValue("@i_interested_pricing", user.interested_pricing);
                    cmd.Parameters.AddWithValue("@i_property_city", user.property_city);
                    cmd.Parameters.AddWithValue("@i_isactive", user.isactive);
                    cmd.Parameters.AddWithValue("@i_api_name", user.api_name);                  
                    cmd.Parameters.AddWithValue("@i_cuid", user.cuid);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("InsertInterestedIns Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, InsertInterestedIns Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in InsertInterestedIns method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            //return new CreateResponse(HttpStatusCode.OK,) { Content = new StringContent(errorDesc) };
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpPost]
        [ActionName("UpdateInterestedIn")]
        public HttpResponseMessage UpdateInterestedIn(InterestedInModel user)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving UpdateInterestedIn ");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_InterestedIn_UPDATE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@i_id", user.id);
                    
                    cmd.Parameters.AddWithValue("@i_property_name", user.property_name);
                    cmd.Parameters.AddWithValue("@i_interested_pricing", user.interested_pricing);
                    cmd.Parameters.AddWithValue("@i_property_city", user.property_city);
                    cmd.Parameters.AddWithValue("@i_isactive", user.isactive);
                    cmd.Parameters.AddWithValue("@i_api_name", user.api_name);
                    cmd.Parameters.AddWithValue("@i_cuid", user.cuid);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("UpdateInterestedIn Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, UpdateInterestedIn Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in UpdateInterestedIn method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            //return new CreateResponse(HttpStatusCode.OK,) { Content = new StringContent(errorDesc) };
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpGet]
        [ActionName("GetAllInterestedIn")]
        public List<InterestedInModel> GetAllInterestedInCollection()
        {
            DataTable dtData = null;
            SqlDataAdapter adapter = null;
            List<InterestedInModel> InterestedInCollection = new List<InterestedInModel>();
            InterestedInModel ObjuserModel = new InterestedInModel();
            try
            {
                log.DebugFormat("Retrieving All InterestedIn Collections");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_GET_ALL_InterestedIn", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    adapter = new SqlDataAdapter(cmd);
                    dtData = new DataTable();
                    adapter.Fill(dtData);
                    if (dtData.Rows.Count > 0)
                    {
                        InterestedInCollection = new List<InterestedInModel>();
                        for (int i = 0; i < dtData.Rows.Count; i++)
                        {
                            var vals = dtData.Rows[i].ItemArray;
                            ObjuserModel = new InterestedInModel
                            {
                                id = StringUtil.getInt(vals[0].ToString()),
                                property_name = StringUtil.nullIfEmpty(vals[1].ToString()),
                                interested_pricing = StringUtil.getInt(vals[2].ToString()),
                                property_city = StringUtil.nullIfEmpty(vals[3].ToString()),
                                isactive = StringUtil.getInt(vals[4].ToString()),
                                api_name = StringUtil.nullIfEmpty(vals[4].ToString())

                            };
                            InterestedInCollection.Add(ObjuserModel);
                        }
                    }
                    string errorCode = outErrorCode.Value.ToString();
                    string errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("GetAllInterestedInCollection Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, GetAllInterestedInCollection Records returned-{0}", dtData != null ? dtData.Rows.Count : 0);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in GetAllInterestedIn method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return InterestedInCollection;
        }

        [HttpGet]
        [ActionName("DeleteInterestedIn")]
        public HttpResponseMessage DeleteInterestedIn(int InterestedInID)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Delete InterestedIn");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_InterestedIn_DELETE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", InterestedInID);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Delete InterestedIn Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Delete InterestedIn Records returned-{0}", errorDesc);
                    log.Info("Delete records Data:::" + InterestedInID);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in Delete InterestedIn method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }
        
        #endregion

        #region "EmailTemplate"
        [HttpPost]
        [ActionName("InsertEmailTemplate")]
        public HttpResponseMessage InsertEmailTemplates(EMailTemplateModel user)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving InsertEmailTemplates ");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_EmailTemplate_INSERT", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@i_id", user.id);
                    cmd.Parameters.AddWithValue("@i_email_bcc_roles", user.email_bcc_roles);
                    cmd.Parameters.AddWithValue("@i_email_cc_roles", user.email_cc_roles);
                    cmd.Parameters.AddWithValue("@i_email_contacts", user.email_contacts);
                    cmd.Parameters.AddWithValue("@i_isactive", user.isactive);
                    cmd.Parameters.AddWithValue("@i_email_template_name", user.email_template_name);
                    cmd.Parameters.AddWithValue("@i_cuid", user.cuid);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("InsertEmailTemplates Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, InsertEmailTemplates Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in InsertEmailTemplates method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            //return new CreateResponse(HttpStatusCode.OK,) { Content = new StringContent(errorDesc) };
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpPost]
        [ActionName("UpdateEmailTemplate")]
        public HttpResponseMessage UpdateEmailTemplate(EMailTemplateModel user)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving UpdateEmailTemplate ");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_EmailTemplate_UPDATE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@i_id", user.id);
                    cmd.Parameters.AddWithValue("@i_email_bcc_roles", user.email_bcc_roles);
                    cmd.Parameters.AddWithValue("@i_email_cc_roles", user.email_cc_roles);
                    cmd.Parameters.AddWithValue("@i_email_contacts", user.email_contacts);
                    cmd.Parameters.AddWithValue("@i_isactive", user.isactive);
                    cmd.Parameters.AddWithValue("@i_email_template_name", user.email_template_name);
                    cmd.Parameters.AddWithValue("@i_cuid", user.cuid);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("UpdateEmailTemplate Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, UpdateEmailTemplate Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in UpdateEmailTemplate method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            //return new CreateResponse(HttpStatusCode.OK,) { Content = new StringContent(errorDesc) };
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpGet]
        [ActionName("GetAllEmailTemplate")]
        public List<EMailTemplateModel> GetAllEmailTemplateCollection()
        {
            DataTable dtData = null;
            SqlDataAdapter adapter = null;
            List<EMailTemplateModel> EmailTemplateCollection = new List<EMailTemplateModel>();
            EMailTemplateModel ObjuserModel = new EMailTemplateModel();
            try
            {
                log.DebugFormat("Retrieving All EmailTemplate Collections");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_GET_ALL_EmailTemplate", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    adapter = new SqlDataAdapter(cmd);
                    dtData = new DataTable();
                    adapter.Fill(dtData);
                    if (dtData.Rows.Count > 0)
                    {
                        EmailTemplateCollection = new List<EMailTemplateModel>();
                        for (int i = 0; i < dtData.Rows.Count; i++)
                        {
                            var vals = dtData.Rows[i].ItemArray;
                            ObjuserModel = new EMailTemplateModel
                            {
                                id = StringUtil.getInt(vals[0].ToString()),
                                email_template_name = StringUtil.nullIfEmpty(vals[1].ToString()),
                                isactive = StringUtil.getInt(vals[2].ToString()),
                                email_contacts = StringUtil.nullIfEmpty(vals[3].ToString()),
                                email_cc_roles = StringUtil.nullIfEmpty(vals[4].ToString()),
                                email_bcc_roles = StringUtil.nullIfEmpty(vals[5].ToString())

                            };
                            EmailTemplateCollection.Add(ObjuserModel);
                        }
                    }
                    string errorCode = outErrorCode.Value.ToString();
                    string errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("GetAllEmailTemplateCollection Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, GetAllEmailTemplateCollection Records returned-{0}", dtData != null ? dtData.Rows.Count : 0);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in GetAllEmailTemplate method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return EmailTemplateCollection;
        }

        [HttpGet]
        [ActionName("DeleteEmailTemplate")]
        public HttpResponseMessage DeleteEmailTemplate(int EmailTemplateID)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Delete EmailTemplate");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_EmailTemplate_DELETE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", EmailTemplateID);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Delete EmailTemplate Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Delete EmailTemplate Records returned-{0}", errorDesc);
                    log.Info("Delete records Data:::" + EmailTemplateID);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in Delete EmailTemplate method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        #endregion

        #region "LeadStatus"
        [HttpPost]
        [ActionName("InsertLeadStatus")]
        public HttpResponseMessage InsertLeadStatuss(LeadStatusModel user)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving InsertLeadStatuss ");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_LeadStatus_INSERT", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@i_id", user.id);
                    cmd.Parameters.AddWithValue("@i_allowed_activity", user.allowed_activity);
                    cmd.Parameters.AddWithValue("@i_allowed_followup_activity", user.allowed_followup_activity);
                    cmd.Parameters.AddWithValue("@i_email_template_id", user.email_template_id);
                    cmd.Parameters.AddWithValue("@i_isactive", user.isactive);
                    cmd.Parameters.AddWithValue("@i_lead_status_name", user.lead_status_name);
                    cmd.Parameters.AddWithValue("@i_lead_status_persentage", user.lead_status_persentage);
                    cmd.Parameters.AddWithValue("@i_lead_status_stage", user.lead_status_stage);
                    cmd.Parameters.AddWithValue("@i_cuid", user.cuid);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("InsertLeadStatuss Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, InsertLeadStatuss Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in InsertLeadStatuss method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            //return new CreateResponse(HttpStatusCode.OK,) { Content = new StringContent(errorDesc) };
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpPost]
        [ActionName("UpdateLeadStatus")]
        public HttpResponseMessage UpdateLeadStatus(LeadStatusModel user)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving UpdateLeadStatus ");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_LeadStatus_UPDATE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@i_id", user.id);
                    cmd.Parameters.AddWithValue("@i_allowed_activity", user.allowed_activity);
                    cmd.Parameters.AddWithValue("@i_allowed_followup_activity", user.allowed_followup_activity);
                    cmd.Parameters.AddWithValue("@i_email_template_id", user.email_template_id);
                    cmd.Parameters.AddWithValue("@i_isactive", user.isactive);
                    cmd.Parameters.AddWithValue("@i_lead_status_name", user.lead_status_name);
                    cmd.Parameters.AddWithValue("@i_lead_status_persentage", user.lead_status_persentage);
                    cmd.Parameters.AddWithValue("@i_lead_status_stage", user.lead_status_stage);
                    cmd.Parameters.AddWithValue("@i_cuid", user.cuid);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("UpdateLeadStatus Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, UpdateLeadStatus Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in UpdateLeadStatus method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            //return new CreateResponse(HttpStatusCode.OK,) { Content = new StringContent(errorDesc) };
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpGet]
        [ActionName("GetAllLeadStatus")]
        public List<LeadStatusModel> GetAllLeadStatusCollection()
        {
            DataTable dtData = null;
            SqlDataAdapter adapter = null;
            List<LeadStatusModel> LeadStatusCollection = new List<LeadStatusModel>();
            LeadStatusModel ObjuserModel = new LeadStatusModel();
            try
            {
                log.DebugFormat("Retrieving All LeadStatus Collections");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_GET_ALL_LeadStatus", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    adapter = new SqlDataAdapter(cmd);
                    dtData = new DataTable();
                    adapter.Fill(dtData);
                    if (dtData.Rows.Count > 0)
                    {
                        LeadStatusCollection = new List<LeadStatusModel>();
                        for (int i = 0; i < dtData.Rows.Count; i++)
                        {
                            var vals = dtData.Rows[i].ItemArray;
                            ObjuserModel = new LeadStatusModel
                            {
                                id = StringUtil.getInt(vals[0].ToString()),
                                lead_status_name = StringUtil.nullIfEmpty(vals[1].ToString()),
                                lead_status_stage = StringUtil.nullIfEmpty(vals[2].ToString()),
                                lead_status_persentage = StringUtil.getDecimal(vals[3].ToString()),
                                allowed_activity = StringUtil.nullIfEmpty(vals[4].ToString()),
                                allowed_followup_activity = StringUtil.nullIfEmpty(vals[5].ToString()),
                                email_template_id = StringUtil.getInt(vals[6].ToString()),
                                isactive = StringUtil.getInt(vals[7].ToString())
                            };
                            LeadStatusCollection.Add(ObjuserModel);
                        }
                    }
                    string errorCode = outErrorCode.Value.ToString();
                    string errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("GetAllLeadStatusCollection Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, GetAllLeadStatusCollection Records returned-{0}", dtData != null ? dtData.Rows.Count : 0);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in GetAllLeadStatus method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return LeadStatusCollection;
        }

        [HttpGet]
        [ActionName("DeleteLeadStatus")]
        public HttpResponseMessage DeleteLeadStatus(int LeadStatusID)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Delete LeadStatus");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_LeadStatus_DELETE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", LeadStatusID);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Delete LeadStatus Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Delete LeadStatus Records returned-{0}", errorDesc);
                    log.Info("Delete records Data:::" + LeadStatusID);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in Delete LeadStatus method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        #endregion

        #region "LeadSource"
        [HttpPost]
        [ActionName("InsertLeadSource")]
        public HttpResponseMessage InsertLeadSources(LeadSourceModel user)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving InsertLeadSources ");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_LeadSource_INSERT", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@i_id", user.id);

                    cmd.Parameters.AddWithValue("@i_lead_source_name", user.lead_source_name);
                    cmd.Parameters.AddWithValue("@i_isactive", user.isactive);
                    cmd.Parameters.AddWithValue("@i_cuid", user.cuid);
                    cmd.Parameters.AddWithValue("@i_cuid", user.cuid);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("InsertLeadSources Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, InsertLeadSources Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in InsertLeadSources method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            //return new CreateResponse(HttpStatusCode.OK,) { Content = new StringContent(errorDesc) };
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpPost]
        [ActionName("UpdateLeadSource")]
        public HttpResponseMessage UpdateLeadSource(LeadSourceModel user)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving UpdateLeadSource ");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_LeadSource_UPDATE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@i_id", user.id);

                    cmd.Parameters.AddWithValue("@i_lead_source_name", user.lead_source_name);                    
                    cmd.Parameters.AddWithValue("@i_isactive", user.isactive);                   
                    cmd.Parameters.AddWithValue("@i_cuid", user.cuid);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("UpdateLeadSource Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, UpdateLeadSource Records returned-{0}", errorDesc);
                    log.Info("Insert Data:::" + JsonConvert.SerializeObject(errorDesc));
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in UpdateLeadSource method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            //return new CreateResponse(HttpStatusCode.OK,) { Content = new StringContent(errorDesc) };
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }

        [HttpGet]
        [ActionName("GetAllLeadSource")]
        public List<LeadSourceModel> GetAllLeadSourceCollection()
        {
            DataTable dtData = null;
            SqlDataAdapter adapter = null;
            List<LeadSourceModel> LeadSourceCollection = new List<LeadSourceModel>();
            LeadSourceModel ObjuserModel = new LeadSourceModel();
            try
            {
                log.DebugFormat("Retrieving All LeadSource Collections");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_GET_ALL_LeadSource", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    adapter = new SqlDataAdapter(cmd);
                    dtData = new DataTable();
                    adapter.Fill(dtData);
                    if (dtData.Rows.Count > 0)
                    {
                        LeadSourceCollection = new List<LeadSourceModel>();
                        for (int i = 0; i < dtData.Rows.Count; i++)
                        {
                            var vals = dtData.Rows[i].ItemArray;
                            ObjuserModel = new LeadSourceModel
                            {
                                id = StringUtil.getInt(vals[0].ToString()),
                                lead_source_name = StringUtil.nullIfEmpty(vals[1].ToString()),
                                isactive = StringUtil.getInt(vals[2].ToString())
                              

                            };
                            LeadSourceCollection.Add(ObjuserModel);
                        }
                    }
                    string errorCode = outErrorCode.Value.ToString();
                    string errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("GetAllLeadSourceCollection Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, GetAllLeadSourceCollection Records returned-{0}", dtData != null ? dtData.Rows.Count : 0);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in GetAllLeadSource method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return LeadSourceCollection;
        }

        [HttpGet]
        [ActionName("DeleteLeadSource")]
        public HttpResponseMessage DeleteLeadSource(int LeadSourceID)
        {
            string errorDesc = string.Empty;
            string errorCode = string.Empty;
            try
            {
                log.DebugFormat("Retrieving Delete LeadSource");

                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["iCovCon"].ToString()))
                {
                    SqlParameter outErrorCode = new SqlParameter("@o_ErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    SqlParameter outErrorDesc = new SqlParameter("@o_ErrorDescription", SqlDbType.VarChar, 5000) { Direction = ParameterDirection.Output };

                    SqlCommand cmd = new SqlCommand("SP_LeadSource_DELETE", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@I_ID", LeadSourceID);
                    cmd.Parameters.Add(outErrorCode);
                    cmd.Parameters.Add(outErrorDesc);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    errorCode = outErrorCode.Value.ToString();
                    errorDesc = outErrorDesc.Value.ToString();
                    log.DebugFormat("Delete LeadSource Result:{0}", errorDesc);
                    log.DebugFormat("Procedure executed successfully, Delete LeadSource Records returned-{0}", errorDesc);
                    log.Info("Delete records Data:::" + LeadSourceID);
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Exception in Delete LeadSource method in database layer:{0}|{1}", ex.Message, ex.StackTrace);
            }
            return Request.CreateResponse(HttpStatusCode.OK, errorDesc, "application/json");
        }
        #endregion


    }
}
