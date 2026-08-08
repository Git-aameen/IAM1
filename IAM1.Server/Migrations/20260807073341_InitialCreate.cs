using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IAM1.Server.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UserProfiles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    FullName = table.Column<string>(type: "TEXT", nullable: false),
                    EmployeeId = table.Column<string>(type: "TEXT", nullable: false),
                    Gender = table.Column<string>(type: "TEXT", nullable: false),
                    DateOfBirth = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Email = table.Column<string>(type: "TEXT", nullable: false),
                    Phone = table.Column<string>(type: "TEXT", nullable: false),
                    OfficeLocation = table.Column<string>(type: "TEXT", nullable: false),
                    Department = table.Column<string>(type: "TEXT", nullable: false),
                    Position = table.Column<string>(type: "TEXT", nullable: false),
                    Manager = table.Column<string>(type: "TEXT", nullable: false),
                    JoinedDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    EmploymentStatus = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserProfiles", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "UserProfiles",
                columns: new[] { "Id", "DateOfBirth", "Department", "Email", "EmployeeId", "EmploymentStatus", "FullName", "Gender", "JoinedDate", "Manager", "OfficeLocation", "Phone", "Position" },
                values: new object[] { 1, new DateTime(1992, 5, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), "Information Technology", "johnathan.s@company.com", "EMP-2024-0089", "Full-Time Permanent", "Dracule Mihawk", "Male", new DateTime(2021, 1, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Sarah Jenkins (IT Director)", "Headquarter, Floor 12, Tech Tower", "+66 81 234 5678", "Senior System Administrator" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserProfiles");
        }
    }
}
