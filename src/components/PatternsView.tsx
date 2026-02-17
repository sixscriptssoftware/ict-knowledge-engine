import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, CirclesFour, TrendUp, GitBranch, Sparkle } from '@phosphor-icons/react';
import type { Entity, Relationship } from '@/lib/types';
import { 
  analyzeRelationshipPatterns, 
  analyzeConceptPatterns, 
  generatePatternInsights,
  type RelationshipPattern,
  type ConceptPattern 
} from '@/lib/relationship-analyzer';
import { marked } from 'marked';

interface PatternsViewProps {
  entities: Entity[];
  relationships: Relationship[];
  onEntitySelect: (entity: Entity) => void;
}

export function PatternsView({ entities, relationships, onEntitySelect }: PatternsViewProps) {
  const [patterns, setPatterns] = useState<RelationshipPattern[]>([]);
  const [conceptPatterns, setConceptPatterns] = useState<ConceptPattern[]>([]);
  const [aiInsights, setAiInsights] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);

  useEffect(() => {
    if (entities.length > 0 && relationships.length > 0) {
      runAnalysis();
    }
  }, [entities.length, relationships.length]);

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const [relationshipPatterns, conceptPatternsData] = await Promise.all([
        analyzeRelationshipPatterns(entities, relationships),
        analyzeConceptPatterns(entities, relationships)
      ]);
      setPatterns(relationshipPatterns);
      setConceptPatterns(conceptPatternsData);
    } catch (error) {
      console.error('Error analyzing patterns:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateInsights = async () => {
    if (patterns.length === 0 && conceptPatterns.length === 0) return;
    
    setIsGeneratingInsights(true);
    try {
      const insights = await generatePatternInsights(patterns, conceptPatterns);
      setAiInsights(insights);
    } catch (error) {
      console.error('Error generating insights:', error);
      setAiInsights('Failed to generate AI insights. Please try again.');
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  const getPatternIcon = (type: RelationshipPattern['type']) => {
    switch (type) {
      case 'chain': return <TrendUp size={20} className="text-primary" />;
      case 'hub': return <CirclesFour size={20} className="text-accent" />;
      case 'cluster': return <CirclesFour size={20} className="text-secondary" />;
      case 'bridge': return <GitBranch size={20} className="text-warning" />;
    }
  };

  const getPatternColor = (type: RelationshipPattern['type']) => {
    switch (type) {
      case 'chain': return 'oklch(0.75 0.2 145)';
      case 'hub': return 'oklch(0.7 0.15 195)';
      case 'cluster': return 'oklch(0.65 0.1 264)';
      case 'bridge': return 'oklch(0.7 0.15 75)';
    }
  };

  const chains = patterns.filter(p => p.type === 'chain');
  const hubs = patterns.filter(p => p.type === 'hub');
  const clusters = patterns.filter(p => p.type === 'cluster');
  const bridges = patterns.filter(p => p.type === 'bridge');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-3">
            <Brain size={32} className="text-accent" />
            AI Pattern Analysis
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Discover hidden relationships and insights in your ICT knowledge base
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={runAnalysis}
            disabled={isAnalyzing || entities.length === 0}
            className="gap-2"
          >
            <Sparkle size={16} />
            {isAnalyzing ? 'Analyzing...' : 'Reanalyze Patterns'}
          </Button>
          
          <Button
            onClick={generateInsights}
            disabled={isGeneratingInsights || patterns.length === 0}
            className="gap-2"
          >
            <Brain size={16} />
            {isGeneratingInsights ? 'Generating...' : 'Generate AI Insights'}
          </Button>
        </div>
      </div>

      {entities.length === 0 && (
        <Card className="p-12 text-center bg-card/30">
          <Brain size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium mb-2">No Data to Analyze</h3>
          <p className="text-sm text-muted-foreground">
            Load demo data or upload files to begin pattern analysis
          </p>
        </Card>
      )}

      {entities.length > 0 && (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="chains">Chains ({chains.length})</TabsTrigger>
            <TabsTrigger value="hubs">Hubs ({hubs.length})</TabsTrigger>
            <TabsTrigger value="clusters">Clusters ({clusters.length})</TabsTrigger>
            <TabsTrigger value="bridges">Bridges ({bridges.length})</TabsTrigger>
            <TabsTrigger value="concepts">Concept Usage</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-6 bg-card/50">
                <div className="flex items-center gap-3 mb-2">
                  {getPatternIcon('chain')}
                  <h3 className="font-semibold">Connection Chains</h3>
                </div>
                <p className="text-3xl font-bold mb-1">{chains.length}</p>
                <p className="text-xs text-muted-foreground">
                  Concept → Model → Trade paths
                </p>
              </Card>

              <Card className="p-6 bg-card/50">
                <div className="flex items-center gap-3 mb-2">
                  {getPatternIcon('hub')}
                  <h3 className="font-semibold">Hub Entities</h3>
                </div>
                <p className="text-3xl font-bold mb-1">{hubs.length}</p>
                <p className="text-xs text-muted-foreground">
                  Highly connected central nodes
                </p>
              </Card>

              <Card className="p-6 bg-card/50">
                <div className="flex items-center gap-3 mb-2">
                  {getPatternIcon('cluster')}
                  <h3 className="font-semibold">Knowledge Clusters</h3>
                </div>
                <p className="text-3xl font-bold mb-1">{clusters.length}</p>
                <p className="text-xs text-muted-foreground">
                  Tightly grouped related entities
                </p>
              </Card>

              <Card className="p-6 bg-card/50">
                <div className="flex items-center gap-3 mb-2">
                  {getPatternIcon('bridge')}
                  <h3 className="font-semibold">Bridge Entities</h3>
                </div>
                <p className="text-3xl font-bold mb-1">{bridges.length}</p>
                <p className="text-xs text-muted-foreground">
                  Critical connection points
                </p>
              </Card>
            </div>

            <Card className="p-6 bg-card/30">
              <h3 className="font-semibold mb-4">Top Patterns by Strength</h3>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {patterns
                    .sort((a, b) => b.strength - a.strength)
                    .slice(0, 10)
                    .map((pattern) => (
                      <Card key={pattern.id} className="p-4 bg-card hover:bg-card/80 transition-colors">
                        <div className="flex items-start gap-3">
                          {getPatternIcon(pattern.type)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{pattern.name}</h4>
                              <Badge variant="outline" className="text-xs">
                                {pattern.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {pattern.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{pattern.entities.length} entities</span>
                              <span>{pattern.relationships.length} connections</span>
                              <div className="flex items-center gap-1">
                                <div 
                                  className="h-2 w-20 bg-muted rounded-full overflow-hidden"
                                >
                                  <div 
                                    className="h-full"
                                    style={{
                                      width: `${Math.min(pattern.strength * 100, 100)}%`,
                                      backgroundColor: getPatternColor(pattern.type)
                                    }}
                                  />
                                </div>
                                <span className="font-mono">
                                  {(pattern.strength * 100).toFixed(0)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              </ScrollArea>
            </Card>
          </TabsContent>

          <TabsContent value="chains" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Connection chains show how concepts flow through models to produce trades.
            </p>
            <ScrollArea className="h-[600px]">
              <div className="space-y-3">
                {chains.map((pattern) => (
                  <Card key={pattern.id} className="p-5 bg-card/50">
                    <div className="flex items-start gap-3 mb-3">
                      {getPatternIcon('chain')}
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{pattern.name}</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          {pattern.description}
                        </p>
                        
                        <div className="space-y-2">
                          {pattern.insights.map((insight, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-sm">
                              <span className="text-primary mt-0.5">•</span>
                              <span className="text-foreground/80">{insight}</span>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 pt-4 border-t border-border/50">
                          <p className="text-xs text-muted-foreground mb-2">Entities in chain:</p>
                          <div className="flex flex-wrap gap-2">
                            {pattern.entities.map((entity) => (
                              <Badge
                                key={entity.id}
                                variant="outline"
                                className="cursor-pointer hover:bg-accent transition-colors"
                                onClick={() => onEntitySelect(entity)}
                              >
                                {entity.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
                {chains.length === 0 && (
                  <Card className="p-8 text-center bg-card/30">
                    <p className="text-muted-foreground">No connection chains found</p>
                  </Card>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="hubs" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Hub entities are highly connected nodes that serve as central points in the knowledge graph.
            </p>
            <ScrollArea className="h-[600px]">
              <div className="space-y-3">
                {hubs.map((pattern) => (
                  <Card key={pattern.id} className="p-5 bg-card/50">
                    <div className="flex items-start gap-3 mb-3">
                      {getPatternIcon('hub')}
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{pattern.name}</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          {pattern.description}
                        </p>
                        
                        <div className="space-y-2 mb-4">
                          {pattern.insights.map((insight, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-sm">
                              <span className="text-accent mt-0.5">•</span>
                              <span className="text-foreground/80">{insight}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onEntitySelect(pattern.entities[0])}
                          >
                            View Hub Entity
                          </Button>
                          <span className="text-xs text-muted-foreground">
                            {pattern.relationships.length} connections
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
                {hubs.length === 0 && (
                  <Card className="p-8 text-center bg-card/30">
                    <p className="text-muted-foreground">No hub entities found</p>
                  </Card>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="clusters" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Clusters are groups of entities with dense interconnections forming cohesive knowledge units.
            </p>
            <ScrollArea className="h-[600px]">
              <div className="space-y-3">
                {clusters.map((pattern) => (
                  <Card key={pattern.id} className="p-5 bg-card/50">
                    <div className="flex items-start gap-3 mb-3">
                      {getPatternIcon('cluster')}
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{pattern.name}</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          {pattern.description}
                        </p>
                        
                        <div className="space-y-2 mb-4">
                          {pattern.insights.map((insight, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-sm">
                              <span className="text-secondary mt-0.5">•</span>
                              <span className="text-foreground/80">{insight}</span>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 pt-4 border-t border-border/50">
                          <p className="text-xs text-muted-foreground mb-2">Cluster members:</p>
                          <div className="flex flex-wrap gap-2">
                            {pattern.entities.slice(0, 8).map((entity) => (
                              <Badge
                                key={entity.id}
                                variant="outline"
                                className="cursor-pointer hover:bg-accent transition-colors"
                                onClick={() => onEntitySelect(entity)}
                              >
                                {entity.name}
                              </Badge>
                            ))}
                            {pattern.entities.length > 8 && (
                              <Badge variant="outline">
                                +{pattern.entities.length - 8} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
                {clusters.length === 0 && (
                  <Card className="p-8 text-center bg-card/30">
                    <p className="text-muted-foreground">No clusters found</p>
                  </Card>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="bridges" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Bridge entities connect different parts of the knowledge graph and are critical for maintaining connectivity.
            </p>
            <ScrollArea className="h-[600px]">
              <div className="space-y-3">
                {bridges.map((pattern) => (
                  <Card key={pattern.id} className="p-5 bg-card/50">
                    <div className="flex items-start gap-3 mb-3">
                      {getPatternIcon('bridge')}
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{pattern.name}</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          {pattern.description}
                        </p>
                        
                        <div className="space-y-2 mb-4">
                          {pattern.insights.map((insight, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-sm">
                              <span className="text-warning mt-0.5">•</span>
                              <span className="text-foreground/80">{insight}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onEntitySelect(pattern.entities[0])}
                          >
                            View Bridge Entity
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
                {bridges.length === 0 && (
                  <Card className="p-8 text-center bg-card/30">
                    <p className="text-muted-foreground">No bridge entities found</p>
                  </Card>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="concepts" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Analyze how concepts are used across models and trades, including success rates and common pairings.
            </p>
            <ScrollArea className="h-[600px]">
              <div className="space-y-3">
                {conceptPatterns.slice(0, 20).map((cp) => (
                  <Card key={cp.concept.id} className="p-5 bg-card/50">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 
                            className="font-medium cursor-pointer hover:text-primary transition-colors"
                            onClick={() => onEntitySelect(cp.concept)}
                          >
                            {cp.concept.name}
                          </h4>
                          {cp.successRate !== undefined && (
                            <Badge 
                              variant={cp.successRate > 0.5 ? 'default' : 'destructive'}
                              className="font-mono"
                            >
                              {(cp.successRate * 100).toFixed(0)}% success
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                          <div>
                            <p className="text-muted-foreground text-xs">Used in Models</p>
                            <p className="font-semibold">{cp.relatedModels.length}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Used in Trades</p>
                            <p className="font-semibold">{cp.relatedTrades.length}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Usage Frequency</p>
                            <p className="font-semibold">{cp.usageFrequency}</p>
                          </div>
                        </div>

                        {cp.commonPairings.length > 0 && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-2">
                              Commonly paired with:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {cp.commonPairings.slice(0, 5).map((pairing) => (
                                <Badge
                                  key={pairing.concept.id}
                                  variant="outline"
                                  className="cursor-pointer hover:bg-accent transition-colors"
                                  onClick={() => onEntitySelect(pairing.concept)}
                                >
                                  {pairing.concept.name} ({pairing.count})
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
                {conceptPatterns.length === 0 && (
                  <Card className="p-8 text-center bg-card/30">
                    <p className="text-muted-foreground">No concept patterns found</p>
                  </Card>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            {aiInsights === '' && (
              <Card className="p-12 text-center bg-card/30">
                <Brain size={48} className="mx-auto mb-4 text-accent opacity-70" />
                <h3 className="text-lg font-medium mb-2">Generate AI Insights</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Use AI to analyze detected patterns and provide actionable recommendations
                </p>
                <Button
                  onClick={generateInsights}
                  disabled={isGeneratingInsights || patterns.length === 0}
                  className="gap-2"
                >
                  <Sparkle size={16} />
                  {isGeneratingInsights ? 'Analyzing...' : 'Generate Insights'}
                </Button>
              </Card>
            )}

            {aiInsights !== '' && (
              <Card className="p-6 bg-card/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Sparkle size={20} className="text-accent" />
                    AI-Generated Insights
                  </h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={generateInsights}
                    disabled={isGeneratingInsights}
                  >
                    Regenerate
                  </Button>
                </div>
                <ScrollArea className="h-[600px]">
                  <div 
                    className="prose prose-invert prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: marked(aiInsights) as string }}
                  />
                </ScrollArea>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
