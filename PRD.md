# ICT Knowledge Engine — AI-Powered Structured Database

A smart database with an AI brain inside that automatically ingests, indexes, organizes, and serves all data from an ICT (Inner Circle Trader) trading methodology project. Users upload files/repos and the AI agent parses every file, classifies it, extracts structured entities, builds a knowledge graph, and enables natural language querying.

**Experience Qualities**:
1. **Intelligent** — The AI autonomously classifies, organizes, and connects data without manual tagging, making the system feel perceptive and self-aware
2. **Terminal-inspired** — Dark, focused interface with data-first presentation and real-time processing feedback that feels like a sophisticated trading terminal
3. **Interconnected** — Every piece of data links to related entities, creating a living web of knowledge that reveals patterns and relationships

**Complexity Level**: Complex Application (advanced functionality with multiple views)
This is a full-featured knowledge management system with AI agent processing, multi-format file ingestion, knowledge graph construction, real-time indexing, semantic search, and interactive data visualization. It requires sophisticated state management, async processing feedback, and multiple specialized views.

## Essential Features

### File & Repository Upload System
- **Functionality**: Drag-and-drop upload supporting `.json`, `.yaml`, `.yml`, `.md`, `.csv`, `.py`, `.sql`, `.txt`, `.png`, `.jpg`, `.pdf`; GitHub repo URL ingestion that clones and processes entire directory trees; ZIP/folder bulk upload with recursive processing
- **Purpose**: Provides flexible data ingestion from multiple sources matching the user's existing ICT project structure
- **Trigger**: User drags files to upload zone, pastes GitHub URL, or selects local files
- **Progression**: Select files/enter URL → Upload progress indicator → AI processing feed (real-time) → Entity extraction notifications → Database population → Success summary with counts
- **Success criteria**: Files upload without errors, supported formats are processed correctly, GitHub repos clone and walk full directory tree, progress updates show in real-time

### AI-Powered Agentic Indexing
- **Functionality**: LLM processes each file to extract entities (concepts, models, trades, schemas, code modules), auto-classify into domains, validate JSON against schemas, parse Python for classes/functions, extract relationships
- **Purpose**: Eliminates manual tagging and organization, automatically structures unstructured data
- **Trigger**: File upload completion
- **Progression**: File received → Format detection → AI parsing (format-specific extraction) → Entity creation → Relationship detection → Domain classification → Validation (if applicable) → Database write → Knowledge graph update
- **Success criteria**: 95%+ files successfully parsed, entities contain accurate extracted data, no hallucinated information, validation failures clearly flagged

### Knowledge Graph Construction
- **Functionality**: Builds interconnected graph of entities (Concept, Model, Trade, Schema, CodeModule, Document) with typed relationships (CONCEPT_USED_IN_MODEL, MODEL_PRODUCES_TRADE, CONCEPT_RELATED_TO, etc.)
- **Purpose**: Reveals hidden connections between concepts, models, trades, and code; enables contextual exploration
- **Trigger**: Entity extraction and relationship detection during indexing
- **Progression**: Entities identified → AI detects relationships → Graph edges created → Visual graph updates → User clicks node → Detail view opens with related entities sidebar
- **Success criteria**: Related entities correctly linked, graph visualization renders and is interactive, clicking nodes navigates to detail views

### Multi-View Data Browser
- **Functionality**: Dashboard (stats and recent activity), Explorer (file tree browser by domain), Entity Detail (full record with related entities), Graph View (interactive force-directed visualization), Search (full-text and semantic), Upload & Ingest (progress tracking), AI Chat (RAG-powered Q&A)
- **Purpose**: Provides specialized interfaces for different data interaction patterns—overview, browsing, detail inspection, relationship exploration, querying, ingestion, and conversational access
- **Trigger**: User clicks navigation items or uses search/chat
- **Progression**: Select view → Content loads → User interacts (filter, search, click entities) → Detail view or results appear → User explores related entities → Navigate back or to another view
- **Success criteria**: All views accessible from navigation, data displays correctly in each view, filtering/searching works, entity links navigate properly

