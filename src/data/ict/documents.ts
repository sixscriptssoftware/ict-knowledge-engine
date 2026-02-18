import type { Entity } from '../../lib/types';

const timestamp = new Date().toISOString();
const uploadId = 'ict-master-database-2026-02-18';

export const ICT_DOCUMENTS: Entity[] = [
  {
    id: 'document-ict-master-library',
    type: 'document',
    domain: 'knowledge_base',
    name: 'ICT Master Library',
    description: 'Comprehensive 826-line reference covering all ICT concepts, models, and implementation details across 10 parts. The definitive source document for Inner Circle Trader methodology. Includes core concepts, advanced concepts, execution models, time-based trading, confirmation tools, multi-timeframe workflow, special models, and algorithmic implementation.',
    content: '# ICT Master Library - Comprehensive Training Data\n\nPart 1: Core Concepts (Market Structure, BOS, SMS, CHoCH, FVG, Order Block, Displacement, Liquidity, OTE, Premium/Discount)\nPart 2: Advanced Concepts (Breaker Block, Mitigation Block, BPR, Liquidity Void, PD Array Matrix)\nPart 3: Execution Models (Power of Three, Judas Swing, Silver Bullet, ICT 2022, Market Maker Models)\nPart 4: Time-Based Concepts (Killzones, Macro Times, IPDA, Daily Bias)\nPart 5: Confirmation Tools (SMT Divergence, Institutional Order Flow, Model Stacking)\nPart 6: Multi-Timeframe Workflow (HTF→LTF Process)\nPart 7: Special Models (Turtle Soup, Equity Runs)\nPart 8: Algorithmic Implementation (Python, smartmoneyconcepts library)\nPart 9: Risk Management\nPart 10: Data Schemas',
    metadata: {
      line_count: 826,
      sections: 10,
      concepts_defined: 47,
      models_described: 12,
      created: '2026-01',
      format: 'markdown',
      primary_topics: [
        'Core ICT Concepts',
        'Market Structure',
        'Price Action',
        'Time-Based Trading',
        'Execution Models',
        'Multi-Timeframe Analysis',
        'Algorithmic Detection',
        'Risk Management'
      ]
    },
    sources: [{
      filePath: 'knowledge_base/ICT_MASTER_LIBRARY.md',
      lineStart: 1,
      lineEnd: 826,
      uploadId,
      uploadedAt: timestamp
    }],
    tags: ['documentation', 'master_reference', 'comprehensive', 'ict', 'methodology'],
    createdAt: timestamp,
    updatedAt: timestamp
  },
  {
    id: 'document-concept-relationships',
    type: 'document',
    domain: 'knowledge_base',
    name: 'Concept Relationships YAML',
    description: 'Canonical 713-line source of truth for ICT concept relationships across 13 sections. Defines model requirements, concept dependencies, causal chains, time rules, confluence weights, anti-patterns, PD array taxonomy, IPDA ranges, entry blueprints, risk management, pair-specific rules, pre-trade validation, and trade correlations. Version 2.0, updated 2026-02-17.',
    content: '# ICT Concept Relationships - Canonical Source\n\nSections:\n1. Model Requirements (Silver Bullet, Judas Swing, OTE, Breaker Reversal, ICT 2022, Unicorn, Turtle Soup)\n2. Concept Dependencies (FVG, IFVG, OB, MSS, Liquidity, Displacement, Market Structure, OTE, SMT, Advanced PD Arrays)\n3. Causal Chains (Reversal Sequence, Power of 3, HTF→LTF)\n4. Time Rules (Killzones, Macros, Opening Prices, Silver Bullet Windows, Avoid Times)\n5. Confluence Weights (Critical: 2.5, High: 1.5, Moderate: 1.0, Penalties: -2.0)\n6. Anti-Patterns (10 common mistakes with fixes)\n7. PD Array Taxonomy (Hierarchy and relationships)\n8. IPDA Data Ranges (20/40/60 day lookback)\n9. Entry Model Blueprints (Quick reference)\n10. Risk Management (1-2% per trade, invalidation rules)\n11. Pair-Specific Rules (EUR/USD, GBP/USD, USD/JPY, XAU/USD)\n12. Pre-Trade Validation (Must-have, should-have, red flags)\n13. Trade Correlations (Winning/losing combinations)',
    metadata: {
      line_count: 713,
      sections: 13,
      version: '2.0',
      updated: '2026-02-17',
      format: 'yaml',
      primary_topics: [
        'Model Requirements',
        'Concept Dependencies',
        'Causal Chains',
        'Time Rules',
        'Confluence Scoring',
        'Anti-Patterns',
        'Validation Rules'
      ]
    },
    sources: [{
      filePath: 'knowledge_base/concept_relationships.yaml',
      lineStart: 1,
      lineEnd: 713,
      uploadId,
      uploadedAt: timestamp
    }],
    tags: ['documentation', 'relationships', 'yaml', 'canonical', 'rules'],
    createdAt: timestamp,
    updatedAt: timestamp
  },
  {
    id: 'document-ict-learning-system',
    type: 'document',
    domain: 'knowledge_base',
    name: 'ICT Learning System',
    description: 'Documentation for the ICT learning and training system. Covers pattern library structure, real-time learning mechanisms, YouTube transcript ingestion pipelines, concept graph construction, and continuous improvement feedback loops. Defines how the system learns from new examples and refines its understanding of ICT concepts.',
    content: '# ICT Learning System\n\n## Pattern Library\n- Positive examples (winning trades)\n- Negative examples (losing trades)\n- Edge cases and special conditions\n- Context-dependent variations\n\n## Real-Time Learning\n- Trade execution monitoring\n- Outcome tracking and analysis\n- Pattern recognition improvement\n- Concept refinement based on results\n\n## YouTube Transcript Ingestion\n- ICT Mentorship 2022 series\n- Concept extraction from videos\n- Automated transcript processing\n- Key insight identification\n\n## Concept Graph\n- Node: Concepts, models, trades\n- Edges: Relationships, dependencies\n- Weight: Confluence scores\n- Validation: Pre-trade checklist\n\n## Continuous Improvement\n- Feedback loops from trade results\n- Confluence weight adjustment\n- Anti-pattern identification\n- Model performance tracking',
    metadata: {
      format: 'markdown',
      components: [
        'Pattern Library',
        'Real-Time Learning',
        'YouTube Ingestion',
        'Concept Graph',
        'Feedback Loops'
      ],
      integrations: [
        'Trade journal',
        'Video transcripts',
        'Concept relationships',
        'Performance metrics'
      ]
    },
    sources: [{
      filePath: 'knowledge_base/ICT_LEARNING_SYSTEM.md',
      lineStart: 1,
      lineEnd: 500,
      uploadId,
      uploadedAt: timestamp
    }],
    tags: ['documentation', 'learning', 'system', 'ai', 'training'],
    createdAt: timestamp,
    updatedAt: timestamp
  },
];
