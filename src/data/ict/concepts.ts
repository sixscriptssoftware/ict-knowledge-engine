import type { Entity } from '../../lib/types';

const timestamp = new Date().toISOString();
const uploadId = 'ict-master-database-2026-02-18';

export const ICT_CONCEPTS: Entity[] = [
  // ===== CORE CONCEPTS (Part 1) =====
  {
    id: 'concept-market-structure',
    type: 'concept',
    domain: 'concepts',
    name: 'Market Structure',
    description: 'The foundational layer of ICT methodology representing the real-time footprint of Smart Money. Shows whether institutions are accumulating (bullish) or distributing (bearish) through the sequence of swing highs and lows.',
    content: 'Market Structure is validated by displacement and confirms trend direction through Higher Highs/Higher Lows (bullish) or Lower Lows/Lower Highs (bearish). Timeframe priority: Daily > 4H > 1H > 15M > 5M. Always confirm structure on 1H and Daily before intraday entries.',
    metadata: {
      category: 'structure',
      abbreviation: 'MS',
      detection_rules: 'Identify swing highs and lows, track sequence (HH/HL = bullish, LL/LH = bearish), confirm with displacement',
      entry_rules: ['Confirm structure on higher timeframe first', 'Wait for displacement to validate breaks', 'Without displacement, break is liquidity raid not structure'],
      invalidation: 'Structure shift confirmed by counter-trend displacement breaking key swing points',
      related_concepts: ['bos', 'sms-mss', 'choch', 'displacement'],
      confluence_weight: 2.0,
      timeframes: ['M1', 'M5', 'M15', 'H1', 'H4', 'D1'],
      htf_priority: true,
      source_reference: 'ICT_MASTER_LIBRARY.md Part 1.1'
    },
    sources: [{
      filePath: 'knowledge_base/ICT_MASTER_LIBRARY.md',
      lineStart: 1,
      lineEnd: 40,
      uploadId,
      uploadedAt: timestamp
    }],
    tags: ['structure', 'core_concept', 'foundation', 'smart_money'],
    createdAt: timestamp,
    updatedAt: timestamp
  },
  {
    id: 'concept-bos',
    type: 'concept',
    domain: 'concepts',
    name: 'Break of Structure (BOS)',
    description: 'A continuation signal where price breaks a previous swing point IN THE SAME DIRECTION as the prevailing trend with visible displacement. Confirms trend continuation and provides entry opportunities on retracements.',
    content: 'BOS occurs when price breaks and closes beyond a previous swing high (in uptrend) or swing low (in downtrend) WITH displacement. This validates institutional continuation of the current trend. Look for entries on retracements to OTE, FVG, or Order Blocks after BOS confirmation.',
    metadata: {
      category: 'structure',
      abbreviation: 'BOS',
      detection_rules: 'Price breaks previous swing point in trend direction with displacement candle(s)',
      entry_rules: ['Wait for BOS confirmation with displacement', 'Enter on retracement to FVG/OB/OTE', 'Target opposite liquidity'],
      invalidation: 'Immediate reversal through BOS point or counter-trend MSS',
      related_concepts: ['market-structure', 'displacement', 'sms-mss', 'choch'],
      confluence_weight: 1.5,
      timeframes: ['M5', 'M15', 'H1', 'H4'],
      htf_priority: false,
      source_reference: 'ICT_MASTER_LIBRARY.md Part 1.2'
    },
    sources: [{
      filePath: 'knowledge_base/ICT_MASTER_LIBRARY.md',
      lineStart: 42,
      lineEnd: 65,
      uploadId,
      uploadedAt: timestamp
    }],
    tags: ['structure', 'continuation', 'confirmation', 'core_concept'],
    createdAt: timestamp,
    updatedAt: timestamp
  },
  {
    id: 'concept-sms-mss',
    type: 'concept',
    domain: 'concepts',
    name: 'Shift in Market Structure (SMS/MSS)',
    description: 'A reversal signal where price breaks a swing point AGAINST the current trend with clear displacement. Indicates institutional shift from one directional bias to another. NOT an entry signal alone - wait for new structure to form.',
    content: 'SMS/MSS occurs when price breaks against the prevailing trend with displacement through a protected swing low/high. This signals potential reversal but requires confirmation through new structure formation. More significant than CHoCH.',
    metadata: {
      category: 'structure',
      abbreviation: 'SMS/MSS',
      detection_rules: 'Price breaks swing point against trend with displacement through protected level',
      entry_rules: ['NOT an entry signal by itself', 'Wait for new structure to form', 'Look for liquidity sweep confirmation', 'Enter on retest of broken structure'],
      invalidation: 'Immediate BOS back in original trend direction',
      related_concepts: ['market-structure', 'bos', 'choch', 'displacement', 'liquidity'],
      confluence_weight: 1.5,
      timeframes: ['M5', 'M15', 'H1', 'H4', 'D1'],
      htf_priority: true,
      source_reference: 'ICT_MASTER_LIBRARY.md Part 1.2'
    },
    sources: [{
      filePath: 'knowledge_base/ICT_MASTER_LIBRARY.md',
      lineStart: 42,
      lineEnd: 75,
      uploadId,
      uploadedAt: timestamp
    }],
    tags: ['structure', 'reversal', 'confirmation', 'core_concept'],
    createdAt: timestamp,
    updatedAt: timestamp
  },
  {
    id: 'concept-choch',
    type: 'concept',
    domain: 'concepts',
    name: 'Change of Character (CHoCH)',
    description: 'A long-term reversal signal where price breaks against trend at key structure points. Weaker than SMS but alerts traders to weakening dominant trend. Early warning of potential major trend shift.',
    content: 'CHoCH signals major trend weakening when price breaks counter-trend swing points. Acts as early warning system before full SMS confirmation. Often precedes larger market reversals.',
    metadata: {
      category: 'structure',
      abbreviation: 'CHoCH',
      detection_rules: 'Break of counter-trend swing point at key levels',
      entry_rules: ['Early warning only, not entry signal', 'Prepare for potential reversal', 'Wait for SMS confirmation'],
      invalidation: 'Strong BOS reasserting original trend',
      related_concepts: ['bos', 'sms-mss', 'market-structure'],
      confluence_weight: 1.0,
      timeframes: ['H1', 'H4', 'D1', 'W1'],
      htf_priority: true,
      source_reference: 'ICT_MASTER_LIBRARY.md Part 1.2'
    },
    sources: [{
      filePath: 'knowledge_base/ICT_MASTER_LIBRARY.md',
      lineStart: 42,
      lineEnd: 75,
      uploadId,
      uploadedAt: timestamp
    }],
    tags: ['structure', 'reversal', 'early_warning', 'core_concept'],
    createdAt: timestamp,
    updatedAt: timestamp
  },
  {
    id: 'concept-fvg',
    type: 'concept',
    domain: 'concepts',
    name: 'Fair Value Gap (FVG)',
    description: 'A three-candle imbalance formation where price moved so rapidly that opposing liquidity was skipped. Bullish FVG: Candle 1 high < Candle 3 low. Bearish FVG: Candle 1 low > Candle 3 high. Price often retraces to fill 50% of the gap before continuing.',
    content: 'FVG forms when displacement creates an inefficiency. Gap between candle 1 and candle 3 represents institutional imbalance. Entry at 50% Consequent Encroachment (CE) provides optimal risk/reward. Stop loss goes beyond gap-creating candle. MUST follow displacement - gaps without displacement are low probability.',
    metadata: {
      category: 'price_action',
      abbreviation: 'FVG',
      detection_rules: 'Three-candle pattern: Bullish if C1.high < C3.low, Bearish if C1.low > C3.high. Must follow displacement.',
      entry_rules: ['Enter at 50% CE of gap', 'Stop beyond gap candle', 'Only after confirmed BOS/SMS', 'Avoid if 50%+ already filled'],
      invalidation: 'Gap fills completely before entry or closes through far side',
      related_concepts: ['displacement', 'order-block', 'ote', 'pd-array', 'inversion-fvg'],
      confluence_weight: 1.5,
      timeframes: ['M1', 'M5', 'M15', 'H1', 'H4'],
      htf_priority: false,
      source_reference: 'ICT_MASTER_LIBRARY.md Part 1.3'
    },
    sources: [{
      filePath: 'knowledge_base/ICT_MASTER_LIBRARY.md',
      lineStart: 77,
      lineEnd: 120,
      uploadId,
      uploadedAt: timestamp
    }],
    tags: ['price_action', 'core_concept', 'pd_array', 'imbalance', 'entry_zone'],
    createdAt: timestamp,
    updatedAt: timestamp
  },
  {
    id: 'concept-order-block',
    type: 'concept',
    domain: 'concepts',
    name: 'Order Block (OB)',
    description: 'The last opposite-colored candle before displacement. Bullish OB = last DOWN candle before bullish displacement. Bearish OB = last UP candle before bearish displacement. Represents institutional order accumulation zone.',
    content: 'Order Blocks mark where institutions placed orders before displacing price. Price respects OB body or 50% midpoint on retests. Invalidated if body is broken by close. Best when combined with FVG (Unicorn setup) or aligned with OTE zones.',
    metadata: {
      category: 'structure',
      abbreviation: 'OB',
      detection_rules: 'Last red candle before bullish displacement OR last green candle before bearish displacement. Must have displacement to validate.',
      entry_rules: ['Entry at open or 50% of block body', 'Price may wick through but should respect body', 'Use as re-entry on retracements'],
      invalidation: 'Body broken - price closes through 50% of OB body',
      related_concepts: ['displacement', 'fvg', 'breaker-block', 'pd-array', 'mitigation-block'],
      confluence_weight: 1.5,
      timeframes: ['M5', 'M15', 'H1', 'H4'],
      htf_priority: false,
      source_reference: 'ICT_MASTER_LIBRARY.md Part 1.4'
    },
    sources: [{
      filePath: 'knowledge_base/ICT_MASTER_LIBRARY.md',
      lineStart: 122,
      lineEnd: 145,
      uploadId,
      uploadedAt: timestamp
    }],
    tags: ['structure', 'core_concept', 'pd_array', 'entry_zone', 'institutional'],
    createdAt: timestamp,
    updatedAt: timestamp
  },
  {
    id: 'concept-displacement',
    type: 'concept',
    domain: 'concepts',
    name: 'Displacement',
    description: 'Strong, impulsive price move with large-bodied candles (2x+ average range), minimal wicks, creating FVGs and OBs. The footprint of institutional order flow. REQUIRED for all valid ICT setups. Without displacement, setups are weak and should be ignored.',
    content: 'Displacement is the institutional commitment signal - long bodies, minimal opposite wicks, breaks structure with authority. Validates BOS, SMS, FVGs, and OBs. No displacement = no smart money sponsorship = low probability setup. This is THE filter for all ICT concepts.',
    metadata: {
      category: 'confirmation',
      abbreviation: 'DISP',
      detection_rules: 'Large-bodied candle(s), 2x+ avg range, minimal opposite wick, breaks structure with authority',
      entry_rules: ['Do not enter ANY setup without displacement confirmation', 'Wait for displacement before validating FVG/OB', 'Displacement must break structure, not just move price'],
      invalidation: 'Immediate reversal or weak follow-through',
      related_concepts: ['fvg', 'order-block', 'bos', 'sms-mss', 'liquidity-void'],
      confluence_weight: 2.5,
      timeframes: ['M1', 'M5', 'M15', 'H1'],
      htf_priority: false,
      source_reference: 'ICT_MASTER_LIBRARY.md Part 1.5'
    },
    sources: [{
      filePath: 'knowledge_base/ICT_MASTER_LIBRARY.md',
      lineStart: 147,
      lineEnd: 170,
      uploadId,
      uploadedAt: timestamp
    }],
    tags: ['confirmation', 'critical', 'core_concept', 'institutional', 'smart_money'],
    createdAt: timestamp,
    updatedAt: timestamp
  },
  {
    id: 'concept-liquidity',
    type: 'concept',
    domain: 'concepts',
    name: 'Liquidity',
    description: 'Resting stop orders that price is DRAWN to. Buy-Side Liquidity (BSL) above swing highs where shorts have stops. Sell-Side Liquidity (SSL) below swing lows where longs have stops. Equal highs/lows, PDH/PDL, session extremes are liquidity pools. Price sweeps these before real moves.',
    content: 'Liquidity pools include: Equal highs/lows, trendline liquidity, previous day/week highs/lows, session extremes, Asia range. Smart Money needs liquidity to fill large orders. Liquidity sweep → displacement opposite direction = high probability reversal. If there is no liquidity to draw on, there is no reason for price to move.',
    metadata: {
      category: 'liquidity',
      abbreviation: 'LIQ',
      detection_rules: 'Identify equal highs/lows, swing extremes, previous day/week/session highs/lows, trendline liquidity',
      entry_rules: ['Do not trade UNTIL liquidity is swept', 'Wait for sweep then displacement opposite', 'Liquidity sweep without displacement = failed setup'],
      invalidation: 'No sweep occurs or double sweep in same direction',
      related_concepts: ['displacement', 'smt', 'bpr', 'turtle-soup', 'judas-swing'],
      confluence_weight: 2.5,
      timeframes: ['M15', 'H1', 'H4', 'D1'],
      htf_priority: true,
      source_reference: 'ICT_MASTER_LIBRARY.md Part 1.6'
    },
    sources: [{
      filePath: 'knowledge_base/ICT_MASTER_LIBRARY.md',
      lineStart: 172,
      lineEnd: 205,
      uploadId,
      uploadedAt: timestamp
    }],
    tags: ['liquidity', 'critical', 'core_concept', 'target', 'stop_hunt'],
    createdAt: timestamp,
    updatedAt: timestamp
  },
  {
    id: 'concept-ote',
    type: 'concept',
    domain: 'concepts',
    name: 'Optimal Trade Entry (OTE)',
    description: 'The 61.8% to 79% Fibonacci retracement zone where Smart Money re-engages after displacement. Sweet spot: 70.5%. Only use after confirmed displacement and BOS/SMS. Often aligns with FVGs and OBs for maximum confluence.',
    content: 'OTE zone boundaries: 61.8% (upper), 70.5% (smart money sweet spot), 79% (lower). Measure from swing low to swing high (bullish) or vice versa. Most effective during Killzones. Confluence with FVG or OB inside OTE zone = highest probability setups.',
    metadata: {
      category: 'fib_based',
      abbreviation: 'OTE',
      detection_rules: 'Apply Fibonacci retracement after displacement leg. Zone is 61.8-79%.',
      entry_rules: ['Only after confirmed displacement and BOS/SMS', 'Measure swing low to high (bullish) or high to low (bearish)', 'Sweet spot entry at 70.5%', 'Best during Killzones'],
      invalidation: 'Price fails to react in OTE zone or breaks beyond 79%',
      related_concepts: ['fvg', 'order-block', 'displacement', 'premium-discount'],
      confluence_weight: 1.0,
      timeframes: ['M15', 'H1', 'H4'],
      htf_priority: false,
      source_reference: 'ICT_MASTER_LIBRARY.md Part 1.7'
    },
    sources: [{
      filePath: 'knowledge_base/ICT_MASTER_LIBRARY.md',
      lineStart: 207,
      lineEnd: 230,
      uploadId,
      uploadedAt: timestamp
    }],
    tags: ['fib_based', 'core_concept', 'entry_zone', 'confluence', 'retracement'],
    createdAt: timestamp,
    updatedAt: timestamp
  },
  {
    id: 'concept-premium-discount',
    type: 'concept',
    domain: 'concepts',
    name: 'Premium/Discount Zones',
    description: 'The 50% midpoint of any swing divides price into expensive (premium) and cheap (discount) zones. Bullish narrative: buy discount, target premium. Bearish narrative: sell premium, target discount. Filters low-probability setups across all timeframes.',
    content: 'Premium = above 50% (expensive). Discount = below 50% (cheap). Trading rules: Buy in discount only with bullish bias, sell in premium only with bearish bias. Bullish FVG in premium = low probability. Bearish OB in discount = unlikely to hold.',
    metadata: {
      category: 'price_action',
      abbreviation: 'P/D',
      detection_rules: 'Calculate 50% midpoint of swing high to swing low range',
      entry_rules: ['Bullish trades: Only enter in discount zone', 'Bearish trades: Only enter in premium zone', 'Avoid counter-zone setups'],
      invalidation: 'Narrative changes or structure shift',
      related_concepts: ['ote', 'market-structure', 'daily-bias'],
      confluence_weight: 1.0,
      timeframes: ['M15', 'H1', 'H4', 'D1'],
      htf_priority: true,
      source_reference: 'ICT_MASTER_LIBRARY.md Part 1.8'
    },
    sources: [{
      filePath: 'knowledge_base/ICT_MASTER_LIBRARY.md',
      lineStart: 232,
      lineEnd: 250,
      uploadId,
      uploadedAt: timestamp
    }],
    tags: ['price_action', 'core_concept', 'filter', 'zones'],
    createdAt: timestamp,
    updatedAt: timestamp
  },

  // ===== ADVANCED CONCEPTS (Part 2) =====
  {
    id: 'concept-breaker-block',
    type: 'concept',
    domain: 'concepts',
    name: 'Breaker Block',
    description: 'A failed Order Block that causes market structure shift and becomes support/resistance. Forms when price fails to continue from OB, breaks through it, then respects it as opposite polarity. Entry at breaker body after confirmation.',
    content: 'Formation: 1) OB forms, 2) Price fails to continue, 3) Structure breaks THROUGH the OB, 4) Failed OB becomes Breaker Block. Entry on retest of broken level with HTF bias confirmation. Strongest after liquidity sweep.',
    metadata: {
      category: 'advanced',
      abbreviation: 'BB',
      detection_rules: 'OB that failed and was broken through, now acting as S/R from opposite side',
      entry_rules: ['Wait for clear break through OB', 'Confirm with HTF bias', 'Enter on retest of breaker body'],
      invalidation: 'Price breaks back through breaker',
      related_concepts: ['order-block', 'liquidity', 'displacement'],
      confluence_weight: 1.0,
      timeframes: ['M15', 'H1', 'H4'],
      htf_priority: false,
      source_reference: 'ICT_MASTER_LIBRARY.md Part 2.1'
    },
    sources: [{
      filePath: 'knowledge_base/ICT_MASTER_LIBRARY.md',
      lineStart: 252,
      lineEnd: 275,
      uploadId,
      uploadedAt: timestamp
    }],
    tags: ['advanced', 'pd_array', 'reversal', 'structure'],
    createdAt: timestamp,
    updatedAt: timestamp
  },
  {
    id: 'concept-mitigation-block',
    type: 'concept',
    domain: 'concepts',
    name: 'Mitigation Block',
    description: 'A candle formed by failed breakout or liquidity raid that is later revisited and respected. Different from OB (origin of move) - Mitigation Blocks come from FAILED moves. Use only after SMS or liquidity raid confirmation.',
    content: 'Mitigation Blocks form when false breakout/raid candle becomes reaction zone. Often align with FVGs or OBs. Confirm raid and reversal first before trading. Strongest at key structure levels after liquidity sweeps.',
    metadata: {
      category: 'advanced',
      abbreviation: 'MB',
      detection_rules: 'Candle from failed breakout or liquidity raid that gets revisited',
      entry_rules: ['Use only after SMS or liquidity raid', 'Confirm reversal first', 'Often align with FVG/OB'],
      invalidation: 'Price breaks through mitigation block',
      related_concepts: ['order-block', 'liquidity', 'bpr'],
      confluence_weight: 1.0,
      timeframes: ['M15', 'H1', 'H4'],
      htf_priority: false,
      source_reference: 'ICT_MASTER_LIBRARY.md Part 2.2'
    },
    sources: [{
      filePath: 'knowledge_base/ICT_MASTER_LIBRARY.md',
      lineStart: 277,
      lineEnd: 295,
      uploadId,
      uploadedAt: timestamp
    }],
    tags: ['advanced', 'pd_array', 'failed_move', 'raid'],
    createdAt: timestamp,
    updatedAt: timestamp
  },
  {
    id: 'concept-bpr',
    type: 'concept',
    domain: 'concepts',
    name: 'Balanced Price Range (BPR)',
    description: 'Forms after aggressive liquidity sweep high/low when price returns and trades back inside the range. Midpoint acts as reaction level for re-entries when initial move was missed.',
    content: 'Formation: 1) Liquidity sweep occurs, 2) Structure breaks, 3) Price retraces inside range. Midpoint becomes key reaction point. Strongest after BOS that sweeps liquidity and immediately rebalances. Use for second-chance entries.',
    metadata: {
      category: 'advanced',
      abbreviation: 'BPR',
      detection_rules: 'After liquidity sweep, price returns and consolidates inside previously swept range',
      entry_rules: ['Midpoint is reaction level', 'Use for missed initial moves', 'Strongest after BOS + sweep + rebalance'],
      invalidation: 'Range breaks significantly',
      related_concepts: ['liquidity', 'displacement', 'mitigation-block'],
      confluence_weight: 1.0,
      timeframes: ['M15', 'H1', 'H4'],
      htf_priority: false,
      source_reference: 'ICT_MASTER_LIBRARY.md Part 2.3'
    },
    sources: [{
      filePath: 'knowledge_base/ICT_MASTER_LIBRARY.md',
      lineStart: 297,
      lineEnd: 315,
      uploadId,
      uploadedAt: timestamp
    }],
    tags: ['advanced', 'post_sweep', 'reentry', 'range'],
    createdAt: timestamp,
    updatedAt: timestamp
  },
  {
    id: 'concept-liquidity-void',
    type: 'concept',
    domain: 'concepts',
    name: 'Liquidity Void',
    description: 'Long-bodied candle with minimal/no wick overlap - extreme imbalance where price moved too fast. Visual representation of institutional delivery with no opposing volume. Midpoint often acts as reaction point.',
    content: 'Characteristics: No opposing transaction volume, appears during major institutional legs, extreme imbalance. Not entry signal but displacement confirmation. Price may rebalance to midpoint before continuation. Combine with BOS, OB, or FVG.',
    metadata: {
      category: 'advanced',
      abbreviation: 'LV',
      detection_rules: 'Long-bodied candle with no/minimal wick overlap showing extreme imbalance',
      entry_rules: ['Displacement confirmation not entry signal', 'Midpoint may be reaction point', 'Combine with BOS/OB/FVG'],
      invalidation: 'Price consolidates within void',
      related_concepts: ['displacement', 'fvg', 'volume-imbalance'],
      confluence_weight: 1.0,
      timeframes: ['M5', 'M15', 'H1'],
      htf_priority: false,
      source_reference: 'ICT_MASTER_LIBRARY.md Part 2.4'
    },
    sources: [{
      filePath: 'knowledge_base/ICT_MASTER_LIBRARY.md',
      lineStart: 317,
      lineEnd: 335,
      uploadId,
      uploadedAt: timestamp
    }],
    tags: ['advanced', 'imbalance', 'displacement', 'extreme_move'],
    createdAt: timestamp,
    updatedAt: timestamp
  },
  {
    id: 'concept-pd-array',
    type: 'concept',
    domain: 'concepts',
    name: 'PD Array Matrix',
    description: 'Premium/Discount Array hierarchy. Priority order: OB > FVG > Breaker > Mitigation > Void > NWOG/NDOG. Use in conjunction with ICT 2022 Model or Silver Bullet. HTF PD Arrays take priority. Always combine with structure and time.',
    content: 'PD Arrays are the institutional tools for framing setups. Components in priority: Order Blocks (entry zones), Fair Value Gaps (imbalances), Breaker Blocks (failed OBs as S/R), Mitigation Blocks (post-raid zones), Liquidity Voids (extreme imbalances), New Week/Day Opening Gaps.',
    metadata: {
      category: 'advanced',
      abbreviation: 'PDA',
      detection_rules: 'Hierarchy of premium/discount zones used by institutions',
      entry_rules: ['Use with ICT 2022 or Silver Bullet', 'HTF arrays take priority', 'Combine with structure and time'],
      invalidation: 'Array invalidation depends on specific PD Array type',
      related_concepts: ['order-block', 'fvg', 'breaker-block', 'mitigation-block', 'liquidity-void'],
      confluence_weight: 1.5,
      timeframes: ['M15', 'H1', 'H4', 'D1'],
      htf_priority: true,
      source_reference: 'ICT_MASTER_LIBRARY.md Part 2.5'
    },
    sources: [{
      filePath: 'knowledge_base/ICT_MASTER_LIBRARY.md',
      lineStart: 337,
      lineEnd: 360,
      uploadId,
      uploadedAt: timestamp
    }],
    tags: ['advanced', 'framework', 'hierarchy', 'institutional'],
    createdAt: timestamp,
    updatedAt: timestamp
  },
  {
    id: 'concept-inversion-fvg',
    type: 'concept',
    domain: 'concepts',
    name: 'Inversion FVG (IFVG)',
    description: 'When price closes THROUGH original FVG, it flips polarity. Bullish FVG becomes bearish support, bearish FVG becomes bullish resistance. Requires candle closure validation to confirm inversion.',
    content: 'IFVG forms when price invalidates original FVG by closing through it. Original gap then acts as opposite polarity. Entry on retest of inverted FVG from new side. Must wait for candle close confirmation of flip.',
    metadata: {
      category: 'advanced',
      abbreviation: 'IFVG',
      detection_rules: 'Price closes through original FVG body, invalidating it',
      entry_rules: ['Wait for candle close through FVG', 'Wait for retest from opposite side', 'Confirm with structure'],
      invalidation: 'Price closes back through inverted FVG',
      related_concepts: ['fvg', 'displacement'],
      confluence_weight: 0.5,
      timeframes: ['M5', 'M15', 'H1'],
      htf_priority: false,
      source_reference: 'ICT_MASTER_LIBRARY.md Part 2 (implied)'
    },
    sources: [{
      filePath: 'knowledge_base/ICT_MASTER_LIBRARY.md',
      lineStart: 77,
      lineEnd: 120,
      uploadId,
      uploadedAt: timestamp
    }],
    tags: ['advanced', 'fvg', 'inversion', 'polarity_flip'],
    createdAt: timestamp,
    updatedAt: timestamp
  },
  {
    id: 'concept-smt',
    type: 'concept',
    domain: 'concepts',
    name: 'SMT Divergence',
    description: 'Smart Money Tool - comparative analysis between correlated instruments where one makes new swing but other fails to confirm. EUR/USD vs GBP/USD, ES vs NQ, DXY vs EUR/USD. The pair that DOESN\'T make new extreme shows true direction. Weight: 1.5x at liquidity sweep.',
    content: 'Example: EUR/USD makes lower low, GBP/USD does NOT = Bullish SMT. NQ makes higher high, ES does NOT = Bearish SMT. Best after liquidity sweep, confirms SMS, during Killzones. NOT entry signal alone - filter and confirmation tool.',
    metadata: {
      category: 'confirmation',
      abbreviation: 'SMT',
      detection_rules: 'Compare correlated pairs/instruments - one makes new extreme, other fails',
      entry_rules: ['Use after liquidity sweep', 'Confirms SMS', 'Best during Killzones', 'NOT entry signal alone'],
      invalidation: 'Both instruments confirm same direction',
      related_concepts: ['liquidity', 'sms-mss', 'killzones'],
      confluence_weight: 1.5,
      timeframes: ['M15', 'H1', 'H4'],
      htf_priority: false,
      source_reference: 'ICT_MASTER_LIBRARY.md Part 5.1'
    },
    sources: [{
      filePath: 'knowledge_base/ICT_MASTER_LIBRARY.md',
      lineStart: 500,
      lineEnd: 525,
      uploadId,
      uploadedAt: timestamp
    }],
    tags: ['confirmation', 'divergence', 'correlation', 'filter'],
    createdAt: timestamp,
    updatedAt: timestamp
  },
  {
    id: 'concept-ipda',
    type: 'concept',
    domain: 'concepts',
    name: 'IPDA (Interbank Price Delivery Algorithm)',
    description: 'ICT concept that price movements are driven by liquidity zones and imbalances, not random. Smart Money follows structured rules to: accumulate liquidity, balance imbalances, deliver price between pools. Framework: Price + Time + Liquidity. Uses 20/40/60 day lookback ranges.',
    content: 'IPDA is the algorithm governing institutional price delivery. Analysis points: Price (key levels, PD Arrays), Time (session behavior, macros), Liquidity (inaccuracy areas to cover). Not random - price seeks liquidity or rebalance by design.',
    metadata: {
      category: 'advanced',
      abbreviation: 'IPDA',
      detection_rules: 'Framework combining price levels, time windows, and liquidity targets',
      entry_rules: ['Identify liquidity target', 'Confirm time window', 'Use PD Arrays for entry', 'Price seeks liquidity or rebalance'],
      invalidation: 'Multiple failed deliveries at expected times',
      related_concepts: ['liquidity', 'pd-array', 'killzones', 'macro-times'],
      confluence_weight: 1.5,
      timeframes: ['H1', 'H4', 'D1'],
      htf_priority: true,
      source_reference: 'ICT_MASTER_LIBRARY.md Part 4.3'
    },
    sources: [{
      filePath: 'knowledge_base/ICT_MASTER_LIBRARY.md',
      lineStart: 450,
      lineEnd: 475,
      uploadId,
      uploadedAt: timestamp
    }],
    tags: ['advanced', 'framework', 'algorithm', 'institutional'],
    createdAt: timestamp,
    updatedAt: timestamp
  },

  // ===== TIME-BASED CONCEPTS (Part 4) =====
  {
    id: 'concept-killzones',
    type: 'concept',
    domain: 'concepts',
    name: 'Killzones',
    description: 'Specific trading sessions with distinct institutional behavior. London (2-5 AM ET) engineers liquidity. NY AM (7-10 AM ET) has highest volume and biggest moves - BEST session. NY PM (1-3 PM ET) for continuation/reversal. Asian (7-10 PM ET) for accumulation. AVOID 11AM-12:30PM dead zone.',
    content: 'London Killzone: Sets stage for day, Judas Swings. NY AM: Primary trading session, Silver Bullet setups. NY PM: Secondary opportunities. Asian: Low volatility consolidation. Do not take entries outside Killzones especially lunch 11-12:30 PM.',
    metadata: {
      category: 'time_based',
      abbreviation: 'KZ',
      detection_rules: 'Time-based: London 2-5am, NY AM 7-10am, NY PM 1-3pm, Asian 7-10pm ET',
      entry_rules: ['Only trade during Killzones', 'Best: NY AM 7-10am', 'AVOID 11am-12:30pm lunch', 'AVOID after 5pm close'],
      invalidation: 'N/A - time-based concept',
      related_concepts: ['macro-times', 'judas-swing', 'silver-bullet', 'power-of-three'],
      confluence_weight: 1.5,
      timeframes: ['M5', 'M15', 'H1'],
      htf_priority: false,
      source_reference: 'ICT_MASTER_LIBRARY.md Part 4.1'
    },
    sources: [{
      filePath: 'knowledge_base/ICT_MASTER_LIBRARY.md',
      lineStart: 400,
      lineEnd: 430,
      uploadId,
      uploadedAt: timestamp
    }],
    tags: ['time_based', 'critical', 'session', 'timing'],
    createdAt: timestamp,
    updatedAt: timestamp
  },
  {
    id: 'concept-macro-times',
    type: 'concept',
    domain: 'concepts',
    name: 'ICT Macro Times',
    description: 'Specific 20-minute intervals where algorithm seeks liquidity or reprices FVGs. Key times: 09:30, 09:50, 10:10, 10:50, 11:10, 13:10, 13:50, 14:10, 14:50, 15:10, 15:50 ET. Look for displacement/FVG formation at these exact times for high probability setups.',
    content: 'Macro times are algorithmic price delivery windows. Short institutional instructions creating events. Add confluence to trading decisions. Most powerful: 09:50-10:10 (Silver Bullet setup), 10:50-11:10 (reversal/cleanup), 13:10-13:40 (PM session).',
    metadata: {
      category: 'time_based',
      abbreviation: 'MACRO',
      detection_rules: 'Exact time windows: 09:30, 09:50, 10:10, 10:50, 11:10, 13:10, 13:50, 14:10, 14:50, 15:10, 15:50 ET',
      entry_rules: ['Look for displacement at macro times', 'Watch for FVG formation', 'Combine with Killzone analysis'],
      invalidation: 'N/A - time-based concept',
      related_concepts: ['killzones', 'silver-bullet', 'displacement', 'fvg'],
      confluence_weight: 1.5,
      timeframes: ['M1', 'M5', 'M15'],
      htf_priority: false,
      source_reference: 'ICT_MASTER_LIBRARY.md Part 4.2'
    },
    sources: [{
      filePath: 'knowledge_base/ICT_MASTER_LIBRARY.md',
      lineStart: 432,
      lineEnd: 448,
      uploadId,
      uploadedAt: timestamp
    }],
    tags: ['time_based', 'critical', 'timing', 'algorithm'],
    createdAt: timestamp,
    updatedAt: timestamp
  },
  {
    id: 'concept-daily-bias',
    type: 'concept',
    domain: 'concepts',
    name: 'Daily Bias Model',
    description: 'Pre-session determination of buy/sell day using HTF context. Components: HTF structure (Daily/4H/1H), Draw on Liquidity target, Premium/Discount position, Key liquidity pools (PDH/PDL, weekly), Time of week. Bullish bias = buy discount only. Bearish bias = sell premium only.',
    content: 'Daily Bias prevents counter-trend trading. Check: 1) HTF market structure, 2) Liquidity draw target, 3) Premium or discount current position, 4) Key pools (PDH/PDL), 5) Time of week (Monday accumulation, Friday expansion). Recalculate after major BOS/SMS or HTF liquidity event.',
    metadata: {
      category: 'time_based',
      abbreviation: 'DB',
      detection_rules: 'Analyze HTF structure, liquidity targets, premium/discount, PDH/PDL, day of week',
      entry_rules: ['Bullish bias: Only buy in discount', 'Bearish bias: Only sell in premium', 'Recalculate after HTF BOS/SMS'],
      invalidation: 'HTF structure shift or major liquidity event',
      related_concepts: ['premium-discount', 'liquidity', 'market-structure', 'killzones'],
      confluence_weight: 2.0,
      timeframes: ['H4', 'D1'],
      htf_priority: true,
      source_reference: 'ICT_MASTER_LIBRARY.md Part 4.4'
    },
    sources: [{
      filePath: 'knowledge_base/ICT_MASTER_LIBRARY.md',
      lineStart: 477,
      lineEnd: 498,
      uploadId,
      uploadedAt: timestamp
    }],
    tags: ['time_based', 'filter', 'bias', 'htf', 'pre_session'],
    createdAt: timestamp,
    updatedAt: timestamp
  },

  // ===== STRUCTURAL CONCEPTS =====
  {
    id: 'concept-power-of-three',
    type: 'concept',
    domain: 'concepts',
    name: 'Power of Three (AMD)',
    description: 'Three-phase session cycle: Accumulation (Asian) → Manipulation (London/Judas) → Distribution (NY). The manipulation IS the entry signal - it sweeps liquidity. Smart Money builds positions (A), traps retail (M), delivers to target (D).',
    content: 'Session application: Asian session accumulates (range/consolidation), London open manipulates (Judas Swing sweeps), NY session distributes (real move to opposite liquidity). Trading: 1) Identify accumulation range, 2) Wait for manipulation sweep, 3) Enter after displacement confirms distribution, 4) Target opposite liquidity.',
    metadata: {
      category: 'structure',
      abbreviation: 'PO3/AMD',
      detection_rules: 'Identify accumulation range, watch for manipulation sweep, confirm distribution displacement',
      entry_rules: ['Identify accumulation range', 'Wait for manipulation sweep', 'Enter after displacement', 'Target opposite liquidity'],
      invalidation: 'Failed distribution or reversal back into accumulation',
      related_concepts: ['judas-swing', 'killzones', 'liquidity', 'displacement'],
      confluence_weight: 1.5,
      timeframes: ['M15', 'H1', 'H4'],
      htf_priority: false,
      source_reference: 'ICT_MASTER_LIBRARY.md Part 3.1'
    },
    sources: [{
      filePath: 'knowledge_base/ICT_MASTER_LIBRARY.md',
      lineStart: 362,
      lineEnd: 385,
      uploadId,
      uploadedAt: timestamp
    }],
    tags: ['structure', 'session', 'cycle', 'manipulation'],
    createdAt: timestamp,
    updatedAt: timestamp
  },
  {
    id: 'concept-volume-imbalance',
    type: 'concept',
    domain: 'concepts',
    name: 'Volume Imbalance',
    description: 'Advanced PD array concept requiring displacement and volume analysis. Represents institutional imbalance with no opposing volume. Similar to liquidity void but specifically focused on volume characteristics.',
    content: 'Volume Imbalance shows where institutions moved price without opposition. Requires advanced PD arrays understanding plus displacement confirmation. Used for precision entries in conjunction with other concepts.',
    metadata: {
      category: 'advanced',
      abbreviation: 'VI',
      detection_rules: 'Requires advanced PD arrays + displacement + volume analysis',
      entry_rules: ['Combine with displacement', 'Use with PD Array Matrix', 'Confirm with HTF bias'],
      invalidation: 'Price consolidates within imbalance',
      related_concepts: ['pd-array', 'displacement', 'liquidity-void'],
      confluence_weight: 1.0,
      timeframes: ['M5', 'M15', 'H1'],
      htf_priority: false,
      source_reference: 'concept_relationships.yaml'
    },
    sources: [{
      filePath: 'knowledge_base/concept_relationships.yaml',
      lineStart: 100,
      lineEnd: 110,
      uploadId,
      uploadedAt: timestamp
    }],
    tags: ['advanced', 'pd_array', 'imbalance', 'volume'],
    createdAt: timestamp,
    updatedAt: timestamp
  },
  {
    id: 'concept-rejection-block',
    type: 'concept',
    domain: 'concepts',
    name: 'Rejection Block',
    description: 'Advanced PD array requiring liquidity sweep and strong rejection. Forms when price aggressively rejects from a level after liquidity run. Shows institutional commitment to direction.',
    content: 'Rejection Block forms at key levels after liquidity sweep with strong opposing candle. Shows smart money defending level. Requires advanced PD arrays understanding plus liquidity sweep confirmation.',
    metadata: {
      category: 'advanced',
      abbreviation: 'RB',
      detection_rules: 'Requires advanced PD arrays + liquidity sweep + strong rejection candle',
      entry_rules: ['Wait for liquidity sweep', 'Confirm strong rejection', 'Enter on retest'],
      invalidation: 'Level breaks after initial rejection',
      related_concepts: ['pd-array', 'liquidity', 'displacement'],
      confluence_weight: 1.0,
      timeframes: ['M15', 'H1', 'H4'],
      htf_priority: false,
      source_reference: 'concept_relationships.yaml'
    },
    sources: [{
      filePath: 'knowledge_base/concept_relationships.yaml',
      lineStart: 110,
      lineEnd: 120,
      uploadId,
      uploadedAt: timestamp
    }],
    tags: ['advanced', 'pd_array', 'rejection', 'liquidity'],
    createdAt: timestamp,
    updatedAt: timestamp
  },
  {
    id: 'concept-institutional-order-flow',
    type: 'concept',
    domain: 'concepts',
    name: 'Institutional Order Flow',
    description: 'Dominant direction Smart Money pushes price - underlying bias driving structure and delivery. Building blocks: HH/HL or LL/LH structure, SMS shifts, liquidity targets, displacement events, time windows. Rule: Do not counter flow - "You will get steamrolled".',
    content: 'Institutional Order Flow is the smart money river - swim with it or get destroyed. Components: Market structure (HH/HL bullish, LL/LH bearish), Structure shifts (SMS confirms changes), Liquidity targets (where they\'re going), Displacement (institutional commitment), Time delivery windows (when they move).',
    metadata: {
      category: 'confirmation',
      abbreviation: 'IOF',
      detection_rules: 'Combine market structure + SMS + liquidity targets + displacement + time windows',
      entry_rules: ['Do not counter flow', 'Wait for confirmed SMS and divergence to counter', 'Align all trades with dominant flow'],
      invalidation: 'Confirmed SMS with multiple confluences',
      related_concepts: ['market-structure', 'sms-mss', 'liquidity', 'displacement', 'killzones'],
      confluence_weight: 2.0,
      timeframes: ['H1', 'H4', 'D1'],
      htf_priority: true,
      source_reference: 'ICT_MASTER_LIBRARY.md Part 5.2'
    },
    sources: [{
      filePath: 'knowledge_base/ICT_MASTER_LIBRARY.md',
      lineStart: 527,
      lineEnd: 550,
      uploadId,
      uploadedAt: timestamp
    }],
    tags: ['confirmation', 'critical', 'bias', 'smart_money', 'flow'],
    createdAt: timestamp,
    updatedAt: timestamp
  },
];
