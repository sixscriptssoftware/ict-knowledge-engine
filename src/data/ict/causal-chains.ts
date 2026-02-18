// Causal chains from concept_relationships.yaml

export const ICT_CAUSAL_CHAINS = {
  reversal_sequence: {
    description: 'The required order for reversal entries',
    steps: [
      {
        step: 1,
        concept: 'liquidity_sweep',
        signal: 'Liquidity taken (BSL/SSL)',
        required: true
      },
      {
        step: 2,
        concept: 'displacement',
        signal: 'Strong momentum candle away from sweep',
        required: true
      },
      {
        step: 3,
        concept: 'fvg_or_ob',
        signal: 'Imbalance or order block forms',
        required: true
      },
      {
        step: 4,
        concept: 'retracement',
        signal: 'Price returns to FVG/OB',
        required: true
      },
      {
        step: 5,
        concept: 'entry',
        signal: 'Enter in zone with SL beyond sweep',
        required: true
      }
    ],
    failure_at_step: {
      1: 'No liquidity = no fuel for move, skip this setup',
      2: 'No displacement = weak hands, likely to fail',
      3: 'No FVG/OB = no clear entry zone',
      4: 'No retracement = chasing, bad R:R'
    }
  },
  
  power_of_3: {
    description: 'Accumulation -> Manipulation -> Distribution within a session',
    steps: [
      {
        step: 1,
        phase: 'accumulation',
        time: 'Asian session / early London',
        action: 'Range forms, liquidity builds',
        duration: '4-8 hours'
      },
      {
        step: 2,
        phase: 'manipulation',
        time: 'London open / NY open',
        action: 'False breakout, sweeps liquidity',
        duration: '1-2 hours'
      },
      {
        step: 3,
        phase: 'distribution',
        time: 'Mid-session',
        action: 'True move in opposite direction',
        duration: '2-4 hours'
      }
    ],
    key_insight: 'The manipulation IS the entry signal — it sweeps liquidity'
  },
  
  htf_to_ltf: {
    description: 'Always align with higher timeframe bias',
    steps: [
      {
        step: 1,
        action: 'Determine HTF bias',
        timeframes: ['Daily', '4H'],
        lookfor: 'Market structure, order flow direction'
      },
      {
        step: 2,
        action: 'Identify HTF POI',
        concepts: ['fvg', 'order_block', 'liquidity'],
        lookfor: 'Key price levels to react from'
      },
      {
        step: 3,
        action: 'Wait for price at HTF POI',
        patience: 'critical',
        lookfor: 'Price reaching your HTF level'
      },
      {
        step: 4,
        action: 'Drop to LTF for entry',
        timeframes: ['15m', '5m', '1m'],
        lookfor: 'Lower timeframe confirmation'
      },
      {
        step: 5,
        action: 'Find LTF confirmation',
        concepts: ['displacement', 'bos', 'fvg'],
        lookfor: 'Entry trigger on lower timeframe'
      }
    ],
    failure_mode: 'Trading LTF without HTF context = gambling'
  }
};

// Helper function to validate if all steps in a chain are present
export function validateCausalChain(
  chainName: 'reversal_sequence' | 'power_of_3' | 'htf_to_ltf',
  completedSteps: number[]
): { valid: boolean; missing_steps: number[]; failure_message?: string } {
  const chain = ICT_CAUSAL_CHAINS[chainName];
  const totalSteps = chain.steps.length;
  const missing: number[] = [];
  
  for (let i = 1; i <= totalSteps; i++) {
    if (!completedSteps.includes(i)) {
      missing.push(i);
    }
  }
  
  const valid = missing.length === 0;
  let failure_message: string | undefined;
  
  if (!valid && chainName === 'reversal_sequence') {
    const firstMissing = missing[0];
    failure_message = chain.failure_at_step[firstMissing];
  } else if (!valid && chainName === 'htf_to_ltf') {
    failure_message = chain.failure_mode;
  }
  
  return { valid, missing_steps: missing, failure_message };
}

// Helper function to get next step in chain
export function getNextStep(
  chainName: 'reversal_sequence' | 'power_of_3' | 'htf_to_ltf',
  currentStep: number
) {
  const chain = ICT_CAUSAL_CHAINS[chainName];
  const nextStepNum = currentStep + 1;
  
  if (nextStepNum > chain.steps.length) {
    return null; // Chain complete
  }
  
  return chain.steps.find(s => s.step === nextStepNum);
}
