# BWMilsim

**Lokale, gemeinsam synchronisierte Operationsplattform für Arma 3 Milsim.**

BWMilsim ist als selbst gehostete Webanwendung gedacht: Ein Spieler startet den lokalen Node-Server, alle anderen verbinden sich über LAN oder ein privates VPN mit derselben Sitzung. Änderungen am gemeinsamen Zustand werden in Echtzeit an die verbundenen Browser verteilt.

## Aktueller Stand

Die erste funktionale Version enthält bereits:

- Führungs-Dashboard mit Bereitschaft, Auftragslage und Meldungsfeed
- Operationsverwaltung mit Phasen: Planung, Briefing, Bereitstellung, Durchführung, Exfiltration, AAR und Abschluss
- Gemeinsame taktische Lagekarte mit synchronisierten Markern
- Auftragsverwaltung inklusive Priorität und Status
- Gemeinsame Lagemeldungen / Befehle / Funkmeldungen
- Personalstamm mit Callsigns, Dienstgraden, Funktionen, Einheiten und Bereitschaft
- Hierarchische Organisationsansicht
- Bundeswehr-nahe Dienstgradordnung als konfigurierbare Grundlage
- Nachbesprechung / AAR mit Lessons Learned und Maßnahmenfeldern
- Audit-/Änderungsverlauf
- Persistenz in einer lokalen JSON-Datei
- Echtzeit-Synchronisierung per Server-Sent Events
- Lokaler Betrieb ohne Cloud-Dienst

## Start

Voraussetzung: **Node.js 18 oder neuer**.

```bash
git clone https://github.com/RazerFazer-lang/BWMilsim.git
cd BWMilsim
npm start
```

Danach auf dem Host öffnen:

```text
http://localhost:3000
```

Der Server bindet standardmäßig an `0.0.0.0:3000` und zeigt beim Start die LAN-Adressen an. Andere Spieler öffnen die entsprechende Adresse, zum Beispiel:

```text
http://192.168.178.50:3000
```

Für einen Zugriff über ein privates VPN kann die VPN-IP des Hosts verwendet werden.

## Architektur

```text
Browser 1 ─┐
Browser 2 ─┼── HTTP API / SSE ──> Node.js Host ──> data/state.json
Browser 3 ─┘
```

Der Server hält den **gemeinsamen autoritativen Sitzungszustand**. Schreiboperationen werden serverseitig verarbeitet, gespeichert und als Event an alle verbundenen Clients ausgespielt.

## Nächste Ausbauphasen

Die aktuelle Version ist bewusst als stabile Basis angelegt. Darauf können die vollständigen Milsim-Funktionen folgen: Rollen- und Rechteverwaltung, echte Einheiten-/Dienstpostenmodelle, umfangreichere Kartenfunktionen, Missions-/Briefing-Builder, Material- und Logistiksystem, Sanitäts-/Casualty-Tracking, Trainings- und Qualifikationsverwaltung, Szenario-Templates, Import/Export, Session-Verwaltung und später eine optionale Arma-3-Bridge.
