using IAM1.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace IAM1.Server.Controllers
{
    [ApiController]
    [Route("api/training_all")]
    public class TrainingAllController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public TrainingAllController( IConfiguration configuration) {
            _configuration = configuration;
        }

        // =====================================================
        // GET ALL TRAINING
        // =====================================================

        [HttpGet]
        public IActionResult GetTraining()
        {
            var trainings = new List<object>();
            using var connection = new SqliteConnection(
                    _configuration.GetConnectionString(
                        "DefaultConnection"
                    )
                );

            connection.Open();
            const string sql = @"
                SELECT
                    TrainingId,
                    TrainingName,
                    Description
                FROM Training
                ORDER BY TrainingName;
            ";

            using var command = new SqliteCommand(sql, connection);
            using var reader = command.ExecuteReader();
            while (reader.Read()) {
                trainings.Add(new {
                    trainingId = reader.GetInt32(reader.GetOrdinal("TrainingId")),
                    trainingName = reader["TrainingName"]?.ToString(),
                    description = reader["Description"]?.ToString()
                });
            }

            return Ok(trainings);
        }


        // =====================================================
        // CREATE TRAINING
        // =====================================================

        [HttpPost]
        public IActionResult CreateTraining( [FromBody] Training training)
        {
            using var connection = new SqliteConnection(
                    _configuration.GetConnectionString(
                        "DefaultConnection"
                    )
                );

            connection.Open();

            const string sql = @"
                INSERT INTO Training (
                    TrainingName,
                    Description,
                    IsActive,
                    CreatedDate,
                    CreateBy
                )
                VALUES (
                    @TrainingName,
                    @Description,
                    1,
                    CURRENT_TIMESTAMP,
                    @CreateBy
                );
            ";

            using var command = new SqliteCommand(sql, connection);
            command.Parameters.AddWithValue( "@TrainingName", training.TrainingName);
            command.Parameters.AddWithValue( "@Description", training.Description ?? "");
            command.Parameters.AddWithValue( "@CreateBy", training.CreateBy ?? "system");
            command.ExecuteNonQuery();

            return Ok(new {
                success = true,
                message = "Training created successfully."
            });
        }


        // =====================================================
        // UPDATE TRAINING
        // =====================================================

        [HttpPut("{trainingId}")]
        public IActionResult UpdateTraining( int trainingId, [FromBody] Training request)
        {
            using var connection = new SqliteConnection( 
                _configuration.GetConnectionString(
                        "DefaultConnection"
                    )
                );

            connection.Open();
            const string sql = @"
                UPDATE Training
                SET
                    TrainingName = @TrainingName,
                    Description = @Description,
                    UpdatedDate = CURRENT_TIMESTAMP,
                    UpdateBy = @UpdateBy
                WHERE TrainingId = @TrainingId
            ";

            using var command = new SqliteCommand(sql, connection);
            command.Parameters.AddWithValue( "@TrainingId", trainingId);
            command.Parameters.AddWithValue( "@TrainingName", request.TrainingName);
            command.Parameters.AddWithValue( "@Description", request.Description ?? "");
            command.Parameters.AddWithValue( "@UpdateBy", request.UpdateBy ?? "system");

            var rows = command.ExecuteNonQuery();
            if (rows == 0) {
                return NotFound(new {
                    success = false,
                    message =
                        "Training not found."
                });
            }

            return Ok(new {
                success = true,
                message =
                    "Training updated successfully."
            });
        }


        // =====================================================
        // DELETE TRAINING
        // =====================================================

        [HttpDelete("{trainingId}")]
        public IActionResult DeleteTraining( int trainingId)
        {
            using var connection = new SqliteConnection(
                    _configuration.GetConnectionString(
                        "DefaultConnection"
                    )
                );

            connection.Open();

            // -------------------------------------
            // Check Role Assignment
            // -------------------------------------

            const string checkSql = @"
                SELECT
                    r.RoleName
                FROM RoleTraining rt

                INNER JOIN Role r
                    ON rt.RoleId = r.RoleId

                WHERE rt.TrainingId = @TrainingId

                ORDER BY r.RoleName
            ";

            using var checkCommand = new SqliteCommand( checkSql, connection);
            checkCommand.Parameters.AddWithValue( "@TrainingId", trainingId);

            var assignedRoles = new List<string>();
            using ( var reader = checkCommand.ExecuteReader())
            {
                while (reader.Read())
                {
                    assignedRoles.Add(
                        reader["RoleName"]
                            ?.ToString()
                        ?? ""
                    );
                }
            }

            // -------------------------------------
            // Prevent Delete
            // -------------------------------------

            if (assignedRoles.Count > 0)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Cannot delete training because it is assigned to roles.",
                    assignedRoles
                });
            }

            // -------------------------------------
            // Delete Training
            // -------------------------------------

            const string deleteSql = @"
                DELETE FROM Training
                WHERE TrainingId = @TrainingId
            ";

            using var deleteCommand = new SqliteCommand( deleteSql, connection);

            deleteCommand.Parameters.AddWithValue( "@TrainingId", trainingId);

            var rows = deleteCommand.ExecuteNonQuery();
            if (rows == 0)
            {
                return NotFound(new
                {
                    success = false,
                    message = "Training not found."
                });
            }

            return Ok(new
            {
                success = true,
                message = "Training deleted successfully."
            });
        }
    }
}