### Semantic Search & AI Chat
- **Functionality**: Natural language search across all content ("Show me all trades that used Order Block + FVG confluence"), RAG-powered chat with source citations
- **Purpose**: Enables intuitive data access without learning query syntax; surfaces insights through conversation
- **Trigger**: User types query in search bar or chat interface
- **Progression**: User enters question → AI retrieves relevant entities using semantic search → LLM generates answer with citations → Results display with source links → User clicks citation → Entity detail opens
- **Success criteria**: Relevant results returned for natural language queries, chat answers cite correct sources, clicking citations navigates to entities

### AI Training & Pattern Discovery
- **Functionality**: Analyzes user's complete trade history to discover personalized success patterns, failure modes, concept effectiveness, model performance, optimal trading times, and high-probability concept combinations; generates actionable insights tailored to the specific trader's strengths and weaknesses
- **Purpose**: Transforms historical data into personalized intelligence that improves future trading decisions by revealing what specifically works for this trader
- **Trigger**: User clicks "Train AI Model" button in Training view
- **Progression**: Button click → Progress indicator (0-100%) → AI analyzes all trades → Pattern detection (concept combinations, session performance, pair specialization) → Concept/model scoring → Quality factor identification → Insight generation via LLM → Results display in tabs (Overview, Insights, Patterns, Concept Scores, Model Performance, Quality Factors) → User reviews personalized recommendations
- **Success criteria**: Training completes within 30 seconds, patterns match actual trade data, insights are specific and actionable, win rates accurately calculated per concept/model, personalized profile shows trader's strengths/weaknesses clearly

### Agent Skills System
- **Functionality**: Modular framework providing 16+ specialized AI-powered capabilities for querying, analyzing, and learning from the knowledge base; includes concept definitions, trade filtering, pattern recognition, failure analysis, confluence detection, killzone performance, risk/reward analysis, and personalized recommendations; each skill has defined parameters, complexity levels, execution contexts, and standardized result formats with confidence scores
- **Purpose**: Provides structured, reusable analysis capabilities that combine the power of the AI graph with specialized domain logic; enables users to execute complex queries without writing code
- **Trigger**: User navigates to Skills tab, selects a skill from the registry, enters parameters, and clicks execute
- **Progression**: Browse skills by category (Query, Analysis, Learning, Recommendation) → Select skill → View description and examples → Enter parameters → Execute → View results with confidence score → Review reasoning and sources → Follow suggested next actions → Navigate to referenced entities
- **Success criteria**: All 16 built-in skills execute successfully, results include confidence scores and source citations, suggested follow-ups are relevant, execution history is tracked, performance metrics are calculated

### Real-Time Processing Feedback
- **Functionality**: Live feed showing file-by-file parsing progress, entity extraction counts, validation results, warnings/errors
- **Purpose**: Provides transparency during potentially long ingestion processes; builds trust in AI decisions
- **Trigger**: Upload and ingest operations
- **Progression**: Ingest starts → File queue appears → Each file processes → Status updates in real-time → Extraction summaries appear → Completion notification → Dashboard stats update
- **Success criteria**: Progress visible during ingestion, no UI freezing, errors clearly displayed, final counts match processed files

### Batch Operations
- **Functionality**: Multi-select mode in Explorer view allows selecting multiple entities (via checkboxes); batch reclassify to change domain and type for all selected entities at once; batch delete to remove multiple entities and all associated relationships simultaneously; confirmation dialogs show full list of affected entities before applying changes
- **Purpose**: Enables efficient bulk management of entities when AI misclassifies items or when users need to reorganize large datasets; prevents tedious one-by-one editing
- **Trigger**: User clicks "Select Multiple" button in Explorer, selects entities via checkboxes, clicks "Reclassify" or "Delete" in bottom action bar
- **Progression**: Enable selection mode → Check entity boxes (or "Select All") → Selected count badge appears → Click Reclassify or Delete → Confirmation dialog shows affected entities → Choose new domain/type (reclassify) or confirm deletion → Batch operation executes → Toast confirmation → Selection cleared → View updates
- **Success criteria**: Checkboxes appear on all entities in selection mode, selection persists while filtering/scrolling, batch operations update all selected entities atomically, related relationships cascade delete correctly, UI reflects changes immediately

