using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Linq.Expressions;
using System.Threading.Tasks;
using WebApplication1.Models;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace WebApplication1.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<BookController> _logger;

        public BookController(IConfiguration configuration, ILogger<BookController> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        [HttpGet]
        public JsonResult Get()
        {
            try
            {

                string query = @"
                             SELECT * FROM Book
                            ";
                DataTable table = new DataTable();
                string sqlDataSource = _configuration.GetConnectionString("BookApp");
                SqlDataReader myReader;
                using (SqlConnection myCon = new SqlConnection(sqlDataSource))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        myReader = myCommand.ExecuteReader();
                        table.Load(myReader);
                        myReader.Close();
                        myCon.Close();
                    }
                }

                return new JsonResult(table);
            }
            catch (Exception ex)
            {
                // Log the exception details
                _logger.LogError(ex, "An error occurred while executing the SQL query.");

                // Rethrow the exception to propagate it further
                throw;
            }


        }
    }
}


