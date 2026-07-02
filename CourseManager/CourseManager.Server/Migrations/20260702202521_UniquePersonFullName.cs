using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CourseManager.Server.Migrations
{
    /// <inheritdoc />
    public partial class UniquePersonFullName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_People_FullName",
                table: "People");

            migrationBuilder.CreateIndex(
                name: "IX_People_FullName",
                table: "People",
                column: "FullName",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_People_FullName",
                table: "People");

            migrationBuilder.CreateIndex(
                name: "IX_People_FullName",
                table: "People",
                column: "FullName");
        }
    }
}
