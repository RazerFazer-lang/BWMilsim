# BWMilsim

**Lokale, gemeinsam synchronisierte Operationsplattform für Arma 3 Milsim.**

## 🌐 Direkt öffnen

**Web-Demo / Oberfläche:**
https://razerfazer-lang.github.io/BWMilsim/

Die GitHub-Pages-Seite ist als leicht zugängliche Web-Oberfläche gedacht. GitHub Pages veröffentlicht die statischen Dateien direkt aus dem Repository; Updates können automatisch über GitHub Actions ausgerollt werden.

> Hinweis: GitHub Pages selbst unterstützt keine serverseitige Node.js-Ausführung. Deshalb läuft die vollständige gemeinsame Echtzeit-Session weiterhin über den lokalen BWMilsim-Host. citehttps://docs.github.com/de/pages/getting-started-with-github-pages/creating-a-github-pages-site

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
- gemeinsame taktische Lagekarte
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

## Architektur

```text
                 GitHub Repository
                        │
          ┌─────────────┴─────────────┐
          │                           │
   GitHub Pages                 Lokaler Host
   Web-Oberfläche               Node.js Server
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
