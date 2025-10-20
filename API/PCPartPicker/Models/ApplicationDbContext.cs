using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client.Extensions.Msal;
using PCPartPicker.Interfaces;
using System;
using System.Drawing;
using System.Reflection.Emit;

namespace PCPartPicker.Models
{
    public partial class ApplicationDbContext : IdentityDbContext<AppUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        // === Domain tables (move from MyDbContext) ===
        public DbSet<Configuration> Configurations => Set<Configuration>();
        public DbSet<CartItem> CartItems => Set<CartItem>();
        public DbSet<Processor> Processors => Set<Processor>();
        public DbSet<Motherboard> Motherboards => Set<Motherboard>();
        public DbSet<Videocard> Videocards => Set<Videocard>();
        public DbSet<Memory> Memories => Set<Memory>();
        public DbSet<Powersupply> Powersupplies => Set<Powersupply>();
        public DbSet<Pccase> Pccases => Set<Pccase>();
        public DbSet<Harddrive> Harddrives => Set<Harddrive>();
        public DbSet<ChipsetType> ChipsetTypes => Set<ChipsetType>();
        public DbSet<Cpucooler> Cpucoolers => Set<Cpucooler>();
        public DbSet<FormfactorType> FormfactorTypes => Set<FormfactorType>();
        public DbSet<HarddriveType> HarddriveTypes => Set<HarddriveType>();
        public DbSet<ManufacturerType> ManufacturerTypes => Set<ManufacturerType>();
        public DbSet<MemoryType> MemoryTypes => Set<MemoryType>();
        public DbSet<Order> Orders => Set<Order>();
        public DbSet<OrderItem> OrderItems => Set<OrderItem>();
        public DbSet<SeriesType> SeriesTypes => Set<SeriesType>();
        public DbSet<SocketType> SocketTypes => Set<SocketType>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // If you relied on a DB collation, keep it:
            // b.UseCollation("SQL_Latin1_General_CP1_CI_AS");

            // Configuration ↔ AppUser (many-to-one)
            modelBuilder.Entity<Configuration>()
             .HasOne(c => c.User)
             .WithMany(u => u.Configurations)
             .HasForeignKey(c => c.UserId)
             .HasPrincipalKey(u => u.Id)
             .OnDelete(DeleteBehavior.Cascade);

            // CartItem ↔ AppUser (many-to-one)
            modelBuilder.Entity<CartItem>()
             .HasOne(ci => ci.User)
             .WithMany(u => u.Carts)
             .HasForeignKey(ci => ci.UserId)
             .HasPrincipalKey(u => u.Id)
             .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.UseCollation("SQL_Latin1_General_CP1_CI_AS");

            modelBuilder.Entity<CartItem>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("PK__CartItem__3214EC07DE21E7B8");

