using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PCPartPicker.Migrations.ApplicationDb
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SecurityStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "bit", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "bit", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "chipset_type",
                columns: table => new
                {
                    chipset_type_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    type = table.Column<string>(type: "varchar(512)", unicode: false, maxLength: 512, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__chipset___8AE4C0E34C588E3B", x => x.chipset_type_id);
                });

            migrationBuilder.CreateTable(
                name: "formfactor_type",
                columns: table => new
                {
                    formfactor_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    type = table.Column<string>(type: "varchar(512)", unicode: false, maxLength: 512, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__formfact__F8C41484C0183579", x => x.formfactor_id);
                });

            migrationBuilder.CreateTable(
                name: "harddrive_type",
                columns: table => new
                {
                    harddirve_type_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    type = table.Column<string>(type: "varchar(512)", unicode: false, maxLength: 512, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__harddriv__A4B39B9994C82C0B", x => x.harddirve_type_id);
                });

            migrationBuilder.CreateTable(
                name: "manufacturer_type",
                columns: table => new
                {
                    manufacturer_type_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    type = table.Column<string>(type: "varchar(512)", unicode: false, maxLength: 512, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__manufact__AA802FFD80347698", x => x.manufacturer_type_id);
                });

            migrationBuilder.CreateTable(
                name: "memory_type",
                columns: table => new
                {
                    memory_type_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    type = table.Column<string>(type: "varchar(512)", unicode: false, maxLength: 512, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__memory_t__00D6009C161AE41C", x => x.memory_type_id);
                });

            migrationBuilder.CreateTable(
                name: "series_type",
                columns: table => new
                {
                    series_type_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    type = table.Column<string>(type: "varchar(512)", unicode: false, maxLength: 512, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__series_t__BE02A4A882ED2B20", x => x.series_type_id);
                });

            migrationBuilder.CreateTable(
                name: "socket_type",
                columns: table => new
                {
                    socket_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    type = table.Column<string>(type: "varchar(512)", unicode: false, maxLength: 512, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__socket_t__58609DBFD57F45BC", x => x.socket_id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderKey = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CartItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
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
                name: "cpucooler",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "varchar(512)", unicode: false, maxLength: 512, nullable: true),
                    price = table.Column<decimal>(type: "decimal(18,0)", nullable: true),
                    rpm = table.Column<decimal>(type: "decimal(18,0)", nullable: true),
                    noise_level = table.Column<decimal>(type: "decimal(18,0)", nullable: true),
                    color = table.Column<string>(type: "varchar(512)", unicode: false, maxLength: 512, nullable: true),
                    size = table.Column<decimal>(type: "decimal(18,0)", nullable: true),
                    manufacturer_type_id = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__cpucoole__3CC8340A130CC43A", x => x.id);
                    table.ForeignKey(
                        name: "FK_cpucooler_manufacturer_type",
                        column: x => x.manufacturer_type_id,
                        principalTable: "manufacturer_type",
                        principalColumn: "manufacturer_type_id");
                });

            migrationBuilder.CreateTable(
                name: "harddrive",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "varchar(512)", unicode: false, maxLength: 512, nullable: true),
                    price = table.Column<decimal>(type: "decimal(18,0)", nullable: true),
                    capacity = table.Column<decimal>(type: "decimal(18,0)", nullable: true),
                    price_per_gb = table.Column<decimal>(type: "decimal(18,0)", nullable: true),
                    type = table.Column<string>(type: "varchar(512)", unicode: false, maxLength: 512, nullable: true),
                    cache = table.Column<decimal>(type: "decimal(18,0)", nullable: true),
                    @interface = table.Column<string>(name: "interface", type: "varchar(512)", unicode: false, maxLength: 512, nullable: true),
                    manufacturer_type_id = table.Column<int>(type: "int", nullable: true),
                    drive_type_id = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__harddriv__E6AB2F6BC2E3E7DA", x => x.id);
                    table.ForeignKey(
                        name: "FK_harddrive_harddrive_type",
                        column: x => x.drive_type_id,
                        principalTable: "harddrive_type",
                        principalColumn: "harddirve_type_id");
                    table.ForeignKey(
                        name: "FK_harddrive_manufacturer_type",
                        column: x => x.manufacturer_type_id,
                        principalTable: "manufacturer_type",
                        principalColumn: "manufacturer_type_id");
                });

            migrationBuilder.CreateTable(
                name: "pccase",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "varchar(512)", unicode: false, maxLength: 512, nullable: true),
                    price = table.Column<decimal>(type: "decimal(18,0)", nullable: true),
                    form_factor = table.Column<string>(type: "varchar(512)", unicode: false, maxLength: 512, nullable: true),
                    color = table.Column<string>(type: "varchar(512)", unicode: false, maxLength: 512, nullable: true),
                    side_panel = table.Column<string>(type: "varchar(512)", unicode: false, maxLength: 512, nullable: true),
                    external_volume = table.Column<decimal>(type: "decimal(18,0)", nullable: true),
                    internal_35_bays = table.Column<int>(type: "int", nullable: true),
                    form_factor_type_id = table.Column<int>(type: "int", nullable: true),
                    manufacturer_type_id = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__pccase__0E7DBE43A310AF49", x => x.id);
                    table.ForeignKey(
                        name: "FK_pccase_formfactor_type",
                        column: x => x.form_factor_type_id,
                        principalTable: "formfactor_type",
                        principalColumn: "formfactor_id");
                    table.ForeignKey(
                        name: "FK_pccase_manufacturer_type",
                        column: x => x.manufacturer_type_id,
                        principalTable: "manufacturer_type",
                        principalColumn: "manufacturer_type_id");
                });

            migrationBuilder.CreateTable(
                name: "powersupply",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "varchar(512)", unicode: false, maxLength: 512, nullable: true),
                    price = table.Column<decimal>(type: "decimal(18,0)", nullable: true),
                    type = table.Column<string>(type: "varchar(512)", unicode: false, maxLength: 512, nullable: true),
                    efficiency = table.Column<string>(type: "varchar(512)", unicode: false, maxLength: 512, nullable: true),
                    wattage = table.Column<decimal>(type: "decimal(18,0)", nullable: true),
                    modular = table.Column<string>(type: "varchar(512)", unicode: false, maxLength: 512, nullable: true),
                    color = table.Column<string>(type: "varchar(512)", unicode: false, maxLength: 512, nullable: true),
                    manufacturer_type_id = table.Column<int>(type: "int", nullable: true),
                    form_factor_id = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__powersup__C379066FE691A8CD", x => x.id);
                    table.ForeignKey(
                        name: "FK_powersupply_formfactor_type",
                        column: x => x.form_factor_id,
                        principalTable: "formfactor_type",
                        principalColumn: "formfactor_id");
                    table.ForeignKey(
                        name: "FK_powersupply_manufacturer_type",
                        column: x => x.manufacturer_type_id,
                        principalTable: "manufacturer_type",
                        principalColumn: "manufacturer_type_id");
                });

            migrationBuilder.CreateTable(
                name: "memory",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "varchar(512)", unicode: false, maxLength: 512, nullable: true),
                    price = table.Column<decimal>(type: "decimal(18,0)", nullable: true),
                    speed = table.Column<decimal>(type: "decimal(18,0)", nullable: true),
                    modules = table.Column<string>(type: "varchar(512)", unicode: false, maxLength: 512, nullable: true),
                    price_per_gb = table.Column<decimal>(type: "decimal(18,0)", nullable: true),
                    color = table.Column<string>(type: "varchar(512)", unicode: false, maxLength: 512, nullable: true),
                    first_word_latency = table.Column<decimal>(type: "decimal(18,0)", nullable: true),
                    cas_latency = table.Column<decimal>(type: "decimal(18,0)", nullable: true),
                    manufacturer_type_id = table.Column<int>(type: "int", nullable: true),
                    type = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__memory__96A0586DF3311CEB", x => x.id);
                    table.ForeignKey(
                        name: "FK_memory_manufacturer_type",
                        column: x => x.manufacturer_type_id,
                        principalTable: "manufacturer_type",
                        principalColumn: "manufacturer_type_id");
                    table.ForeignKey(
                        name: "FK_memory_memory_type",
                        column: x => x.type,
                        principalTable: "memory_type",
                        principalColumn: "memory_type_id");
                });

            migrationBuilder.CreateTable(
                name: "videocard",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "varchar(512)", unicode: false, maxLength: 512, nullable: true),
                    price = table.Column<decimal>(type: "decimal(18,0)", nullable: true),
                    chipset = table.Column<string>(type: "varchar(512)", unicode: false, maxLength: 512, nullable: true),
                    memory = table.Column<decimal>(type: "decimal(18,0)", nullable: true),
                    core_clock = table.Column<int>(type: "int", nullable: true),
                    boost_clock = table.Column<int>(type: "int", nullable: true),
                    color = table.Column<string>(type: "varchar(512)", unicode: false, maxLength: 512, nullable: true),
                    length = table.Column<int>(type: "int", nullable: true),
                    manufacturer_type_id = table.Column<int>(type: "int", nullable: true),
                    chipset_type_id = table.Column<int>(type: "int", nullable: true),
                    series_type_id = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__videocar__8B8C23C4C1B60D4C", x => x.id);
                    table.ForeignKey(
                        name: "FK_videocard_chipset_type",
                        column: x => x.chipset_type_id,
                        principalTable: "chipset_type",
                        principalColumn: "chipset_type_id");
                    table.ForeignKey(
                        name: "FK_videocard_manufacturer_type",
                        column: x => x.manufacturer_type_id,
                        principalTable: "manufacturer_type",
                        principalColumn: "manufacturer_type_id");
                    table.ForeignKey(
                        name: "FK_videocard_series_type",
                        column: x => x.series_type_id,
                        principalTable: "series_type",
                        principalColumn: "series_type_id");
                });

            migrationBuilder.CreateTable(
                name: "motherboard",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "varchar(512)", unicode: false, maxLength: 512, nullable: true),
                    price = table.Column<decimal>(type: "decimal(18,0)", nullable: true),
                    socket = table.Column<string>(type: "varchar(512)", unicode: false, maxLength: 512, nullable: true),
                    form_factor = table.Column<string>(type: "varchar(512)", unicode: false, maxLength: 512, nullable: true),
                    max_memory = table.Column<int>(type: "int", nullable: true),
                    memory_slots = table.Column<int>(type: "int", nullable: true),
                    color = table.Column<string>(type: "varchar(512)", unicode: false, maxLength: 512, nullable: true),
                    manufacturer_type_id = table.Column<int>(type: "int", nullable: true),
                    socket_type_id = table.Column<int>(type: "int", nullable: true),
                    memory_type_id = table.Column<int>(type: "int", nullable: true),
                    form_factory_type_id = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__motherbo__68B7A0F0D17DF627", x => x.id);
                    table.ForeignKey(
                        name: "FK_motherboard_formfactor_type",
                        column: x => x.form_factory_type_id,
                        principalTable: "formfactor_type",
                        principalColumn: "formfactor_id");
                    table.ForeignKey(
                        name: "FK_motherboard_manufacturer_type",
                        column: x => x.manufacturer_type_id,
                        principalTable: "manufacturer_type",
                        principalColumn: "manufacturer_type_id");
                    table.ForeignKey(
                        name: "FK_motherboard_memory_type",
                        column: x => x.memory_type_id,
                        principalTable: "memory_type",
                        principalColumn: "memory_type_id");
                    table.ForeignKey(
                        name: "FK_motherboard_socket_type",
                        column: x => x.socket_type_id,
                        principalTable: "socket_type",
                        principalColumn: "socket_id");
                });

            migrationBuilder.CreateTable(
                name: "processor",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "varchar(512)", unicode: false, maxLength: 512, nullable: true),
                    price = table.Column<decimal>(type: "decimal(18,0)", nullable: true),
                    socket_type_id = table.Column<int>(type: "int", nullable: true),
                    core_count = table.Column<int>(type: "int", nullable: true),
                    core_clock = table.Column<decimal>(type: "decimal(18,1)", nullable: true),
                    boost_clock = table.Column<decimal>(type: "decimal(18,1)", nullable: true),
                    tdp = table.Column<int>(type: "int", nullable: true),
                    graphics = table.Column<string>(type: "varchar(512)", unicode: false, maxLength: 512, nullable: true),
                    smt = table.Column<bool>(type: "bit", nullable: true),
                    manufacturer_type_id = table.Column<int>(type: "int", nullable: true),
                    series_type_id = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__processo__E30F8F2983086545", x => x.id);
                    table.ForeignKey(
                        name: "FK_processor_manufacturer_type",
                        column: x => x.manufacturer_type_id,
                        principalTable: "manufacturer_type",
                        principalColumn: "manufacturer_type_id");
                    table.ForeignKey(
                        name: "FK_processor_series_type",
                        column: x => x.series_type_id,
                        principalTable: "series_type",
                        principalColumn: "series_type_id");
                    table.ForeignKey(
                        name: "FK_processor_socket_type",
                        column: x => x.socket_type_id,
                        principalTable: "socket_type",
                        principalColumn: "socket_id");
                });

            migrationBuilder.CreateTable(
                name: "OrderItems",
                columns: table => new
                {
                    OrderItemID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrderID = table.Column<int>(type: "int", nullable: false),
                    PartTypeID = table.Column<int>(type: "int", nullable: false),
                    PartID = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    UnitPrice = table.Column<decimal>(type: "decimal(10,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__OrderIte__57ED06A12B76AE19", x => x.OrderItemID);
                    table.ForeignKey(
                        name: "FK__OrderItem__Order__19DFD96B",
                        column: x => x.OrderID,
                        principalTable: "Orders",
                        principalColumn: "OrderID");
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
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true,
                filter: "[NormalizedName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true,
                filter: "[NormalizedUserName] IS NOT NULL");

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
                name: "IX_cpucooler_manufacturer_type_id",
                table: "cpucooler",
                column: "manufacturer_type_id");

            migrationBuilder.CreateIndex(
                name: "IX_harddrive_drive_type_id",
                table: "harddrive",
                column: "drive_type_id");

            migrationBuilder.CreateIndex(
                name: "IX_harddrive_manufacturer_type_id",
                table: "harddrive",
                column: "manufacturer_type_id");

            migrationBuilder.CreateIndex(
                name: "IX_memory_manufacturer_type_id",
                table: "memory",
                column: "manufacturer_type_id");

            migrationBuilder.CreateIndex(
                name: "IX_memory_type",
                table: "memory",
                column: "type");

            migrationBuilder.CreateIndex(
                name: "IX_motherboard_form_factory_type_id",
                table: "motherboard",
                column: "form_factory_type_id");

            migrationBuilder.CreateIndex(
                name: "IX_motherboard_manufacturer_type_id",
                table: "motherboard",
                column: "manufacturer_type_id");

            migrationBuilder.CreateIndex(
                name: "IX_motherboard_memory_type_id",
                table: "motherboard",
                column: "memory_type_id");

            migrationBuilder.CreateIndex(
                name: "IX_motherboard_socket_type_id",
                table: "motherboard",
                column: "socket_type_id");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_OrderID",
                table: "OrderItems",
                column: "OrderID");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_UserID",
                table: "Orders",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_pccase_form_factor_type_id",
                table: "pccase",
                column: "form_factor_type_id");

            migrationBuilder.CreateIndex(
                name: "IX_pccase_manufacturer_type_id",
                table: "pccase",
                column: "manufacturer_type_id");

            migrationBuilder.CreateIndex(
                name: "IX_powersupply_form_factor_id",
                table: "powersupply",
                column: "form_factor_id");

            migrationBuilder.CreateIndex(
                name: "IX_powersupply_manufacturer_type_id",
                table: "powersupply",
                column: "manufacturer_type_id");

            migrationBuilder.CreateIndex(
                name: "IX_processor_manufacturer_type_id",
                table: "processor",
                column: "manufacturer_type_id");

            migrationBuilder.CreateIndex(
                name: "IX_processor_series_type_id",
                table: "processor",
                column: "series_type_id");

            migrationBuilder.CreateIndex(
                name: "IX_processor_socket_type_id",
                table: "processor",
                column: "socket_type_id");

            migrationBuilder.CreateIndex(
                name: "IX_videocard_chipset_type_id",
                table: "videocard",
                column: "chipset_type_id");

            migrationBuilder.CreateIndex(
                name: "IX_videocard_manufacturer_type_id",
                table: "videocard",
                column: "manufacturer_type_id");

            migrationBuilder.CreateIndex(
                name: "IX_videocard_series_type_id",
                table: "videocard",
                column: "series_type_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "CartItems");

            migrationBuilder.DropTable(
                name: "Configuration");

            migrationBuilder.DropTable(
                name: "OrderItems");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "pccase");

            migrationBuilder.DropTable(
                name: "cpucooler");

            migrationBuilder.DropTable(
                name: "memory");

            migrationBuilder.DropTable(
                name: "motherboard");

            migrationBuilder.DropTable(
                name: "powersupply");

            migrationBuilder.DropTable(
                name: "processor");

            migrationBuilder.DropTable(
                name: "harddrive");

            migrationBuilder.DropTable(
                name: "videocard");

            migrationBuilder.DropTable(
                name: "Orders");

            migrationBuilder.DropTable(
                name: "memory_type");

            migrationBuilder.DropTable(
                name: "formfactor_type");

            migrationBuilder.DropTable(
                name: "socket_type");

            migrationBuilder.DropTable(
                name: "harddrive_type");

            migrationBuilder.DropTable(
                name: "chipset_type");

            migrationBuilder.DropTable(
                name: "manufacturer_type");

            migrationBuilder.DropTable(
                name: "series_type");

            migrationBuilder.DropTable(
                name: "AspNetUsers");
        }
    }
}
