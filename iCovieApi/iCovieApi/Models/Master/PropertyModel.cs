using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iCovieApi.Models
{
    public class PropertyModel
    {
        public int id { get; set; }
        public int companyid {get;set;}
        public string companyname { get; set; }
        public int locationid  {get;set;}
        public string locationname { get; set; }
        public int buildingid  {get;set;}
        public string buildingname { get; set; }
        public int floorid  {get;set;}
        public string floorname { get; set; }
        public int unitsid  {get;set;}
        public string unitname { get; set; }
        public string address  {get;set;}
        public string noofbeds { get; set; }
        public string noofboths { get; set; }
        public decimal sqft { get; set; }
        public decimal cost  {get;set;}
        public int facilitymangerid  {get;set;}
        public int facilityuserid  {get;set;}
        public int communitymangerid  {get;set;}
        public int communityuserid  {get;set;}
        public string pincode  {get;set;}
        public string description { get; set; }
        public decimal coordinates { get; set; }
        public decimal pricing  {get;set;}
        public string phoneno1 { get; set; }
        public string phoneno2 { get; set; }
        public string phoneno3 { get; set; }
        public List<PropertyAminitiesModel> AminitsTypeList { get; set; }
        public List<PropertyNeighbourCategorryTypeModel> NeighbourCategoryTypeList { get; set; }
        public List<PropertyImagesModel> ImagesList { get; set; }
        
        public decimal discountpricing { get; set; }
        public int bedtype { get; set; }
        public string bedtypename { get; set; }
        public int businesscategory { get; set; }
        public string businesscategoryname { get; set; }
        public int guesttype { get; set; }
        public string guesttypename { get; set; }
        public int propertycategory { get; set; }
        public string propertycategoryname { get; set; }
        public int propertytype { get; set; }
        public string propertytypename { get; set; }
        public string propertyname { get; set; }
        public string yearbuild { get; set; }
        public string propertyvideo { get; set; }
        public int gender { get; set; }
        public string gendername { get; set; }
        public int cid { get; set; }
    }
}