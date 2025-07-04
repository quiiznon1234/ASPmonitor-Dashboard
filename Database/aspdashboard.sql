USE [master]
GO
/****** Object:  Database [aspdashboard]    Script Date: 10/04/2025 16:16:48 ******/
CREATE DATABASE [aspdashboard] ON  PRIMARY 
( NAME = N'aspdashboard', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL15.SQL2019\MSSQL\DATA\aspdashboard.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'aspdashboard_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL15.SQL2019\MSSQL\DATA\aspdashboard_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [aspdashboard].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [aspdashboard] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [aspdashboard] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [aspdashboard] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [aspdashboard] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [aspdashboard] SET ARITHABORT OFF 
GO
ALTER DATABASE [aspdashboard] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [aspdashboard] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [aspdashboard] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [aspdashboard] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [aspdashboard] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [aspdashboard] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [aspdashboard] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [aspdashboard] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [aspdashboard] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [aspdashboard] SET  DISABLE_BROKER 
GO
ALTER DATABASE [aspdashboard] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [aspdashboard] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [aspdashboard] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [aspdashboard] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [aspdashboard] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [aspdashboard] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [aspdashboard] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [aspdashboard] SET  MULTI_USER 
GO
ALTER DATABASE [aspdashboard] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [aspdashboard] SET DB_CHAINING OFF 
GO
USE [aspdashboard]
GO
/****** Object:  User [IIS APPPOOL\ASPROOM]    Script Date: 10/04/2025 16:16:48 ******/
CREATE USER [IIS APPPOOL\ASPROOM] FOR LOGIN [IIS APPPOOL\ASPROOM] WITH DEFAULT_SCHEMA=[dbo]
GO
sys.sp_addrolemember @rolename = N'db_datareader', @membername = N'IIS APPPOOL\ASPROOM'
GO
sys.sp_addrolemember @rolename = N'db_datawriter', @membername = N'IIS APPPOOL\ASPROOM'
GO
/****** Object:  Table [dbo].[DashBoardRooms]    Script Date: 10/04/2025 16:16:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DashBoardRooms](
	[PK] [int] IDENTITY(1,1) NOT NULL,
	[RoomName] [varchar](100) NOT NULL,
	[UpdateBy] [int] NULL,
	[UpdateTime] [datetime] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PatienRoom]    Script Date: 10/04/2025 16:16:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PatienRoom](
	[PatientNum] [int] IDENTITY(1,1) NOT NULL,
	[SectionName] [varchar](100) NULL,
	[PatientName] [varchar](100) NULL,
	[BarCode] [varchar](100) NULL,
	[DateTime] [datetime] NULL,
	[TestName] [varchar](100) NULL,
 CONSTRAINT [PK__PatienRo__E96A846A4D0DC1B6] PRIMARY KEY CLUSTERED 
(
	[PatientNum] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SectionRoom]    Script Date: 10/04/2025 16:16:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SectionRoom](
	[DashBoardRoomPK] [int] NULL,
	[SectionName] [varchar](100) NULL,
	[Num] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UserAuthorize]    Script Date: 10/04/2025 16:16:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserAuthorize](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[FirstName] [varchar](30) NULL,
	[LastName] [varchar](30) NULL,
	[UserName] [varchar](20) NOT NULL,
	[Password] [varchar](20) NOT NULL,
	[UserLevel] [tinyint] NOT NULL,
	[Status] [tinyint] NOT NULL,
	[CreateDate] [smalldatetime] NULL,
	[UpdateDate] [smalldatetime] NULL,
	[CreateBy] [int] NULL,
	[UpdateBy] [int] NULL,
 CONSTRAINT [PK_UserAuthorize] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[DashBoardRooms] ON 

INSERT [dbo].[DashBoardRooms] ([PK], [RoomName], [UpdateBy], [UpdateTime]) VALUES (11, N'LAB 1', 1, CAST(N'2025-03-27T14:49:32.463' AS DateTime))
SET IDENTITY_INSERT [dbo].[DashBoardRooms] OFF
GO
SET IDENTITY_INSERT [dbo].[PatienRoom] ON 

INSERT [dbo].[PatienRoom] ([PatientNum], [SectionName], [PatientName], [BarCode], [DateTime], [TestName]) VALUES (3, N'HEMATOLOGY', N'น.ส.มะลิ ตระกูลพงษ์', N'621128072701', CAST(N'2019-11-28T08:39:34.000' AS DateTime), N'ESR')
INSERT [dbo].[PatienRoom] ([PatientNum], [SectionName], [PatientName], [BarCode], [DateTime], [TestName]) VALUES (6, N'HEMATOLOGY', N'นายจิณณวัตร ใจเตรียม', N'621128070401', CAST(N'2019-11-28T08:35:15.000' AS DateTime), N'CBC')
INSERT [dbo].[PatienRoom] ([PatientNum], [SectionName], [PatientName], [BarCode], [DateTime], [TestName]) VALUES (14, N'HEMATOLOGY', N'นายจิณณวัตร ใจเตรียม', N'621128070401', CAST(N'2019-11-28T08:35:15.000' AS DateTime), N'CBC')
INSERT [dbo].[PatienRoom] ([PatientNum], [SectionName], [PatientName], [BarCode], [DateTime], [TestName]) VALUES (16, N'HEMATOLOGY', N'นายจิณณวัตร ใจเตรียม', N'621128070401', CAST(N'2019-11-28T08:35:15.000' AS DateTime), N'CBC')
INSERT [dbo].[PatienRoom] ([PatientNum], [SectionName], [PatientName], [BarCode], [DateTime], [TestName]) VALUES (25, N'HEMATOLOGY', N'นายจิณณวัตร ใจเตรียม', N'621128070401', CAST(N'2019-11-28T08:35:15.000' AS DateTime), N'CBC')
INSERT [dbo].[PatienRoom] ([PatientNum], [SectionName], [PatientName], [BarCode], [DateTime], [TestName]) VALUES (27, N'HEMATOLOGY', N'น.ส.จารุณี รุ่งสิตา', N'621128069101', CAST(N'2019-11-28T08:30:50.000' AS DateTime), N'CBC')
INSERT [dbo].[PatienRoom] ([PatientNum], [SectionName], [PatientName], [BarCode], [DateTime], [TestName]) VALUES (28, N'CHEMISTRY', N'นางเสี่ยน สุวรรณดำรงชัย', N'621128070257', CAST(N'2019-11-28T08:34:31.000' AS DateTime), N'Electrolyte')
INSERT [dbo].[PatienRoom] ([PatientNum], [SectionName], [PatientName], [BarCode], [DateTime], [TestName]) VALUES (29, N'CHEMISTRY', N'นางเสี่ยน สุวรรณดำรงชัย', N'621128070258', CAST(N'2019-11-28T08:34:31.000' AS DateTime), N'Hemoglobin A1 C')
INSERT [dbo].[PatienRoom] ([PatientNum], [SectionName], [PatientName], [BarCode], [DateTime], [TestName]) VALUES (30, N'CHEMISTRY', N'นายชิด รีวงษ์', N'621128067157', CAST(N'2019-11-28T08:25:43.000' AS DateTime), N'Uric acid')
INSERT [dbo].[PatienRoom] ([PatientNum], [SectionName], [PatientName], [BarCode], [DateTime], [TestName]) VALUES (31, N'CHEMISTRY', N'นายรณรงค์ ท้วมเจริญ', N'621128067557', CAST(N'2019-11-28T08:27:22.000' AS DateTime), N'Alk. Phosphatase')
INSERT [dbo].[PatienRoom] ([PatientNum], [SectionName], [PatientName], [BarCode], [DateTime], [TestName]) VALUES (32, N'CHEMISTRY', N'นายรณรงค์ ท้วมเจริญ', N'621128067558', CAST(N'2019-11-28T08:27:22.000' AS DateTime), N'Hemoglobin A1 C')
INSERT [dbo].[PatienRoom] ([PatientNum], [SectionName], [PatientName], [BarCode], [DateTime], [TestName]) VALUES (33, N'HEMATOLOGY', N'นายรณรงค์ ท้วมเจริญ', N'621128067601', CAST(N'2019-11-28T08:27:21.000' AS DateTime), N'CBC')
INSERT [dbo].[PatienRoom] ([PatientNum], [SectionName], [PatientName], [BarCode], [DateTime], [TestName]) VALUES (34, N'CHEMISTRY', N'นายจิณณวัตร ใจเตรียม', N'621128068657', CAST(N'2019-11-28T08:35:10.000' AS DateTime), N'Bilirubin Direct')
INSERT [dbo].[PatienRoom] ([PatientNum], [SectionName], [PatientName], [BarCode], [DateTime], [TestName]) VALUES (35, N'IMMUNOLOGY', N'นายจิณณวัตร ใจเตรียม', N'621128068702', CAST(N'2019-11-28T08:35:15.000' AS DateTime), N'Parathyroid Hormone ( PTH)')
INSERT [dbo].[PatienRoom] ([PatientNum], [SectionName], [PatientName], [BarCode], [DateTime], [TestName]) VALUES (36, N'IMMUNOLOGY', N'นางสุจิตรา เณรธรณี', N'621128066602', CAST(N'2019-11-28T08:24:28.000' AS DateTime), N'B-HCG')
INSERT [dbo].[PatienRoom] ([PatientNum], [SectionName], [PatientName], [BarCode], [DateTime], [TestName]) VALUES (37, N'CHEMISTRY', N'นางวันเพ็ญ แสงประทีป', N'621128066358', CAST(N'2019-11-28T08:23:36.000' AS DateTime), N'Hemoglobin A1 C')
INSERT [dbo].[PatienRoom] ([PatientNum], [SectionName], [PatientName], [BarCode], [DateTime], [TestName]) VALUES (38, N'CHEMISTRY', N'นางวันเพ็ญ แสงประทีป', N'621128066357', CAST(N'2019-11-28T08:23:36.000' AS DateTime), N'Electrolyte')
INSERT [dbo].[PatienRoom] ([PatientNum], [SectionName], [PatientName], [BarCode], [DateTime], [TestName]) VALUES (39, N'CHEMISTRY', N'นางกนิษฐา พานทอง', N'621128065857', CAST(N'2019-11-28T08:25:57.000' AS DateTime), N'Creatinine+eGFR')
INSERT [dbo].[PatienRoom] ([PatientNum], [SectionName], [PatientName], [BarCode], [DateTime], [TestName]) VALUES (1023, N'CHEMISTRY', N'นายจิณณวัตร ใจเตรียม', N'621128068657', CAST(N'2019-11-28T08:35:10.000' AS DateTime), N'Bilirubin Direct')
INSERT [dbo].[PatienRoom] ([PatientNum], [SectionName], [PatientName], [BarCode], [DateTime], [TestName]) VALUES (1024, N'HEMATOLOGY', N'นายรณรงค์ ท้วมเจริญ', N'621128067601', CAST(N'2019-11-28T08:27:21.000' AS DateTime), N'CBC')
INSERT [dbo].[PatienRoom] ([PatientNum], [SectionName], [PatientName], [BarCode], [DateTime], [TestName]) VALUES (1025, N'CHEMISTRY', N'นายรณรงค์ ท้วมเจริญ', N'621128067558', CAST(N'2019-11-28T08:27:22.000' AS DateTime), N'Hemoglobin A1 C')
SET IDENTITY_INSERT [dbo].[PatienRoom] OFF
GO
INSERT [dbo].[SectionRoom] ([DashBoardRoomPK], [SectionName], [Num]) VALUES (12, N'Chemistry', NULL)
INSERT [dbo].[SectionRoom] ([DashBoardRoomPK], [SectionName], [Num]) VALUES (12, N'chemistry', NULL)
INSERT [dbo].[SectionRoom] ([DashBoardRoomPK], [SectionName], [Num]) VALUES (11, N'CHEMISTRY', NULL)
INSERT [dbo].[SectionRoom] ([DashBoardRoomPK], [SectionName], [Num]) VALUES (11, N'IMMUNOLOGY', NULL)
GO
SET IDENTITY_INSERT [dbo].[UserAuthorize] ON 

INSERT [dbo].[UserAuthorize] ([ID], [FirstName], [LastName], [UserName], [Password], [UserLevel], [Status], [CreateDate], [UpdateDate], [CreateBy], [UpdateBy]) VALUES (1, N'Administrator', N'System', N'admin', N'@dmin', 1, 1, NULL, CAST(N'2017-06-14T14:26:00' AS SmallDateTime), NULL, 1)
SET IDENTITY_INSERT [dbo].[UserAuthorize] OFF
GO
/****** Object:  StoredProcedure [dbo].[SP_AddDashboardRoom]    Script Date: 10/04/2025 16:16:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[SP_AddDashboardRoom]
 @dashboardName varchar(100)
 ,@DashBoardRoomPK int output


AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	INSERT INTO DashBoardRooms(RoomName,UpdateBy,UpdateTime)values(@dashboardName,1,GETDATE())
	SET @DashBoardRoomPK= @@IDENTITY;
	RETURN @DashBoardRoomPK;
END
GO
/****** Object:  StoredProcedure [dbo].[SP_DELETEDASHBOARDS]    Script Date: 10/04/2025 16:16:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
 CREATE PROCEDURE [dbo].[SP_DELETEDASHBOARDS]
@DashboardIds VARCHAR(100)

AS
BEGIN

DELETE FROM DashBoardRooms
WHERE PK = @DashboardIds;
SET @DashboardIds= @@IDENTITY;
	RETURN @DashboardIds;
END
GO
/****** Object:  StoredProcedure [dbo].[SP_DELETESECTIONROOMS]    Script Date: 10/04/2025 16:16:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================


CREATE PROCEDURE [dbo].[SP_DELETESECTIONROOMS]
    @sectionIds VARCHAR(100)
AS
BEGIN

    DELETE FROM SectionRoom
    WHERE SectionName = @sectionIds;
	--SELECT * FROM SectionRoom
END
GO
/****** Object:  StoredProcedure [dbo].[SP_INSERTSECTIONROOM]    Script Date: 10/04/2025 16:16:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[SP_INSERTSECTIONROOM]
	-- Add the parameters for the stored procedure here
	@dashboardroompk int,
	@sectionname varchar(100)
AS
BEGIN
	INSERT INTO SectionRoom (DashBoardRoomPK, SectionName) VALUES (@dashboardroompk, @sectionname)
END
GO
USE [master]
GO
ALTER DATABASE [aspdashboard] SET  READ_WRITE 
GO
