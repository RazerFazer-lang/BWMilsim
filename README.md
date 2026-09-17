# BWMilsim

**Lokale, gemeinsam synchronisierte Operationsplattform für Arma 3 Milsim.**

## 🌐 Direkt öffnen

**Web-Demo / Oberfläche:**
https://razerfazer-lang.github.io/BWMilsim/

**3D-Lagekarte direkt öffnen:**
https://razerfazer-lang.github.io/BWMilsim/altis3d.html

Die GitHub-Pages-Seite ist als leicht zugängliche Web-Oberfläche gedacht. Die 3D-Lagekarte ist als eigenständige Browseransicht verfügbar; die vollständige gemeinsame Echtzeit-Session läuft weiterhin über den lokalen BWMilsim-Host.

## 🖥️ Lokaler Coop-Server

Voraussetzung: **Node.js 18 oder neuer**.

```bash
git clone https://github.com/RazerFazer-lang/BWMilsim.git
cd BWMilsim
npm start
```

Host öffnen:

```text
http://localhost:3000
```

Andere Spieler öffnen die LAN-/VPN-Adresse des Hosts, z. B.:

```text
http://192.168.178.50:3000
```

Der Server bindet standardmäßig an `0.0.0.0:3000` und gibt beim Start die verfügbaren LAN-Adressen aus.

## Aktueller Stand

- Führungs-Dashboard
- Operationsverwaltung mit Missionsphasen
- **3D-Lagekarte mit vollständiger Insel-Terrainansicht**
- frei drehbare Kamera, Zoom und Pan
- Höhenmodell und Gelände-Schattierung
- Grid, North-Orientierung und Ortsreferenzen
- gemeinsame Lageobjekte und synchronisierte Marker im lokalen Modus
- Doppelklick-Markierung auf dem Terrain im lokalen Modus
- Auftragsverwaltung
- Lagemeldungen / Befehle / Funkmeldungen
- Personalstamm
- Einheiten-/Organisationsansicht
- konfigurierbare Dienstgrade
- Nachbesprechung / AAR
- Audit-/Änderungsverlauf
- lokale Persistenz
- Echtzeit-Synchronisierung des gemeinsamen Serverzustands per SSE
- lokale Ausführung ohne Cloud-Abhängigkeit
- GitHub Pages Web-Demo

## 3D-Karte

Die 3D-Karte wird mit Three.js gerendert. Die im Repository enthaltene Terrainbasis ist eine **schematische, lizenzsaubere Vollinsel-Darstellung** mit Altis-Ortsreferenzen und ist ausdrücklich nicht aus extrahierten Arma-3-Spieldateien erzeugt. Eine exakt passende, entsprechend lizenzierte Geländedatenbasis kann später als austauschbares Höhen-/Terrain-Paket eingebunden werden.

## Architektur

```text
                 GitHub Repository
                        │
          ┌─────────────┴─────────────┐
          │                           │
   GitHub Pages                 Lokaler Host
   Web-Oberfläche + 3D          Node.js Server
          │                           │
          │                    gemeinsamer Zustand
          │                           │
          │             ┌─────────────┼─────────────┐
          │             │             │             │
          │          Browser 1     Browser 2     Browser ...
          │
       Demo / UI
```

## Nächste Ausbauphasen

Die Basis ist jetzt vorhanden. Darauf folgen insbesondere Rollen/Rechte, echte Dienstposten, vollständige Einheitenhierarchie, Missions-/Briefing-Builder, Logistik, Sanitäts-/Casualty-Tracking, Trainings und Qualifikationen, Szenario-Templates, Import/Export, Sessionverwaltung und später eine optionale Arma-3-Bridge.
