using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PCPartPicker.Migrations.ApplicationDb
{
    /// <inheritdoc />
    public partial class Baseline : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CartItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", maxLength: 100, nullable: false),
                    PartType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    PartId = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__CartItem__3214EC07DE21E7B8", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CartItems_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    OrderID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserID = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    OrderDate = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())"),
                    TotalPrice = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Orders__C3905BAFDCC59907", x => x.OrderID);
                    table.ForeignKey(
                        name: "FK__Orders__UserID__151B244E",
                        column: x => x.UserID,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Configuration",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MotherboardId = table.Column<int>(type: "int", nullable: true),
                    ProcessorId = table.Column<int>(type: "int", nullable: true),
                    VideocardId = table.Column<int>(type: "int", nullable: true),
                    MemoryId = table.Column<int>(type: "int", nullable: true),
                    PowersupplyId = table.Column<int>(type: "int", nullable: true),
                    CaseId = table.Column<int>(type: "int", nullable: true),
                    StorageId = table.Column<int>(type: "int", nullable: true),
                    CoolerId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Configur__3214EC07E9CFA21A", x => x.Id);
                    table.ForeignKey(
                        name: "FK__Configura__CaseI__0E6E26BF",
                        column: x => x.CaseId,
                        principalTable: "pccase",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK__Configura__Coole__10566F31",
                        column: x => x.CoolerId,
                        principalTable: "cpucooler",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK__Configura__Memor__0C85DE4D",
                        column: x => x.MemoryId,
                        principalTable: "memory",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK__Configura__Mothe__09A971A2",
                        column: x => x.MotherboardId,
                        principalTable: "motherboard",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK__Configura__Power__0D7A0286",
                        column: x => x.PowersupplyId,
                        principalTable: "powersupply",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK__Configura__Proce__0A9D95DB",
                        column: x => x.ProcessorId,
                        principalTable: "processor",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK__Configura__Stora__0F624AF8",
                        column: x => x.StorageId,
                        principalTable: "harddrive",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK__Configura__UserI__08B54D69",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK__Configura__Video__0B91BA14",
                        column: x => x.VideocardId,
                        principalTable: "videocard",
                        principalColumn: "id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_CartItems_UserId",
                table: "CartItems",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Configuration_CaseId",
                table: "Configuration",
                column: "CaseId");

            migrationBuilder.CreateIndex(
                name: "IX_Configuration_CoolerId",
                table: "Configuration",
                column: "CoolerId");

            migrationBuilder.CreateIndex(
                name: "IX_Configuration_MemoryId",
                table: "Configuration",
                column: "MemoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Configuration_MotherboardId",
                table: "Configuration",
                column: "MotherboardId");

            migrationBuilder.CreateIndex(
                name: "IX_Configuration_PowersupplyId",
                table: "Configuration",
                column: "PowersupplyId");

            migrationBuilder.CreateIndex(
                name: "IX_Configuration_ProcessorId",
                table: "Configuration",
                column: "ProcessorId");

            migrationBuilder.CreateIndex(
                name: "IX_Configuration_StorageId",
                table: "Configuration",
                column: "StorageId");

            migrationBuilder.CreateIndex(
                name: "IX_Configuration_UserId",
                table: "Configuration",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Configuration_VideocardId",
                table: "Configuration",
                column: "VideocardId");


            migrationBuilder.CreateIndex(
                name: "IX_Orders_UserID",
                table: "Orders",
                column: "UserID");

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
