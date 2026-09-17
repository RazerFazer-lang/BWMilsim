# BWMilsim – Feature Specification

## Zielbild

BWMilsim soll sich wie ein digitaler Gefechtsstand für eine Arma-3-Coop-Milsim anfühlen. Die Webanwendung begleitet eine Operation von der Personalverwaltung und Vorbereitung über Briefing und Live-Lage bis zur Nachbesprechung.

## Benutzerfluss

1. Host startet BWMilsim lokal.
2. Teilnehmer öffnen die Host-Adresse im Browser.
3. Teilnehmer melden sich mit Benutzername/Passwort bzw. einem vom Host bereitgestellten Zugang an.
4. Jeder sieht abhängig von Rolle und Berechtigungen den gemeinsamen aktuellen Stand.
5. Änderungen werden sofort an alle berechtigten Teilnehmer verteilt.
6. Nach der Mission werden Live-Ereignisse für die AAR-Grundlage übernommen.
7. AAR wird ergänzt, Maßnahmen werden Verantwortlichen zugeteilt.
8. Operation wird archiviert, bleibt aber vollständig durchsuchbar.

## Realistische Organisationsstruktur

Standardmäßig konfigurierbare Bundeswehr-orientierte Hierarchie:

- Kommando
- Bataillon
- Kompanie
- Zug
- Gruppe
- Trupp

Bezeichnungen dürfen pro Server geändert werden. Einheiten haben Kürzel, Rufzeichen, Farbe/Markierung, Führung und Mitglieder.

## Ränge

Eine Beispielkonfiguration soll die deutschen militärischen Dienstgrade abbilden können, ohne dass die Software selbst festlegt, welche Gemeinschaft welche Rangordnung benutzen muss. Beispiele der Konfiguration:

- Soldat
- Gefreiter
- Obergefreiter
- Hauptgefreiter
- Stabsgefreiter
- Oberstabsgefreiter
- Unteroffizier
- Stabsunteroffizier
- Feldwebel
- Oberfeldwebel
- Hauptfeldwebel
- Stabsfeldwebel
- Oberstabsfeldwebel
- Leutnant
- Oberleutnant
- Hauptmann
- Major
- Oberstleutnant
- Oberst

Zusätzlich sollen servereigene Ränge, Rangabzeichen und alternative Systeme angelegt werden können.

## Personalakte

Jeder Teilnehmer erhält eine digitale Dienst-/Spielerakte:

- Anzeigename
- Rufname
- Rang
- Einheit
- Funktion
- Steam-/Arma-Bezug optional
- Qualifikationen
- Anwesenheitsstatus
- Status in der aktuellen Operation
- Notizen
- Historie von Beförderungen und Einheiten

## Qualifikationen

Beispiele:

- Gruppenführer
- Truppführer
- Sanitäter
- Combat Medic
- JTAC/JFO
- Funker
- Fahrer
- Richtschütze
- MG-Schütze
- Panzerbesatzung
- Pilot
- Drohnenoperator
- Pionier

Qualifikationen werden mit Besitzer, Ausstellungsdatum, Ablaufdatum optional und Verifizierung gespeichert.

## Operationsakte

Eine Operation enthält:

- Operationsname
- Status: Planung / Bereit / Aktiv / Pause / Abgeschlossen / Archiviert
- Datum und Uhrzeit
- Operationsleitung
- Auftraggeber
- Lage
- Feindlage
- Eigenlage
- Zivillage
- Wetter/Umwelt optional
- Missionsziel
- ROE / Milsim-Regeln
- Kommunikationsplan
- Logistik
- Sanitätskonzept
- Extraktion
- Anhänge

## OPORD-Unterstützung

Die Oberfläche soll eine strukturierte OPORD-Erfassung unterstützen:

1. Situation
2. Mission
3. Execution
4. Sustainment
5. Command & Signal

Zusätzliche Vorlagen können für FRAGO, Warnbefehl, Lageänderung und Rückmarsch angelegt werden.

## Kartenmodul

Die Karte ist ein zentraler Bestandteil:

- mehrere Kartenprofile
- Zoom/Pan
- Raster
- Marker
- Symbole
- Farben
- Beschriftungen
- Einheitenmarker
- Ziele
- Checkpoints
- Linien/Flächen
- Bewegungsachsen
- Sperren/Grenzen
- Feuerstellungen
- Evakuierungspunkte
- Versorgungspunkte
- Spawn-/Startbereiche
- versteckte Führungsebene

Ein Kartenobjekt speichert Ersteller, Zeit, letzte Änderung und Sichtbarkeitsregeln.

## Layer-Rechte

Beispiel:

- Öffentlich: allgemeine Missionsinformationen
- Zugführung: eigene und untergeordnete Einheiten
- Kompanieführung: gesamte eigene Lage
- Operationsleitung: vollständige Lage
- AAR: nur Nachbereitungsteam/Führung je nach Konfiguration

## Tasks

Tasks besitzen:

- Titel
- Beschreibung
- Priorität
- Status
- Verantwortliche Einheit
- Start-/Fälligkeitszeit
- Position oder Gebiet
- Abhängigkeiten
- Fortschritt
- Abschlussnotiz

Status: `planned`, `active`, `blocked`, `completed`, `cancelled`.

