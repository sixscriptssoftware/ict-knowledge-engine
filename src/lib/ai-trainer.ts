import type { Entity, Relationship } from './types';
import { useKV } from '@github/spark/hooks';

export interface TrainingPattern {
  id: string;
  type: 'success' | 'failure' | 'conditional';
  name: string;
  description: string;
  confidence: number;
  supportingTrades: Entity[];
  concepts: string[];
  models: string[];
  conditions: string[];
  recommendations: string[];
  learnedAt: string;
}

export interface TrainingInsight {
  category: 'concept_effectiveness' | 'model_performance' | 'setup_quality' | 'execution' | 'market_conditions';
  insight: string;
  evidence: string[];
  actionable: string;
  priority: 'high' | 'medium' | 'low';
}

export interface AITrainingModel {
  version: string;
  trainedAt: string;
  tradesAnalyzed: number;
  patterns: TrainingPattern[];
  insights: TrainingInsight[];
  conceptScores: Record<string, { winRate: number; sampleSize: number; avgGrade?: number }>;
  modelScores: Record<string, { winRate: number; sampleSize: number; avgGrade?: number }>;
  setupQualityFactors: Array<{ factor: string; impact: number; description: string }>;
}

export async function trainAIOnTrades(
  entities: Entity[],
  relationships: Relationship[]
): Promise<AITrainingModel> {
  const trades = entities.filter(e => e.type === 'trade');
  const concepts = entities.filter(e => e.type === 'concept');
  const models = entities.filter(e => e.type === 'model');

  if (trades.length === 0) {
    throw new Error('No trades found to train on');
  }

  const winningTrades = trades.filter(t => 
    t.metadata?.meta?.example_type === 'positive' || 
    t.metadata?.result === 'win' ||
    t.metadata?.execution?.result === 'WIN'
  );
  
  const losingTrades = trades.filter(t => 
    t.metadata?.meta?.example_type === 'negative' || 
    t.metadata?.result === 'loss' ||
    t.metadata?.execution?.result === 'LOSS'
  );

  const patterns: TrainingPattern[] = [];
  const insights: TrainingInsight[] = [];

  const successPatterns = await analyzeSuccessPatterns(winningTrades, losingTrades, relationships, entities);
  patterns.push(...successPatterns);

  const failurePatterns = await analyzeFailurePatterns(losingTrades, relationships, entities);
  patterns.push(...failurePatterns);

  const conceptScores = calculateConceptScores(trades, relationships, concepts);
  const modelScores = calculateModelScores(trades, relationships, models);

  const qualityFactors = await identifySetupQualityFactors(winningTrades, losingTrades, relationships);

  const generatedInsights = await generateTrainingInsights(
    trades,
    patterns,
    conceptScores,
    modelScores,
    qualityFactors
  );
  insights.push(...generatedInsights);

  const trainingModel: AITrainingModel = {
    version: `v1-${Date.now()}`,
    trainedAt: new Date().toISOString(),
    tradesAnalyzed: trades.length,
    patterns,
    insights,
    conceptScores,
    modelScores,
    setupQualityFactors: qualityFactors
  };

  return trainingModel;
}

