import type { Entity } from '../../lib/types';

const timestamp = new Date().toISOString();
const uploadId = 'ict-master-database-2026-02-18';

export const ICT_MODELS: Entity[] = [
  {
    id: 'model-silver-bullet',
    type: 'model',
    domain: 'models',
    name: 'Silver Bullet',
    description: 'Precision intraday entry framework operating EXCLUSIVELY 10-11 AM EST (or 2-3 PM EST). Time-based liquidity run setup with mandatory sequence: Liquidity Sweep → SMS → FVG retracement → Delivery. If setup fails, stop trading for the day.',
    content: 'Silver Bullet Sequence: 1) Liquidity Sweep at/before 10AM (raids BSL or SSL), 2) SMS: Price displaces opposite the raid with structure confirmation, 3) Execution Zone: Enter on FVG/OB retracement aligned with OTE, 4) Delivery: Target opposite intraday liquidity (30-60 min typically). Rules: Time is THE filter - no setup outside 10-11 AM counts. Raid + displacement + FVG sequence is mandatory. Typically 1-2R scalps.',
    metadata: {
      category: 'execution_model',
      required_concepts: ['liquidity_sweep', 'displacement', 'fvg', 'market_structure_shift'],
      optional_concepts: ['smt', 'order_block', 'ote'],
      time_windows: [
        { name: 'AM Silver Bullet', time: '10:00-11:00', timezone: 'ET' },
        { name: 'PM Silver Bullet', time: '14:00-15:00', timezone: 'ET' }
      ],
      anti_patterns: ['entry_before_liquidity_sweep', 'counter_trend_without_htf_level', 'fvg_without_displacement'],
      avoid_when: ['No clear HTF bias', 'Major news in window', 'FVG already 50%+ filled'],
      confluence_minimum: 5.0,
      expected_rr: '1:2 to 1:3',
      sequence: [
        'Liquidity Sweep (at/before 10am)',
        'SMS with displacement opposite raid',
        'FVG/OB forms during displacement',
        'Retracement to execution zone (OTE)',
        'Delivery to opposite liquidity'
      ],
      source_reference: 'ICT_MASTER_LIBRARY.md Part 3.3, concept_relationships.yaml'
    },
    sources: [
      {
        filePath: 'knowledge_base/ICT_MASTER_LIBRARY.md',
        lineStart: 387,
        lineEnd: 410,
        uploadId,
        uploadedAt: timestamp
      },
      {
        filePath: 'knowledge_base/concept_relationships.yaml',
        lineStart: 20,
        lineEnd: 35,
        uploadId,
        uploadedAt: timestamp
      }
    ],
    tags: ['execution_model', 'high_probability', 'time_based', 'killzone', 'intraday'],
    createdAt: timestamp,
    updatedAt: timestamp
  },
  {
    id: 'model-judas-swing',
    type: 'model',
    domain: 'models',
    name: 'Judas Swing',
    description: 'False move before real move that lures traders in wrong direction, creating liquidity before institutional delivery. Early-session trap typically before 10:00 AM EST. The manipulation IS the entry signal when displacement confirms reversal.',
    content: 'Judas Swing Purpose: Trap liquidity, induce retail participation, fuel institutional positions in opposite direction. Timing: London Open (2-5 AM EST) or NY AM (7-10 AM EST) most common. Trading Rule: Never chase early Killzone breakouts - assume Judas Swing until displacement confirms direction. The Judas IS the manipulation phase of AMD (Power of Three).',
    metadata: {
      category: 'execution_model',
      required_concepts: ['time_of_day_macro', 'liquidity_sweep', 'displacement'],
      optional_concepts: ['order_block', 'fvg', 'power_of_three'],
      time_windows: [
        { name: 'London Open', time: '02:00-05:00', timezone: 'ET' },
        { name: 'NY Open', time: '07:00-10:00', timezone: 'ET' }
      ],
      anti_patterns: ['chasing_early_breakout', 'entry_without_displacement'],
      avoid_when: ['After 10am without setup', 'Low volatility sessions'],
      confluence_minimum: 4.0,
      expected_rr: '1:2 to 1:4',
      sequence: [
        'Early killzone breakout (false move)',
        'Liquidity sweep of obvious level',
        'Displacement opposite direction',
        'Entry on retracement',
        'Delivery to opposite liquidity'
      ],
      source_reference: 'ICT_MASTER_LIBRARY.md Part 3.2, concept_relationships.yaml',
      insight: 'The Judas Swing IS the manipulation phase of AMD'
    },
    sources: [
      {
        filePath: 'knowledge_base/ICT_MASTER_LIBRARY.md',
        lineStart: 350,
        lineEnd: 385,
        uploadId,
        uploadedAt: timestamp
      },
      {
        filePath: 'knowledge_base/concept_relationships.yaml',
        lineStart: 37,
        lineEnd: 50,
        uploadId,
        uploadedAt: timestamp
      }
    ],
    tags: ['execution_model', 'manipulation', 'time_based', 'liquidity_trap', 'early_session'],
    createdAt: timestamp,
    updatedAt: timestamp
  },
  {
    id: 'model-ict-2022',
    type: 'model',
    domain: 'models',
    name: 'ICT 2022 Model',
    description: 'Full AMD (Accumulation-Manipulation-Distribution) cycle trade. Core principle: "Price is nothing without time." Components: Daily bias, liquidity sweeps, MSS on lower TFs, PD Array targeting. Best at session opens (London, NY).',
    content: 'ICT 2022 Execution: London (3 AM NY): Mark NY midnight to London open range, wait for liquidity sweep, identify MSS with displacement, execute at PD Array retest. New York (8 AM NY): If London swept use OTE from London range, if London ranged mark NY midnight-open and look for sweep. Target opposite side of accumulation range.',
    metadata: {
      category: 'execution_model',
      required_concepts: ['accumulation_range', 'manipulation_sweep', 'displacement', 'fvg'],
      optional_concepts: ['order_block', 'ote', 'premium_discount'],
      time_windows: [
        { name: 'London Open', time: '03:00-05:00', timezone: 'ET' },
        { name: 'NY Open', time: '08:00-10:00', timezone: 'ET' }
      ],
      anti_patterns: ['skipping_accumulation_phase', 'entering_before_manipulation'],
      avoid_when: ['No clear accumulation range', 'Major news events'],
      confluence_minimum: 6.0,
      expected_rr: '1:3 to 1:5',
      sequence: [
        'Mark accumulation range (midnight-open)',
        'Wait for manipulation sweep',
        'Confirm MSS with displacement',
        'Enter at PD Array (FVG/OB)',
        'Target opposite side of range'
      ],
      source_reference: 'ICT_MASTER_LIBRARY.md Part 3.7, concept_relationships.yaml',
      time_context: 'Best at session opens (London, NY)'
    },
    sources: [
      {
        filePath: 'knowledge_base/ICT_MASTER_LIBRARY.md',
        lineStart: 480,
        lineEnd: 520,
        uploadId,
        uploadedAt: timestamp
      },
      {
        filePath: 'knowledge_base/concept_relationships.yaml',
        lineStart: 65,
        lineEnd: 75,
        uploadId,
        uploadedAt: timestamp
      }
    ],
    tags: ['execution_model', 'amd_cycle', 'session_open', 'full_cycle', 'high_probability'],
    createdAt: timestamp,
    updatedAt: timestamp
  },
  {
    id: 'model-unicorn',
    type: 'model',
    domain: 'models',
    name: 'Unicorn Setup',
    description: 'Order Block with FVG inside - highest probability setup in ICT. Rare occurrence (2-3 per week). Requires OB + FVG inside OB boundaries + HTF bias alignment. Entry inside the FVG portion of the OB for maximum precision.',
    content: 'Unicorn Requirements: Order Block identified, Fair Value Gap forms INSIDE the Order Block boundaries, HTF bias aligned with setup direction. Rarity: 2-3 per week makes this special. Probability: Highest of all ICT setups. Entry: Inside the FVG portion of the OB (confluence of both concepts).',
    metadata: {
      category: 'execution_model',
      required_concepts: ['order_block', 'fvg_inside_ob', 'htf_bias_alignment'],
      optional_concepts: ['ote', 'displacement', 'liquidity_sweep'],
      time_windows: [
        { name: 'Any Killzone', time: 'During KZ hours', timezone: 'ET' }
      ],
      anti_patterns: ['forcing_unicorn', 'entering_outside_fvg'],
      avoid_when: ['HTF not aligned', 'FVG outside OB boundaries'],
      confluence_minimum: 7.0,
      expected_rr: '1:3 to 1:6',
      sequence: [
        'Identify Order Block',
        'Confirm FVG forms INSIDE OB',
        'Verify HTF bias alignment',
        'Enter in FVG portion of OB',
        'Target liquidity or HTF objective'
      ],
      source_reference: 'concept_relationships.yaml',
      rarity: 'Uncommon — maybe 2-3 per week',
      probability: 'Highest of all setups',
      entry: 'Inside the FVG portion of the OB'
    },
    sources: [
      {
        filePath: 'knowledge_base/concept_relationships.yaml',
        lineStart: 77,
        lineEnd: 86,
        uploadId,
        uploadedAt: timestamp
      }
    ],
    tags: ['execution_model', 'highest_probability', 'rare', 'confluence', 'precision'],
    createdAt: timestamp,
    updatedAt: timestamp
  },
  {
    id: 'model-turtle-soup',
    type: 'model',
    domain: 'models',
    name: 'Turtle Soup',
    description: 'Liquidity grab reversal setup where price sweeps obvious highs/lows (turtle stops), then immediately reverses. Speed of reversal is KEY. Targets traders caught on wrong side. Entry on reversal candle, SL beyond sweep.',
    content: 'Turtle Soup Formation: Clear liquidity pool (equal highs/lows, obvious levels), Liquidity sweep occurs, IMMEDIATE reversal (speed is critical). Best Conditions: Obvious level run (equal highs/lows, prior week high/low), Impulsive move through level fails to follow through, No displacement confirming breakout. Entry: On reversal candle. Stop: Beyond the sweep. Target: Opposite liquidity.',
    metadata: {
      category: 'execution_model',
      required_concepts: ['clear_liquidity_pool', 'liquidity_sweep', 'immediate_reversal'],
      optional_concepts: ['fvg', 'smt', 'displacement'],
      time_windows: [
        { name: 'Any Killzone', time: 'Especially London/NY Open', timezone: 'ET' }
      ],
      anti_patterns: ['waiting_too_long', 'entering_before_reversal'],
      avoid_when: ['Slow reversal', 'No clear liquidity pool'],
      confluence_minimum: 5.0,
      expected_rr: '1:2 to 1:4',
      sequence: [
        'Identify clear liquidity pool',
        'Wait for sweep of level',
        'Watch for IMMEDIATE reversal',
        'Enter on reversal candle',
        'Stop beyond sweep, target opposite liquidity'
      ],
      source_reference: 'ICT_MASTER_LIBRARY.md Part 7.1, concept_relationships.yaml',
      key: 'Speed — the faster the reversal, the better'
    },
    sources: [
      {
        filePath: 'knowledge_base/ICT_MASTER_LIBRARY.md',
        lineStart: 600,
        lineEnd: 630,
        uploadId,
        uploadedAt: timestamp
      },
      {
        filePath: 'knowledge_base/concept_relationships.yaml',
        lineStart: 88,
        lineEnd: 97,
        uploadId,
        uploadedAt: timestamp
      }
    ],
    tags: ['execution_model', 'reversal', 'liquidity_grab', 'false_breakout', 'speed'],
    createdAt: timestamp,
    updatedAt: timestamp
  },
  {
    id: 'model-ote-retracement',
    type: 'model',
    domain: 'models',
    name: 'OTE Retracement Model',
    description: 'Retracement entry after displacement leg using Fibonacci 62-79% zone. Sweet spot: 70.5%. Requires displacement + fibonacci + MSS. Confluence zone provides optimal risk/reward entries.',
    content: 'OTE Model: After displacement creates impulse leg, apply Fibonacci retracement. Zone: 62-79% retracement. Sweet spot: 70.5% (0.705 fib). Requirements: Displacement leg (mandatory), MSS confirmation, Fibonacci retracement tool. Entry: Within OTE zone, preferably at 70.5% when aligned with FVG or OB. Most effective during Killzones.',
    metadata: {
      category: 'execution_model',
      required_concepts: ['displacement', 'fibonacci_retracement', 'market_structure_break'],
      optional_concepts: ['fvg', 'order_block', 'premium_discount'],
      time_windows: [
        { name: 'Any Killzone', time: 'Best during active sessions', timezone: 'ET' }
      ],
      anti_patterns: ['entering_before_ote', 'chasing_past_79'],
      avoid_when: ['No displacement', 'No MSS', 'Against HTF bias'],
      confluence_minimum: 5.0,
      expected_rr: '1:2 to 1:4',
      sequence: [
        'Identify displacement leg',
        'Confirm MSS',
        'Apply Fibonacci (swing low to high or vice versa)',
        'Wait for retracement to 62-79% zone',
        'Enter at 70.5% sweet spot or with FVG/OB confluence'
      ],
      source_reference: 'concept_relationships.yaml',
      confluence_zone: '62-79% retracement',
      sweet_spot: '70.5%'
    },
    sources: [
      {
        filePath: 'knowledge_base/concept_relationships.yaml',
        lineStart: 52,
        lineEnd: 63,
        uploadId,
        uploadedAt: timestamp
      }
    ],
    tags: ['execution_model', 'retracement', 'fibonacci', 'ote', 'precision'],
    createdAt: timestamp,
    updatedAt: timestamp
  },
  {
    id: 'model-breaker-block-reversal',
    type: 'model',
    domain: 'models',
    name: 'Breaker Block Reversal',
    description: 'Failed Order Block reversal model. Requires liquidity sweep through high/low + displacement through OB that causes it to fail. Failed OB becomes Breaker Block and acts as S/R. Entry at breaker body.',
    content: 'Breaker Formation: Liquidity sweep occurs at high/low, Displacement moves THROUGH Order Block (OB fails), Failed OB becomes Breaker Block. Entry Rules: Enter at the breaker body (highest up-close or lowest down-close), Confirm with structure, Stop beyond breaker. Most reliable after HTF liquidity events.',
    metadata: {
      category: 'execution_model',
      required_concepts: ['liquidity_sweep_high_low', 'displacement_through_ob'],
      optional_concepts: ['breaker_block', 'htf_bias', 'smt'],
      time_windows: [
        { name: 'Any Killzone', time: 'After liquidity events', timezone: 'ET' }
      ],
      anti_patterns: ['entering_before_ob_fails', 'no_displacement'],
      avoid_when: ['OB holds', 'No liquidity sweep', 'Weak displacement'],
      confluence_minimum: 5.5,
      expected_rr: '1:2 to 1:4',
      sequence: [
        'Identify Order Block',
        'Wait for liquidity sweep',
        'Displacement breaks THROUGH OB',
        'OB fails and becomes Breaker',
        'Enter at breaker body on retest'
      ],
      source_reference: 'concept_relationships.yaml',
      entry_rules: ['Enter at the breaker body (highest up-close or lowest down-close)']
    },
    sources: [
      {
        filePath: 'knowledge_base/concept_relationships.yaml',
        lineStart: 58,
        lineEnd: 64,
        uploadId,
        uploadedAt: timestamp
      }
    ],
    tags: ['execution_model', 'reversal', 'breaker', 'failed_ob', 'liquidity'],
    createdAt: timestamp,
    updatedAt: timestamp
  },
  {
    id: 'model-htf-ltf-process',
    type: 'model',
    domain: 'models',
    name: 'HTF→LTF Multi-Timeframe Entry Process',
    description: 'Always align with higher timeframe bias. Three-layer process: Layer 1 HTF sweep context (Daily/4H), Layer 2 ITF confirmation (H1/M15 BOS/SMS + displacement), Layer 3 LTF execution (M5/M1 retrace into OB/FVG at OTE). Never the other way around.',
    content: 'HTF→LTF Process: Layer 1 (Context): Determine HTF bias on Daily/4H, identify HTF POI (liquidity, FVG, OB). Layer 2 (Confirmation): Wait for price at HTF POI with patience, drop to H1/M15 for BOS/SMS + displacement. Layer 3 (Execution): Drop to M5/M1 for entry, find LTF confirmation (displacement, BOS, FVG), enter on retrace into OB/FVG at OTE. Failure Mode: Trading LTF without HTF context = gambling.',
    metadata: {
      category: 'execution_model',
      required_concepts: ['market_structure', 'killzones', 'displacement', 'ote'],
      optional_concepts: ['fvg', 'order_block', 'liquidity', 'daily_bias'],
      time_windows: [
        { name: 'During Killzones', time: 'After HTF setup', timezone: 'ET' }
      ],
      anti_patterns: ['ltf_without_htf', 'skipping_layers', 'impatience'],
      avoid_when: ['No HTF bias', 'HTF POI not reached', 'Against HTF structure'],
      confluence_minimum: 7.0,
      expected_rr: '1:3 to 1:6',
      sequence: [
        'Layer 1: Determine HTF bias (Daily/4H)',
        'Identify HTF POI (FVG, OB, liquidity)',
        'Layer 2: Wait for HTF POI, confirm on ITF (H1/M15)',
        'Look for BOS/SMS + displacement on ITF',
        'Layer 3: Drop to LTF (M5/M1) for execution',
        'Enter on retrace to OB/FVG at OTE'
      ],
      source_reference: 'ICT_MASTER_LIBRARY.md Part 6.1',
      failure_mode: 'Trading LTF without HTF context = gambling'
    },
    sources: [
      {
        filePath: 'knowledge_base/ICT_MASTER_LIBRARY.md',
        lineStart: 552,
        lineEnd: 598,
        uploadId,
        uploadedAt: timestamp
      }
    ],
    tags: ['execution_model', 'multi_timeframe', 'htf_ltf', 'process', 'systematic'],
    createdAt: timestamp,
    updatedAt: timestamp
  },
];
