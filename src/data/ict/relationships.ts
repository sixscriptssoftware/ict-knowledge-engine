import type { Relationship } from '../../lib/types';

const timestamp = new Date().toISOString();

export const ICT_RELATIONSHIPS: Relationship[] = [
  // ===== CONCEPT_PREREQUISITE (11 edges) =====
  {
    id: 'rel-prereq-displacement-fvg',
    type: 'CONCEPT_PREREQUISITE',
    source: 'concept-displacement',
    target: 'concept-fvg',
    metadata: {
      description: 'Displacement must be understood before identifying fair value gaps',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-prereq-displacement-orderblock',
    type: 'CONCEPT_PREREQUISITE',
    source: 'concept-displacement',
    target: 'concept-order-block',
    metadata: {
      description: 'Displacement is prerequisite to understanding order blocks',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-prereq-displacement-mss',
    type: 'CONCEPT_PREREQUISITE',
    source: 'concept-displacement',
    target: 'concept-market-structure',
    metadata: {
      description: 'Displacement precedes market structure shifts',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-prereq-liquidity-displacement',
    type: 'CONCEPT_PREREQUISITE',
    source: 'concept-liquidity',
    target: 'concept-displacement',
    metadata: {
      description: 'Understanding liquidity is prerequisite to displacement',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-prereq-marketstructure-bos',
    type: 'CONCEPT_PREREQUISITE',
    source: 'concept-market-structure',
    target: 'concept-bos',
    metadata: {
      description: 'Market structure understanding precedes break of structure',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-prereq-marketstructure-smsmss',
    type: 'CONCEPT_PREREQUISITE',
    source: 'concept-market-structure',
    target: 'concept-sms-mss',
    metadata: {
      description: 'Market structure is prerequisite to understanding shifts',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-prereq-fvg-inversionfvg',
    type: 'CONCEPT_PREREQUISITE',
    source: 'concept-fvg',
    target: 'concept-inversion-fvg',
    metadata: {
      description: 'FVG understanding precedes inversion FVG',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-prereq-fvg-pdarray',
    type: 'CONCEPT_PREREQUISITE',
    source: 'concept-fvg',
    target: 'concept-pd-array',
    metadata: {
      description: 'FVG is prerequisite to PD array understanding',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-prereq-orderblock-breakerblock',
    type: 'CONCEPT_PREREQUISITE',
    source: 'concept-order-block',
    target: 'concept-breaker-block',
    metadata: {
      description: 'Order block understanding precedes breaker blocks',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-prereq-orderblock-pdarray',
    type: 'CONCEPT_PREREQUISITE',
    source: 'concept-order-block',
    target: 'concept-pd-array',
    metadata: {
      description: 'Order blocks are prerequisite to PD array',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-prereq-liquidityvoid-displacement',
    type: 'CONCEPT_PREREQUISITE',
    source: 'concept-liquidity-void',
    target: 'concept-displacement',
    metadata: {
      description: 'Liquidity void understanding precedes displacement',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },

  // ===== CONCEPT_RELATED_TO (30 edges - bidirectional) =====
  {
    id: 'rel-related-fvg-orderblock-1',
    type: 'CONCEPT_RELATED_TO',
    source: 'concept-fvg',
    target: 'concept-order-block',
    metadata: {
      description: 'FVG and order blocks often occur together in price action',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-related-orderblock-fvg-2',
    type: 'CONCEPT_RELATED_TO',
    source: 'concept-order-block',
    target: 'concept-fvg',
    metadata: {
      description: 'Order blocks and FVG are closely related concepts',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-related-bos-smsmss-1',
    type: 'CONCEPT_RELATED_TO',
    source: 'concept-bos',
    target: 'concept-sms-mss',
    metadata: {
      description: 'BOS and SMS/MSS are related market structure concepts',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-related-smsmss-bos-2',
    type: 'CONCEPT_RELATED_TO',
    source: 'concept-sms-mss',
    target: 'concept-bos',
    metadata: {
      description: 'SMS/MSS and BOS are complementary concepts',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-related-smsmss-choch-1',
    type: 'CONCEPT_RELATED_TO',
    source: 'concept-sms-mss',
    target: 'concept-choch',
    metadata: {
      description: 'SMS/MSS and CHOCH represent similar market shifts',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-related-choch-smsmss-2',
    type: 'CONCEPT_RELATED_TO',
    source: 'concept-choch',
    target: 'concept-sms-mss',
    metadata: {
      description: 'CHOCH and SMS/MSS are interrelated concepts',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-related-bos-choch-1',
    type: 'CONCEPT_RELATED_TO',
    source: 'concept-bos',
    target: 'concept-choch',
    metadata: {
      description: 'BOS and CHOCH represent different types of structure breaks',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-related-choch-bos-2',
    type: 'CONCEPT_RELATED_TO',
    source: 'concept-choch',
    target: 'concept-bos',
    metadata: {
      description: 'CHOCH and BOS are complementary structure concepts',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-related-ote-fvg-1',
    type: 'CONCEPT_RELATED_TO',
    source: 'concept-ote',
    target: 'concept-fvg',
    metadata: {
      description: 'OTE zones often contain FVGs',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-related-fvg-ote-2',
    type: 'CONCEPT_RELATED_TO',
    source: 'concept-fvg',
    target: 'concept-ote',
    metadata: {
      description: 'FVGs are often found in OTE zones',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-related-ote-orderblock-1',
    type: 'CONCEPT_RELATED_TO',
    source: 'concept-ote',
    target: 'concept-order-block',
    metadata: {
      description: 'OTE zones align with order blocks',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-related-orderblock-ote-2',
    type: 'CONCEPT_RELATED_TO',
    source: 'concept-order-block',
    target: 'concept-ote',
    metadata: {
      description: 'Order blocks often fall within OTE zones',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-related-killzones-macrotimes-1',
    type: 'CONCEPT_RELATED_TO',
    source: 'concept-killzones',
    target: 'concept-macro-times',
    metadata: {
      description: 'Killzones and macro times define trading windows',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-related-macrotimes-killzones-2',
    type: 'CONCEPT_RELATED_TO',
    source: 'concept-macro-times',
    target: 'concept-killzones',
    metadata: {
      description: 'Macro times are specific periods within killzones',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-related-smt-liquidity-1',
    type: 'CONCEPT_RELATED_TO',
    source: 'concept-smt',
    target: 'concept-liquidity',
    metadata: {
      description: 'SMT divergences indicate liquidity manipulation',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-related-liquidity-smt-2',
    type: 'CONCEPT_RELATED_TO',
    source: 'concept-liquidity',
    target: 'concept-smt',
    metadata: {
      description: 'Liquidity concepts relate to SMT analysis',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-related-premiumdiscount-ote-1',
    type: 'CONCEPT_RELATED_TO',
    source: 'concept-premium-discount',
    target: 'concept-ote',
    metadata: {
      description: 'Premium/discount zones define OTE levels',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-related-ote-premiumdiscount-2',
    type: 'CONCEPT_RELATED_TO',
    source: 'concept-ote',
    target: 'concept-premium-discount',
    metadata: {
      description: 'OTE is based on premium/discount analysis',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-related-ipda-killzones-1',
    type: 'CONCEPT_RELATED_TO',
    source: 'concept-ipda',
    target: 'concept-killzones',
    metadata: {
      description: 'IPDA analysis uses killzone timing',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-related-killzones-ipda-2',
    type: 'CONCEPT_RELATED_TO',
    source: 'concept-killzones',
    target: 'concept-ipda',
    metadata: {
      description: 'Killzones are part of IPDA framework',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-related-ipda-macrotimes-1',
    type: 'CONCEPT_RELATED_TO',
    source: 'concept-ipda',
    target: 'concept-macro-times',
    metadata: {
      description: 'IPDA framework includes macro timing',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-related-macrotimes-ipda-2',
    type: 'CONCEPT_RELATED_TO',
    source: 'concept-macro-times',
    target: 'concept-ipda',
    metadata: {
      description: 'Macro times are part of IPDA analysis',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-related-bpr-liquidityvoid-1',
    type: 'CONCEPT_RELATED_TO',
    source: 'concept-bpr',
    target: 'concept-liquidity-void',
    metadata: {
      description: 'BPR and liquidity voids represent similar concepts',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-related-liquidityvoid-bpr-2',
    type: 'CONCEPT_RELATED_TO',
    source: 'concept-liquidity-void',
    target: 'concept-bpr',
    metadata: {
      description: 'Liquidity voids relate to balanced price ranges',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-related-liquidityvoid-mitigationblock-1',
    type: 'CONCEPT_RELATED_TO',
    source: 'concept-liquidity-void',
    target: 'concept-mitigation-block',
    metadata: {
      description: 'Liquidity voids are filled by mitigation blocks',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-related-mitigationblock-liquidityvoid-2',
    type: 'CONCEPT_RELATED_TO',
    source: 'concept-mitigation-block',
    target: 'concept-liquidity-void',
    metadata: {
      description: 'Mitigation blocks address liquidity voids',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-related-bpr-mitigationblock-1',
    type: 'CONCEPT_RELATED_TO',
    source: 'concept-bpr',
    target: 'concept-mitigation-block',
    metadata: {
      description: 'BPR and mitigation blocks are related concepts',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-related-mitigationblock-bpr-2',
    type: 'CONCEPT_RELATED_TO',
    source: 'concept-mitigation-block',
    target: 'concept-bpr',
    metadata: {
      description: 'Mitigation blocks relate to balanced price ranges',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-related-powerofthree-dailybias-1',
    type: 'CONCEPT_RELATED_TO',
    source: 'concept-power-of-three',
    target: 'concept-daily-bias',
    metadata: {
      description: 'Power of Three unfolds according to daily bias',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-related-dailybias-powerofthree-2',
    type: 'CONCEPT_RELATED_TO',
    source: 'concept-daily-bias',
    target: 'concept-power-of-three',
    metadata: {
      description: 'Daily bias guides Power of Three execution',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },

  // ===== CONCEPT_USED_IN_MODEL (27 edges) =====
  {
    id: 'rel-used-displacement-silverbullet',
    type: 'CONCEPT_USED_IN_MODEL',
    source: 'concept-displacement',
    target: 'model-silver-bullet',
    metadata: {
      description: 'Displacement is key component of Silver Bullet',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-used-fvg-silverbullet',
    type: 'CONCEPT_USED_IN_MODEL',
    source: 'concept-fvg',
    target: 'model-silver-bullet',
    metadata: {
      description: 'FVG is used in Silver Bullet identification',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-used-liquidity-silverbullet',
    type: 'CONCEPT_USED_IN_MODEL',
    source: 'concept-liquidity',
    target: 'model-silver-bullet',
    metadata: {
      description: 'Liquidity sweep is part of Silver Bullet',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-used-mss-silverbullet',
    type: 'CONCEPT_USED_IN_MODEL',
    source: 'concept-market-structure',
    target: 'model-silver-bullet',
    metadata: {
      description: 'Market structure shift validates Silver Bullet',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-used-killzones-silverbullet',
    type: 'CONCEPT_USED_IN_MODEL',
    source: 'concept-killzones',
    target: 'model-silver-bullet',
    metadata: {
      description: 'Killzones define Silver Bullet timing',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-used-displacement-judasswing',
    type: 'CONCEPT_USED_IN_MODEL',
    source: 'concept-displacement',
    target: 'model-judas-swing',
    metadata: {
      description: 'Displacement occurs in Judas Swing reversal',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-used-liquidity-judasswing',
    type: 'CONCEPT_USED_IN_MODEL',
    source: 'concept-liquidity',
    target: 'model-judas-swing',
    metadata: {
      description: 'Liquidity grab is part of Judas Swing',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-used-powerofthree-judasswing',
    type: 'CONCEPT_USED_IN_MODEL',
    source: 'concept-power-of-three',
    target: 'model-judas-swing',
    metadata: {
      description: 'Judas Swing follows Power of Three structure',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-used-powerofthree-ict2022',
    type: 'CONCEPT_USED_IN_MODEL',
    source: 'concept-power-of-three',
    target: 'model-ict-2022',
    metadata: {
      description: 'Power of Three is core to ICT 2022 model',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-used-displacement-ict2022',
    type: 'CONCEPT_USED_IN_MODEL',
    source: 'concept-displacement',
    target: 'model-ict-2022',
    metadata: {
      description: 'Displacement validates ICT 2022 moves',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-used-fvg-ict2022',
    type: 'CONCEPT_USED_IN_MODEL',
    source: 'concept-fvg',
    target: 'model-ict-2022',
    metadata: {
      description: 'FVG is used in ICT 2022 framework',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-used-liquidity-ict2022',
    type: 'CONCEPT_USED_IN_MODEL',
    source: 'concept-liquidity',
    target: 'model-ict-2022',
    metadata: {
      description: 'Liquidity concepts are central to ICT 2022',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-used-orderblock-unicorn',
    type: 'CONCEPT_USED_IN_MODEL',
    source: 'concept-order-block',
    target: 'model-unicorn',
    metadata: {
      description: 'Order blocks define Unicorn entry zones',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-used-fvg-unicorn',
    type: 'CONCEPT_USED_IN_MODEL',
    source: 'concept-fvg',
    target: 'model-unicorn',
    metadata: {
      description: 'FVG is part of Unicorn setup',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-used-dailybias-unicorn',
    type: 'CONCEPT_USED_IN_MODEL',
    source: 'concept-daily-bias',
    target: 'model-unicorn',
    metadata: {
      description: 'Daily bias directs Unicorn trades',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-used-liquidity-turtlesoup',
    type: 'CONCEPT_USED_IN_MODEL',
    source: 'concept-liquidity',
    target: 'model-turtle-soup',
    metadata: {
      description: 'Turtle Soup exploits liquidity traps',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-used-displacement-oteretracement',
    type: 'CONCEPT_USED_IN_MODEL',
    source: 'concept-displacement',
    target: 'model-ote-retracement',
    metadata: {
      description: 'Displacement precedes OTE retracement',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-used-fvg-oteretracement',
    type: 'CONCEPT_USED_IN_MODEL',
    source: 'concept-fvg',
    target: 'model-ote-retracement',
    metadata: {
      description: 'FVG appears in OTE retracement zones',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-used-ote-oteretracement',
    type: 'CONCEPT_USED_IN_MODEL',
    source: 'concept-ote',
    target: 'model-ote-retracement',
    metadata: {
      description: 'OTE defines the retracement levels',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-used-liquidity-breakerblockreversal',
    type: 'CONCEPT_USED_IN_MODEL',
    source: 'concept-liquidity',
    target: 'model-breaker-block-reversal',
    metadata: {
      description: 'Liquidity grab triggers breaker block',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-used-displacement-breakerblockreversal',
    type: 'CONCEPT_USED_IN_MODEL',
    source: 'concept-displacement',
    target: 'model-breaker-block-reversal',
    metadata: {
      description: 'Displacement confirms breaker block reversal',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-used-breakerblock-breakerblockreversal',
    type: 'CONCEPT_USED_IN_MODEL',
    source: 'concept-breaker-block',
    target: 'model-breaker-block-reversal',
    metadata: {
      description: 'Breaker block is core to the reversal model',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-used-marketstructure-htfltfprocess',
    type: 'CONCEPT_USED_IN_MODEL',
    source: 'concept-market-structure',
    target: 'model-htf-ltf-process',
    metadata: {
      description: 'Market structure analyzed across timeframes',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-used-killzones-htfltfprocess',
    type: 'CONCEPT_USED_IN_MODEL',
    source: 'concept-killzones',
    target: 'model-htf-ltf-process',
    metadata: {
      description: 'Killzones used in HTF/LTF alignment',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-used-displacement-htfltfprocess',
    type: 'CONCEPT_USED_IN_MODEL',
    source: 'concept-displacement',
    target: 'model-htf-ltf-process',
    metadata: {
      description: 'Displacement validates HTF/LTF alignment',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-used-ote-htfltfprocess',
    type: 'CONCEPT_USED_IN_MODEL',
    source: 'concept-ote',
    target: 'model-htf-ltf-process',
    metadata: {
      description: 'OTE zones guide HTF/LTF entries',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-used-ipda-htfltfprocess',
    type: 'CONCEPT_USED_IN_MODEL',
    source: 'concept-ipda',
    target: 'model-htf-ltf-process',
    metadata: {
      description: 'IPDA framework spans HTF/LTF analysis',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },

  // ===== MODEL_PRODUCES_TRADE (6 edges) =====
  {
    id: 'rel-produces-silverbullet-gbpusd1',
    type: 'MODEL_PRODUCES_TRADE',
    source: 'model-silver-bullet',
    target: 'trade-gbpusd-2025-09-26-1',
    metadata: {
      description: 'Silver Bullet model produced GBPUSD trade 1',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-produces-silverbullet-gbpusd2',
    type: 'MODEL_PRODUCES_TRADE',
    source: 'model-silver-bullet',
    target: 'trade-gbpusd-2025-09-26-2',
    metadata: {
      description: 'Silver Bullet model produced GBPUSD trade 2',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-produces-silverbullet-gbpusd3',
    type: 'MODEL_PRODUCES_TRADE',
    source: 'model-silver-bullet',
    target: 'trade-gbpusd-2025-09-26-3',
    metadata: {
      description: 'Silver Bullet model produced GBPUSD trade 3',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-produces-silverbullet-gbpusd4',
    type: 'MODEL_PRODUCES_TRADE',
    source: 'model-silver-bullet',
    target: 'trade-gbpusd-2025-09-26-4',
    metadata: {
      description: 'Silver Bullet model produced GBPUSD trade 4',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-produces-silverbullet-eurusd1',
    type: 'MODEL_PRODUCES_TRADE',
    source: 'model-silver-bullet',
    target: 'trade-eurusd-2025-09-26-1',
    metadata: {
      description: 'Silver Bullet model produced EURUSD trade',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-produces-ict2022-eurusd2',
    type: 'MODEL_PRODUCES_TRADE',
    source: 'model-ict-2022',
    target: 'trade-eurusd-2025-09-30-1',
    metadata: {
      description: 'ICT 2022 model produced EURUSD trade',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },

  // ===== TRADE_USES_CONCEPT (28 edges) =====
  // GBPUSD trades use: fvg, order-block, liquidity, displacement
  {
    id: 'rel-tradeuses-gbpusd1-fvg',
    type: 'TRADE_USES_CONCEPT',
    source: 'trade-gbpusd-2025-09-26-1',
    target: 'concept-fvg',
    metadata: {
      description: 'Trade identified FVG entry zone',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-tradeuses-gbpusd1-orderblock',
    type: 'TRADE_USES_CONCEPT',
    source: 'trade-gbpusd-2025-09-26-1',
    target: 'concept-order-block',
    metadata: {
      description: 'Trade used order block for entry',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-tradeuses-gbpusd1-liquidity',
    type: 'TRADE_USES_CONCEPT',
    source: 'trade-gbpusd-2025-09-26-1',
    target: 'concept-liquidity',
    metadata: {
      description: 'Trade exploited liquidity sweep',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-tradeuses-gbpusd1-displacement',
    type: 'TRADE_USES_CONCEPT',
    source: 'trade-gbpusd-2025-09-26-1',
    target: 'concept-displacement',
    metadata: {
      description: 'Trade validated by displacement',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-tradeuses-gbpusd2-fvg',
    type: 'TRADE_USES_CONCEPT',
    source: 'trade-gbpusd-2025-09-26-2',
    target: 'concept-fvg',
    metadata: {
      description: 'Trade identified FVG entry zone',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-tradeuses-gbpusd2-orderblock',
    type: 'TRADE_USES_CONCEPT',
    source: 'trade-gbpusd-2025-09-26-2',
    target: 'concept-order-block',
    metadata: {
      description: 'Trade used order block for entry',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-tradeuses-gbpusd2-liquidity',
    type: 'TRADE_USES_CONCEPT',
    source: 'trade-gbpusd-2025-09-26-2',
    target: 'concept-liquidity',
    metadata: {
      description: 'Trade exploited liquidity sweep',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-tradeuses-gbpusd2-displacement',
    type: 'TRADE_USES_CONCEPT',
    source: 'trade-gbpusd-2025-09-26-2',
    target: 'concept-displacement',
    metadata: {
      description: 'Trade validated by displacement',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-tradeuses-gbpusd3-fvg',
    type: 'TRADE_USES_CONCEPT',
    source: 'trade-gbpusd-2025-09-26-3',
    target: 'concept-fvg',
    metadata: {
      description: 'Trade identified FVG entry zone',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-tradeuses-gbpusd3-orderblock',
    type: 'TRADE_USES_CONCEPT',
    source: 'trade-gbpusd-2025-09-26-3',
    target: 'concept-order-block',
    metadata: {
      description: 'Trade used order block for entry',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-tradeuses-gbpusd3-liquidity',
    type: 'TRADE_USES_CONCEPT',
    source: 'trade-gbpusd-2025-09-26-3',
    target: 'concept-liquidity',
    metadata: {
      description: 'Trade exploited liquidity sweep',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-tradeuses-gbpusd3-displacement',
    type: 'TRADE_USES_CONCEPT',
    source: 'trade-gbpusd-2025-09-26-3',
    target: 'concept-displacement',
    metadata: {
      description: 'Trade validated by displacement',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-tradeuses-gbpusd4-fvg',
    type: 'TRADE_USES_CONCEPT',
    source: 'trade-gbpusd-2025-09-26-4',
    target: 'concept-fvg',
    metadata: {
      description: 'Trade identified FVG entry zone',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-tradeuses-gbpusd4-orderblock',
    type: 'TRADE_USES_CONCEPT',
    source: 'trade-gbpusd-2025-09-26-4',
    target: 'concept-order-block',
    metadata: {
      description: 'Trade used order block for entry',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-tradeuses-gbpusd4-liquidity',
    type: 'TRADE_USES_CONCEPT',
    source: 'trade-gbpusd-2025-09-26-4',
    target: 'concept-liquidity',
    metadata: {
      description: 'Trade exploited liquidity sweep',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-tradeuses-gbpusd4-displacement',
    type: 'TRADE_USES_CONCEPT',
    source: 'trade-gbpusd-2025-09-26-4',
    target: 'concept-displacement',
    metadata: {
      description: 'Trade validated by displacement',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  // EURUSD trades use: fvg, displacement
  {
    id: 'rel-tradeuses-eurusd1-fvg',
    type: 'TRADE_USES_CONCEPT',
    source: 'trade-eurusd-2025-09-26-1',
    target: 'concept-fvg',
    metadata: {
      description: 'Trade identified FVG entry zone',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-tradeuses-eurusd1-displacement',
    type: 'TRADE_USES_CONCEPT',
    source: 'trade-eurusd-2025-09-26-1',
    target: 'concept-displacement',
    metadata: {
      description: 'Trade validated by displacement',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-tradeuses-eurusd2-fvg',
    type: 'TRADE_USES_CONCEPT',
    source: 'trade-eurusd-2025-09-30-1',
    target: 'concept-fvg',
    metadata: {
      description: 'Trade identified FVG entry zone',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-tradeuses-eurusd2-displacement',
    type: 'TRADE_USES_CONCEPT',
    source: 'trade-eurusd-2025-09-30-1',
    target: 'concept-displacement',
    metadata: {
      description: 'Trade validated by displacement',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-tradeuses-eurusdearly-fvg',
    type: 'TRADE_USES_CONCEPT',
    source: 'trade-eurusd-2025-09-26-early',
    target: 'concept-fvg',
    metadata: {
      description: 'Trade identified FVG entry zone',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-tradeuses-eurusdearly-displacement',
    type: 'TRADE_USES_CONCEPT',
    source: 'trade-eurusd-2025-09-26-early',
    target: 'concept-displacement',
    metadata: {
      description: 'Trade validated by displacement',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-tradeuses-eurusdearly-liquidity',
    type: 'TRADE_USES_CONCEPT',
    source: 'trade-eurusd-2025-09-26-early',
    target: 'concept-liquidity',
    metadata: {
      description: 'Trade exploited liquidity sweep',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-tradeuses-eurusdearly-orderblock',
    type: 'TRADE_USES_CONCEPT',
    source: 'trade-eurusd-2025-09-26-early',
    target: 'concept-order-block',
    metadata: {
      description: 'Trade used order block for entry',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-tradeuses-eurusdearly-killzones',
    type: 'TRADE_USES_CONCEPT',
    source: 'trade-eurusd-2025-09-26-early',
    target: 'concept-killzones',
    metadata: {
      description: 'Trade executed during London killzone',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-tradeuses-eurusdearly-ote',
    type: 'TRADE_USES_CONCEPT',
    source: 'trade-eurusd-2025-09-26-early',
    target: 'concept-ote',
    metadata: {
      description: 'Trade entered at OTE level',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-tradeuses-eurusdearly-marketstructure',
    type: 'TRADE_USES_CONCEPT',
    source: 'trade-eurusd-2025-09-26-early',
    target: 'concept-market-structure',
    metadata: {
      description: 'Trade aligned with market structure',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-tradeuses-eurusdearly-bos',
    type: 'TRADE_USES_CONCEPT',
    source: 'trade-eurusd-2025-09-26-early',
    target: 'concept-bos',
    metadata: {
      description: 'Trade confirmed by break of structure',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },

  // ===== SCHEMA_VALIDATES (3 edges) =====
  {
    id: 'rel-validates-schema-tradesignal-gbpusd1',
    type: 'SCHEMA_VALIDATES',
    source: 'schema-trade-signal',
    target: 'trade-gbpusd-2025-09-26-1',
    metadata: {
      description: 'Trade signal schema validates GBPUSD trade structure',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-validates-schema-conceptencoding-fvg',
    type: 'SCHEMA_VALIDATES',
    source: 'schema-concept-encoding',
    target: 'concept-fvg',
    metadata: {
      description: 'Schema validates FVG concept encoding',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-validates-schema-conceptencoding-orderblock',
    type: 'SCHEMA_VALIDATES',
    source: 'schema-concept-encoding',
    target: 'concept-order-block',
    metadata: {
      description: 'Schema validates order block concept encoding',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },

  // ===== DOCUMENT_DEFINES (35 edges) =====
  // document-ict-master-library → all core concepts
  {
    id: 'rel-defines-masterlibrary-marketstructure',
    type: 'DOCUMENT_DEFINES',
    source: 'document-ict-master-library',
    target: 'concept-market-structure',
    metadata: {
      description: 'Master library defines market structure concept',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-defines-masterlibrary-bos',
    type: 'DOCUMENT_DEFINES',
    source: 'document-ict-master-library',
    target: 'concept-bos',
    metadata: {
      description: 'Master library defines BOS concept',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-defines-masterlibrary-smsmss',
    type: 'DOCUMENT_DEFINES',
    source: 'document-ict-master-library',
    target: 'concept-sms-mss',
    metadata: {
      description: 'Master library defines SMS/MSS concept',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-defines-masterlibrary-choch',
    type: 'DOCUMENT_DEFINES',
    source: 'document-ict-master-library',
    target: 'concept-choch',
    metadata: {
      description: 'Master library defines CHOCH concept',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-defines-masterlibrary-fvg',
    type: 'DOCUMENT_DEFINES',
    source: 'document-ict-master-library',
    target: 'concept-fvg',
    metadata: {
      description: 'Master library defines FVG concept',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-defines-masterlibrary-orderblock',
    type: 'DOCUMENT_DEFINES',
    source: 'document-ict-master-library',
    target: 'concept-order-block',
    metadata: {
      description: 'Master library defines order block concept',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-defines-masterlibrary-displacement',
    type: 'DOCUMENT_DEFINES',
    source: 'document-ict-master-library',
    target: 'concept-displacement',
    metadata: {
      description: 'Master library defines displacement concept',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-defines-masterlibrary-liquidity',
    type: 'DOCUMENT_DEFINES',
    source: 'document-ict-master-library',
    target: 'concept-liquidity',
    metadata: {
      description: 'Master library defines liquidity concept',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-defines-masterlibrary-ote',
    type: 'DOCUMENT_DEFINES',
    source: 'document-ict-master-library',
    target: 'concept-ote',
    metadata: {
      description: 'Master library defines OTE concept',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-defines-masterlibrary-premiumdiscount',
    type: 'DOCUMENT_DEFINES',
    source: 'document-ict-master-library',
    target: 'concept-premium-discount',
    metadata: {
      description: 'Master library defines premium/discount concept',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-defines-masterlibrary-breakerblock',
    type: 'DOCUMENT_DEFINES',
    source: 'document-ict-master-library',
    target: 'concept-breaker-block',
    metadata: {
      description: 'Master library defines breaker block concept',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-defines-masterlibrary-mitigationblock',
    type: 'DOCUMENT_DEFINES',
    source: 'document-ict-master-library',
    target: 'concept-mitigation-block',
    metadata: {
      description: 'Master library defines mitigation block concept',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-defines-masterlibrary-bpr',
    type: 'DOCUMENT_DEFINES',
    source: 'document-ict-master-library',
    target: 'concept-bpr',
    metadata: {
      description: 'Master library defines BPR concept',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-defines-masterlibrary-liquidityvoid',
    type: 'DOCUMENT_DEFINES',
    source: 'document-ict-master-library',
    target: 'concept-liquidity-void',
    metadata: {
      description: 'Master library defines liquidity void concept',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-defines-masterlibrary-pdarray',
    type: 'DOCUMENT_DEFINES',
    source: 'document-ict-master-library',
    target: 'concept-pd-array',
    metadata: {
      description: 'Master library defines PD array concept',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-defines-masterlibrary-inversionfvg',
    type: 'DOCUMENT_DEFINES',
    source: 'document-ict-master-library',
    target: 'concept-inversion-fvg',
    metadata: {
      description: 'Master library defines inversion FVG concept',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-defines-masterlibrary-smt',
    type: 'DOCUMENT_DEFINES',
    source: 'document-ict-master-library',
    target: 'concept-smt',
    metadata: {
      description: 'Master library defines SMT concept',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-defines-masterlibrary-ipda',
    type: 'DOCUMENT_DEFINES',
    source: 'document-ict-master-library',
    target: 'concept-ipda',
    metadata: {
      description: 'Master library defines IPDA concept',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-defines-masterlibrary-killzones',
    type: 'DOCUMENT_DEFINES',
    source: 'document-ict-master-library',
    target: 'concept-killzones',
    metadata: {
      description: 'Master library defines killzones concept',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-defines-masterlibrary-macrotimes',
    type: 'DOCUMENT_DEFINES',
    source: 'document-ict-master-library',
    target: 'concept-macro-times',
    metadata: {
      description: 'Master library defines macro times concept',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-defines-masterlibrary-dailybias',
    type: 'DOCUMENT_DEFINES',
    source: 'document-ict-master-library',
    target: 'concept-daily-bias',
    metadata: {
      description: 'Master library defines daily bias concept',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-defines-masterlibrary-powerofthree',
    type: 'DOCUMENT_DEFINES',
    source: 'document-ict-master-library',
    target: 'concept-power-of-three',
    metadata: {
      description: 'Master library defines power of three concept',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-defines-masterlibrary-volumeimbalance',
    type: 'DOCUMENT_DEFINES',
    source: 'document-ict-master-library',
    target: 'concept-volume-imbalance',
    metadata: {
      description: 'Master library defines volume imbalance concept',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-defines-masterlibrary-rejectionblock',
    type: 'DOCUMENT_DEFINES',
    source: 'document-ict-master-library',
    target: 'concept-rejection-block',
    metadata: {
      description: 'Master library defines rejection block concept',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-defines-masterlibrary-institutionalorderflow',
    type: 'DOCUMENT_DEFINES',
    source: 'document-ict-master-library',
    target: 'concept-institutional-order-flow',
    metadata: {
      description: 'Master library defines institutional order flow concept',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  // document-concept-relationships → all models
  {
    id: 'rel-defines-conceptrelationships-silverbullet',
    type: 'DOCUMENT_DEFINES',
    source: 'document-concept-relationships',
    target: 'model-silver-bullet',
    metadata: {
      description: 'Relationships document defines Silver Bullet model',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-defines-conceptrelationships-judasswing',
    type: 'DOCUMENT_DEFINES',
    source: 'document-concept-relationships',
    target: 'model-judas-swing',
    metadata: {
      description: 'Relationships document defines Judas Swing model',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-defines-conceptrelationships-ict2022',
    type: 'DOCUMENT_DEFINES',
    source: 'document-concept-relationships',
    target: 'model-ict-2022',
    metadata: {
      description: 'Relationships document defines ICT 2022 model',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-defines-conceptrelationships-unicorn',
    type: 'DOCUMENT_DEFINES',
    source: 'document-concept-relationships',
    target: 'model-unicorn',
    metadata: {
      description: 'Relationships document defines Unicorn model',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-defines-conceptrelationships-turtlesoup',
    type: 'DOCUMENT_DEFINES',
    source: 'document-concept-relationships',
    target: 'model-turtle-soup',
    metadata: {
      description: 'Relationships document defines Turtle Soup model',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-defines-conceptrelationships-oteretracement',
    type: 'DOCUMENT_DEFINES',
    source: 'document-concept-relationships',
    target: 'model-ote-retracement',
    metadata: {
      description: 'Relationships document defines OTE Retracement model',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-defines-conceptrelationships-breakerblockreversal',
    type: 'DOCUMENT_DEFINES',
    source: 'document-concept-relationships',
    target: 'model-breaker-block-reversal',
    metadata: {
      description: 'Relationships document defines Breaker Block Reversal model',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-defines-conceptrelationships-htfltfprocess',
    type: 'DOCUMENT_DEFINES',
    source: 'document-concept-relationships',
    target: 'model-htf-ltf-process',
    metadata: {
      description: 'Relationships document defines HTF/LTF Process model',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  // document-ict-learning-system → code modules
  {
    id: 'rel-defines-learningsystem-fvgdetection',
    type: 'DOCUMENT_DEFINES',
    source: 'document-ict-learning-system',
    target: 'code-fvg-detection',
    metadata: {
      description: 'Learning system document defines FVG detection code',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-defines-learningsystem-swingdetection',
    type: 'DOCUMENT_DEFINES',
    source: 'document-ict-learning-system',
    target: 'code-swing-detection',
    metadata: {
      description: 'Learning system document defines swing detection code',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },

  // ===== CONCEPT_DETECTED_BY (4 edges) =====
  {
    id: 'rel-detected-fvg-fvgdetection',
    type: 'CONCEPT_DETECTED_BY',
    source: 'concept-fvg',
    target: 'code-fvg-detection',
    metadata: {
      description: 'FVG concept detected by FVG detection algorithm',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-detected-marketstructure-swingdetection',
    type: 'CONCEPT_DETECTED_BY',
    source: 'concept-market-structure',
    target: 'code-swing-detection',
    metadata: {
      description: 'Market structure detected by swing detection algorithm',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-detected-bos-swingdetection',
    type: 'CONCEPT_DETECTED_BY',
    source: 'concept-bos',
    target: 'code-swing-detection',
    metadata: {
      description: 'BOS detected by swing detection algorithm',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  {
    id: 'rel-detected-smsmss-swingdetection',
    type: 'CONCEPT_DETECTED_BY',
    source: 'concept-sms-mss',
    target: 'code-swing-detection',
    metadata: {
      description: 'SMS/MSS detected by swing detection algorithm',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  }
];
