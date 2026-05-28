using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CourseManager.Server.Migrations
{
    /// <inheritdoc />
    public partial class FullDatabaseSetup : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CourseFiles_Files_FileAssetId",
                table: "CourseFiles");

            migrationBuilder.DropForeignKey(
                name: "FK_CourseSectionFiles_Files_FileAssetId",
                table: "CourseSectionFiles");

            migrationBuilder.DropForeignKey(
                name: "FK_GroupFiles_Files_FileAssetId",
                table: "GroupFiles");

            migrationBuilder.DropForeignKey(
                name: "FK_PersonFiles_Files_FileAssetId",
                table: "PersonFiles");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Files",
                table: "Files");

            migrationBuilder.RenameTable(
                name: "Files",
                newName: "FileAssets");

            migrationBuilder.RenameIndex(
                name: "IX_Files_FileName",
                table: "FileAssets",
                newName: "IX_FileAssets_FileName");

            migrationBuilder.AddPrimaryKey(
                name: "PK_FileAssets",
                table: "FileAssets",
                column: "FileAssetId");

            migrationBuilder.AddForeignKey(
                name: "FK_CourseFiles_FileAssets_FileAssetId",
                table: "CourseFiles",
                column: "FileAssetId",
                principalTable: "FileAssets",
                principalColumn: "FileAssetId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_CourseSectionFiles_FileAssets_FileAssetId",
                table: "CourseSectionFiles",
                column: "FileAssetId",
                principalTable: "FileAssets",
                principalColumn: "FileAssetId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_GroupFiles_FileAssets_FileAssetId",
                table: "GroupFiles",
                column: "FileAssetId",
                principalTable: "FileAssets",
                principalColumn: "FileAssetId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PersonFiles_FileAssets_FileAssetId",
                table: "PersonFiles",
                column: "FileAssetId",
                principalTable: "FileAssets",
                principalColumn: "FileAssetId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CourseFiles_FileAssets_FileAssetId",
                table: "CourseFiles");

            migrationBuilder.DropForeignKey(
                name: "FK_CourseSectionFiles_FileAssets_FileAssetId",
                table: "CourseSectionFiles");

            migrationBuilder.DropForeignKey(
                name: "FK_GroupFiles_FileAssets_FileAssetId",
                table: "GroupFiles");

            migrationBuilder.DropForeignKey(
                name: "FK_PersonFiles_FileAssets_FileAssetId",
                table: "PersonFiles");

            migrationBuilder.DropPrimaryKey(
                name: "PK_FileAssets",
                table: "FileAssets");

            migrationBuilder.RenameTable(
                name: "FileAssets",
                newName: "Files");

            migrationBuilder.RenameIndex(
                name: "IX_FileAssets_FileName",
                table: "Files",
                newName: "IX_Files_FileName");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Files",
                table: "Files",
                column: "FileAssetId");

            migrationBuilder.AddForeignKey(
                name: "FK_CourseFiles_Files_FileAssetId",
                table: "CourseFiles",
                column: "FileAssetId",
                principalTable: "Files",
                principalColumn: "FileAssetId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_CourseSectionFiles_Files_FileAssetId",
                table: "CourseSectionFiles",
                column: "FileAssetId",
                principalTable: "Files",
                principalColumn: "FileAssetId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_GroupFiles_Files_FileAssetId",
                table: "GroupFiles",
                column: "FileAssetId",
                principalTable: "Files",
                principalColumn: "FileAssetId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PersonFiles_Files_FileAssetId",
                table: "PersonFiles",
                column: "FileAssetId",
                principalTable: "Files",
                principalColumn: "FileAssetId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