async function analyzeSuccessPatterns(
  winningTrades: Entity[],
  losingTrades: Entity[],
  relationships: Relationship[],
  allEntities: Entity[]
): Promise<TrainingPattern[]> {
  const patterns: TrainingPattern[] = [];

  const winningConceptCombos = new Map<string, Entity[]>();
  
  for (const trade of winningTrades) {
    const usedConcepts = relationships
      .filter(r => r.type === 'TRADE_USES_CONCEPT' && r.sourceId === trade.id)
      .map(r => allEntities.find(e => e.id === r.targetId))
      .filter(Boolean) as Entity[];

    if (usedConcepts.length >= 2) {
      const comboKey = usedConcepts.map(c => c.name).sort().join(' + ');
      if (!winningConceptCombos.has(comboKey)) {
        winningConceptCombos.set(comboKey, []);
      }
      winningConceptCombos.get(comboKey)!.push(trade);
    }
  }

  for (const [combo, trades] of winningConceptCombos.entries()) {
    if (trades.length >= 2) {
      const concepts = combo.split(' + ');
      
      const losingWithSameConcepts = losingTrades.filter(loseTrade => {
        const loseConcepts = relationships
          .filter(r => r.type === 'TRADE_USES_CONCEPT' && r.sourceId === loseTrade.id)
          .map(r => allEntities.find(e => e.id === r.targetId))
          .filter(Boolean) as Entity[];
        
        const loseConceptNames = loseConcepts.map(c => c.name);
        return concepts.every(c => loseConceptNames.includes(c));
      });

      const winRate = trades.length / (trades.length + losingWithSameConcepts.length);

      if (winRate >= 0.6) {
        patterns.push({
          id: `success-${Date.now()}-${Math.random()}`,
          type: 'success',
          name: `High Win Rate: ${combo}`,
          description: `The combination of ${combo} has produced ${trades.length} winning trades with a ${(winRate * 100).toFixed(0)}% win rate`,
          confidence: winRate,
          supportingTrades: trades,
          concepts,
          models: [],
          conditions: extractCommonConditions(trades),
          recommendations: [
            `Prioritize setups that combine ${concepts.slice(0, 2).join(' and ')}`,
            `This pattern has proven reliable across ${trades.length} trades`,
            `Look for these concepts forming together during optimal market conditions`
          ],
          learnedAt: new Date().toISOString()
        });
      }
    }
  }

  const sessionPatterns = analyzeSessionSuccessPatterns(winningTrades, losingTrades);
  patterns.push(...sessionPatterns);

  const pairPatterns = analyzePairSuccessPatterns(winningTrades, losingTrades);
  patterns.push(...pairPatterns);

  return patterns;
}

function analyzeSessionSuccessPatterns(
  winningTrades: Entity[],
  losingTrades: Entity[]
): TrainingPattern[] {
  const patterns: TrainingPattern[] = [];
  const sessionStats = new Map<string, { wins: Entity[]; losses: Entity[] }>();

  for (const trade of winningTrades) {
    const session = trade.metadata?.time?.session || trade.metadata?.setup?.session;
    if (session) {
      if (!sessionStats.has(session)) {
        sessionStats.set(session, { wins: [], losses: [] });
      }
      sessionStats.get(session)!.wins.push(trade);
    }
  }

  for (const trade of losingTrades) {
    const session = trade.metadata?.time?.session || trade.metadata?.setup?.session;
    if (session) {
      if (!sessionStats.has(session)) {
        sessionStats.set(session, { wins: [], losses: [] });
      }
      sessionStats.get(session)!.losses.push(trade);
    }
  }

  for (const [session, stats] of sessionStats.entries()) {
    const total = stats.wins.length + stats.losses.length;
    if (total >= 3) {
      const winRate = stats.wins.length / total;
      if (winRate >= 0.7) {
        patterns.push({
          id: `session-success-${Date.now()}-${Math.random()}`,
          type: 'success',
          name: `Strong ${session} Session Performance`,
          description: `You have a ${(winRate * 100).toFixed(0)}% win rate during ${session} sessions across ${total} trades`,
          confidence: winRate,
          supportingTrades: stats.wins,
          concepts: [],
          models: [],
          conditions: [`Trades during ${session} session`],
          recommendations: [
            `Focus your trading activity on ${session} sessions where you perform best`,
            `Your edge is strongest during ${session} market conditions`,
            `Consider increasing position size during confirmed ${session} setups`
          ],
          learnedAt: new Date().toISOString()
        });
      }
    }
  }

  return patterns;
}

