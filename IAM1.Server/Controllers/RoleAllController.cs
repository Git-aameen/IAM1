using IAM1.Server.Models;
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

        // ดึง training ทั้งหมดในระบบ (สำหรับ dropdown เลือกเพิ่ม)
        [HttpGet("all-trainings")]
        public IActionResult GetAllTrainings()
        {
            using var connection = new SqliteConnection(
                    _configuration.GetConnectionString("DefaultConnection")
                );

            connection.Open();

            const string sql = @"
                SELECT
                    TrainingId,
                    TrainingName,
                    Description
                FROM Training
                ORDER BY TrainingId
            ";

            using var command = new SqliteCommand(sql, connection);

            using var reader = command.ExecuteReader();

            var result = new List<Training>();

            while (reader.Read())
            {
                result.Add(
                    new Training
                    {
                        TrainingId = reader.GetInt32(0),
                        TrainingName = reader.GetString(1),
                        Description = reader.IsDBNull(2) ? "" : reader.GetString(2)
                    }
                );
            }

            return Ok(result);
        }

        [HttpGet("{roleId}/trainings")]
        public IActionResult GetRoleTrainings(int roleId)
        {
            using var connection = new SqliteConnection(
                    _configuration.GetConnectionString(
                        "DefaultConnection"
                    )
                );

            connection.Open();

            const string sql = @"
                                SELECT
                                    t.TrainingId,
                                    t.TrainingName,
                                    t.Description
                                FROM RoleTraining rt
                                INNER JOIN Training t
                                    ON rt.TrainingId = t.TrainingId
                                WHERE rt.RoleId = @RoleId
                            ";

            using var command = new SqliteCommand(
                    sql,
                    connection
                );

            command.Parameters.AddWithValue(
                "@RoleId",
                roleId
            );

            var reader = command.ExecuteReader();
            var result = new List<Training>();
            while (reader.Read())
            {
                result.Add(
                    new Training
                    {
                        TrainingId = reader.GetInt32(0),
                        TrainingName = reader.GetString(1),
                        Description = reader.GetString(2)
                    }
                );
            }

            return Ok(result);
        }

        [HttpGet("{roleId}")]
        public IActionResult GetRoleById(int roleId)
        {
            using var connection =
                new SqliteConnection(
                    _configuration.GetConnectionString(
                        "DefaultConnection"
                    )
                );

            connection.Open();

            const string sql = @"
                SELECT
                    RoleId,
                    RoleName,
                    Description
                FROM Role
                WHERE RoleId = @RoleId
            ";

            using var command =
                new SqliteCommand(
                    sql,
                    connection
                );

            command.Parameters.AddWithValue(
                "@RoleId",
                roleId
            );

            using var reader =
                command.ExecuteReader();

            if (!reader.Read())
            {
                return NotFound();
            }

            return Ok(new
            {
                id = reader.GetInt32(0),
                roleName = reader.GetString(1),
                description = reader.IsDBNull(2)
                    ? ""
                    : reader.GetString(2)
            });
        }

        // เพิ่ม Role ใหม่
        [HttpPost]
        public IActionResult CreateRole([FromBody] RoleUpsertDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.RoleName))
            {
                return BadRequest("Role name is required.");
            }

            using var connection = new SqliteConnection(
                    _configuration.GetConnectionString("DefaultConnection")
                );

            connection.Open();

            const string sql = @"
                INSERT INTO Role
                (
                    RoleName,
                    Description,
                    IsActive
                )
                VALUES
                (
                    @RoleName,
                    @Description,
                    1
                );

                SELECT last_insert_rowid();
            ";

            using var command = new SqliteCommand(sql, connection);

            command.Parameters.AddWithValue("@RoleName", dto.RoleName);
            command.Parameters.AddWithValue("@Description", dto.Description ?? "");

            var newId = Convert.ToInt32((long)command.ExecuteScalar()!);

            return Ok(new
            {
                id = newId,
                roleName = dto.RoleName,
                description = dto.Description
            });
        }

        // แก้ไข Role
        [HttpPut("{roleId}")]
        public IActionResult UpdateRole(int roleId, [FromBody] RoleUpsertDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.RoleName))
            {
                return BadRequest("Role name is required.");
            }

            using var connection = new SqliteConnection(
                    _configuration.GetConnectionString("DefaultConnection")
                );

            connection.Open();

            const string sql = @"
                UPDATE Role
                SET
                    RoleName = @RoleName,
                    Description = @Description
                WHERE RoleId = @RoleId
            ";

            using var command = new SqliteCommand(sql, connection);

            command.Parameters.AddWithValue("@RoleName", dto.RoleName);
            command.Parameters.AddWithValue("@Description", dto.Description ?? "");
            command.Parameters.AddWithValue("@RoleId", roleId);

            var rows = command.ExecuteNonQuery();

            if (rows == 0)
            {
                return NotFound();
            }

            return Ok(new
            {
                id = roleId,
                roleName = dto.RoleName,
                description = dto.Description
            });
        }

        // ลบ Role (soft delete)
        [HttpDelete("{roleId}")]
        public IActionResult DeleteRole(int roleId)
        {
            using var connection = new SqliteConnection(
                    _configuration.GetConnectionString("DefaultConnection")
                );

            connection.Open();

            const string sql = @"
                UPDATE Role
                SET IsActive = 0
                WHERE RoleId = @RoleId
            ";

            using var command = new SqliteCommand(sql, connection);

            command.Parameters.AddWithValue("@RoleId", roleId);

            var rows = command.ExecuteNonQuery();

            if (rows == 0)
            {
                return NotFound();
            }

            return Ok();
        }

        [HttpPost("{roleId}/trainings")]
        public IActionResult SaveRoleTrainings(
            int roleId,
            [FromBody] List<int> trainingIds
        )
        {
            using var connection =
                new SqliteConnection(
                    _configuration.GetConnectionString(
                        "DefaultConnection"
                    )
                );

            connection.Open();

            using var transaction =
                connection.BeginTransaction();

            try
            {
                var deleteCommand =
                    new SqliteCommand(
                        @"
                DELETE FROM RoleTraining
                WHERE RoleId = @RoleId
                ",
                        connection,
                        transaction
                    );

                deleteCommand.Parameters.AddWithValue(
                    "@RoleId",
                    roleId
                );

                deleteCommand.ExecuteNonQuery();

                foreach (var trainingId in trainingIds)
                {
                    var insertCommand =
                        new SqliteCommand(
                            @"
                    INSERT INTO RoleTraining
                    (
                        RoleId,
                        TrainingId,
                        CreatedDate
                    )
                    VALUES
                    (
                        @RoleId,
                        @TrainingId,
                        CURRENT_TIMESTAMP
                    )
                    ",
                            connection,
                            transaction
                        );

                    insertCommand.Parameters.AddWithValue(
                        "@RoleId",
                        roleId
                    );

                    insertCommand.Parameters.AddWithValue(
                        "@TrainingId",
                        trainingId
                    );

                    insertCommand.ExecuteNonQuery();
                }

                transaction.Commit();

                return Ok();
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }
    }

    public class RoleUpsertDto
    {
        public string RoleName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }
}