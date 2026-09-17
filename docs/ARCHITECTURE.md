# BWMilsim – Arma 3 Milsim Platform

## Produktziel

BWMilsim ist eine lokal betreibbare, kooperative Web-Zentrale für Arma-3-Milsim. Ein Host startet die Anwendung, weitere Teilnehmer verbinden sich über LAN oder VPN. Alle autorisierten Clients arbeiten auf demselben serverseitigen Datenbestand und erhalten Änderungen in Echtzeit.

## Betriebsmodell

```text
                 LAN / VPN / Hamachi / Tailscale / Radmin
                              |
                 +------------v-------------+
                 |      BWMilsim Host      |
                 |  Web UI + API + WS      |
                 |  SQLite + Event Store   |
                 +------------+-------------+
                              |
          +-------------------+-------------------+
          |                   |                   |
      Client A            Client B            Client C
     Browser/Desktop      Browser/Desktop      Browser/Desktop
```

### Host

Der Host ist die autoritative Instanz. Er hält Benutzer, Organisation, Operationen, Kartenobjekte, Aufträge, Meldungen und AAR-Daten. Clients schreiben niemals direkt in die Datenbank.

### Clients

Jeder Browser lädt einen initialen Snapshot und öffnet danach eine WebSocket-Verbindung. Änderungen werden als Events verteilt. Ein Reconnect fordert den seit dem letzten bekannten Event fehlenden Bereich oder einen neuen Snapshot an.

## Realtime-Modell

Jede mutierende Operation erzeugt ein serverseitiges Domain-Event, z. B.:

- `person.updated`
- `rank.assigned`
- `unit.membership.changed`
- `operation.created`
- `operation.phase.changed`
- `map.marker.created`
- `map.marker.updated`
- `task.status.changed`
- `radio.message.created`
- `casualty.recorded`
- `aar.note.created`
- `aar.lesson.created`

Ein Event enthält mindestens `eventId`, `timestamp`, `actorId`, `entityType`, `entityId`, `eventType`, `version` und `payload`.

## Konfliktbehandlung

Der Server verwendet Optimistic Concurrency. Schreiboperationen senden die zuletzt bekannte Entity-Version. Bei Versionsabweichung wird die Änderung abgelehnt und der Client erhält den aktuellen Stand. Für Kartenmarker und Notizen können zusätzlich last-write-wins oder feldbasierte Konfliktregeln verwendet werden.

## Rollen und Rechte

Vorgesehene Rollen:

- `admin`
- `operations`
- `commander`
- `platoon_lead`
- `squad_lead`
- `medic`
- `logistics`
- `observer`
- `member`

Rechte werden granular modelliert, z. B. `person.read`, `person.write`, `operation.write`, `map.write`, `aar.write`, `admin.write`.

## Dienstgrade

Dienstgrade werden datengetrieben statt fest im UI hinterlegt. Eine Standardkonfiguration kann Bundeswehr-nahe Ränge bereitstellen, soll aber pro Gemeinschaft anpassbar sein. Rangobjekte besitzen mindestens `code`, `name`, `abbreviation`, `sortOrder`, `category` und optionale Insignien-Metadaten.

## Kernmodule

### 1. Dashboard
Aktive Operation, aktuelle Phase, Teilnehmer, offene Aufträge, Meldungen, letzte Ereignisse und Serverstatus.

### 2. Personal
Spielerprofil, Name, Rufname, Rang, Einheit, Qualifikationen, Dienststatus, Anwesenheit, Notizen und Historie.

### 3. Organisation
Kompanie/Bataillon/Zug/Gruppe/Trupp-Struktur mit verschiebbaren Mitgliedern und Führungsfunktionen.

### 4. Operations
Operationen mit OPORD-artiger Struktur: Lage, Auftrag, Durchführung, Einsatzunterstützung, Führung/Verbindung sowie zusätzliche Regeln/Anhänge.

### 5. Missionsplanung
Phasen, Tasks, Checkpoints, Synchronisationspunkte, Einheiten, Ziele und Kartenmarker.

### 6. Live-Lage
Gemeinsame Lagekarte mit Ebenen, Freund/Feind/Neutral-Markern, Bewegungen, geplanten Positionen, Tasks und Ereignis-Timeline. Zugriffsregeln können einzelne Ebenen auf Führungsrollen beschränken.

### 7. Meldungen und Befehle
Strukturierte Meldungen, Lageupdates, Aufträge, Empfangsbestätigungen und Status.

### 8. Logistik
Fahrzeuge, Material, Munition, Versorgung, Reparaturstatus und Verantwortlichkeiten.

### 9. Sanitäts-/Verwundetenverwaltung
In-Milsim-Rahmen: Verwundetenstatus, Evakuierung, Behandlung, Rückkehr, Ausfall und Nachbereitung.

### 10. Nachbesprechung / AAR
Automatische Übernahme relevanter Operationsereignisse plus manuelle Eingaben. Abschnitte: Ablauf, Ereignisse, Was lief gut, Was lief schlecht, Lessons Learned, Maßnahmen, Verantwortliche, Fälligkeitsdatum und Abschlussstatus.

### 11. Statistik und Historie
Operationen, Teilnahme, Aufgabenabschluss, AAR-Maßnahmen, Qualifikationen und organisatorische Historie.

### 12. Administration
Rollen, Rechte, Ränge, Einheiten, Kartenprofile, Datenexport, Backup, Systemdiagnose und Audit-Log.

## Datenmodell – Kernentitäten

- `User`
- `Role`
- `Permission`
- `Rank`
- `Unit`
- `UnitMembership`
- `Qualification`
- `Operation`
- `OperationPhase`
- `Task`
- `MapLayer`
- `MapMarker`
- `Message`
- `Vehicle`
- `Equipment`
- `Casualty`
- `AAREvent`
- `AARLesson`
- `AARActionItem`
- `AuditEvent`
- `ServerSetting`

## Sicherheit

Passwörter werden ausschließlich gehasht gespeichert. Sessions sind serverseitig bzw. über sichere signierte Tokens geschützt. Admin- und Führungsfunktionen erfordern serverseitige Rechteprüfung. Das System ist standardmäßig nur im lokalen Netz/VPN erreichbar; öffentliche Freigabe ist eine explizite Betriebsentscheidung.

## Lokal zuerst

Standardstart:

```text
npm install
npm run dev
```

Produktiv soll ein einziger Host-Prozess Frontend, API und WebSocket-Endpunkt bereitstellen können. SQLite ist für eine typische private Milsim-Größe die Standarddatenbank; Migration auf PostgreSQL bleibt möglich.

## UI-Richtung

Militärisch-professionelle Oberfläche ohne überladene Effekte: klare Informationshierarchie, Kartenfokus, kompakte Tabellen, Status-Chips, dunkler Leitstellen-/Gefechtsstand-Look und vollständige Tastaturbedienung. Mobile Nutzung soll für Status, Meldungen und AAR möglich sein; die vollständige Lageplanung ist für Desktop optimiert.