function analyzePairSuccessPatterns(
  winningTrades: Entity[],
  losingTrades: Entity[]
): TrainingPattern[] {
  const patterns: TrainingPattern[] = [];
  const pairStats = new Map<string, { wins: Entity[]; losses: Entity[] }>();

  for (const trade of winningTrades) {
    const pair = trade.metadata?.market?.pair;
    if (pair) {
      if (!pairStats.has(pair)) {
        pairStats.set(pair, { wins: [], losses: [] });
      }
      pairStats.get(pair)!.wins.push(trade);
    }
  }

  for (const trade of losingTrades) {
    const pair = trade.metadata?.market?.pair;
    if (pair) {
      if (!pairStats.has(pair)) {
        pairStats.set(pair, { wins: [], losses: [] });
      }
      pairStats.get(pair)!.losses.push(trade);
    }
  }

  for (const [pair, stats] of pairStats.entries()) {
    const total = stats.wins.length + stats.losses.length;
    if (total >= 3) {
      const winRate = stats.wins.length / total;
      if (winRate >= 0.7) {
        patterns.push({
          id: `pair-success-${Date.now()}-${Math.random()}`,
          type: 'success',
          name: `${pair} Excellence`,
          description: `You excel at trading ${pair} with ${(winRate * 100).toFixed(0)}% win rate over ${total} trades`,
          confidence: winRate,
          supportingTrades: stats.wins,
          concepts: [],
          models: [],
          conditions: [`Trading ${pair}`],
          recommendations: [
            `Prioritize ${pair} setups in your watchlist`,
            `You've demonstrated strong understanding of ${pair} price action`,
            `Consider specializing in ${pair} to deepen your edge`
          ],
          learnedAt: new Date().toISOString()
        });
      } else if (winRate < 0.4) {
        patterns.push({
          id: `pair-failure-${Date.now()}-${Math.random()}`,
          type: 'failure',
          name: `${pair} Weakness`,
          description: `${pair} shows only ${(winRate * 100).toFixed(0)}% win rate across ${total} trades`,
          confidence: 1 - winRate,
          supportingTrades: stats.losses,
          concepts: [],
          models: [],
          conditions: [`Trading ${pair}`],
          recommendations: [
            `Avoid or reduce exposure to ${pair} until you improve your analysis`,
            `Study ${pair} price action more deeply before taking trades`,
            `Consider paper trading ${pair} to build confidence`
          ],
          learnedAt: new Date().toISOString()
        });
      }
    }
  }

  return patterns;
}

async function analyzeFailurePatterns(
  losingTrades: Entity[],
  relationships: Relationship[],
  allEntities: Entity[]
): Promise<TrainingPattern[]> {
  const patterns: TrainingPattern[] = [];

  const failureReasons = new Map<string, Entity[]>();
  
  for (const trade of losingTrades) {
    const failureAnalysis = trade.metadata?.failure_analysis;
    if (failureAnalysis) {
      const rootCause = failureAnalysis.root_cause || 'Unknown';
      if (!failureReasons.has(rootCause)) {
        failureReasons.set(rootCause, []);
      }
      failureReasons.get(rootCause)!.push(trade);
    }
  }

  for (const [reason, trades] of failureReasons.entries()) {
    if (trades.length >= 2) {
      const usedConcepts = new Set<string>();
      const usedModels = new Set<string>();
      
      for (const trade of trades) {
        const concepts = relationships
          .filter(r => r.type === 'TRADE_USES_CONCEPT' && r.sourceId === trade.id)
          .map(r => allEntities.find(e => e.id === r.targetId))
          .filter(Boolean) as Entity[];
        
        concepts.forEach(c => usedConcepts.add(c.name));
        
        if (trade.metadata?.setup?.model) {
          usedModels.add(trade.metadata.setup.model);
        }
      }

      patterns.push({
        id: `failure-${Date.now()}-${Math.random()}`,
        type: 'failure',
        name: `Common Failure: ${reason}`,
        description: `${trades.length} trades failed due to: ${reason}`,
        confidence: trades.length / losingTrades.length,
        supportingTrades: trades,
        concepts: Array.from(usedConcepts),
        models: Array.from(usedModels),
        conditions: extractCommonConditions(trades),
        recommendations: [
          `Avoid setups when ${reason.toLowerCase()}`,
          `This failure mode has occurred in ${trades.length} trades`,
          `Implement pre-trade checklist to screen for this condition`
        ],
        learnedAt: new Date().toISOString()
      });
    }
  }

  return patterns;
}

