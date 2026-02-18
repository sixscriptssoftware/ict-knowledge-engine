import type { Entity } from '../../lib/types';

const timestamp = new Date().toISOString();
const uploadId = 'ict-master-database-2026-02-18';

export const ICT_SCHEMAS: Entity[] = [
  {
    id: 'schema-concept-encoding',
    type: 'schema',
    domain: 'schemas',
    name: 'Concept Encoding Schema',
    description: 'JSON schema for ICT concept storage including type, timeframe, candle data (OHLC for 3 candles), gap measurements, mitigation status, killzone context, and confluence scoring.',
    content: JSON.stringify({
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "$id": "https://ict-knowledge-engine.com/schemas/concept-encoding.schema.json",
      "title": "ICT Concept Encoding",
      "description": "Schema for storing detected ICT concepts with full context",
      "type": "object",
      "required": ["concept", "type", "timeframe", "timestamp"],
      "properties": {
        "concept": {
          "type": "string",
          "enum": ["FVG", "OB", "BOS", "SMS", "CHoCH", "Liquidity", "Displacement", "OTE", "Breaker", "Mitigation"]
        },
        "type": {
          "type": "string",
          "enum": ["bullish", "bearish", "neutral"]
        },
        "timeframe": {
          "type": "string",
          "enum": ["M1", "M5", "M15", "H1", "H4", "D1", "W1"]
        },
        "timestamp": {
          "type": "string",
          "format": "date-time"
        },
        "candles": {
          "type": "object",
          "properties": {
            "candle_1": {
              "type": "object",
              "properties": {
                "open": {"type": "number"},
                "high": {"type": "number"},
                "low": {"type": "number"},
                "close": {"type": "number"},
                "time": {"type": "string", "format": "date-time"}
              }
            },
            "candle_2": {
              "type": "object",
              "properties": {
                "open": {"type": "number"},
                "high": {"type": "number"},
                "low": {"type": "number"},
                "close": {"type": "number"},
                "time": {"type": "string", "format": "date-time"}
              }
            },
            "candle_3": {
              "type": "object",
              "properties": {
                "open": {"type": "number"},
                "high": {"type": "number"},
                "low": {"type": "number"},
                "close": {"type": "number"},
                "time": {"type": "string", "format": "date-time"}
              }
            }
          }
        },
        "gap_top": {"type": "number"},
        "gap_bottom": {"type": "number"},
        "gap_50_percent": {"type": "number"},
        "mitigated": {"type": "boolean"},
        "killzone": {
          "type": "string",
          "enum": ["London", "NY_AM", "NY_PM", "Asian", "None"]
        },
        "confluence_score": {"type": "number", "minimum": 0, "maximum": 10}
      }
    }, null, 2),
    metadata: {
      schema_version: '2020-12',
      validates: 'concept_detection',
      fields: [
        'concept', 'type', 'timeframe', 'timestamp',
        'candle_1', 'candle_2', 'candle_3',
        'gap_top', 'gap_bottom', 'gap_50_percent',
        'mitigated', 'killzone', 'confluence_score'
      ]
    },
    sources: [{
      filePath: 'knowledge_base/ICT_MASTER_LIBRARY.md',
      lineStart: 700,
      lineEnd: 750,
      uploadId,
      uploadedAt: timestamp
    }],
    tags: ['schema', 'validation', 'json', 'concept', 'detection'],
    createdAt: timestamp,
    updatedAt: timestamp
  },
  {
    id: 'schema-trade-signal',
    type: 'schema',
    domain: 'schemas',
    name: 'Trade Signal Schema',
    description: 'JSON schema for ICT trade signals including timestamp (ISO8601), symbol, direction (long/short), model, HTF bias, killzone, detailed confluences object, entry/stop/targets, risk-reward, and outcome.',
    content: JSON.stringify({
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "$id": "https://ict-knowledge-engine.com/schemas/trade-signal.schema.json",
      "title": "ICT Trade Signal",
      "description": "Schema for ICT trade signal generation and validation",
      "type": "object",
      "required": ["timestamp", "symbol", "direction", "model", "entry_price", "stop_loss", "target_1"],
      "properties": {
        "timestamp": {
          "type": "string",
          "format": "date-time",
          "description": "ISO8601 timestamp"
        },
        "symbol": {
          "type": "string",
          "description": "Trading pair (e.g., EURUSD, GBPUSD)"
        },
        "direction": {
          "type": "string",
          "enum": ["long", "short"]
        },
        "model": {
          "type": "string",
          "enum": ["silver_bullet", "judas_swing", "ict_2022", "unicorn", "turtle_soup", "ote_retracement", "breaker_reversal", "htf_ltf"]
        },
        "htf_bias": {
          "type": "string",
          "enum": ["bullish", "bearish", "neutral"]
        },
        "killzone": {
          "type": "string",
          "enum": ["London", "NY_AM", "NY_PM", "Asian"]
        },
        "confluences": {
          "type": "object",
          "properties": {
            "fvg": {"type": "boolean"},
            "order_block": {"type": "boolean"},
            "ote_zone": {"type": "boolean"},
            "liquidity_sweep": {"type": "boolean"},
            "smt_divergence": {"type": "boolean"},
            "displacement": {"type": "boolean"},
            "bos_sms": {"type": "boolean"}
          }
        },
        "confluence_count": {
          "type": "integer",
          "minimum": 0
        },
        "confluence_score": {
          "type": "number",
          "minimum": 0,
          "maximum": 10
        },
        "entry_price": {"type": "number"},
        "stop_loss": {"type": "number"},
        "target_1": {"type": "number"},
        "target_2": {"type": "number"},
        "risk_reward": {"type": "number"},
        "outcome": {
          "type": "string",
          "enum": ["WIN", "LOSS", "PENDING", "BREAKEVEN"]
        },
        "pips_result": {"type": "number"}
      }
    }, null, 2),
    metadata: {
      schema_version: '2020-12',
      validates: 'trade_signal',
      required_confluences_minimum: 3,
      minimum_score: 5.0
    },
    sources: [{
      filePath: 'knowledge_base/ICT_MASTER_LIBRARY.md',
      lineStart: 750,
      lineEnd: 800,
      uploadId,
      uploadedAt: timestamp
    }],
    tags: ['schema', 'validation', 'json', 'trade', 'signal'],
    createdAt: timestamp,
    updatedAt: timestamp
  },
  {
    id: 'schema-pd-array',
    type: 'schema',
    domain: 'schemas',
    name: 'PD Array Schema',
    description: 'JSON schema for Premium/Discount Arrays including type (OB/FVG/Breaker/Mitigation/Void), direction, timeframe, high/low boundaries, midpoint calculations (50%, 70.5%), candle index, mitigation status, confluence score, and HTF alignment.',
    content: JSON.stringify({
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "$id": "https://ict-knowledge-engine.com/schemas/pd-array.schema.json",
      "title": "PD Array",
      "description": "Schema for Premium/Discount Array storage",
      "type": "object",
      "required": ["type", "direction", "timeframe", "high", "low", "created_at_candle_index"],
      "properties": {
        "type": {
          "type": "string",
          "enum": ["OB", "FVG", "Breaker", "Mitigation", "Void", "NWOG", "NDOG"]
        },
        "direction": {
          "type": "string",
          "enum": ["bullish", "bearish"]
        },
        "timeframe": {
          "type": "string",
          "enum": ["M1", "M5", "M15", "H1", "H4", "D1", "W1"]
        },
        "high": {"type": "number"},
        "low": {"type": "number"},
        "midpoint_50": {
          "type": "number",
          "description": "50% equilibrium level"
        },
        "midpoint_70_5": {
          "type": "number",
          "description": "70.5% OTE sweet spot"
        },
        "created_at_candle_index": {
          "type": "integer",
          "description": "Candle index when PD Array formed"
        },
        "mitigated": {"type": "boolean"},
        "mitigated_at_candle_index": {"type": "integer"},
        "confluence_score": {"type": "number"},
        "htf_aligned": {"type": "boolean"},
        "priority_level": {
          "type": "integer",
          "minimum": 1,
          "maximum": 7,
          "description": "Priority in PD Array Matrix (1=highest)"
        }
      }
    }, null, 2),
    metadata: {
      schema_version: '2020-12',
      validates: 'pd_array',
      priority_order: ['OB', 'FVG', 'Breaker', 'Mitigation', 'Void', 'NWOG', 'NDOG']
    },
    sources: [{
      filePath: 'knowledge_base/ICT_MASTER_LIBRARY.md',
      lineStart: 337,
      lineEnd: 360,
      uploadId,
      uploadedAt: timestamp
    }],
    tags: ['schema', 'validation', 'json', 'pd_array', 'hierarchy'],
    createdAt: timestamp,
    updatedAt: timestamp
  },
];