                entity.Property(e => e.PartType).HasMaxLength(50);
                entity.Property(e => e.UserId).HasMaxLength(100);
            });

            modelBuilder.Entity<ChipsetType>(entity =>
            {
                entity.HasKey(e => e.ChipsetTypeId).HasName("PK__chipset___8AE4C0E34C588E3B");

                entity.ToTable("chipset_type");

                entity.Property(e => e.ChipsetTypeId).HasColumnName("chipset_type_id");
                entity.Property(e => e.Type)
                    .HasMaxLength(512)
                    .IsUnicode(false)
                    .HasColumnName("type");
            });

            modelBuilder.Entity<Configuration>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("PK__Configur__3214EC07E9CFA21A");

                entity.ToTable("Configuration");

                entity.HasOne(d => d.Case).WithMany(p => p.Configurations)
                    .HasForeignKey(d => d.CaseId)
                    .HasConstraintName("FK__Configura__CaseI__0E6E26BF");

                entity.HasOne(d => d.Cooler).WithMany(p => p.Configurations)
                    .HasForeignKey(d => d.CoolerId)
                    .HasConstraintName("FK__Configura__Coole__10566F31");

                entity.HasOne(d => d.Memory).WithMany(p => p.Configurations)
                    .HasForeignKey(d => d.MemoryId)
                    .HasConstraintName("FK__Configura__Memor__0C85DE4D");

                entity.HasOne(d => d.Motherboard).WithMany(p => p.Configurations)
                    .HasForeignKey(d => d.MotherboardId)
                    .HasConstraintName("FK__Configura__Mothe__09A971A2");

                entity.HasOne(d => d.Powersupply).WithMany(p => p.Configurations)
                    .HasForeignKey(d => d.PowersupplyId)
                    .HasConstraintName("FK__Configura__Power__0D7A0286");

                entity.HasOne(d => d.Processor).WithMany(p => p.Configurations)
                    .HasForeignKey(d => d.ProcessorId)
                    .HasConstraintName("FK__Configura__Proce__0A9D95DB");

                entity.HasOne(d => d.Storage).WithMany(p => p.Configurations)
                    .HasForeignKey(d => d.StorageId)
                    .HasConstraintName("FK__Configura__Stora__0F624AF8");

                entity.HasOne(d => d.User).WithMany(p => p.Configurations)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK__Configura__UserI__08B54D69");

                entity.HasOne(d => d.Videocard).WithMany(p => p.Configurations)
                    .HasForeignKey(d => d.VideocardId)
                    .HasConstraintName("FK__Configura__Video__0B91BA14");
            });

            modelBuilder.Entity<Cpucooler>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("PK__cpucoole__3CC8340A130CC43A");

                entity.ToTable("cpucooler");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Color)
                    .HasMaxLength(512)
                    .IsUnicode(false)
                    .HasColumnName("color");
                entity.Property(e => e.ManufacturerTypeId).HasColumnName("manufacturer_type_id");
                entity.Property(e => e.Name)
                    .HasMaxLength(512)
                    .IsUnicode(false)
                    .HasColumnName("name");
                entity.Property(e => e.NoiseLevel)
                    .HasColumnType("decimal(18, 0)")
                    .HasColumnName("noise_level");
                entity.Property(e => e.Price)
                    .HasColumnType("decimal(18, 0)")
                    .HasColumnName("price");
                entity.Property(e => e.Rpm)
                    .HasColumnType("decimal(18, 0)")
                    .HasColumnName("rpm");
                entity.Property(e => e.Size)
                    .HasColumnType("decimal(18, 0)")
                    .HasColumnName("size");

                entity.HasOne(d => d.ManufacturerType).WithMany(p => p.Cpucoolers)
                    .HasForeignKey(d => d.ManufacturerTypeId)
                    .HasConstraintName("FK_cpucooler_manufacturer_type");
            });

            modelBuilder.Entity<FormfactorType>(entity =>
            {
                entity.HasKey(e => e.FormfactorId).HasName("PK__formfact__F8C41484C0183579");

                entity.ToTable("formfactor_type");

                entity.Property(e => e.FormfactorId).HasColumnName("formfactor_id");
                entity.Property(e => e.Type)
                    .HasMaxLength(512)
                    .IsUnicode(false)
                    .HasColumnName("type");
            });

            modelBuilder.Entity<Harddrive>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("PK__harddriv__E6AB2F6BC2E3E7DA");

                entity.ToTable("harddrive");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Cache)
                    .HasColumnType("decimal(18, 0)")
                    .HasColumnName("cache");
                entity.Property(e => e.Capacity)
                    .HasColumnType("decimal(18, 0)")
                    .HasColumnName("capacity");
                entity.Property(e => e.DriveTypeId).HasColumnName("drive_type_id");
                entity.Property(e => e.Interface)
                    .HasMaxLength(512)
                    .IsUnicode(false)
                    .HasColumnName("interface");
                entity.Property(e => e.ManufacturerTypeId).HasColumnName("manufacturer_type_id");
                entity.Property(e => e.Name)
                    .HasMaxLength(512)
                    .IsUnicode(false)
                    .HasColumnName("name");
                entity.Property(e => e.Price)
                    .HasColumnType("decimal(18, 0)")
                    .HasColumnName("price");
                entity.Property(e => e.PricePerGb)
                    .HasColumnType("decimal(18, 0)")
                    .HasColumnName("price_per_gb");
                entity.Property(e => e.Type)
                    .HasMaxLength(512)
                    .IsUnicode(false)
                    .HasColumnName("type");

                entity.HasOne(d => d.DriveType).WithMany(p => p.Harddrives)
                    .HasForeignKey(d => d.DriveTypeId)
                    .HasConstraintName("FK_harddrive_harddrive_type");

                entity.HasOne(d => d.ManufacturerType).WithMany(p => p.Harddrives)
                    .HasForeignKey(d => d.ManufacturerTypeId)
                    .HasConstraintName("FK_harddrive_manufacturer_type");
            });

            modelBuilder.Entity<HarddriveType>(entity =>
            {
                entity.HasKey(e => e.HarddirveTypeId).HasName("PK__harddriv__A4B39B9994C82C0B");

                entity.ToTable("harddrive_type");

                entity.Property(e => e.HarddirveTypeId).HasColumnName("harddirve_type_id");
                entity.Property(e => e.Type)
                    .HasMaxLength(512)
                    .IsUnicode(false)
                    .HasColumnName("type");
            });

            modelBuilder.Entity<ManufacturerType>(entity =>
            {
                entity.HasKey(e => e.ManufacturerTypeId).HasName("PK__manufact__AA802FFD80347698");

                entity.ToTable("manufacturer_type");

                entity.Property(e => e.ManufacturerTypeId).HasColumnName("manufacturer_type_id");
                entity.Property(e => e.Type)
                    .HasMaxLength(512)
                    .IsUnicode(false)
                    .HasColumnName("type");
            });

            modelBuilder.Entity<Memory>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("PK__memory__96A0586DF3311CEB");

                entity.ToTable("memory");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.CasLatency)
                    .HasColumnType("decimal(18, 0)")
                    .HasColumnName("cas_latency");
                entity.Property(e => e.Color)
                    .HasMaxLength(512)
                    .IsUnicode(false)
                    .HasColumnName("color");
                entity.Property(e => e.FirstWordLatency)
                    .HasColumnType("decimal(18, 0)")
                    .HasColumnName("first_word_latency");
                entity.Property(e => e.ManufacturerTypeId).HasColumnName("manufacturer_type_id");
                entity.Property(e => e.Modules)
                    .HasMaxLength(512)
                    .IsUnicode(false)
                    .HasColumnName("modules");
                entity.Property(e => e.Name)
                    .HasMaxLength(512)
                    .IsUnicode(false)
                    .HasColumnName("name");
                entity.Property(e => e.Price)
                    .HasColumnType("decimal(18, 0)")
                    .HasColumnName("price");
                entity.Property(e => e.PricePerGb)
                    .HasColumnType("decimal(18, 0)")
                    .HasColumnName("price_per_gb");
                entity.Property(e => e.Speed)
                    .HasColumnType("decimal(18, 0)")
                    .HasColumnName("speed");
                entity.Property(e => e.Type).HasColumnName("type");

                entity.HasOne(d => d.ManufacturerType).WithMany(p => p.Memories)
                    .HasForeignKey(d => d.ManufacturerTypeId)
                    .HasConstraintName("FK_memory_manufacturer_type");

                entity.HasOne(d => d.TypeNavigation).WithMany(p => p.Memories)
                    .HasForeignKey(d => d.Type)
                    .HasConstraintName("FK_memory_memory_type");
            });

            modelBuilder.Entity<MemoryType>(entity =>
            {
                entity.HasKey(e => e.MemoryTypeId).HasName("PK__memory_t__00D6009C161AE41C");

                entity.ToTable("memory_type");

                entity.Property(e => e.MemoryTypeId).HasColumnName("memory_type_id");
                entity.Property(e => e.Type)
                    .HasMaxLength(512)
                    .IsUnicode(false)
                    .HasColumnName("type");
            });

            modelBuilder.Entity<Motherboard>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("PK__motherbo__68B7A0F0D17DF627");

                entity.ToTable("motherboard");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Color)
                    .HasMaxLength(512)
                    .IsUnicode(false)
                    .HasColumnName("color");
                entity.Property(e => e.FormFactor)
                    .HasMaxLength(512)
                    .IsUnicode(false)
                    .HasColumnName("form_factor");
                entity.Property(e => e.FormFactorTypeId).HasColumnName("form_factory_type_id");
                entity.Property(e => e.ManufacturerTypeId).HasColumnName("manufacturer_type_id");
                entity.Property(e => e.MaxMemory).HasColumnName("max_memory");
                entity.Property(e => e.MemorySlots).HasColumnName("memory_slots");
                entity.Property(e => e.MemoryTypeId).HasColumnName("memory_type_id");
                entity.Property(e => e.Name)
                    .HasMaxLength(512)
                    .IsUnicode(false)
                    .HasColumnName("name");
                entity.Property(e => e.Price)
                    .HasColumnType("decimal(18, 0)")
                    .HasColumnName("price");
                entity.Property(e => e.Socket)
                    .HasMaxLength(512)
                    .IsUnicode(false)
                    .HasColumnName("socket");
                entity.Property(e => e.SocketTypeId).HasColumnName("socket_type_id");

                entity.HasOne(d => d.FormFactorType).WithMany(p => p.Motherboards)
                    .HasForeignKey(d => d.FormFactorTypeId)
                    .HasConstraintName("FK_motherboard_formfactor_type");

                entity.HasOne(d => d.ManufacturerType).WithMany(p => p.Motherboards)
                    .HasForeignKey(d => d.ManufacturerTypeId)
                    .HasConstraintName("FK_motherboard_manufacturer_type");

                entity.HasOne(d => d.MemoryType).WithMany(p => p.Motherboards)
                    .HasForeignKey(d => d.MemoryTypeId)
                    .HasConstraintName("FK_motherboard_memory_type");

                entity.HasOne(d => d.SocketType).WithMany(p => p.Motherboards)
                    .HasForeignKey(d => d.SocketTypeId)
                    .HasConstraintName("FK_motherboard_socket_type");
            });

            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasKey(e => e.OrderId).HasName("PK__Orders__C3905BAFDCC59907");

                entity.Property(e => e.OrderId).HasColumnName("OrderID");
                entity.Property(e => e.OrderDate)
                    .HasDefaultValueSql("(getdate())")
                    .HasColumnType("datetime");
                entity.Property(e => e.Status).HasMaxLength(50);
                entity.Property(e => e.TotalPrice).HasColumnType("decimal(10, 2)");
                entity.Property(e => e.UserId).HasColumnName("UserID");

                entity.HasOne(d => d.User).WithMany(p => p.Orders)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Orders__UserID__151B244E");
            });

            modelBuilder.Entity<OrderItem>(entity =>
            {
                entity.HasKey(e => e.OrderItemId).HasName("PK__OrderIte__57ED06A12B76AE19");

                entity.Property(e => e.OrderItemId).HasColumnName("OrderItemID");
                entity.Property(e => e.OrderId).HasColumnName("OrderID");
                entity.Property(e => e.PartId).HasColumnName("PartID");
                entity.Property(e => e.PartTypeId).HasColumnName("PartTypeID");
                entity.Property(e => e.UnitPrice).HasColumnType("decimal(10, 2)");

                entity.HasOne(d => d.Order).WithMany(p => p.OrderItems)
                    .HasForeignKey(d => d.OrderId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__OrderItem__Order__19DFD96B");
            });

            modelBuilder.Entity<Pccase>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("PK__pccase__0E7DBE43A310AF49");

                entity.ToTable("pccase");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Color)
                    .HasMaxLength(512)
                    .IsUnicode(false)
                    .HasColumnName("color");
                entity.Property(e => e.ExternalVolume)
                    .HasColumnType("decimal(18, 0)")
                    .HasColumnName("external_volume");
                entity.Property(e => e.FormFactor)
                    .HasMaxLength(512)
                    .IsUnicode(false)
                    .HasColumnName("form_factor");
                entity.Property(e => e.FormFactorTypeId).HasColumnName("form_factor_type_id");
                entity.Property(e => e.Internal35Bays).HasColumnName("internal_35_bays");
                entity.Property(e => e.ManufacturerTypeId).HasColumnName("manufacturer_type_id");
                entity.Property(e => e.Name)
                    .HasMaxLength(512)
                    .IsUnicode(false)
                    .HasColumnName("name");
                entity.Property(e => e.Price)
                    .HasColumnType("decimal(18, 0)")
                    .HasColumnName("price");
                entity.Property(e => e.SidePanel)
                    .HasMaxLength(512)
                    .IsUnicode(false)
                    .HasColumnName("side_panel");

                entity.HasOne(d => d.FormFactorType).WithMany(p => p.Pccases)
                    .HasForeignKey(d => d.FormFactorTypeId)
                    .HasConstraintName("FK_pccase_formfactor_type");

                entity.HasOne(d => d.ManufacturerType).WithMany(p => p.Pccases)
                    .HasForeignKey(d => d.ManufacturerTypeId)
                    .HasConstraintName("FK_pccase_manufacturer_type");
            });

            modelBuilder.Entity<Powersupply>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("PK__powersup__C379066FE691A8CD");

                entity.ToTable("powersupply");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Color)
                    .HasMaxLength(512)
                    .IsUnicode(false)
                    .HasColumnName("color");
                entity.Property(e => e.Efficiency)
                    .HasMaxLength(512)
                    .IsUnicode(false)
                    .HasColumnName("efficiency");
                entity.Property(e => e.FormFactorId).HasColumnName("form_factor_id");
                entity.Property(e => e.ManufacturerTypeId).HasColumnName("manufacturer_type_id");
                entity.Property(e => e.Modular)
                    .HasMaxLength(512)
                    .IsUnicode(false)
                    .HasColumnName("modular");
                entity.Property(e => e.Name)
                    .HasMaxLength(512)
                    .IsUnicode(false)
                    .HasColumnName("name");
                entity.Property(e => e.Price)
                    .HasColumnType("decimal(18, 0)")
                    .HasColumnName("price");
                entity.Property(e => e.Type)
                    .HasMaxLength(512)
                    .IsUnicode(false)
                    .HasColumnName("type");
                entity.Property(e => e.Wattage)
                    .HasColumnType("decimal(18, 0)")
                    .HasColumnName("wattage");

                entity.HasOne(d => d.FormFactor).WithMany(p => p.Powersupplies)
                    .HasForeignKey(d => d.FormFactorId)
                    .HasConstraintName("FK_powersupply_formfactor_type");

                entity.HasOne(d => d.ManufacturerType).WithMany(p => p.Powersupplies)
                    .HasForeignKey(d => d.ManufacturerTypeId)
                    .HasConstraintName("FK_powersupply_manufacturer_type");
            });

            modelBuilder.Entity<Processor>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("PK__processo__E30F8F2983086545");

                entity.ToTable("processor");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.BoostClock)
                    .HasColumnType("decimal(18, 1)")
                    .HasColumnName("boost_clock");
                entity.Property(e => e.CoreClock)
                    .HasColumnType("decimal(18, 1)")
                    .HasColumnName("core_clock");
                entity.Property(e => e.CoreCount).HasColumnName("core_count");
                entity.Property(e => e.Graphics)
                    .HasMaxLength(512)
                    .IsUnicode(false)
                    .HasColumnName("graphics");
                entity.Property(e => e.ManufacturerTypeId).HasColumnName("manufacturer_type_id");
                entity.Property(e => e.Name)
                    .HasMaxLength(512)
                    .IsUnicode(false)
                    .HasColumnName("name");
                entity.Property(e => e.Price)
                    .HasColumnType("decimal(18, 0)")
                    .HasColumnName("price");
                entity.Property(e => e.SeriesTypeId).HasColumnName("series_type_id");
                entity.Property(e => e.Smt).HasColumnName("smt");
                entity.Property(e => e.SocketTypeId).HasColumnName("socket_type_id");
                entity.Property(e => e.Tdp).HasColumnName("tdp");

                entity.HasOne(d => d.ManufacturerType).WithMany(p => p.Processors)
                    .HasForeignKey(d => d.ManufacturerTypeId)
                    .HasConstraintName("FK_processor_manufacturer_type");

                entity.HasOne(d => d.SeriesType).WithMany(p => p.Processors)
                    .HasForeignKey(d => d.SeriesTypeId)
                    .HasConstraintName("FK_processor_series_type");

                entity.HasOne(d => d.SocketType).WithMany(p => p.Processors)
                    .HasForeignKey(d => d.SocketTypeId)
                    .HasConstraintName("FK_processor_socket_type");
            });

            modelBuilder.Entity<SeriesType>(entity =>
            {
                entity.HasKey(e => e.SeriesTypeId).HasName("PK__series_t__BE02A4A882ED2B20");

                entity.ToTable("series_type");

                entity.Property(e => e.SeriesTypeId).HasColumnName("series_type_id");
                entity.Property(e => e.Type)
                    .HasMaxLength(512)
                    .IsUnicode(false)
                    .HasColumnName("type");
            });

            modelBuilder.Entity<SocketType>(entity =>
            {
                entity.HasKey(e => e.SocketId).HasName("PK__socket_t__58609DBFD57F45BC");

                entity.ToTable("socket_type");

                entity.Property(e => e.SocketId).HasColumnName("socket_id");
                entity.Property(e => e.Type)
                    .HasMaxLength(512)
                    .IsUnicode(false)
                    .HasColumnName("type");
            });

            //modelBuilder.Entity<User>(entity =>
            //{
            //    entity.HasKey(e => e.Id).HasName("PK__Users__3214EC0737DE25E9");

            //    entity.HasIndex(e => e.EmailAddress, "UQ__Users__49A147402F469F90").IsUnique();

            //    entity.Property(e => e.EmailAddress).HasMaxLength(255);
            //    entity.Property(e => e.Password).HasMaxLength(255);
            //});

            modelBuilder.Entity<Videocard>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("PK__videocar__8B8C23C4C1B60D4C");

                entity.ToTable("videocard");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.BoostClock).HasColumnName("boost_clock");
                entity.Property(e => e.Chipset)
                    .HasMaxLength(512)
                    .IsUnicode(false)
                    .HasColumnName("chipset");
                entity.Property(e => e.ChipsetTypeId).HasColumnName("chipset_type_id");
                entity.Property(e => e.Color)
                    .HasMaxLength(512)
                    .IsUnicode(false)
                    .HasColumnName("color");
                entity.Property(e => e.CoreClock).HasColumnName("core_clock");
                entity.Property(e => e.Length).HasColumnName("length");
                entity.Property(e => e.ManufacturerTypeId).HasColumnName("manufacturer_type_id");
                entity.Property(e => e.Memory)
                    .HasColumnType("decimal(18, 0)")
                    .HasColumnName("memory");
                entity.Property(e => e.Name)
                    .HasMaxLength(512)
                    .IsUnicode(false)
                    .HasColumnName("name");
                entity.Property(e => e.Price)
                    .HasColumnType("decimal(18, 0)")
                    .HasColumnName("price");
                entity.Property(e => e.SeriesTypeId).HasColumnName("series_type_id");

                entity.HasOne(d => d.ChipsetType).WithMany(p => p.Videocards)
                    .HasForeignKey(d => d.ChipsetTypeId)
                    .HasConstraintName("FK_videocard_chipset_type");

                entity.HasOne(d => d.ManufacturerType).WithMany(p => p.Videocards)
                    .HasForeignKey(d => d.ManufacturerTypeId)
                    .HasConstraintName("FK_videocard_manufacturer_type");

                entity.HasOne(d => d.SeriesType).WithMany(p => p.Videocards)
                    .HasForeignKey(d => d.SeriesTypeId)
                    .HasConstraintName("FK_videocard_series_type");
            });

            OnModelCreatingPartial(modelBuilder);
        }
        public string ComponentLookupForName(int partId, string partType)
        {
            switch (partType)
            {
                case "Processor":
                    return Processors.Where(x => x.Id == partId).FirstOrDefault().Name;
                case "Motherboard":
                    return Motherboards.Where(x => x.Id == partId).FirstOrDefault().Name;
                case "Memory":
                    return Memories.Where(x => x.Id == partId).FirstOrDefault().Name;
                case "Videocard":
                    return Videocards.Where(x => x.Id == partId).FirstOrDefault().Name;
                case "Storage":
                    return Harddrives.Where(x => x.Id == partId).FirstOrDefault().Name;
                case "Powersupply":
                    return Powersupplies.Where(x => x.Id == partId).FirstOrDefault().Name;
                case "Pccase":
                    return Pccases.Where(x => x.Id == partId).FirstOrDefault().Name;
                case "Cpucooler":
                    return Cpucoolers.Where(x => x.Id == partId).FirstOrDefault().Name;
                default:
                    return "";
            }
        }

        public decimal? ComponentLookupForPrice(int partId, string partType)
        {
            switch (partType)
            {
                case "Processor":
                    return Processors.Where(x => x.Id == partId).FirstOrDefault().Price;
                case "Motherboard":
                    return Motherboards.Where(x => x.Id == partId).FirstOrDefault().Price;
                case "Memory":
                    return Memories.Where(x => x.Id == partId).FirstOrDefault().Price;
                case "Videocard":
                    return Videocards.Where(x => x.Id == partId).FirstOrDefault().Price;
                case "Harddrive":
                    return Harddrives.Where(x => x.Id == partId).FirstOrDefault().Price;
                case "Powersupply":
                    return Powersupplies.Where(x => x.Id == partId).FirstOrDefault().Price;
                case "Pccase":
                    return Pccases.Where(x => x.Id == partId).FirstOrDefault().Price;
                case "Cpucooler":
                    return Cpucoolers.Where(x => x.Id == partId).FirstOrDefault().Price;
                default:
                    return 0;
            }
        }

        public async Task<IComponent> ComponentLookup(int partId, string partType)
        {
            switch (partType)
            {
                case "Processor":
                    return Processors.Where(x => x.Id == partId).FirstOrDefault();
                case "Motherboard":
                    return Motherboards.Where(x => x.Id == partId).FirstOrDefault();
                case "Memory":
                    return Memories.Where(x => x.Id == partId).FirstOrDefault();
                case "Videocard":
                    return Videocards.Where(x => x.Id == partId).FirstOrDefault();
                case "Harddrive":
                    return Harddrives.Where(x => x.Id == partId).FirstOrDefault();
                case "Powersupply":
                    return Powersupplies.Where(x => x.Id == partId).FirstOrDefault();
                case "Pccase":
                    return Pccases.Where(x => x.Id == partId).FirstOrDefault();
                case "Cpucooler":
                    return Cpucoolers.Where(x => x.Id == partId).FirstOrDefault();
                default:
                    return null;
            }
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
