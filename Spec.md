# Specifikation

För att säkerställa att vi har tillgång till utvecklare med relevant kompetens i
närheten har följande utvecklingsmiljö valts:

- [ASP.NET](https://dotnet.microsoft.com/en-us/apps/aspnet) server med
  [Minimal API](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis?view=aspnetcore-10.0)
  som backend.
- [Angular](https://angular.dev/) som frontend
- En [Android App](https://developer.android.com/) finns som **önskemål**, men
  som start bör vi nog börja med en ren webbsida som är mobilanpassad i stället
- Möjlighet att driftsätta lokalt eller via cloud, oklart vad som kommer vara
  möjligt, bygg inte in i ett hörn

## Arbetet vi ska förenkla

Johan sitter idag och hanterar mycket anteckningr och bilder för varje person i
utbildningen, så att han vet vad han ska fylla i när utbildningen är klar och
det ska skickas in till relevanta myndigheter. Mappar skapas för varje
utbildningsmoment liksom varje grupp i detta moment, och kan exempelvis se ut
såhär när han är klar:

```
kursnamn-2026
├── Fnatte-Knatte
|   ├──fnatte-anteckningar.txt
|   ├──knatte-anteckningar.txt
|   ├──bild1.jpg
|   ├──bild2.jpg
|   ├──bild3.jpg
|   ├──bild4-fnatte.jpg
|   └──bild5-knatte.jpg
|
├── Kajsa-Långben
|   ├──kajsa-anteckningar.txt
|   ├──långben-anteckningar.txt
|   ├──bild1.jpg
|   ├──bild2-kajsa.jpg
|   └──bild3-kajsa.jpg
|
└── Kalle-Tjatte
    ├──kalle-anteckningar.txt
    ├──tjatte-anteckningar.txt
    └──bild1.jpg
```

## Förslag till MVP lösning

- Skapa en mobilanpassad webbsida som är riktad till ansvariga personen, dvs
  **inte** något som ska visas för kursdeltagarna
- Användern bör kunna skapa nya kurstillfällen, och bör kunna ge dessa valfria
  namn
  - Det bör gå att skapa grupper under varje kurstillfällen
  - Det bör gå att koppla personer till ett kurstillfälla och såklart till
    grupperna
  - Det bör gå att lägga in anteckningar direkt på ett kurstillfälle, för en
    grupp, eller för en enda person. Exempelvis att skriva in vad en grupp har
    gjort, eller skriva in vad en specifik person har gjort, vad som kan behöva
    kompletteras / undersökas senare osv
    - Det bör gå att göra samma sak men via att spela in ljud från mikrofonen,
      så att anteckningar kan tas på fält utan att behöva skriva då det kan
      regna, snöa, eller annars vara otympligt att göra det med fingrarna.
      Automatisk röst -> text för detta hade varit en **stor** bonus
    - Det bör även gå att på motsvarande sätt ta bilder med kameran, för ett
      kurstille, en grupp eller bara för en specifik person
    - Bör även gå att ladda upp filer på mostavarande sätt
- Det bör gå att visa en vy för varje person för ett kurstillfälle, och då se
  allt denna person var involverad i. Alla bilder, texter, ljud osv som finns
  för hela kurstillfället ska då visas, liksom det som finns för alla grupper
  personen ingår i, liksom såklart det som finns för endast denna person.

Tanken är alltså att skapa ett gränssnitt som gör den manuella mappstrukturen
enklare. Det bör gå att skapa ett nytt kurstillfälle, och ange vilka personer
som deltar. Det bör gå att placera dessa deltagare i grupper. Det bör även gå
att lägga in anteckningar, antingen övergripande för hela kurstillfället, för en
grupp, eller för en specifik person. På motsvarande sätt behöver bilder, filer
och inspelningar av olika slag kunna läggas in med. Allt detta bör sedan gå att
se per person så att användaren slipper gå mellan olika vyer för att veta vad en
person deltog i.
