import { useState, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Brain, TrendUp, TrendDown, CheckCircle, Warning, Sparkle, Target } from '@phosphor-icons/react';
import { toast } from 'sonner';
import type { Entity, Relationship } from '@/lib/types';
import {
  trainAIOnTrades,
  type AITrainingModel,
  type TrainingPattern,
  type TrainingInsight
} from '@/lib/ai-trainer';

interface TrainingViewProps {
  entities: Entity[];
  relationships: Relationship[];
  onEntitySelect: (entity: Entity) => void;
}

export function TrainingView({ entities, relationships, onEntitySelect }: TrainingViewProps) {
  const [trainingModel, setTrainingModel] = useKV<AITrainingModel | null>('ai-training-model', null);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);

  const trades = entities.filter(e => e.type === 'trade');
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

  const runTraining = async () => {
    if (trades.length === 0) {
      toast.error('No trades available to train on');
      return;
    }

    setIsTraining(true);
    setTrainingProgress(10);

    try {
      toast.info('Training AI on your trading data...', {
        description: `Analyzing ${trades.length} trades`
      });

      setTrainingProgress(30);
      const model = await trainAIOnTrades(entities, relationships);
      setTrainingProgress(80);

      setTrainingModel(model);
      setTrainingProgress(100);

      toast.success('AI training complete!', {
        description: `Learned ${model.patterns.length} patterns and generated ${model.insights.length} insights`
      });
    } catch (error) {
      console.error('Training error:', error);
      toast.error('Training failed', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsTraining(false);
      setTimeout(() => setTrainingProgress(0), 1000);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-warning';
      case 'low': return 'text-muted-foreground';
      default: return 'text-foreground';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'concept_effectiveness': return <Target size={20} className="text-primary" />;
      case 'model_performance': return <Sparkle size={20} className="text-accent" />;
      case 'setup_quality': return <CheckCircle size={20} className="text-primary" />;
      case 'execution': return <TrendUp size={20} className="text-warning" />;
      default: return <Brain size={20} className="text-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-3">
            <Brain size={32} className="text-primary" />
            AI Training Center
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Train AI on your specific trading data to get personalized insights
          </p>
        </div>
        
        <Button
          onClick={runTraining}
          disabled={isTraining || trades.length === 0}
          className="gap-2"
          size="lg"
        >
          <Sparkle size={20} />
          {isTraining ? 'Training...' : trainingModel ? 'Retrain Model' : 'Train AI Model'}
        </Button>
      </div>

      {isTraining && (
        <Card className="p-6 bg-card/50">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Training in progress...</span>
              <span className="font-mono text-primary">{trainingProgress}%</span>
            </div>
            <Progress value={trainingProgress} className="h-2" />
          </div>
        </Card>
      )}

      {trades.length === 0 && !isTraining && (
        <Card className="p-12 text-center bg-card/30">
          <Brain size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium mb-2">No Trading Data</h3>
          <p className="text-sm text-muted-foreground">
            Upload trade data or load demo data to begin AI training
          </p>
        </Card>
      )}

      {trades.length > 0 && !trainingModel && !isTraining && (
        <Card className="p-12 text-center bg-card/30">
          <Brain size={48} className="mx-auto mb-4 text-accent opacity-70" />
          <h3 className="text-lg font-medium mb-2">Ready to Train</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {trades.length} trades available ({winningTrades.length} wins, {losingTrades.length} losses)
          </p>
          <Button onClick={runTraining} className="gap-2" size="lg">
            <Sparkle size={20} />
            Start Training
          </Button>
        </Card>
      )}

      {trainingModel && (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="insights">Insights ({trainingModel.insights.length})</TabsTrigger>
            <TabsTrigger value="patterns">Patterns ({trainingModel.patterns.length})</TabsTrigger>
            <TabsTrigger value="concepts">Concept Scores</TabsTrigger>
            <TabsTrigger value="models">Model Performance</TabsTrigger>
            <TabsTrigger value="quality">Quality Factors</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-6 bg-card/50">
                <div className="flex items-center gap-3 mb-2">
                  <Brain size={24} className="text-primary" />
                  <h3 className="font-semibold">Model Version</h3>
                </div>
                <p className="text-2xl font-bold mb-1">{trainingModel.version}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(trainingModel.trainedAt).toLocaleDateString()}
                </p>
              </Card>

              <Card className="p-6 bg-card/50">
                <div className="flex items-center gap-3 mb-2">
                  <TrendUp size={24} className="text-accent" />
                  <h3 className="font-semibold">Trades Analyzed</h3>
                </div>
                <p className="text-2xl font-bold mb-1">{trainingModel.tradesAnalyzed}</p>
                <p className="text-xs text-muted-foreground">
                  {winningTrades.length}W / {losingTrades.length}L ({((winningTrades.length / trades.length) * 100).toFixed(0)}%)
                </p>
              </Card>

              <Card className="p-6 bg-card/50">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkle size={24} className="text-primary" />
                  <h3 className="font-semibold">Patterns Learned</h3>
                </div>
                <p className="text-2xl font-bold mb-1">{trainingModel.patterns.length}</p>
                <p className="text-xs text-muted-foreground">
                  {trainingModel.patterns.filter(p => p.type === 'success').length} success, {trainingModel.patterns.filter(p => p.type === 'failure').length} failure
                </p>
              </Card>

              <Card className="p-6 bg-card/50">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle size={24} className="text-accent" />
                  <h3 className="font-semibold">Insights Generated</h3>
                </div>
                <p className="text-2xl font-bold mb-1">{trainingModel.insights.length}</p>
                <p className="text-xs text-muted-foreground">
                  {trainingModel.insights.filter(i => i.priority === 'high').length} high priority
                </p>
              </Card>
            </div>

            <Card className="p-6 bg-card/30">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Target size={20} className="text-primary" />
                Your Trading Profile
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Best Performing Concepts</h4>
                    <div className="space-y-2">
                      {Object.entries(trainingModel.conceptScores)
                        .filter(([_, score]) => score.sampleSize >= 2)
                        .sort((a, b) => b[1].winRate - a[1].winRate)
                        .slice(0, 3)
                        .map(([name, score], idx) => (
                          <div key={name} className="flex items-center justify-between">
                            <span className="text-sm flex items-center gap-2">
                              <span className="text-primary font-bold">#{idx + 1}</span>
                              {name}
                            </span>
                            <Badge variant="default" className="text-xs">
                              {(score.winRate * 100).toFixed(0)}%
                            </Badge>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Best Performing Models</h4>
                    <div className="space-y-2">
                      {Object.entries(trainingModel.modelScores)
                        .filter(([_, score]) => score.sampleSize >= 2)
                        .sort((a, b) => b[1].winRate - a[1].winRate)
                        .slice(0, 3)
                        .map(([name, score], idx) => (
                          <div key={name} className="flex items-center justify-between">
                            <span className="text-sm flex items-center gap-2">
                              <span className="text-primary font-bold">#{idx + 1}</span>
                              {name}
                            </span>
                            <Badge variant="default" className="text-xs">
                              {(score.winRate * 100).toFixed(0)}%
                            </Badge>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Areas for Improvement</h4>
                    <div className="space-y-2">
                      {Object.entries(trainingModel.conceptScores)
                        .filter(([_, score]) => score.sampleSize >= 2 && score.winRate < 0.5)
                        .sort((a, b) => a[1].winRate - b[1].winRate)
                        .slice(0, 3)
                        .map(([name, score]) => (
                          <div key={name} className="flex items-center justify-between">
                            <span className="text-sm flex items-center gap-2">
                              <Warning size={16} className="text-warning" />
                              {name}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {(score.winRate * 100).toFixed(0)}%
                            </Badge>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Key Success Factors</h4>
                    <div className="space-y-2">
                      {trainingModel.setupQualityFactors.slice(0, 3).map((factor, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle size={16} className="text-primary mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{factor.factor}</p>
                            <p className="text-xs text-muted-foreground">+{factor.impact.toFixed(1)}% impact</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card/30">
              <h3 className="font-semibold mb-4">Training Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle size={20} className="text-primary mt-0.5 flex-shrink-0" />
                  <p>
                    Analyzed {trainingModel.tradesAnalyzed} trades to identify patterns and correlations unique to your trading style
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={20} className="text-primary mt-0.5 flex-shrink-0" />
                  <p>
                    Calculated win rates for {Object.keys(trainingModel.conceptScores).length} concepts and {Object.keys(trainingModel.modelScores).length} models based on YOUR historical performance
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={20} className="text-primary mt-0.5 flex-shrink-0" />
                  <p>
                    Identified {trainingModel.setupQualityFactors.length} key factors that specifically improve YOUR setup quality
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={20} className="text-primary mt-0.5 flex-shrink-0" />
                  <p>
                    Generated {trainingModel.insights.filter(i => i.priority === 'high').length} high-priority personalized insights tailored to your strengths and weaknesses
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              AI-generated insights based on your actual trading performance and patterns.
            </p>
            <ScrollArea className="h-[600px]">
              <div className="space-y-3">
                {trainingModel.insights
                  .sort((a, b) => {
                    const priorityOrder = { high: 0, medium: 1, low: 2 };
                    return priorityOrder[a.priority] - priorityOrder[b.priority];
                  })
                  .map((insight, idx) => (
                    <Card key={idx} className="p-5 bg-card/50">
                      <div className="flex items-start gap-3">
                        {getCategoryIcon(insight.category)}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline" className="text-xs">
                              {insight.category.replace(/_/g, ' ')}
                            </Badge>
                            <Badge
                              variant={insight.priority === 'high' ? 'destructive' : 'outline'}
                              className="text-xs"
                            >
                              {insight.priority} priority
                            </Badge>
                          </div>
                          
                          <h4 className="font-medium mb-2">{insight.insight}</h4>
                          
                          <div className="space-y-2 mb-3">
                            <p className="text-xs text-muted-foreground font-semibold">Evidence:</p>
                            {insight.evidence.map((ev, i) => (
                              <div key={i} className="flex items-start gap-2 text-sm">
                                <span className="text-primary mt-1">•</span>
                                <span className="text-foreground/80">{ev}</span>
                              </div>
                            ))}
                          </div>

                          <div className="p-3 bg-accent/10 border border-accent/20 rounded-md">
                            <p className="text-xs font-semibold text-accent mb-1">Action Item:</p>
                            <p className="text-sm text-foreground">{insight.actionable}</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="patterns" className="space-y-4">
            <div className="flex gap-2">
              <Badge variant="outline" className="gap-1">
                <TrendUp size={14} />
                {trainingModel.patterns.filter(p => p.type === 'success').length} Success
              </Badge>
              <Badge variant="outline" className="gap-1">
                <TrendDown size={14} />
                {trainingModel.patterns.filter(p => p.type === 'failure').length} Failure
              </Badge>
            </div>
            
            <ScrollArea className="h-[600px]">
              <div className="space-y-3">
                {trainingModel.patterns
                  .sort((a, b) => b.confidence - a.confidence)
                  .map((pattern) => (
                    <Card key={pattern.id} className="p-5 bg-card/50">
                      <div className="flex items-start gap-3">
                        {pattern.type === 'success' ? (
                          <TrendUp size={24} className="text-primary flex-shrink-0" />
                        ) : (
                          <TrendDown size={24} className="text-destructive flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">{pattern.name}</h4>
                            <Badge variant="outline" className="text-xs font-mono">
                              {(pattern.confidence * 100).toFixed(0)}% confidence
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3">
                            {pattern.description}
                          </p>

                          {pattern.concepts.length > 0 && (
                            <div className="mb-3">
                              <p className="text-xs text-muted-foreground mb-2">Concepts involved:</p>
                              <div className="flex flex-wrap gap-2">
                                {pattern.concepts.map((concept, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    {concept}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {pattern.conditions.length > 0 && (
                            <div className="mb-3">
                              <p className="text-xs text-muted-foreground mb-2">Common conditions:</p>
                              <div className="space-y-1">
                                {pattern.conditions.map((condition, i) => (
                                  <div key={i} className="flex items-start gap-2 text-sm">
                                    <span className="text-accent mt-0.5">→</span>
                                    <span className="text-foreground/80">{condition}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="space-y-2">
                            <p className="text-xs text-muted-foreground font-semibold">Recommendations:</p>
                            {pattern.recommendations.map((rec, i) => (
                              <div key={i} className="flex items-start gap-2 text-sm">
                                <CheckCircle size={16} className="text-primary mt-0.5 flex-shrink-0" />
                                <span className="text-foreground/90">{rec}</span>
                              </div>
                            ))}
                          </div>

                          <div className="mt-3 pt-3 border-t border-border/50">
                            <p className="text-xs text-muted-foreground">
                              Based on {pattern.supportingTrades.length} trade{pattern.supportingTrades.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="concepts" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Win rates and performance metrics for each concept based on your trades.
            </p>
            <ScrollArea className="h-[600px]">
              <div className="space-y-3">
                {Object.entries(trainingModel.conceptScores)
                  .sort((a, b) => b[1].winRate - a[1].winRate)
                  .map(([conceptName, score]) => (
                    <Card key={conceptName} className="p-5 bg-card/50">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{conceptName}</h4>
                        <Badge
                          variant={score.winRate >= 0.6 ? 'default' : score.winRate >= 0.4 ? 'outline' : 'destructive'}
                          className="font-mono"
                        >
                          {(score.winRate * 100).toFixed(0)}% win rate
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground text-xs">Sample Size</p>
                          <p className="font-semibold">{score.sampleSize} trades</p>
                        </div>
                        {score.avgGrade && (
                          <div>
                            <p className="text-muted-foreground text-xs">Avg Quality</p>
                            <p className="font-semibold">{score.avgGrade.toFixed(1)}/10</p>
                          </div>
                        )}
                        <div>
                          <p className="text-muted-foreground text-xs">Status</p>
                          <p className="font-semibold">
                            {score.winRate >= 0.6 ? '✓ Strong' : score.winRate >= 0.4 ? '→ Average' : '⚠ Weak'}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3">
                        <Progress value={score.winRate * 100} className="h-2" />
                      </div>
                    </Card>
                  ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="models" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Performance analysis of your trading models based on historical results.
            </p>
            <ScrollArea className="h-[600px]">
              <div className="space-y-3">
                {Object.entries(trainingModel.modelScores)
                  .sort((a, b) => b[1].winRate - a[1].winRate)
                  .map(([modelName, score]) => (
                    <Card key={modelName} className="p-5 bg-card/50">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{modelName}</h4>
                        <Badge
                          variant={score.winRate >= 0.6 ? 'default' : score.winRate >= 0.4 ? 'outline' : 'destructive'}
                          className="font-mono"
                        >
                          {(score.winRate * 100).toFixed(0)}% win rate
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground text-xs">Sample Size</p>
                          <p className="font-semibold">{score.sampleSize} trades</p>
                        </div>
                        {score.avgGrade && (
                          <div>
                            <p className="text-muted-foreground text-xs">Avg Quality</p>
                            <p className="font-semibold">{score.avgGrade.toFixed(1)}/10</p>
                          </div>
                        )}
                        <div>
                          <p className="text-muted-foreground text-xs">Performance</p>
                          <p className="font-semibold">
                            {score.winRate >= 0.6 ? '🔥 Excellent' : score.winRate >= 0.4 ? '→ Neutral' : '⚠ Poor'}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3">
                        <Progress value={score.winRate * 100} className="h-2" />
                      </div>
                    </Card>
                  ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="quality" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Key factors that improve setup quality and trade outcomes.
            </p>
            <div className="space-y-3">
              {trainingModel.setupQualityFactors.map((factor, idx) => (
                <Card key={idx} className="p-6 bg-card/50">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Sparkle size={24} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{factor.factor}</h4>
                        <Badge variant="default" className="font-mono">
                          +{factor.impact.toFixed(1)}% impact
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground/80">
                        {factor.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}

              {trainingModel.setupQualityFactors.length === 0 && (
                <Card className="p-8 text-center bg-card/30">
                  <p className="text-muted-foreground">
                    Need more trade data to identify quality factors
                  </p>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