function calculateConceptScores(
  trades: Entity[],
  relationships: Relationship[],
  concepts: Entity[]
): Record<string, { winRate: number; sampleSize: number; avgGrade?: number }> {
  const scores: Record<string, { winRate: number; sampleSize: number; avgGrade?: number }> = {};

  for (const concept of concepts) {
    const tradesUsingConcept = relationships
      .filter(r => r.type === 'TRADE_USES_CONCEPT' && r.targetId === concept.id)
      .map(r => trades.find(t => t.id === r.sourceId))
      .filter(Boolean) as Entity[];

    if (tradesUsingConcept.length > 0) {
      const wins = tradesUsingConcept.filter(t => 
        t.metadata?.meta?.example_type === 'positive' || 
        t.metadata?.result === 'win' ||
        t.metadata?.execution?.result === 'WIN'
      ).length;

      const grades = tradesUsingConcept
        .map(t => t.metadata?.grading?.total_score)
        .filter(g => typeof g === 'number') as number[];
      
      const avgGrade = grades.length > 0 
        ? grades.reduce((a, b) => a + b, 0) / grades.length 
        : undefined;

      scores[concept.name] = {
        winRate: wins / tradesUsingConcept.length,
        sampleSize: tradesUsingConcept.length,
        avgGrade
      };
    }
  }

  return scores;
}

function calculateModelScores(
  trades: Entity[],
  relationships: Relationship[],
  models: Entity[]
): Record<string, { winRate: number; sampleSize: number; avgGrade?: number }> {
  const scores: Record<string, { winRate: number; sampleSize: number; avgGrade?: number }> = {};

  for (const model of models) {
    const tradesFromModel = relationships
      .filter(r => r.type === 'MODEL_PRODUCES_TRADE' && r.sourceId === model.id)
      .map(r => trades.find(t => t.id === r.targetId))
      .filter(Boolean) as Entity[];

    if (tradesFromModel.length > 0) {
      const wins = tradesFromModel.filter(t => 
        t.metadata?.meta?.example_type === 'positive' || 
        t.metadata?.result === 'win' ||
        t.metadata?.execution?.result === 'WIN'
      ).length;

      const grades = tradesFromModel
        .map(t => t.metadata?.grading?.total_score)
        .filter(g => typeof g === 'number') as number[];
      
      const avgGrade = grades.length > 0 
        ? grades.reduce((a, b) => a + b, 0) / grades.length 
        : undefined;

      scores[model.name] = {
        winRate: wins / tradesFromModel.length,
        sampleSize: tradesFromModel.length,
        avgGrade
      };
    }
  }

  return scores;
}

async function identifySetupQualityFactors(
  winningTrades: Entity[],
  losingTrades: Entity[],
  relationships: Relationship[]
): Promise<Array<{ factor: string; impact: number; description: string }>> {
  const factors: Array<{ factor: string; impact: number; description: string }> = [];

  const winningWithConfluence = winningTrades.filter(t => {
    const conceptCount = relationships.filter(r => 
      r.type === 'TRADE_USES_CONCEPT' && r.sourceId === t.id
    ).length;
    return conceptCount >= 3;
  });

  const losingWithConfluence = losingTrades.filter(t => {
    const conceptCount = relationships.filter(r => 
      r.type === 'TRADE_USES_CONCEPT' && r.sourceId === t.id
    ).length;
    return conceptCount >= 3;
  });

  const confluenceWinRate = winningWithConfluence.length / (winningWithConfluence.length + losingWithConfluence.length || 1);
  const baselineWinRate = winningTrades.length / (winningTrades.length + losingTrades.length || 1);
  
  if (confluenceWinRate > baselineWinRate) {
    factors.push({
      factor: 'High Concept Confluence',
      impact: (confluenceWinRate - baselineWinRate) * 100,
      description: `Trades with 3+ concepts have ${(confluenceWinRate * 100).toFixed(0)}% win rate vs ${(baselineWinRate * 100).toFixed(0)}% baseline`
    });
  }

  const winningWithGrades = winningTrades.filter(t => t.metadata?.grading?.total_score);
  if (winningWithGrades.length > 0) {
    const avgWinningGrade = winningWithGrades.reduce((sum, t) => sum + (t.metadata.grading.total_score || 0), 0) / winningWithGrades.length;
    
    const losingWithGrades = losingTrades.filter(t => t.metadata?.grading?.total_score);
    const avgLosingGrade = losingWithGrades.length > 0
      ? losingWithGrades.reduce((sum, t) => sum + (t.metadata.grading.total_score || 0), 0) / losingWithGrades.length
      : 0;

    if (avgWinningGrade > avgLosingGrade + 1) {
      factors.push({
        factor: 'Setup Quality Score',
        impact: avgWinningGrade - avgLosingGrade,
        description: `Winning trades average ${avgWinningGrade.toFixed(1)}/10 vs losing trades at ${avgLosingGrade.toFixed(1)}/10`
      });
    }
  }

  const winningInOptimalTime = winningTrades.filter(t => 
    t.metadata?.time?.killzone || t.metadata?.setup?.session
  );
  if (winningInOptimalTime.length > winningTrades.length * 0.7) {
    factors.push({
      factor: 'Optimal Time Entry',
      impact: 15,
      description: `${((winningInOptimalTime.length / winningTrades.length) * 100).toFixed(0)}% of winning trades occurred during identified killzones`
    });
  }

  return factors;
}