## Edge Case Handling

**Unsupported File Types**: Quietly skip with warning in ingest log, don't halt processing
**Malformed Files**: Flag as "Parse Failed" with error message, store raw content for manual review
**Duplicate Entities**: Merge into single record with multiple source attributions, maintain all file references
**Schema Validation Failures**: Create entity anyway but flag as INVALID with detailed error messages
**Missing GitHub Repo / Auth Failures**: Show clear error message with retry option
**Large Repos (1000+ files)**: Process in batches, show batch progress, allow cancellation
**Conflicting Classifications**: Use AI confidence scores, allow user manual override with learning
**Orphaned Relationships**: Display "broken link" indicator in graph, provide cleanup tool
**Batch Operations on Filtered Results**: Selecting "All" only selects currently filtered/visible entities, not entire database
**Batch Delete with No Relationships**: Delete completes successfully even if entities have no relationships
**Empty Batch Operations**: Reclassify/Delete buttons disabled when no entities selected

## Design Direction

The design should evoke a sophisticated trading terminal—focused, data-dense, and purposeful. It should feel like a professional tool for serious traders, combining the precision of a database with the intelligence of an AI assistant. Dark backgrounds create focus; bright accent colors highlight important data; monospace fonts suggest technical accuracy; smooth animations provide feedback without distraction.

## Color Selection

A terminal-inspired dark palette with vibrant accents for data visualization and status indicators.

- **Primary Color**: Deep space background `oklch(0.15 0.02 264)` — Creates focused, distraction-free environment reminiscent of trading terminals
- **Secondary Colors**: 
  - Charcoal surface `oklch(0.2 0.01 264)` for cards and panels
  - Slate muted `oklch(0.35 0.01 264)` for borders and dividers
- **Accent Color**: Electric green `oklch(0.75 0.2 145)` — High-energy success color for successful parsing, valid trades, and positive actions
- **Additional Accents**:
  - Neon red `oklch(0.6 0.24 25)` for errors, invalid data, and destructive actions
  - Bright cyan `oklch(0.7 0.15 195)` for links, interactive elements, and graph nodes
  - Warm amber `oklch(0.7 0.15 75)` for warnings and pending states

