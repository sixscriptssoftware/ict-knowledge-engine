// Pre-trade validation checklist from concept_relationships.yaml

export const ICT_PRE_TRADE_CHECKLIST = {
  must_have_one: [
    'liquidity_swept',
    'at_htf_poi'
  ],
  
  must_have_all: [
    'htf_bias_determined',
    'entry_zone_identified',
    'stop_loss_defined',
    'target_defined'
  ],
  
  should_have: [
    'displacement_confirmed',
    'in_killzone',
    'risk_under_1_percent'
  ],
  
  red_flags: [
    'against_htf_bias',
    'news_in_30_min',
    'already_2_trades_today',
    'revenge_trading',
    'outside_all_killzones',
    'no_clear_invalidation'
  ]
};

export interface PreTradeValidationInput {
  liquidity_swept?: boolean;
  at_htf_poi?: boolean;
  htf_bias_determined?: boolean;
  entry_zone_identified?: boolean;
  stop_loss_defined?: boolean;
  target_defined?: boolean;
  displacement_confirmed?: boolean;
  in_killzone?: boolean;
  risk_under_1_percent?: boolean;
  against_htf_bias?: boolean;
  news_in_30_min?: boolean;
  already_2_trades_today?: boolean;
  revenge_trading?: boolean;
  outside_all_killzones?: boolean;
  no_clear_invalidation?: boolean;
}

export interface PreTradeValidationResult {
  valid: boolean;
  score: number;
  missing_must_have_one: boolean;
  missing_must_have_all: string[];
  missing_should_have: string[];
  red_flags_present: string[];
  can_trade: boolean;
  warnings: string[];
  recommendation: string;
}

export function validatePreTrade(input: PreTradeValidationInput): PreTradeValidationResult {
  const result: PreTradeValidationResult = {
    valid: false,
    score: 0,
    missing_must_have_one: false,
    missing_must_have_all: [],
    missing_should_have: [],
    red_flags_present: [],
    can_trade: false,
    warnings: [],
    recommendation: ''
  };
  
  // Check must_have_one (at least one must be true)
  const hasOneRequired = 
    input.liquidity_swept === true || 
    input.at_htf_poi === true;
  
  if (!hasOneRequired) {
    result.missing_must_have_one = true;
    result.warnings.push('CRITICAL: Must have either liquidity swept OR at HTF POI');
  }
  
  // Check must_have_all (all must be true)
  for (const requirement of ICT_PRE_TRADE_CHECKLIST.must_have_all) {
    if (input[requirement] !== true) {
      result.missing_must_have_all.push(requirement);
      result.warnings.push(`REQUIRED: ${requirement.replace(/_/g, ' ')}`);
    }
  }
  
  // Check should_have (not critical but important)
  for (const item of ICT_PRE_TRADE_CHECKLIST.should_have) {
    if (input[item] !== true) {
      result.missing_should_have.push(item);
    }
  }
  
  // Check red_flags (any true is a problem)
  for (const flag of ICT_PRE_TRADE_CHECKLIST.red_flags) {
    if (input[flag] === true) {
      result.red_flags_present.push(flag);
      result.warnings.push(`RED FLAG: ${flag.replace(/_/g, ' ')}`);
    }
  }
  
  // Calculate score
  let score = 100;
  
  // Deduct for missing requirements
  if (result.missing_must_have_one) {
    score -= 50; // Critical
  }
  score -= result.missing_must_have_all.length * 15; // 15 points each
  score -= result.missing_should_have.length * 5; // 5 points each
  score -= result.red_flags_present.length * 20; // 20 points each
  
  result.score = Math.max(0, score);
  
  // Determine if can trade
  result.can_trade = 
    !result.missing_must_have_one &&
    result.missing_must_have_all.length === 0 &&
    result.red_flags_present.length === 0;
  
  result.valid = result.can_trade;
  
  // Generate recommendation
  if (result.score >= 90) {
    result.recommendation = 'EXCELLENT - All criteria met. Green light to trade.';
  } else if (result.score >= 70) {
    result.recommendation = 'GOOD - Minor items missing but trade is viable. Proceed with caution.';
  } else if (result.score >= 50) {
    result.recommendation = 'MARGINAL - Several items missing. Consider waiting for better setup.';
  } else if (result.score >= 30) {
    result.recommendation = 'POOR - Many requirements not met. High risk trade.';
  } else {
    result.recommendation = 'FAILED - Do not trade. Critical requirements missing or red flags present.';
  }
  
  return result;
}

// Helper to format validation result for display
export function formatValidationReport(result: PreTradeValidationResult): string {
  let report = `\n=== PRE-TRADE VALIDATION REPORT ===\n`;
  report += `Score: ${result.score}/100\n`;
  report += `Can Trade: ${result.can_trade ? 'YES ✓' : 'NO ✗'}\n`;
  report += `\n${result.recommendation}\n`;
  
  if (result.warnings.length > 0) {
    report += `\nWARNINGS:\n`;
    result.warnings.forEach(w => report += `  - ${w}\n`);
  }
  
  if (result.missing_should_have.length > 0) {
    report += `\nMISSING (Recommended):\n`;
    result.missing_should_have.forEach(m => report += `  - ${m.replace(/_/g, ' ')}\n`);
  }
  
  report += `\n===================================\n`;
  
  return report;
}
