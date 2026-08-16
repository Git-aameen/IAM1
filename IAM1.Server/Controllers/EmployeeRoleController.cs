using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;

namespace IAM1.Server.Controllers
{
    [ApiController]
    [Route("api/profile/{employeeId}/roles")]
    public class EmployeeRoleController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public EmployeeRoleController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // ดึง role ทั้งหมดที่ผูกกับพนักงานคนนี้
        [HttpGet]
        public IActionResult GetEmployeeRoles(string employeeId)
        {
            using var connection = new SqliteConnection(
                _configuration.GetConnectionString("DefaultConnection")
            );

            connection.Open();

            const string sql = @"
                SELECT
                    r.RoleId,
                    r.RoleName,
                    r.Description,
                    ur.IsPrimary
                FROM UserRole ur
                INNER JOIN Role r
                    ON ur.RoleId = r.RoleId
                WHERE ur.EmployeeId = @EmployeeId
                ORDER BY ur.IsPrimary DESC, r.RoleName
            ";

            using var command = new SqliteCommand(sql, connection);
            command.Parameters.AddWithValue("@EmployeeId", employeeId);

            using var reader = command.ExecuteReader();

            var result = new List<object>();

            while (reader.Read())
            {
                result.Add(new
                {
                    id = reader.GetInt32(reader.GetOrdinal("RoleId")),
                    roleName = reader["RoleName"]?.ToString() ?? "",
                    description = reader["Description"]?.ToString() ?? "",
                    isPrimary = reader.GetInt32(reader.GetOrdinal("IsPrimary")) == 1
                });
            }

            return Ok(result);
        }

        // บันทึก role ทั้งหมดของพนักงานคนนี้ (ลบของเก่าทิ้งแล้วใส่ใหม่ตาม list ที่ส่งมา)
        [HttpPost]
        public IActionResult SaveEmployeeRoles(
            string employeeId,
            [FromBody] SaveEmployeeRolesDto dto
        )
        {
            using var connection = new SqliteConnection(
                _configuration.GetConnectionString("DefaultConnection")
            );

            connection.Open();

            using var transaction = connection.BeginTransaction();

            try
            {
                var deleteCommand = new SqliteCommand(
                    "DELETE FROM UserRole WHERE EmployeeId = @EmployeeId",
                    connection,
                    transaction
                );

                deleteCommand.Parameters.AddWithValue("@EmployeeId", employeeId);
                deleteCommand.ExecuteNonQuery();

                foreach (var roleId in dto.RoleIds)
                {
                    var isPrimary =
                        dto.PrimaryRoleId.HasValue &&
                        dto.PrimaryRoleId.Value == roleId
                            ? 1
                            : 0;

                    var insertCommand = new SqliteCommand(
                        @"
                        INSERT INTO UserRole
                        (
                            EmployeeId,
                            RoleId,
                            IsPrimary,
                            AssignedDate
                        )
                        VALUES
                        (
                            @EmployeeId,
                            @RoleId,
                            @IsPrimary,
                            CURRENT_TIMESTAMP
                        )
                        ",
                        connection,
                        transaction
                    );

                    insertCommand.Parameters.AddWithValue("@EmployeeId", employeeId);
                    insertCommand.Parameters.AddWithValue("@RoleId", roleId);
                    insertCommand.Parameters.AddWithValue("@IsPrimary", isPrimary);

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

    public class SaveEmployeeRolesDto
    {
        public List<int> RoleIds { get; set; } = new();
        public int? PrimaryRoleId { get; set; }
    }
}