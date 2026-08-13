using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;

namespace IAM1.Server.Controllers
{
    [ApiController]
    [Route("api/role_all")]
    public class RoleAllController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public RoleAllController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        public IActionResult GetAllRoles()
        {
            var connectionString =
                _configuration.GetConnectionString("DefaultConnection");

            var roles = new List<object>();

            using var connection = new SqliteConnection(connectionString);

            connection.Open();

            const string sql = @"
                SELECT
                    RoleId,
                    RoleName,
                    Description
                FROM Role
                WHERE IsActive = 1
                ORDER BY RoleId;
            ";

            using var command = new SqliteCommand(sql, connection);

            using var reader = command.ExecuteReader();

            while (reader.Read())
            {
                roles.Add(new
                {
                    id = reader.GetInt32(
                        reader.GetOrdinal("RoleId")
                    ),

                    roleName = reader["RoleName"]?.ToString() ?? "",

                    description = reader["Description"]?.ToString() ?? ""
                });
            }

            return Ok(roles);
        }
    }
}