**Foreground/Background Pairings**:
- Background (Deep space #1a1a2e `oklch(0.15 0.02 264)`): Light gray text `oklch(0.9 0 0)` - Ratio 8.5:1 ✓
- Surface (Charcoal `oklch(0.2 0.01 264)`): Light gray text `oklch(0.9 0 0)` - Ratio 7.2:1 ✓
- Accent (Electric green `oklch(0.75 0.2 145)`): Deep space text `oklch(0.15 0.02 264)` - Ratio 8.1:1 ✓
- Destructive (Neon red `oklch(0.6 0.24 25)`): White text `oklch(1 0 0)` - Ratio 4.6:1 ✓

## Font Selection

Typefaces should communicate precision, technical sophistication, and readability for dense data displays.

- **Primary**: JetBrains Mono — Monospace font for data tables, code snippets, file paths, and entity IDs; reinforces terminal aesthetic
- **Secondary**: Inter — Clean sans-serif for body text, descriptions, and UI labels; excellent readability at small sizes

**Typographic Hierarchy**:
- H1 (View Titles): Inter SemiBold/32px/tight (-0.02em) letter spacing
- H2 (Section Headers): Inter SemiBold/24px/tight letter spacing
- H3 (Entity Names): Inter Medium/18px/normal letter spacing
- Body (Descriptions): Inter Regular/14px/relaxed (1.6) line height
- Data Labels: Inter Medium/12px/wide (0.02em) letter spacing/uppercase
- Monospace (IDs, Paths, Code): JetBrains Mono Regular/13px/normal line height
- Small (Metadata): Inter Regular/12px/normal letter spacing

## Animations

Animations should provide immediate feedback for interactions and guide attention during state changes. Use sparingly—favor instant responses for data-heavy views, reserve animation for state transitions and background processing notifications.

- **Entity card hover**: Subtle lift (2px transform) + border glow (0ms → 150ms)
- **Graph nodes**: Smooth position transitions (300ms spring), pulse on new entity creation
- **Upload progress**: Smooth progress bar fill with percentage count-up
- **Ingest feed**: New items slide in from top (200ms ease-out) with gentle fade
- **Search results**: Stagger fade-in (50ms delay per item, max 5 items)
- **Tab/view transitions**: Content cross-fade (200ms) without layout shift
- **Success notifications**: Slide in from top-right (300ms) + auto-dismiss (4s) with fade out

## Component Selection

**Components**:
- **Tabs**: Primary navigation between Dashboard, Explorer, Graph, Search, Upload, Chat
- **Card**: Entity containers in Explorer and search results
- **Dialog**: Entity detail modal with full record display
- **ScrollArea**: Long entity lists and code file contents
- **Input**: Search bars, GitHub URL input, filters
- **Button**: Primary actions (Upload, Ingest, Search), secondary actions (Export, Reclassify)
- **Badge**: Domain tags (Concepts, Models, Trades), status indicators (VALID, INVALID, PROCESSING)
- **Progress**: File upload and ingestion progress bars
- **Table**: Trade records, entity lists with sortable columns
- **Separator**: Visual breaks between sections in detail views
- **Avatar**: User profile in header (GitHub avatar)
- **Dropdown Menu**: Bulk actions, export options, filters
- **Tooltip**: Explanations for icons and data fields

**Customizations**:
- **Graph Visualization**: Custom D3 force-directed graph with zoom/pan, node click handlers, type-based coloring
- **Upload Zone**: Custom drag-and-drop area with file type icons and animated dropzone highlight
- **Ingest Feed**: Custom scrolling log with syntax-highlighted messages and status icons
- **Entity Relationship Sidebar**: Custom linked list with type icons and relationship labels
- **Monaco Editor**: Code syntax highlighting for Python/JSON/YAML file viewing

**States**:
- **Buttons**: Default (solid accent), hover (brightness +10%), active (scale 0.98), disabled (opacity 40%)
- **Cards**: Default (subtle border), hover (border glow + lift), selected (accent border)
- **Graph Nodes**: Default (type color), hover (scale 1.2 + label appear), selected (double border + connected edges highlight)
- **Badges**: Solid fills for status (green=valid, red=invalid, amber=processing, gray=unknown)

**Icon Selection** (Phosphor Icons):
- Database / HardDrives: Dashboard home
- Tree / FolderOpen: Explorer file browser
- GraphNode / CirclesThreePlus: Knowledge graph view
- MagnifyingGlass: Search
- Upload / CloudArrowUp: Upload & ingest
- ChatsCircle: AI chat interface
- BookOpen: Concepts domain
- Target: Models domain
- TrendUp: Trades domain
- Cube: Schemas domain
- Barbell: Training data domain
- Brain: Knowledge base domain
- Code: Code modules domain
- Notebook: Journal entries domain
- Images: Charts & screenshots domain
- File / FileText: Generic documents
- ArrowsLeftRight / GitBranch: Relationships

**Spacing**:
- Page padding: `p-6`
- Card padding: `p-4`
- Section gaps: `gap-6`
- Item gaps in lists: `gap-2`
- Tight inline gaps: `gap-1`
- Header height: `h-16`
- Sidebar width: `w-64`

**Mobile**:
- Tabs collapse to dropdown selector
- Sidebar becomes slide-over drawer
- Graph view: simplified touch controls (pinch zoom, tap nodes)
- Upload zone: full-screen on mobile
- Cards: full-width stacking
- Tables: horizontal scroll in ScrollArea
- Two-column layouts become single column at <768px
