# Course Manager

![.NET 8](https://img.shields.io/badge/.NET%208-512BD4?logo=dotnet&logoColor=white)
![C#](https://img.shields.io/badge/C%23-239120?logo=csharp&logoColor=white)
![ASP.NET Core](https://img.shields.io/badge/ASP.NET%20Core-5C2D91?logo=dotnet&logoColor=white)
![Azure](https://img.shields.io/badge/Azure_App_Service-0078D4?logo=microsoftazure&logoColor=white)
![Blob Storage](https://img.shields.io/badge/Azure%20Blob%20Storage-0089D6?logo=microsoftazure&logoColor=white)
![Azure SQL Database](https://img.shields.io/badge/Azure%20SQL%20Database-CC2927?logo=microsoftsqlserver&logoColor=white)
![Entity Framework Core](https://img.shields.io/badge/EF%20Core-68217A?logo=dotnet&logoColor=white)
![Angular](https://img.shields.io/badge/Angular%2021-DD0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Sass](https://img.shields.io/badge/Sass-CC6699?logo=sass&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)
![NPM](https://img.shields.io/badge/NPM-CB3837?logo=npm&logoColor=white)
![PowerShell](https://img.shields.io/badge/PowerShell-5391FE?logo=powershell&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

## Beskrivning

Course Manager är en webbapplikation för att hantera kurser, kurssektioner, grupper och deltagare. Systemet låter dig organisera utbildningsinnehåll med stöd för filuppladdning och förhandsgranskning av dokument direkt i webbläsaren.

**Funktioner:** Skapa, redigera och ta bort kurser, kurssektioner, grupper och deltagare. Tilldela deltagare till kurser, kurssektioner och grupper via many-to-many-relationer. Ladda upp filer (bilder, PDF, text) kopplade till valfri entitet. Förhandsgranska textfiler, bilder, ljud och PDF direkt i webbläsaren. Redigera textfiler inline. Ladda ner alla filer för en entitet som ZIP. Sök bland kurser och deltagare. Mörkt och ljust läge med automatisk anpassning. Responsiv design anpassad för både desktop och mobil.

**Struktur:** Varje kurs innehåller kurssektioner. Varje kurssektion innehåller grupper. Deltagare kan kopplas till kurser, kurssektioner och grupper. Filer kan laddas upp på alla nivåer.

**Teknik:** Backend är byggd med ASP.NET Core, Entity Framework Core och Azure SQL Database. Filhantering sker via Azure Blob Storage eller lokal fillagring (i Utvecklingsmiljö). Applikationen körs i Azure App Service. Frontend är byggd med Angular (v21) och TypeScript med SCSS för styling.

---

## Arkitektur

Projektet består av två delar:

- **CourseManager.Server**: Webbservern som hanterar API, databas och filhantering
- **CourseManager.Client**: Frontend byggd med Angular

### Azure-baserad arkitektur

Systemet använder följande Azure-tjänster:

- **Azure App Service** → Hosting av backend API och frontend
- **Azure SQL Database** → Databas för kurser, sektioner, grupper, deltagare och filmetadata
- **Azure Blob Storage** → Lagring av uppladdade filer

---

### Server

- REST API för kurser, kurssektioner, grupper, deltagare och relationer
- Filhantering via Azure Blob Storage eller lokal fillagring (i Utvecklingsmiljö)
- Azure SQL Database via Entity Framework Core
- ZIP-nedladdning av alla filer för en entitet (inkl. nested)
- CORS-konfiguration för frontend

---

### Webbläsargränssnitt

- Skrivet i Angular med TypeScript
- SCSS för styling
- Responsiv design med hamburgermeny för mobil
- Mörkt/ljust läge med `prefers-color-scheme`-detektion
- Inline textredigering
- Filförhandsgranskning (text, bild, ljud, PDF)
- Bekräftelsedialoger för destruktiva operationer
- Snackbar-meddelanden med auto-dismiss

---

### Lagring

- Metadata lagras i Azure SQL Database (eller LocalDB lokalt i utvecklingsläge)
- Filer lagras i Azure Blob Storage eller lokalt filsystem (`uploads/` i utvecklingsläge)
- Many-to-many-relationer mellan entiteter och filer via join-tabeller

---

## Komplett funktionell översikt

### Kurshantering

- Skapa kurs med namn och beskrivning
- Visa alla kurser med sökfunktion
- Redigera kursinformation
- Ta bort kurs med bekräftelsedialog
- Visa kursdetaljer med kurssektioner och deltagare

### Kurssektioner

- Skapa kurssektion kopplad till en kurs
- Visa kurssektion med dess grupper och deltagare
- Redigera och ta bort kurssektioner

### Grupphantering

- Skapa grupp kopplad till en kurssektion
- Visa gruppdetaljer med deltagare
- Redigera och ta bort grupp

### Deltagare (Persons)

- Skapa deltagare med fullständigt namn
- Lista alla deltagare med sökfunktion
- Visa deltagardetaljer med kopplade kurser, sektioner, grupper och filer
- Tilldela deltagare till kurser, kurssektioner och grupper
- Ta bort deltagare

### Filhantering

- Ladda upp filer (PNG, JPG, PDF, TXT) till kurs, kurssektion, grupp eller deltagare
- Max filstorlek: 50 MB
- Förhandsgranska textfiler med inline-redigering
- Bildvisning för uppladdade bilder
- PDF-visning via webbläsaren
- Ladda ner enskild fil
- Ladda ner alla filer för en entitet som ZIP (inklusive nested filer)
- Content-modul med översiktsvy som grupperar filer efter källa
- Ta bort filer med bekräftelsedialog

### UI/UX-detaljer

- Top-nav med logotyp, navigationslänkar och tema-toggle
- Brödsmulestig (breadcrumb) för navigering
- Snackbar för framgångs- och felmeddelanden
- Bekräftelsedialoger (Yes/No) för destruktiva operationer
- Responsiv hamburgermeny för mobil
- Mörkt/ljust läge — toggle-knapp och auto-detection via `prefers-color-scheme`
- Footer med copyright

---

## API-endpoints

### Kurser: api/course

- `GET /api/course` — Lista alla kurser
- `GET /api/course/{courseId}` — Hämta en kurs
- `POST /api/course` — Skapa kurs
- `PUT /api/course/{courseId}` — Uppdatera kurs
- `DELETE /api/course/{courseId}` — Ta bort kurs

### Kurssektioner: api/course-section

- `GET /api/course-section` — Lista alla kurssektioner
- `GET /api/course-section/{sectionId}` — Hämta en kurssektion
- `POST /api/course-section` — Skapa kurssektion
- `PUT /api/course-section/{sectionId}` — Uppdatera kurssektion
- `DELETE /api/course-section/{sectionId}` — Ta bort kurssektion

### Grupper: api/group

- `GET /api/group` — Lista alla grupper
- `GET /api/group/{groupId}` — Hämta en grupp
- `POST /api/group` — Skapa grupp
- `PUT /api/group/{groupId}` — Uppdatera grupp
- `DELETE /api/group/{groupId}` — Ta bort grupp

### Deltagare: api/person

- `GET /api/person` — Lista alla deltagare
- `GET /api/person/{personId}` — Hämta en deltagare
- `POST /api/person` — Skapa deltagare
- `PUT /api/person/{personId}` — Uppdatera deltagare
- `DELETE /api/person/{personId}` — Ta bort deltagare

### Relationer: api/relations

- `POST /api/relations/course` — Tilldela deltagare till kurs
- `DELETE /api/relations/course/{courseId}/{personId}` — Ta bort deltagare från kurs
- `POST /api/relations/course-section` — Tilldela deltagare till kurssektion
- `DELETE /api/relations/course-section/{sectionId}/{personId}` — Ta bort deltagare från kurssektion
- `POST /api/relations/group` — Tilldela deltagare till grupp
- `DELETE /api/relations/group/{groupId}/{personId}` — Ta bort deltagare från grupp

### Filer: api/files

- `GET /api/files/{fileAssetId}` — Hämta filmetadata
- `POST /api/files/upload/{entityType}/{entityId}` — Ladda upp fil
- `DELETE /api/files/{fileAssetId}` — Ta bort fil
- `GET /api/files/{fileAssetId}/content` — Läs filinnehåll (text)
- `PUT /api/files/{fileAssetId}/content` — Uppdatera filinnehåll (text)
- `GET /api/files/{fileAssetId}/download` — Ladda ner fil
- `GET /api/files/{fileAssetId}/inline` — Visa fil inline
- `GET /api/files/course/{courseId}` — Lista filer för kurs
- `GET /api/files/course-section/{sectionId}` — Lista filer för kurssektion
- `GET /api/files/group/{groupId}` — Lista filer för grupp
- `GET /api/files/person/{personId}` — Lista filer för deltagare
- `GET /api/files/download/{entityType}/{entityId}` — Ladda ner alla filer som ZIP
- `DELETE /api/files/course/{courseId}/{fileAssetId}` — Ta bort fil från kurs
- `DELETE /api/files/course-section/{sectionId}/{fileAssetId}` — Ta bort fil från kurssektion
- `DELETE /api/files/group/{groupId}/{fileAssetId}` — Ta bort fil från grupp
- `DELETE /api/files/person/{personId}/{fileAssetId}` — Ta bort fil från deltagare

---

## Projektstruktur

```text
Course-Manager/
├─ .gitignore
├─ package.json
├─ package-lock.json
├─ README.md
├─ CourseManager.Client/
│  ├─ angular.json
│  ├─ package.json
│  ├─ tsconfig.json
│  ├─ tsconfig.app.json
│  ├─ tsconfig.spec.json
│  ├─ .editorconfig
│  ├─ .prettierrc
│  ├─ public/
│  └─ src/
│     ├─ index.html
│     ├─ main.ts
│     ├─ styles.scss
│     ├─ environments/
│     │  ├─ environment.ts
│     │  └─ environment.prod.ts
│     └─ app/
│        ├─ app.ts
│        ├─ app.html
│        ├─ app.routes.ts
│        ├─ app.config.ts
│        ├─ theme.service.ts
│        ├─ groups.service.ts
│        ├─ home/
│        ├─ layout/
│        ├─ all-courses/
│        ├─ course-view/
│        ├─ course-section-view/
│        ├─ group-view/
│        ├─ persons/
│        ├─ participant-detail/
│        ├─ create-course/
│        ├─ create-course-section/
│        ├─ create-group/
│        ├─ edit-group/
│        ├─ person-creator/
│        ├─ content-module/
│        │  └─ file-preview/
│        ├─ confirm-dialog/
│        ├─ modal-window/
│        ├─ shared/
│        │  └─ snackbar/
│        ├─ api-services/
│        └─ not-found/
└─ CourseManager.Server/
   ├─ Program.cs
   ├─ appsettings.json
   ├─ appsettings.Development.json
   ├─ CourseManager.Server.csproj
   ├─ Deploy.ps1
   ├─ Data/
   │  └─ AppDbContext.cs
   ├─ DTOs/
   ├─ Endpoints/
   │  ├─ CourseEndpoints.cs
   │  ├─ CourseSectionEndpoints.cs
   │  ├─ GroupEndpoints.cs
   │  ├─ PersonEndpoints.cs
   │  ├─ RelationsEndpoints.cs
   │  └─ FileEndpoints.cs
   ├─ Migrations/
   ├─ Models/
   ├─ Repositories/
   ├─ Services/
   │  └─ BlobService.cs
   ├─ Properties/
   └─ wwwroot/
```

---

## Lokal utveckling

### Krav

- .NET SDK 8
- Node.js och npm
- Angular CLI (installeras via npm)
- SQL Server LocalDB (eller Azure SQL)

### Snabbstart (rekommenderat)

Från rot-mappen, kör följande för att starta både backend och frontend samtidigt:

```powershell
npm install
npm run dev
```

Backend startar på `http://localhost:5053` (eller konfigurerad port).  
Frontend startar på `http://localhost:4200` och proxyar API-anrop till backend.

### Starta backend separat

```powershell
cd CourseManager.Server
dotnet run
```

### Starta frontend separat

```powershell
cd CourseManager.Client
npm install
npm start
```

---

## Deployment

Automatisk deploy till Azure med PowerShell:

```powershell
.\CourseManager.Server\Deploy.ps1
```

---

## Konfiguration

Servern använder `appsettings.json` för grundkonfiguration och `appsettings.Development.json` för lokal utveckling.

**Connection strings** konfigureras via miljövariabler eller `appsettings.json`:

- `ConnectionStrings:AzureSqlConnection` — Azure SQL Database-anslutning
- `AzureStorage:ConnectionString` — Azure Blob Storage-anslutning
- `AzureStorage:ContainerName` — Blob container-namn

Lokalt används LocalDB automatiskt om ingen Azure-connection string finns. Filuppladdning sker till lokal `uploads/`-mapp om Azure Blob Storage inte är konfigurerat.

---

## Säkerhet

- CORS är konfigurerat för specifika origins (Azure-domän och localhost)
- Filuppladdning validerar filtyp (PNG, JPG, PDF, TXT) och filändelse
- Max filstorlek: 50 MB
- Skydd mot ogiltiga filnamn och path traversal
- Entity Framework migrationer körs automatiskt vid startup

---

## English Summary

Course Manager is a web application for managing courses, course sections, groups, and participants. It allows you to organize educational content with support for file uploads and document previews directly in the browser.

Courses contain course sections, which in turn contain groups. Participants can be assigned to courses, course sections, and groups through many-to-many relationships. Files can be uploaded at any level.

The backend is built with ASP.NET Core and Entity Framework Core, using Azure SQL Database for metadata and Azure Blob Storage for file storage. The frontend is built with Angular and TypeScript, featuring a responsive design with dark/light theme support.

## Utvecklare

- **Alaa Alsous**
- **Johan Norgren**
- **Nils Öhrn Skäre**
- **Alexander Ljungqvist**
- **Sebastian Johansson**
- **Nour Amairy**
- **Alexander Lindgren**