async function generateTrainingInsights(
  trades: Entity[],
  patterns: TrainingPattern[],
  conceptScores: Record<string, any>,
  modelScores: Record<string, any>,
  qualityFactors: Array<any>
): Promise<TrainingInsight[]> {
  const insights: TrainingInsight[] = [];

  const winningTrades = trades.filter(t => 
    t.metadata?.meta?.example_type === 'positive' || 
    t.metadata?.result === 'win' ||
    t.metadata?.execution?.result === 'WIN'
  );

  const losingTrades = trades.filter(t => 
    t.metadata?.meta?.example_type === 'negative' || 
    t.metadata?.result === 'loss' ||
    t.metadata?.execution?.result === 'LOSS'
  );

  const prompt = window.spark.llmPrompt`You are an expert ICT (Inner Circle Trader) trading coach analyzing a trader's historical performance to discover personalized success patterns and failure modes.

TRADER'S DATA:
- Total trades: ${trades.length}
- Winning trades: ${winningTrades.length}
- Losing trades: ${losingTrades.length}
- Overall win rate: ${((winningTrades.length / trades.length) * 100).toFixed(1)}%

CONCEPT PERFORMANCE:
${Object.entries(conceptScores).map(([name, score]: [string, any]) => 
  `- ${name}: ${(score.winRate * 100).toFixed(0)}% win rate (${score.sampleSize} trades)${score.avgGrade ? ` - avg quality ${score.avgGrade.toFixed(1)}/10` : ''}`
).join('\n')}

MODEL PERFORMANCE:
${Object.entries(modelScores).map(([name, score]: [string, any]) => 
  `- ${name}: ${(score.winRate * 100).toFixed(0)}% win rate (${score.sampleSize} trades)${score.avgGrade ? ` - avg quality ${score.avgGrade.toFixed(1)}/10` : ''}`
).join('\n')}

DISCOVERED PATTERNS:
${patterns.map(p => 
  `- ${p.type.toUpperCase()}: ${p.name} (${(p.confidence * 100).toFixed(0)}% confidence, ${p.supportingTrades.length} trades)`
).join('\n')}

QUALITY FACTORS:
${qualityFactors.map(f => `- ${f.factor}: +${f.impact.toFixed(1)}% impact`).join('\n')}

SAMPLE WINNING TRADES:
${winningTrades.slice(0, 3).map(t => JSON.stringify({
  concepts: t.metadata?.pd_arrays || t.metadata?.concepts,
  session: t.metadata?.time?.session || t.metadata?.setup?.session,
  pair: t.metadata?.market?.pair,
  model: t.metadata?.setup?.model,
  grade: t.metadata?.grading?.total_score,
  reasoning: t.metadata?.reasoning?.why_taken
}, null, 2)).join('\n\n')}

SAMPLE LOSING TRADES:
${losingTrades.slice(0, 2).map(t => JSON.stringify({
  concepts: t.metadata?.pd_arrays || t.metadata?.concepts,
  session: t.metadata?.time?.session || t.metadata?.setup?.session,
  pair: t.metadata?.market?.pair,
  model: t.metadata?.setup?.model,
  failure_analysis: t.metadata?.failure_analysis
}, null, 2)).join('\n\n')}

Based on this trader's specific data, generate 6-8 personalized, actionable insights that will genuinely improve their trading. Focus on:
1. Their strongest performing concepts and why they work for this trader
2. Concept combinations that consistently produce wins
3. Weak areas that need improvement or avoidance
4. Time/session patterns (when they trade best)
5. Setup quality factors that matter most for their style
6. Common failure modes unique to this trader
7. Specific model recommendations based on their track record
8. Confluence patterns that increase their edge

Return a JSON object with a single "insights" property containing an array of insight objects with these fields:
- category: one of "concept_effectiveness", "model_performance", "setup_quality", "execution", "market_conditions"
- insight: a clear, specific insight statement (50-80 chars)
- evidence: array of 2-4 data points supporting this insight
- actionable: specific action the trader should take (be prescriptive, not vague)
- priority: "high", "medium", or "low" based on impact potential

Make insights highly specific to THIS trader's data. Reference actual numbers, concepts, and patterns from their trades.`;

  try {
    const response = await window.spark.llm(prompt, 'gpt-4o', true);
    const parsed = JSON.parse(response);
    
    if (parsed.insights && Array.isArray(parsed.insights)) {
      insights.push(...parsed.insights);
    }
  } catch (error) {
    console.error('AI insight generation failed, using fallback:', error);
    
    const topConcepts = Object.entries(conceptScores)
      .filter(([_, score]) => score.sampleSize >= 2)
      .sort((a, b) => b[1].winRate - a[1].winRate)
      .slice(0, 3);

    if (topConcepts.length > 0) {
      const [topName, topScore] = topConcepts[0];
      insights.push({
        category: 'concept_effectiveness',
        insight: `"${topName}" shows highest effectiveness with ${(topScore.winRate * 100).toFixed(0)}% win rate`,
        evidence: [
          `Sample size: ${topScore.sampleSize} trades`,
          topScore.avgGrade ? `Average setup quality: ${topScore.avgGrade.toFixed(1)}/10` : '',
          `Outperforms other concepts by ${((topScore.winRate - 0.5) * 100).toFixed(0)}%`
        ].filter(Boolean),
        actionable: `Prioritize identifying "${topName}" in your pre-trade analysis. Look for high-probability setups featuring this concept.`,
        priority: 'high'
      });
    }

    const weakConcepts = Object.entries(conceptScores)
      .filter(([_, score]) => score.sampleSize >= 2 && score.winRate < 0.4)
      .sort((a, b) => a[1].winRate - b[1].winRate)
      .slice(0, 2);

    if (weakConcepts.length > 0) {
      const [weakName, weakScore] = weakConcepts[0];
      insights.push({
        category: 'concept_effectiveness',
        insight: `"${weakName}" shows low effectiveness with only ${(weakScore.winRate * 100).toFixed(0)}% win rate`,
        evidence: [
          `Sample size: ${weakScore.sampleSize} trades`,
          `Below 50% win rate threshold`,
          weakScore.avgGrade ? `Lower setup quality: ${weakScore.avgGrade.toFixed(1)}/10` : ''
        ].filter(Boolean),
        actionable: `Review your identification and application of "${weakName}". Consider additional confluence factors when using this concept.`,
        priority: 'medium'
      });
    }

    const topModels = Object.entries(modelScores)
      .filter(([_, score]) => score.sampleSize >= 2)
      .sort((a, b) => b[1].winRate - a[1].winRate)
      .slice(0, 2);

    if (topModels.length > 0) {
      const [modelName, modelScore] = topModels[0];
      insights.push({
        category: 'model_performance',
        insight: `"${modelName}" model demonstrates strong performance with ${(modelScore.winRate * 100).toFixed(0)}% win rate`,
        evidence: [
          `${modelScore.sampleSize} trades executed`,
          modelScore.avgGrade ? `Average quality: ${modelScore.avgGrade.toFixed(1)}/10` : '',
          'Consistent execution across sample'
        ].filter(Boolean),
        actionable: `Focus on mastering "${modelName}" setup identification. This model aligns well with your trading style.`,
        priority: 'high'
      });
    }

    if (qualityFactors.length > 0) {
      const topFactor = qualityFactors[0];
      insights.push({
        category: 'setup_quality',
        insight: `${topFactor.factor} significantly improves outcomes`,
        evidence: [
          topFactor.description,
          `Impact: +${topFactor.impact.toFixed(1)}% improvement`
        ],
        actionable: `Always verify ${topFactor.factor.toLowerCase()} before entering trades. Make this a mandatory checkpoint in your trading plan.`,
        priority: 'high'
      });
    }

    const failurePatterns = patterns.filter(p => p.type === 'failure');
    if (failurePatterns.length > 0) {
      const mostCommonFailure = failurePatterns.sort((a, b) => 
        b.supportingTrades.length - a.supportingTrades.length
      )[0];

      insights.push({
        category: 'execution',
        insight: mostCommonFailure.name,
        evidence: [
          mostCommonFailure.description,
          `Occurred in ${mostCommonFailure.supportingTrades.length} trades`,
          `Confidence: ${(mostCommonFailure.confidence * 100).toFixed(0)}%`
        ],
        actionable: mostCommonFailure.recommendations[0],
        priority: 'high'
      });
    }
  }

  return insights;
}

