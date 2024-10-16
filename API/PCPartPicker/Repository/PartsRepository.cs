//using Dapper;
//using PCPartPicker.Interface;
//using PCPartPicker.Model;
//using System.Data;
//using System.Data.SqlClient;

//namespace PCPartPicker.Repository
//{
//    public class PartsRepository: IParts
//    {
//        private readonly string _context;
//        public PartsRepository(string context)
//        {
//            _context = context;
//        }

//        public List<CaseModel> GetCases()
//        {
//            List<CaseModel> objCaseModel= new List<CaseModel>();
//            try
//            {
//                using (SqlConnection con = new SqlConnection(_context))
//                {
//                    con.Open();
//                    string cmd = "SELECT TOP 10 * FROM pccase";
//                    var parts = con.Query<CaseModel>(cmd);
//                    return parts.ToList();
//                }
//            }
//            catch (Exception ex)
//            {
//                _ = ex.Message;
//            }
//            return objCaseModel;
//        }

//        public List<HarddriveModel> GetHarddrives()
//        {
//            List<HarddriveModel> objHarddriveModel= new List<HarddriveModel>();
//            try
//            {
//                using (SqlConnection con = new SqlConnection(_context))
//                {
//                    con.Open();
//                    string cmd = "SELECT TOP 10 * FROM harddrive";
//                    var parts = con.Query<HarddriveModel>(cmd);
//                    return parts.ToList();
//                }
//            }
//            catch (Exception ex)
//            {
//                _ = ex.Message;
//            }
//            return objHarddriveModel;
//        }

//        public List<MemoryModel> GetMemories()
//        {
//            List<MemoryModel> objMemoryModel= new List<MemoryModel>();
//            try
//            {
//                using (SqlConnection con = new SqlConnection(_context))
//                {
//                    con.Open();
//                    string cmd = "SELECT TOP 10 * FROM memory";
//                    var parts = con.Query<MemoryModel>(cmd);
//                    return parts.ToList();
//                }
//            }
//            catch (Exception ex)
//            {
//                _ = ex.Message;
//            }
//            return objMemoryModel;
//        }

//        public List<MotherboardModel> GetMotherboards()
//        {
//            List<MotherboardModel> objMotherboardModel= new List<MotherboardModel>();
//            try
//            {
//                using (SqlConnection con = new SqlConnection(_context))
//                {
//                    con.Open();
//                    string cmd = "SELECT TOP 10 * FROM motherboard";
//                    var parts = con.Query<MotherboardModel>(cmd);
//                    return parts.ToList();
//                }
//            }
//            catch (Exception ex)
//            {
//                _ = ex.Message;
//            }
//            return objMotherboardModel;
//        }

//        public List<PowersupplyModel> GetPowersupplies()
//        {
//            List<PowersupplyModel> objPowersupplyModel= new List<PowersupplyModel>();
//            try
//            {
//                using (SqlConnection con = new SqlConnection(_context))
//                {
//                    con.Open();
//                    string cmd = "SELECT TOP 10 * FROM powersupply";
//                    var parts = con.Query<PowersupplyModel>(cmd);
//                    return parts.ToList();
//                }
//            }
//            catch (Exception ex)
//            {
//                _ = ex.Message;
//            }
//            return objPowersupplyModel;
//        }

//        public List<ProcessorModel> GetProcessors()
//        {
//            List<ProcessorModel> objProcessorModel= new List<ProcessorModel>();
//            try
//            {
//                using (SqlConnection con = new SqlConnection(_context))
//                {
//                    con.Open();
//                    string cmd = "SELECT TOP 10 * FROM processor";
//                    var parts = con.Query<ProcessorModel>(cmd);
//                    return parts.ToList();
//                }
//            }
//            catch (Exception ex)
//            {
//                _ = ex.Message;
//            }
//            return objProcessorModel;
//        }

//        public List<VideocardModel> GetVideocards()
//        {
//            List<VideocardModel> objVideocardModel = new List<VideocardModel>();
//            try
//            {
//                using (SqlConnection con = new SqlConnection(_context)) 
//                {
//                    con.Open();
//                    string cmd = "SELECT TOP 20 * FROM videocard";
//                    var parts = con.Query<VideocardModel>(cmd);
//                    return parts.ToList();
//                }
//            }
//            catch(Exception ex)
//            {
//                _ = ex.Message;
//            }
//            return objVideocardModel;
//        }
//    }
//}
