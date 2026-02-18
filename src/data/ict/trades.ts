import type { Entity } from '../../lib/types';

const timestamp = new Date().toISOString();
const uploadId = 'ict-master-database-2026-02-18';

export const ICT_TRADES: Entity[] = [
  {
    id: 'trade-gbpusd-2025-09-26-1',
    type: 'trade',
    domain: 'trades',
    name: 'GBPUSD Buy - 2025-09-26 - Silver Bullet Winner',
    description: 'GBPUSD long trade during NY PM session. Perfect Silver Bullet execution with FVG, OB, and liquidity sweep confluence. Part of 4/4 winning GBPUSD session.',
    content: JSON.stringify({
      ticket: 6668541,
      trade_id: '20250926-GBPUSD-001',
      timestamp: '2025-09-26T15:16:54Z'
    }, null, 2),
    metadata: {
      market: {
        pair: 'GBPUSD',
        direction: 'buy',
        entry: 1.33574,
        stop_loss: 1.3359,
        target: 1.34000,
        exit: 1.33824
      },
      setup: {
        setup_type: 'silver_bullet',
        direction: 'buy',
        model: 'Silver Bullet'
      },
      execution: {
        result: 'WIN',
        entry_price: 1.33574,
        stop_loss: 1.3359,
        target: 1.34000,
        exit_price: 1.33824,
        pnl: 62.50,
        pips: 25.0,
        risk_reward_ratio: 2.5,
        lot_size: 0.25,
        duration_seconds: 3936
      },
      context: {
        killzone: 'NY_PM',
        session: 'NY',
        date: '2025-09-26',
        time: '15:16:54',
        confluences: ['FVG', 'OB', 'liquidity_sweep', 'OTE'],
        confluence_count: 4
      },
      meta: {
        example_type: 'positive',
        grade: 'A+',
        notes: '4/4 GBPUSD winners session. Perfect setup with all confluences aligned.'
      }
    },
    sources: [
      {
        filePath: 'Collected_ICT_Data/connected_trades.csv',
        lineStart: 8,
        lineEnd: 8,
        uploadId,
        uploadedAt: timestamp
      }
    ],
    validationStatus: 'valid',
    tags: ['long', 'win', 'silver_bullet', 'gbpusd', 'ny_pm', 'high_quality'],
    createdAt: timestamp,
    updatedAt: timestamp
  },
  {
    id: 'trade-gbpusd-2025-09-26-2',
    type: 'trade',
    domain: 'trades',
    name: 'GBPUSD Buy - 2025-09-26 - Cycle 2',
    description: 'GBPUSD long trade, second cycle entry. FVG and liquidity sweep confluence. Winner as part of systematic position cycling.',
    content: JSON.stringify({
      ticket: 66685415109704,
      trade_id: '20250926-GBPUSD-002',
      timestamp: '2025-09-26T15:16:54Z'
    }, null, 2),
    metadata: {
      market: {
        pair: 'GBPUSD',
        direction: 'buy',
        entry: 1.33743670,
        stop_loss: 1.3364,
        target: 1.34000,
        exit: 1.33820
      },
      setup: {
        setup_type: 'silver_bullet',
        direction: 'buy',
        model: 'Silver Bullet',
        cycle: 2
      },
      execution: {
        result: 'WIN',
        entry_price: 1.33743670,
        stop_loss: 1.3364,
        target: 1.34000,
        exit_price: 1.33820,
        pnl: 19.08,
        pips: 7.6,
        risk_reward_ratio: 1.5,
        lot_size: 0.25,
        duration_seconds: 5820
      },
      context: {
        killzone: 'NY_PM',
        session: 'NY',
        date: '2025-09-26',
        time: '15:16:54',
        confluences: ['FVG', 'liquidity_sweep'],
        confluence_count: 2
      },
      meta: {
        example_type: 'positive',
        grade: 'A',
        notes: 'Position cycling - re-entry after FVG formation'
      }
    },
    sources: [
      {
        filePath: 'Collected_ICT_Data/connected_trades.csv',
        lineStart: 7,
        lineEnd: 7,
        uploadId,
        uploadedAt: timestamp
      }
    ],
    validationStatus: 'valid',
    tags: ['long', 'win', 'silver_bullet', 'gbpusd', 'ny_pm', 'position_cycle'],
    createdAt: timestamp,
    updatedAt: timestamp
  },
  {
    id: 'trade-gbpusd-2025-09-26-3',
    type: 'trade',
    domain: 'trades',
    name: 'GBPUSD Buy - 2025-09-26 - Cycle 3',
    description: 'GBPUSD long trade, third cycle entry. Continued winning streak in GBPUSD during NY PM.',
    content: JSON.stringify({
      ticket: 66685415112978,
      trade_id: '20250926-GBPUSD-003',
      timestamp: '2025-09-26T15:16:54Z'
    }, null, 2),
    metadata: {
      market: {
        pair: 'GBPUSD',
        direction: 'buy',
        entry: 1.33743670,
        stop_loss: 1.3377,
        target: 1.34100,
        exit: 1.33936
      },
      setup: {
        setup_type: 'silver_bullet',
        direction: 'buy',
        model: 'Silver Bullet',
        cycle: 3
      },
      execution: {
        result: 'WIN',
        entry_price: 1.33743670,
        stop_loss: 1.3377,
        target: 1.34100,
        exit_price: 1.33936,
        pnl: 48.08,
        pips: 19.2,
        risk_reward_ratio: 2.4,
        lot_size: 0.25,
        duration_seconds: 7310
      },
      context: {
        killzone: 'NY_PM',
        session: 'NY',
        date: '2025-09-26',
        time: '15:16:54',
        confluences: ['FVG', 'OB'],
        confluence_count: 2
      },
      meta: {
        example_type: 'positive',
        grade: 'A',
        notes: '3rd position cycle, maintaining winning streak'
      }
    },
    sources: [
      {
        filePath: 'Collected_ICT_Data/connected_trades.csv',
        lineStart: 6,
        lineEnd: 6,
        uploadId,
        uploadedAt: timestamp
      }
    ],
    validationStatus: 'valid',
    tags: ['long', 'win', 'silver_bullet', 'gbpusd', 'ny_pm', 'position_cycle'],
    createdAt: timestamp,
    updatedAt: timestamp
  },
  {
    id: 'trade-gbpusd-2025-09-26-4',
    type: 'trade',
    domain: 'trades',
    name: 'GBPUSD Buy - 2025-09-26 - Cycle 4',
    description: 'GBPUSD long trade, fourth and final cycle. Best R:R of the session completing 4/4 winning streak.',
    content: JSON.stringify({
      ticket: 66685415116113,
      trade_id: '20250926-GBPUSD-004',
      timestamp: '2025-09-26T15:16:54Z'
    }, null, 2),
    metadata: {
      market: {
        pair: 'GBPUSD',
        direction: 'buy',
        entry: 1.33743670,
        stop_loss: 1.3375,
        target: 1.34100,
        exit: 1.33983
      },
      setup: {
        setup_type: 'silver_bullet',
        direction: 'buy',
        model: 'Silver Bullet',
        cycle: 4
      },
      execution: {
        result: 'WIN',
        entry_price: 1.33743670,
        stop_loss: 1.3375,
        target: 1.34100,
        exit_price: 1.33983,
        pnl: 59.83,
        pips: 23.9,
        risk_reward_ratio: 3.1,
        lot_size: 0.25,
        duration_seconds: 9019
      },
      context: {
        killzone: 'NY_PM',
        session: 'NY',
        date: '2025-09-26',
        time: '15:16:54',
        confluences: ['FVG', 'OB', 'displacement'],
        confluence_count: 3
      },
      meta: {
        example_type: 'positive',
        grade: 'A+',
        notes: 'Final cycle completing 4/4 winners. Total session: +$189.49'
      }
    },
    sources: [
      {
        filePath: 'Collected_ICT_Data/connected_trades.csv',
        lineStart: 5,
        lineEnd: 5,
        uploadId,
        uploadedAt: timestamp
      }
    ],
    validationStatus: 'valid',
    tags: ['long', 'win', 'silver_bullet', 'gbpusd', 'ny_pm', 'position_cycle', 'best_rr'],
    createdAt: timestamp,
    updatedAt: timestamp
  },
  {
    id: 'trade-eurusd-2025-09-26-1',
    type: 'trade',
    domain: 'trades',
    name: 'EURUSD Buy - 2025-09-26 - NY PM Winner',
    description: 'EURUSD long trade during NY PM session. FVG and displacement confluence. Winner completing successful Friday trading session.',
    content: JSON.stringify({
      ticket: 6680195,
      trade_id: '20250926-EURUSD-001',
      timestamp: '2025-09-26T16:59:43Z'
    }, null, 2),
    metadata: {
      market: {
        pair: 'EURUSD',
        direction: 'buy',
        entry: 1.16891,
        stop_loss: 1.1689,
        target: 1.17200,
        exit: 1.16946
      },
      setup: {
        setup_type: 'silver_bullet',
        direction: 'buy',
        model: 'Silver Bullet'
      },
      execution: {
        result: 'WIN',
        entry_price: 1.16891,
        stop_loss: 1.1689,
        target: 1.17200,
        exit_price: 1.16946,
        pnl: 27.50,
        pips: 5.5,
        risk_reward_ratio: 2.5,
        lot_size: 0.5,
        duration_seconds: 5981
      },
      context: {
        killzone: 'NY_PM',
        session: 'NY',
        date: '2025-09-26',
        time: '16:59:43',
        confluences: ['FVG', 'displacement'],
        confluence_count: 2
      },
      meta: {
        example_type: 'positive',
        grade: 'A',
        notes: 'Clean execution on EURUSD after successful GBPUSD session'
      }
    },
    sources: [
      {
        filePath: 'Collected_ICT_Data/connected_trades.csv',
        lineStart: 4,
        lineEnd: 4,
        uploadId,
        uploadedAt: timestamp
      }
    ],
    validationStatus: 'valid',
    tags: ['long', 'win', 'silver_bullet', 'eurusd', 'ny_pm'],
    createdAt: timestamp,
    updatedAt: timestamp
  },
  {
    id: 'trade-eurusd-2025-09-30-1',
    type: 'trade',
    domain: 'trades',
    name: 'EURUSD Sell - 2025-09-30 - Loss',
    description: 'EURUSD short trade stopped out at SL. Example of proper risk management - loss contained to predetermined level. Learning opportunity for setup validation.',
    content: JSON.stringify({
      ticket: 6947376,
      trade_id: '20250930-EURUSD-001',
      timestamp: '2025-09-30T15:48:11Z'
    }, null, 2),
    metadata: {
      market: {
        pair: 'EURUSD',
        direction: 'sell',
        entry: 1.17383,
        stop_loss: 1.175,
        target: 1.15745,
        exit: 1.17500
      },
      setup: {
        setup_type: 'ict_2022',
        direction: 'sell',
        model: 'ICT 2022 Model'
      },
      execution: {
        result: 'LOSS',
        entry_price: 1.17383,
        stop_loss: 1.175,
        target: 1.15745,
        exit_price: 1.17500,
        pnl: -29.25,
        pips: -11.7,
        risk_reward_ratio: 1.4,
        lot_size: 0.25,
        duration_seconds: 6699
      },
      context: {
        killzone: 'NY_PM',
        session: 'NY',
        date: '2025-09-30',
        time: '15:48:11',
        confluences: ['FVG'],
        confluence_count: 1
      },
      meta: {
        example_type: 'negative',
        grade: 'C',
        notes: 'Stopped out at SL. Setup may have lacked sufficient confluence. Proper risk management demonstrated.',
        lessons: [
          'Verify minimum 3 confluences before entry',
          'HTF bias alignment critical',
          'Loss contained properly - good risk management'
        ]
      }
    },
    sources: [
      {
        filePath: 'Collected_ICT_Data/connected_trades.csv',
        lineStart: 1,
        lineEnd: 1,
        uploadId,
        uploadedAt: timestamp
      }
    ],
    validationStatus: 'valid',
    tags: ['short', 'loss', 'ict_2022', 'eurusd', 'ny_pm', 'learning_opportunity'],
    createdAt: timestamp,
    updatedAt: timestamp
  },
  {
    id: 'trade-eurusd-2025-09-26-early',
    type: 'trade',
    domain: 'trades',
    name: 'EURUSD Buy - 2025-09-26 - Morning Loss',
    description: 'EURUSD long trade during morning session. Example of importance of proper timing and confluence. Stopped out for loss showing importance of Killzone trading.',
    content: JSON.stringify({
      ticket: 6649836,
      trade_id: '20250926-EURUSD-MORNING',
      timestamp: '2025-09-26T09:15:00Z'
    }, null, 2),
    metadata: {
      market: {
        pair: 'EURUSD',
        direction: 'buy',
        entry: 1.16813,
        stop_loss: 1.16666,
        target: 1.17200,
        exit: 1.16664
      },
      setup: {
        setup_type: 'early_entry',
        direction: 'buy',
        model: 'Premature Entry'
      },
      execution: {
        result: 'LOSS',
        entry_price: 1.16813,
        stop_loss: 1.16666,
        target: 1.17200,
        exit_price: 1.16664,
        pnl: -74.50,
        pips: -14.9,
        risk_reward_ratio: 2.6,
        lot_size: 0.5,
        duration_seconds: 16322
      },
      context: {
        killzone: 'NONE',
        session: 'PRE_NY',
        date: '2025-09-26',
        time: '09:15:00',
        confluences: ['FVG'],
        confluence_count: 1
      },
      meta: {
        example_type: 'negative',
        grade: 'D',
        notes: 'Entry outside Killzone. Demonstrates importance of time-based trading rules.',
        lessons: [
          'Never trade outside Killzones',
          'Wait for proper session timing',
          'Insufficient confluence (only 1)',
          'Early entries have lower probability'
        ]
      }
    },
    sources: [
      {
        filePath: 'Collected_ICT_Data/connected_trades.csv',
        lineStart: 10,
        lineEnd: 10,
        uploadId,
        uploadedAt: timestamp
      },
      {
        filePath: 'Collected_ICT_Data/journal.md',
        lineStart: 50,
        lineEnd: 100,
        uploadId,
        uploadedAt: timestamp
      }
    ],
    validationStatus: 'valid',
    tags: ['long', 'loss', 'eurusd', 'timing_error', 'learning_opportunity', 'anti_pattern'],
    createdAt: timestamp,
    updatedAt: timestamp
  },
];