## Meldesystem

Strukturierte Meldungstypen:

- SITREP
- CONTACT
- CASUALTY
- LOGISTICS
- REQUEST
- TASK COMPLETE
- TASK FAILURE
- INTEL
- COMMAND
- ADMIN

Jede Meldung erhält Absender, Zielgruppe, Zeit, Priorität und Empfangsstatus.

## Echtzeit-Anzeige

Wenn ein Nutzer beispielsweise einen Kartenmarker verschiebt, soll ein anderer Nutzer die Bewegung ohne Browser-Refresh sehen. Das gleiche gilt für:

- Rangänderung
- Einheitszuordnung
- Taskstatus
- Operationsphase
- Meldungen
- AAR-Einträge
- Nutzer online/offline
- Fahrzeugstatus

Im UI wird ein kleines Präsenzsystem angezeigt: `online`, `idle`, `offline`, letzte Aktivität.

## Operationsphasen

Beispielablauf:

- PREP
- BRIEFING
- MOVE
- OBJECTIVE
- CONSOLIDATE
- EXFIL
- DEBRIEF
- AAR

Die Phasen sind konfigurierbar und können manuell oder über Zeitpunkte geändert werden.

## Nachbesprechung / AAR

Die AAR-Seite soll deutlich umfangreicher als ein normales Formular sein.

### Automatisch vorbereitete Timeline

Aus Live-Events werden Zeitpunkte übernommen:

- Operationsstart
- Phasenwechsel
- wichtige Tasks
- Meldungen
- Casualties
- Änderungen an Einheiten
- markierte Schlüsselereignisse
- Operationsende

### Manuelle AAR-Kategorien

- Missionsergebnis
- Was war geplant?
- Was ist passiert?
- Was hat funktioniert?
- Was hat nicht funktioniert?
- Kommunikationsprobleme
- Führung/Entscheidungen
- Taktische Durchführung
- Logistik
- Sanität
- Technik
- Mod-/Missionsprobleme
- Lessons Learned
- konkrete Verbesserungsmaßnahmen

### Action Items

Ein AAR-Fazit kann Aufgaben erzeugen:

- Maßnahme
- Verantwortlicher
- Priorität
- Fälligkeit
- Status
- Verknüpfte Stelle/Problem

## Material und Fahrzeuge

Bestandsverwaltung für die virtuelle Einheit:

- Fahrzeug
- Typ
- Rufzeichen
- Besatzung
- Status
- Standort
- Zustand
- Treibstoff optional
- Munition optional
- Eigentümer/Einheit
- Wartungsnotiz

## Ereignis-/Audit-Log

Administratoren können nachvollziehen:

- wer
- wann
- was
- geändert hat
- alten Wert
- neuen Wert
- betroffene Entität

Das Audit-Log ist append-only und nicht aus der normalen Oberfläche löschbar.

## Suche

Globale Suche über:

- Personal
- Einheiten
- Operationen
- Tasks
- Meldungen
- AAR
- Fahrzeuge
- Ereignisse

Autocomplete soll bereits während der Eingabe Treffer anzeigen.

## Backup / Import / Export

Lokal gespeicherte Daten müssen exportierbar sein. Vorgesehen:

- vollständiges JSON-Backup
- Datenbankbackup
- CSV-Export Personal
- CSV-Export Operationsteilnahme
- AAR-Export
- Import eines vorherigen Backups

## Verbindung

Der Host zeigt:

- lokale IPv4-Adresse
- erkannte LAN-Adressen
- Port
- Verbindungs-URL
- aktive Clients
- WebSocket-Status
- Datenbankstatus

Der Host soll eine einfache Anleitung anzeigen, wie man dieselbe URL im LAN oder über ein VPN erreicht.

## Offline / Reconnect

Bei kurzer Unterbrechung:

- UI bleibt lesbar
- Änderungen werden als ausstehend markiert
- nach Verbindung wird neu synchronisiert
- Konflikte werden verständlich angezeigt
- bei nicht auflösbarem Konflikt bleibt die Serverversion autoritativ

## Bedienung

Tastaturkürzel sollen konfigurierbar sein, z. B.:

- `G` – Lagekarte
- `P` – Personal
- `O` – aktuelle Operation
- `M` – Meldungen
- `A` – AAR
- `N` – neue Meldung
- `Esc` – Overlay schließen

## UI

Desktop-first, aber responsive:

- linke Hauptnavigation
- obere Operationsleiste
- zentrale Arbeitsfläche
- rechte Kontext-/Detailleiste
- Statusleiste für Verbindung und aktuelle Operation

Visuals: dunkles Command-Center-Design, dezente Raster-/Kartenmotive, klare Typografie, keine unnötigen Animationen.

## Arma-3-Integration – vorbereiten

Die Architektur soll später Integrationen aufnehmen können, ohne das Kernsystem umzubauen:

- Export von Mission-/Briefing-Daten
- Import von Arma-Spieler-/Slotdaten
- CBA/ACE3-bezogene Missionsinformationen optional
- Server-/Missionstatus über optionalen Bridge-Dienst
- eventuelle REST/WebSocket-Bridge zu einer laufenden Arma-Instanz

Diese Integrationen sind getrennt vom lokalen Kernsystem zu implementieren.
