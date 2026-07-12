using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CourseManager.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddUserScoping : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_People_FullName",
                table: "People");

            migrationBuilder.DropIndex(
                name: "IX_Courses_Name",
                table: "Courses");

            // Add UserId columns as nullable first so we can assign existing data
            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "People",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "FileAssets",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "Courses",
                type: "int",
                nullable: true);

            // Assign existing data to the first user
            migrationBuilder.Sql("UPDATE Courses SET UserId = (SELECT TOP 1 UserId FROM AppUsers ORDER BY UserId) WHERE UserId IS NULL");
            migrationBuilder.Sql("UPDATE People SET UserId = (SELECT TOP 1 UserId FROM AppUsers ORDER BY UserId) WHERE UserId IS NULL");
            migrationBuilder.Sql("UPDATE FileAssets SET UserId = (SELECT TOP 1 UserId FROM AppUsers ORDER BY UserId) WHERE UserId IS NULL");

            // Make columns non-nullable
            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "People",
                type: "int",
                nullable: false);

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "FileAssets",
                type: "int",
                nullable: false);

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "Courses",
                type: "int",
                nullable: false);

            migrationBuilder.CreateIndex(
                name: "IX_People_FullName",
                table: "People",
                column: "FullName");

            migrationBuilder.CreateIndex(
                name: "IX_People_UserId",
                table: "People",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_FileAssets_UserId",
                table: "FileAssets",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Courses_Name",
                table: "Courses",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_Courses_UserId",
                table: "Courses",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Courses_AppUsers_UserId",
                table: "Courses",
                column: "UserId",
                principalTable: "AppUsers",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FileAssets_AppUsers_UserId",
                table: "FileAssets",
                column: "UserId",
                principalTable: "AppUsers",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_People_AppUsers_UserId",
                table: "People",
                column: "UserId",
                principalTable: "AppUsers",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Courses_AppUsers_UserId",
                table: "Courses");

            migrationBuilder.DropForeignKey(
                name: "FK_FileAssets_AppUsers_UserId",
                table: "FileAssets");

            migrationBuilder.DropForeignKey(
                name: "FK_People_AppUsers_UserId",
                table: "People");

            migrationBuilder.DropIndex(
                name: "IX_People_FullName",
                table: "People");

            migrationBuilder.DropIndex(
                name: "IX_People_UserId",
                table: "People");

            migrationBuilder.DropIndex(
                name: "IX_FileAssets_UserId",
                table: "FileAssets");

            migrationBuilder.DropIndex(
                name: "IX_Courses_Name",
                table: "Courses");

            migrationBuilder.DropIndex(
                name: "IX_Courses_UserId",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "People");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "FileAssets");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Courses");

            migrationBuilder.CreateIndex(
                name: "IX_People_FullName",
                table: "People",
                column: "FullName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Courses_Name",
                table: "Courses",
                column: "Name",
                unique: true);
        }
    }
}
