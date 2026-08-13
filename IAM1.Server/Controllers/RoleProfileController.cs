using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;

namespace IAM1.Server.Controllers
{
    [ApiController]
    [Route("api/role_profile")]
    public class RoleProfileController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public RoleProfileController(IConfiguration configuration)
        {
            _configuration = configuration;
        }


        // =========================================================
        // GET Role Profile
        // =========================================================

        [HttpGet]
        public IActionResult GetRoleProfile(int roleId)
        {
            var connectionString =
                _configuration.GetConnectionString("DefaultConnection");

            using var connection =
                new SqliteConnection(connectionString);

            connection.Open();


            // =====================================================
            // Get Role
            // =====================================================

            const string roleSql = @"
                SELECT
                    RoleId,
                    RoleName,
                    Description,
                    IsActive
                FROM Role
                WHERE RoleId = @RoleId;
            ";

            using var roleCommand =
                new SqliteCommand(roleSql, connection);

            roleCommand.Parameters.AddWithValue(
                "@RoleId",
                roleId
            );

            using var roleReader =
                roleCommand.ExecuteReader();


            if (!roleReader.Read())
            {
                return NotFound(new
                {
                    message = "Role not found."
                });
            }


            var role = new
            {
                id = roleReader.GetInt32(
                    roleReader.GetOrdinal("RoleId")
                ),

                roleName =
                    roleReader["RoleName"]?.ToString() ?? "",

                description =
                    roleReader["Description"]?.ToString() ?? "",

                isActive =
                    Convert.ToInt32(
                        roleReader["IsActive"]
                    )
            };


            roleReader.Close();


            // =====================================================
            // Get Training from RoleTraining
            // =====================================================

            const string trainingSql = @"
                SELECT
                    t.TrainingId,
                    t.TrainingName,
                    t.Description
                FROM RoleTraining rt

                INNER JOIN Training t
                    ON rt.TrainingId = t.TrainingId

                WHERE rt.RoleId = @RoleId

                ORDER BY t.TrainingId;
            ";


            using var trainingCommand =
                new SqliteCommand(
                    trainingSql,
                    connection
                );

            trainingCommand.Parameters.AddWithValue(
                "@RoleId",
                roleId
            );


            var trainings = new List<object>();


            using var trainingReader =
                trainingCommand.ExecuteReader();


            while (trainingReader.Read())
            {
                trainings.Add(new
                {
                    id = trainingReader.GetInt32(
                        trainingReader.GetOrdinal(
                            "TrainingId"
                        )
                    ),

                    trainingName =
                        trainingReader["TrainingName"]
                            ?.ToString() ?? "",

                    description =
                        trainingReader["Description"]
                            ?.ToString() ?? ""
                });
            }


            // =====================================================
            // Return
            // =====================================================

            return Ok(new
            {
                role,
                trainings
            });
        }
    }
}