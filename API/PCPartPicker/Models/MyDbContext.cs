using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace PCPartPicker.Models;

public partial class MyDbContext : DbContext
{
    public MyDbContext()
    {
    }

    public MyDbContext(DbContextOptions<MyDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<ChipsetType> ChipsetTypes { get; set; }

    public virtual DbSet<Cpucooler> Cpucoolers { get; set; }

    public virtual DbSet<FormfactorType> FormfactorTypes { get; set; }

    public virtual DbSet<Harddrive> Harddrives { get; set; }

    public virtual DbSet<HarddriveType> HarddriveTypes { get; set; }

    public virtual DbSet<ManufacturerType> ManufacturerTypes { get; set; }

    public virtual DbSet<Memory> Memories { get; set; }

    public virtual DbSet<MemoryType> MemoryTypes { get; set; }

    public virtual DbSet<Motherboard> Motherboards { get; set; }

    public virtual DbSet<Pccase> Pccases { get; set; }

    public virtual DbSet<Powersupply> Powersupplies { get; set; }

    public virtual DbSet<Processor> Processors { get; set; }

    public virtual DbSet<SeriesType> SeriesTypes { get; set; }

    public virtual DbSet<SocketType> SocketTypes { get; set; }

    public virtual DbSet<Videocard> Videocards { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=tcp:pcparts.database.windows.net,1433;Initial Catalog=MyDB;Persist Security Info=False;User ID=cseszkabence;Password=Sarvar2583;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ChipsetType>(entity =>
        {
            entity.HasKey(e => e.ChipsetTypeId).HasName("PK__chipset___8AE4C0E345085260");

            entity.ToTable("chipset_type");

            entity.Property(e => e.ChipsetTypeId).HasColumnName("chipset_type_id");
            entity.Property(e => e.Type)
                .HasMaxLength(512)
                .IsUnicode(false)
                .HasColumnName("type");
        });

        modelBuilder.Entity<Cpucooler>(entity =>
        {
            entity.HasKey(e => e.Cpucoolerid).HasName("PK__cpucoole__3CC8340A98115DAE");

            entity.ToTable("cpucooler");

            entity.Property(e => e.Cpucoolerid).HasColumnName("cpucoolerid");
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
            entity.HasKey(e => e.FormfactorId).HasName("PK__formfact__F8C41484AC2DAB3F");

            entity.ToTable("formfactor_type");

            entity.Property(e => e.FormfactorId).HasColumnName("formfactor_id");
            entity.Property(e => e.Type)
                .HasMaxLength(512)
                .IsUnicode(false)
                .HasColumnName("type");
        });

        modelBuilder.Entity<Harddrive>(entity =>
        {
            entity.HasKey(e => e.Harddriveid).HasName("PK__harddriv__E6AB2F6BC056780F");

            entity.ToTable("harddrive");

            entity.Property(e => e.Harddriveid).HasColumnName("harddriveid");
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
            entity.HasKey(e => e.HarddirveTypeId).HasName("PK__harddriv__A4B39B9973715212");

            entity.ToTable("harddrive_type");

            entity.Property(e => e.HarddirveTypeId).HasColumnName("harddirve_type_id");
            entity.Property(e => e.Type)
                .HasMaxLength(512)
                .IsUnicode(false)
                .HasColumnName("type");
        });

        modelBuilder.Entity<ManufacturerType>(entity =>
        {
            entity.HasKey(e => e.ManufacturerTypeId).HasName("PK__manufact__AA802FFDCECF8328");

            entity.ToTable("manufacturer_type");

            entity.Property(e => e.ManufacturerTypeId).HasColumnName("manufacturer_type_id");
            entity.Property(e => e.Type)
                .HasMaxLength(512)
                .IsUnicode(false)
                .HasColumnName("type");
        });

        modelBuilder.Entity<Memory>(entity =>
        {
            entity.HasKey(e => e.Memoryid).HasName("PK__memory__96A0586D1B923EA8");

            entity.ToTable("memory");

            entity.Property(e => e.Memoryid).HasColumnName("memoryid");
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
            entity.HasKey(e => e.MemoryTypeId).HasName("PK__memory_t__00D6009CF04692E1");

            entity.ToTable("memory_type");

            entity.Property(e => e.MemoryTypeId).HasColumnName("memory_type_id");
            entity.Property(e => e.Type)
                .HasMaxLength(512)
                .IsUnicode(false)
                .HasColumnName("type");
        });

        modelBuilder.Entity<Motherboard>(entity =>
        {
            entity.HasKey(e => e.Motherboardid).HasName("PK__motherbo__68B7A0F06A2C65AA");

            entity.ToTable("motherboard");

            entity.Property(e => e.Motherboardid).HasColumnName("motherboardid");
            entity.Property(e => e.Color)
                .HasMaxLength(512)
                .IsUnicode(false)
                .HasColumnName("color");
            entity.Property(e => e.FormFactor)
                .HasMaxLength(512)
                .IsUnicode(false)
                .HasColumnName("form_factor");
            entity.Property(e => e.FormFactoryTypeId).HasColumnName("form_factory_type_id");
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

            entity.HasOne(d => d.FormFactoryType).WithMany(p => p.Motherboards)
                .HasForeignKey(d => d.FormFactoryTypeId)
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

        modelBuilder.Entity<Pccase>(entity =>
        {
            entity.HasKey(e => e.Pccaseid).HasName("PK__pccase__0E7DBE437AF61FCA");

            entity.ToTable("pccase");

            entity.Property(e => e.Pccaseid).HasColumnName("pccaseid");
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
            entity.HasKey(e => e.Powersupplyid).HasName("PK__powersup__C379066F116915C6");

            entity.ToTable("powersupply");

            entity.Property(e => e.Powersupplyid).HasColumnName("powersupplyid");
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
            entity.HasKey(e => e.Processorid).HasName("PK__processo__E30F8F294E0EB780");

            entity.ToTable("processor");

            entity.Property(e => e.Processorid).HasColumnName("processorid");
            entity.Property(e => e.BoostClock)
                .HasColumnType("decimal(18, 0)")
                .HasColumnName("boost_clock");
            entity.Property(e => e.CoreClock)
                .HasColumnType("decimal(18, 0)")
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
            entity.HasKey(e => e.SeriesTypeId).HasName("PK__series_t__BE02A4A83DDFF9D4");

            entity.ToTable("series_type");

            entity.Property(e => e.SeriesTypeId).HasColumnName("series_type_id");
            entity.Property(e => e.Type)
                .HasMaxLength(512)
                .IsUnicode(false)
                .HasColumnName("type");
        });

        modelBuilder.Entity<SocketType>(entity =>
        {
            entity.HasKey(e => e.SocketId).HasName("PK__socket_t__58609DBF4F5D8D42");

            entity.ToTable("socket_type");

            entity.Property(e => e.SocketId).HasColumnName("socket_id");
            entity.Property(e => e.Type)
                .HasMaxLength(512)
                .IsUnicode(false)
                .HasColumnName("type");
        });

        modelBuilder.Entity<Videocard>(entity =>
        {
            entity.HasKey(e => e.Videocardid).HasName("PK__videocar__8B8C23C4EB5BDA51");

            entity.ToTable("videocard");

            entity.Property(e => e.Videocardid).HasColumnName("videocardid");
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

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
