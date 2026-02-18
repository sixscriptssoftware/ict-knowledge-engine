// Confluence scoring system from concept_relationships.yaml

export const ICT_CONFLUENCE_WEIGHTS = {
  thresholds: {
    minimum_for_trade: 5.0,
    good_setup: 7.0,
    a_plus_setup: 9.0
  },
  
  critical: {
    displacement: 2.5,
    liquidity_sweep: 2.5,
    htf_bias_aligned: 2.0,
    killzone_aligned: 1.5
  },
  
  high: {
    fair_value_gap: 1.5,
    order_block: 1.5,
    market_structure_shift: 1.5,
    smt_divergence: 1.5,
    macro_active: 1.5
  },
  
  moderate: {
    optimal_trade_entry: 1.0,
    premium_discount_aligned: 1.0,
    breaker_block: 1.0,
    volume_imbalance: 1.0,
    rejection_block: 1.0,
    vacuum_block: 1.0,
    dealing_range_defined: 1.0,
    targeting_liquidity: 1.0
  },
  
  high_precision: {
    propulsion_block: 1.5,
    measured_move_target: 1.5
  },
  
  bonuses: {
    unicorn_setup: 2.0,
    htf_poi_alignment: 1.5,
    multi_timeframe_confluence: 1.5,
    inversion_fair_value_gap: 0.5,
    standard_deviation_projection: 0.5,
    weekly_profile_aligned: 0.5,
    consequent_encroachment_respect: 0.5
  },
  
  penalties: {
    against_htf_bias: -2.0,
    counter_trend: -2.0,
    no_liquidity_sweep: -2.0,
    no_displacement: -1.5,
    news_event_incoming: -3.0,
    outside_killzone: -1.0,
    overextended: -1.0,
    asian_session_chop: -1.0,
    low_probability_time: -2.0
  }
};

// Helper function to calculate total confluence score
export function calculateConfluenceScore(confluences: string[]): number {
  let score = 0;
  
  for (const confluence of confluences) {
    const normalizedKey = confluence.toLowerCase().replace(/ /g, '_');
    
    // Check all categories
    if (ICT_CONFLUENCE_WEIGHTS.critical[normalizedKey]) {
      score += ICT_CONFLUENCE_WEIGHTS.critical[normalizedKey];
    } else if (ICT_CONFLUENCE_WEIGHTS.high[normalizedKey]) {
      score += ICT_CONFLUENCE_WEIGHTS.high[normalizedKey];
    } else if (ICT_CONFLUENCE_WEIGHTS.moderate[normalizedKey]) {
      score += ICT_CONFLUENCE_WEIGHTS.moderate[normalizedKey];
    } else if (ICT_CONFLUENCE_WEIGHTS.high_precision[normalizedKey]) {
      score += ICT_CONFLUENCE_WEIGHTS.high_precision[normalizedKey];
    } else if (ICT_CONFLUENCE_WEIGHTS.bonuses[normalizedKey]) {
      score += ICT_CONFLUENCE_WEIGHTS.bonuses[normalizedKey];
    } else if (ICT_CONFLUENCE_WEIGHTS.penalties[normalizedKey]) {
      score += ICT_CONFLUENCE_WEIGHTS.penalties[normalizedKey];
    }
  }
  
  return score;
}

export function getScoreGrade(score: number): string {
  if (score >= ICT_CONFLUENCE_WEIGHTS.thresholds.a_plus_setup) {
    return 'A+';
  } else if (score >= ICT_CONFLUENCE_WEIGHTS.thresholds.good_setup) {
    return 'A';
  } else if (score >= ICT_CONFLUENCE_WEIGHTS.thresholds.minimum_for_trade) {
    return 'B';
  } else {
    return 'F';
  }
}