function extractCommonConditions(trades: Entity[]): string[] {
  const conditions: string[] = [];
  
  const sessions = trades
    .map(t => t.metadata?.time?.session || t.metadata?.setup?.session)
    .filter(Boolean);
  
  if (sessions.length > 0) {
    const sessionCounts = sessions.reduce((acc, s) => {
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const dominantSession = Object.entries(sessionCounts)
      .sort((a, b) => b[1] - a[1])[0];
    
    if (dominantSession && dominantSession[1] >= trades.length * 0.6) {
      conditions.push(`Occurs primarily during ${dominantSession[0]} session`);
    }
  }

  const pairs = trades
    .map(t => t.metadata?.market?.pair)
    .filter(Boolean);
  
  if (pairs.length > 0) {
    const pairCounts = pairs.reduce((acc, p) => {
      acc[p] = (acc[p] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const dominantPair = Object.entries(pairCounts)
      .sort((a, b) => b[1] - a[1])[0];
    
    if (dominantPair && dominantPair[1] >= trades.length * 0.5) {
      conditions.push(`Most common on ${dominantPair[0]}`);
    }
  }

  return conditions;
}

export async function scoreTradeSetup(
  trade: Entity,
  trainingModel: AITrainingModel,
  relationships: Relationship[]
): Promise<{ score: number; feedback: string[]; warnings: string[] }> {
  let score = 5;
  const feedback: string[] = [];
  const warnings: string[] = [];

  const tradeConcepts = relationships
    .filter(r => r.type === 'TRADE_USES_CONCEPT' && r.sourceId === trade.id)
    .map(r => r.targetId);

  if (tradeConcepts.length >= 3) {
    score += 1.5;
    feedback.push('✓ Strong concept confluence (3+ concepts)');
  } else if (tradeConcepts.length < 2) {
    score -= 1;
    warnings.push('⚠ Low concept confluence - consider additional confirmation');
  }

  for (const pattern of trainingModel.patterns) {
    if (pattern.type === 'success') {
      const matchingConcepts = pattern.concepts.filter(c => 
        tradeConcepts.some(tc => tc.includes(c.toLowerCase().replace(/\s+/g, '-')))
      );
      
      if (matchingConcepts.length === pattern.concepts.length) {
        score += 2;
        feedback.push(`✓ Matches proven success pattern: ${pattern.name}`);
      }
    } else if (pattern.type === 'failure') {
      const matchingConcepts = pattern.concepts.filter(c => 
        tradeConcepts.some(tc => tc.includes(c.toLowerCase().replace(/\s+/g, '-')))
      );
      
      if (matchingConcepts.length >= pattern.concepts.length * 0.5) {
        score -= 1.5;
        warnings.push(`⚠ Similar to failure pattern: ${pattern.name}`);
      }
    }
  }

  const tradeModel = trade.metadata?.setup?.model;
  if (tradeModel && trainingModel.modelScores[tradeModel]) {
    const modelScore = trainingModel.modelScores[tradeModel];
    if (modelScore.winRate >= 0.6) {
      score += 1;
      feedback.push(`✓ Using high-performance model (${(modelScore.winRate * 100).toFixed(0)}% win rate)`);
    } else if (modelScore.winRate < 0.4) {
      score -= 1;
      warnings.push(`⚠ Model has low historical win rate (${(modelScore.winRate * 100).toFixed(0)}%)`);
    }
  }

  score = Math.max(0, Math.min(10, score));

  return { score, feedback, warnings };
}
