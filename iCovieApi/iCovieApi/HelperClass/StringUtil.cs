using System;

namespace iCovieApi.HelperClass
{
    public class StringUtil
    {
        private static readonly log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        public static string Base64Encode(string plainText)
        {
            var plainTextBytes = System.Text.Encoding.UTF8.GetBytes(plainText);
            return System.Convert.ToBase64String(plainTextBytes);
        }

        public static string notNull(string plainText)
        {
            if (plainText == null)
                return "";
            else
                return plainText.Trim();
        }

        public static string nullIfEmpty(object plainText)
        {
            if (plainText == null)
                return null;
            else
            {
                if (plainText.ToString().Trim().Length == 0 || plainText.ToString().Trim() == "null")
                    return null;
                else
                    return plainText.ToString().Trim();
            }
        }

        public static string trimString(Object plainText, int strLen)
        {
            string res = "";
            try
            {
                if (plainText != null)
                {
                    res = plainText.ToString().Trim();
                    if (res.Length > strLen)
                    {
                        res = res.Substring(0, strLen);
                    }
                }
            }
            catch (Exception exp)
            {
                log.Error("Exception while processing StringUtil:trimString() for Value:" + plainText, exp);
            }
            return res;
        }

        public static int getInt(string str)
        {
            int res = 0;
            try
            {
                if (str != null && str.ToString().Trim().Length > 0)
                {
                    res = int.Parse(str.ToString().Trim());
                }
            }
            catch (Exception exp)
            {
                log.Error("Exception while processing StringUtil:getInt() for Value:" + str, exp);
            }
            return res;
        }

        public static long getLong(string str)
        {
            long res = 0;
            try
            {
                if (str != null && str.ToString().Trim().Length > 0)
                {
                    res = long.Parse(str.ToString().Trim());
                }
            }
            catch (Exception exp)
            {
                log.Error("Exception while processing StringUtil:getLong() for Value:" + str, exp);
            }
            return res;
        }

        public static double getDouble(string str)
        {
            double res = 0;
            try
            {
                if (str != null && str.ToString().Trim().Length > 0)
                {
                    res = double.Parse(str.ToString().Trim());
                }
            }
            catch (Exception exp)
            {
                log.Error("Exception while processing StringUtil:getDouble() for Value:" + str, exp);
            }
            return res;
        }

        public static decimal getDecimal(string str)
        {
            decimal res = 0;
            try
            {
                if (str != null && str.ToString().Trim().Length > 0)
                {
                    res = decimal.Parse(str.ToString().Trim());
                }
            }
            catch (Exception exp)
            {
                log.Error("Exception while processing StringUtil:getDouble() for Value:" + str, exp);
            }
            return res;
        }

        public static Boolean getBoolean(string str)
        {
            Boolean res = false;
            try
            {
                if (str != null && str.ToString().Trim().Length > 0)
                {
                    //res = Boolean.Parse(str.ToString().Trim());
                    switch (str.Trim().ToUpper())
                    {
                        case "TRUE":
                        case "YES":
                        case "1":
                            res = true;
                            break;

                        default:
                            res = false;
                            break;
                    }
                }
            }
            catch (Exception exp)
            {
                log.Error("Exception while processing StringUtil:getBoolean() for Value:" + str, exp);
            }
            return res;
        }
        public static string ConvertSecondstoHoursMiniutesSeconds(string inpseconds)
        {
            double total_seconds = Convert.ToDouble(inpseconds);
            TimeSpan time = TimeSpan.FromSeconds(total_seconds);

            string timeformat = string.Format("{0}:{1}:{2}", Math.Floor(time.TotalHours).ToString().PadLeft(2, '0'),
                                          time.Minutes.ToString().PadLeft(2, '0'),
                                          time.Seconds.ToString().PadLeft(2, '0'));

            return timeformat;
        }
        public static string GetPercentage(string ratio)
        {
            string Values = string.Empty;
            string[] arrayValues = ratio.ToString().Split('.');
            if (arrayValues.Length > 1)
                Values = arrayValues[0] + "." + arrayValues[1].ToString().Substring(0, 1) + "%";
            else
                Values = ratio + ".0%";
            return Values;
        }

    }
}