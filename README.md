# FinSentinel

## AI Agents Securing Every Rural Transaction, From Onboarding to Payment

### Overview

FinSentinel is a voice-first, AI-powered platform designed to bring secure financial inclusion to rural India. Leveraging Generative AI and autonomous agents built with LangChain, FinSentinel orchestrates multiple AI agents that interact with Nokia Network-as-Code APIs to deliver end-to-end protection across the financial lifecycle—from onboarding to transactions to continuous monitoring.

### The Problem

Rural India faces three critical challenges in digital finance:

**High Fraud Risk:** SIM swap attacks, number spoofing, and account takeovers
**Low Digital Literacy:** 400+ million users with limited smartphone access
**Poor Connectivity:** Variable network quality, feature phones dominance

Traditional security solutions fail because they assume:

**Smartphone availability**
**High bandwidth**
**Digital literacy**
**SMS-based OTP reliability (which SIM swaps exploit)**

### Our Solution
FinSentinel uses autonomous AI agents that:

Verify users silently via mobile network intelligence (no SMS needed)
Detect fraud in real-time using multi-signal analysis
Adapt to connectivity (web for high bandwidth, IVR for low)
Speak regional languages for accessibility
Make autonomous decisions to prevent fraud instantly


### Architecture

┌─────────────────────────────────────────────────────────────┐
│                    User Interface Layer                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Web/Mobile   │  │ IVR (Planned)│  │ USSD/SMS     │     │
│  │  Dashboard   │  │  Voice KYC   │  │  (Planned)   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────────────┐
│              Agent Orchestration Layer (LangGraph)           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Master Orchestrator Agent                   │  │
│  │  - Analyzes user context & connectivity              │  │
│  │  - Routes to appropriate sub-agents                  │  │
│  │  - Manages agent state & memory                      │  │
│  └──────────────────────────────────────────────────────┘  │
│           │              │              │                   │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐          │
│  │ Onboarding │  │Transaction │  │ Analytics  │          │
│  │   Agent    │  │ Monitoring │  │   Agent    │          │
│  │     ✅     │  │   Agent    │  │  (Planned) │          │
│  │            │  │     ✅     │  │            │          │
│  └────────────┘  └────────────┘  └────────────┘          │
└─────────────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────────────┐
│                   Tool Layer (LangChain)                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │ SIM Swap │ │  Number  │ │  Device  │ │ Location │     │
│  │   Tool   │ │  Verify  │ │  Status  │ │  Verify  │     │
│  │    ✅    │ │   Tool   │ │ (Planned)│ │ (Planned)│     │
│  │          │ │    ✅    │ │          │ │          │     │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘     │
└─────────────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────────────┐
│              External Services Integration                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                   │
│  │   Nokia  │ │  Exotel  │ │ MongoDB  │                   │
│  │    NAC   │ │   IVR    │ │  State   │                   │
│  │    ✅    │ │ (Planned)│ │ (Planned)│                   │
│  └──────────┘ └──────────┘ └──────────┘                   │
└─────────────────────────────────────────────────────────────┘



### Built in the Prototype

We implemented the core fraud-prevention engine of FinSentinel:

AI Agent Architecture (LangChain + LangGraph)

**✔ Onboarding Agent (Completed end-to-end logic)**

Autonomous 6-step verification workflow
Greets user in regional language
Executes security checks sequentially
Makes approve/reject decisions
Provides detailed reasoning traces

**✔ Transaction Monitoring Agent (Parallel checks, autonomous decisions)**

Real-time transaction analysis
Parallel security verification (SIM Swap + Number Verify + Location)
Dynamic risk scoring (0-100 scale)
Automatic alert generation
Sub-500ms response time

**✔ Master Orchestrator Agent (Routing + context management)**

Analyzes incoming requests
Routes to appropriate sub-agents
Manages conversation state
Coordinates multi-agent workflows
Handles error recovery

### Nokia Network-as-Code API Integration

**✔ SIM Swap Detection**

Check if phone number had recent SIM swap

Configurable time window (default: 10 days)

Returns swap status + timestamp

Used in both onboarding and transaction flows

**✔ Number Verification**

Verify phone number matches device SIM
Two modes: Compare or Retrieve
No SMS/OTP required
Direct network verification
Live calls used inside agents

### Fraud Risk Engine

**✔ Multi-signal Risk Scoring**

SIM Swap status: +40 points
Number verification failure: +30 points
Location mismatch: +20 points (planned)
High transaction amount: +10 points

**✔ Real-time Decisioning**

0-39: LOW risk → Allow
40-69: MEDIUM risk → Allow with alert
70-89: HIGH risk → Pause + user confirmation
90-100: CRITICAL risk → Block + manual review

**✔ Autonomous Action Generation**

Agents make decisions without human intervention
Generate natural language explanations
Provide security recommendations
Log all actions for audit

### API Endpoints (Fully Functional)

POST /api/agents/onboarding
POST /api/agents/transaction
POST /api/sim-swap
POST /api/number-verification/verify


### Prototype Dashboard

**✔ Real-time Agent Execution**

Run agents with custom parameters
Toggle between onboarding and transaction modes
Visual feedback for each step

**✔ Decision Visualization**

Risk score display (0-100)
Color-coded risk levels
Status badges (Approved/Rejected)

**✔ Agent Reasoning Traces**

View all agent messages
Inspect tool calls
See decision reasoning

**✔ Mock & Production Modes**

Test with simulated data
Switch to real NAC APIs
Side-by-side comparison


### Next Steps (Planned Extensions)
These modules are designed and architected, but not part of the MVP prototype:
**IVR(Interactive Voice Response)** & **Voice-First KYC**

**➡ Exotel-Powered Voice Flows**

### Complete voice-based onboarding
No smartphone required
Works on feature phones

**➡ Multi-Language Support**

Hindi, Telugu, Tamil, Bengali, Marathi, Gujarati, Kannada, Malayalam
AI-generated voice synthesis
Natural language understanding

**➡ DTMF Confirmations**

Press 1 to approve transaction
Press 2 to block suspicious activity
Press 9 for human agent

**➡ Voice-Based Fraud Alerts**

Instant call on high-risk transactions
User can approve/reject via voice
IVR records decision for audit

### Device Status, Location Verification & QoD

**➡ Full NAC API Suite Integration**

Device Status API (online/offline, device type)
Location Verification API (GPS + cell tower)
Quality on Demand (QoD) for priority transactions
Scam Signal Detection

**➡ Additional Risk Signals**

Device fingerprinting
Behavioral biometrics
Network quality indicators
Time-of-day patterns

### Analytics Agent

**➡ Behavioral Anomaly Detection**

User spending patterns
Unusual transaction times
Geographic anomalies
Merchant risk profiling

**➡ Insights Dashboard for Banks/Fintechs**

Real-time fraud statistics
Risk trend analysis
Customer segment insights
Compliance reports (RBI guidelines)

### Full USSD-Based Feature Phone UX

**➡ Zero-Smartphone-Needed Onboarding**

Dial *123# for registration
USSD menu navigation
SMS confirmations

**➡ Rural-First Flow Design

Optimized for 2G networks
Low bandwidth requirements
Offline-first architecture
SMS fallback for all operations
