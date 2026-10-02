# Nexus — Project Prerequisites & Setup Tracker

> Comprehensive log of all local software, CLI utilities, cloud accounts, and environment configurations required for the **Nexus** platform.

---

## 1. Local Terminal Installations (Completed & Verified)

All core developer utilities, runtimes, package managers, and benchmarking tools installed via PowerShell:

| Tool | Category | Installation Command | Verified Version | Purpose in Nexus | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **Git** | Version Control | `winget install Git.Git` | `2.54.0.windows.1` | Source code management & CI integration |  Verified |
| **Node.js** | Runtime | `winget install OpenJS.NodeJS.LTS` | `v22.23.1` | Unified backend & frontend execution runtime |  Verified |
| **npm** | Package Manager | Bundled with Node.js | `10.9.8` | Default package manager |  Verified |
| **pnpm** | Monorepo Manager | `npm install -g pnpm` | `12.8.1` | Fast, isolated package manager for workspaces |  Verified |
| **Turborepo** | Monorepo Orchestrator | `npm install -g turbo` | `2.11.6` | Task caching, pipeline execution, monorepo builds |  Verified |
| **Docker Desktop** | Infrastructure Engine | `winget install Docker.DockerDesktop` | `29.6.2 (build dfc4efb)` | Local brokers (Kafka, RabbitMQ, NATS, Mosquitto, MinIO, Keycloak, Postgres) |  Verified |
| **k6** | Benchmarking | `winget install GrafanaLabs.k6 -s winget` | `v2.2.0 (windows/amd64)` | High-concurrency load testing (REST, WebSocket, gRPC, MQTT) |  Verified |
| **mkcert** | Security / TLS | `winget install FiloSottile.mkcert` | `v1.4.4` | Zero-config local TLS & mTLS certificates |  Verified |
| **Bruno** | API Client | `winget install Bruno.Bruno` | `v4.2.1` | Git-friendly API request collections & manual testing |  Verified |

---

## 2. Quick Terminal Verification Script

Run this script anytime in PowerShell to verify that all binaries are active in your `PATH`:

```powershell
Write-Host "--- Checking Installed Versions ---" -ForegroundColor Cyan
git --version
node -v
npm -v
pnpm -v
turbo --version
k6 version
mkcert -version
docker --version
```

---

## 3. Pre-Flight & Cloud Account Readiness

###  Completed & Active
- [x] **Step 1: Windows & Git Pre-flight Config** — `.gitattributes` LF normalization active, local repository initialized, and `.wslconfig` configured (6GB RAM / 4 CPUs limit).
- [x] **Step 2: Launch & Test Docker Desktop** — Docker engine running & tested.
- [x] **Step 3: GitHub Account** — Signed in & ready for repository remote and CI/CD.
- [x] **Step 4: Grafana Cloud Account** — Signed in & ready for OpenTelemetry ingestion.

### ⏳ Pending Cloud Accounts (Setup in Later Phases as Needed)
- [ ] **[Neon.tech](https://neon.tech/)** *(Later)* — Serverless PostgreSQL
- [ ] **[Upstash](https://upstash.com/)** *(Later)* — Serverless Redis (for BullMQ queue & caching)
- [ ] **[Fly.io](https://fly.io/)** *(Later)* — Cloud hosting for orchestrator & dashboard
- [ ] **[Buf.build](https://buf.build/)** *(Phase 9)* — Protobuf schema registry & documentation

---

## 4. Specialized Protocol Binaries (Later Phases)

- [ ] **FFmpeg** *(Phase 8 - Media Protocols)*: `winget install Gyan.FFmpeg` (RTSP, RTMP, HLS, SRT streaming)
- [ ] **ghz** *(Phase 1 - gRPC Benchmarking)*: `winget install BoozAllen.ghz` (gRPC dedicated benchmarking)