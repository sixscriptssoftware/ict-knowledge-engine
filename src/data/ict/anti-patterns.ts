// Anti-patterns from concept_relationships.yaml

export const ICT_ANTI_PATTERNS = [
  {
    name: 'fvg_without_displacement',
    description: 'Trading a gap that formed inside a range/chop.',
    why_fails: 'No institutional sponsorship.',
    fix: 'Wait for a candle that closes outside the range.',
    severity: 'high',
    penalty: -1.5
  },
  {
    name: 'entry_before_liquidity_sweep',
    description: 'Entering on the first move before a stop hunt.',
    why_fails: 'You become the liquidity.',
    symptom: 'Stopped out right before the move',
    fix: 'Wait for a raid of an old high/low first.',
    severity: 'critical',
    penalty: -2.0
  },
  {
    name: 'chasing_expansion',
    description: 'Entering after price has already moved > 3SD.',
    why_fails: 'Buying the top / Selling the bottom.',
    fix: 'Wait for retracement to OTE.',
    severity: 'high',
    penalty: -1.5
  },
  {
    name: 'chasing_after_displacement',
    description: 'Entering immediately after big move instead of waiting for pullback',
    why_fails: 'Bad R:R, often enter at worst price',
    fix: 'Wait for retracement to FVG/OB/OTE',
    severity: 'high',
    penalty: -1.5
  },
  {
    name: 'forcing_trades_in_lunch',
    description: 'Trading between 12:00-13:00 NY.',
    why_fails: 'Algo is in seek-and-destroy mode.',
    fix: 'Wait for 13:30 Macro.',
    severity: 'high',
    penalty: -2.0
  },
  {
    name: 'trading_against_htf',
    description: 'Taking LTF signals against higher timeframe bias',
    why_fails: 'Swimming upstream — occasional wins, consistent losses',
    fix: 'Only take LTF signals in direction of HTF bias',
    severity: 'critical',
    penalty: -2.0
  },
  {
    name: 'multiple_stacked_fvgs',
    description: '3+ FVGs stacked in same direction',
    why_fails: 'Price tends to fill imbalances, will likely retrace through all',
    fix: 'Wait for consolidation or skip the setup',
    severity: 'moderate',
    penalty: -1.0
  },
  {
    name: 'equal_highs_lows_untapped',
    description: 'Taking a trade when obvious liquidity hasn\'t been swept',
    why_fails: 'Price will hunt that liquidity first',
    fix: 'Wait for the sweep or target the liquidity as your TP',
    severity: 'high',
    penalty: -2.0
  },
  {
    name: 'revenge_trading',
    description: 'Entering immediately after a loss',
    why_fails: 'Emotional state leads to poor decisions',
    fix: 'Mandatory 30-min break after any loss',
    severity: 'critical',
    penalty: -3.0
  },
  {
    name: 'overtrading_sessions',
    description: 'More than 2-3 trades per session',
    why_fails: 'Quality setups are rare, forcing trades = losses',
    fix: 'Max 2 trades per session, then walk away',
    severity: 'moderate',
    penalty: -1.0
  }
];

// Helper function to check for anti-patterns
export function checkAntiPatterns(setup: {
  has_displacement?: boolean;
  liquidity_swept?: boolean;
  htf_bias?: string;
  ltf_direction?: string;
  in_killzone?: boolean;
  time_hour?: number;
  fvg_count_same_direction?: number;
  untapped_liquidity_nearby?: boolean;
  after_loss?: boolean;
  trades_today?: number;
}): { violations: string[]; total_penalty: number } {
  const violations: string[] = [];
  let totalPenalty = 0;
  
  // Check for no displacement
  if (setup.has_displacement === false) {
    violations.push('fvg_without_displacement');
    totalPenalty += -1.5;
  }
  
  // Check for no liquidity sweep
  if (setup.liquidity_swept === false) {
    violations.push('entry_before_liquidity_sweep');
    totalPenalty += -2.0;
  }
  
  // Check for HTF vs LTF mismatch
  if (setup.htf_bias && setup.ltf_direction && setup.htf_bias !== setup.ltf_direction) {
    violations.push('trading_against_htf');
    totalPenalty += -2.0;
  }
  
  // Check for lunch hour trading
  if (setup.time_hour && setup.time_hour >= 12 && setup.time_hour < 13) {
    violations.push('forcing_trades_in_lunch');
    totalPenalty += -2.0;
  }
  
  // Check for outside killzone
  if (setup.in_killzone === false) {
    violations.push('outside_killzone');
    totalPenalty += -1.0;
  }
  
  // Check for stacked FVGs
  if (setup.fvg_count_same_direction && setup.fvg_count_same_direction >= 3) {
    violations.push('multiple_stacked_fvgs');
    totalPenalty += -1.0;
  }
  
  // Check for untapped liquidity
  if (setup.untapped_liquidity_nearby === true) {
    violations.push('equal_highs_lows_untapped');
    totalPenalty += -2.0;
  }
  
  // Check for revenge trading
  if (setup.after_loss === true) {
    violations.push('revenge_trading');
    totalPenalty += -3.0;
  }
  
  // Check for overtrading
  if (setup.trades_today && setup.trades_today >= 3) {
    violations.push('overtrading_sessions');
    totalPenalty += -1.0;
  }
  
  return { violations, total_penalty: totalPenalty };
}

// Helper function to get anti-pattern details
export function getAntiPatternDetails(patternName: string) {
  return ICT_ANTI_PATTERNS.find(p => p.name === patternName);
}
