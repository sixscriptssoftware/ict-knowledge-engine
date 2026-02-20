import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Database, BookOpen, Target, TrendUp, Cube, Code, Notebook, CirclesThreePlus, Graph, ChatsCircle, Brain, Lightning, Sparkle, ArrowRight, ChartLine, BookOpenText } from '@phosphor-icons/react';
import type { DatabaseStats, DomainType, EntityType } from '@/lib/types';

interface DashboardViewProps {
  stats: DatabaseStats;
  onNavigate?: (tab: string) => void;
}

export function DashboardView({ stats, onNavigate }: DashboardViewProps) {
  const domainIcons: Record<DomainType, React.ReactNode> = {
    concepts: <BookOpen size={24} weight="duotone" />,
    models: <Target size={24} weight="duotone" />,
    trades: <TrendUp size={24} weight="duotone" />,
    schemas: <Cube size={24} weight="duotone" />,
    training_data: <Database size={24} weight="duotone" />,
    knowledge_base: <BookOpen size={24} weight="duotone" />,
    code: <Code size={24} weight="duotone" />,
    journal: <Notebook size={24} weight="duotone" />,
    charts: <ChartLine size={24} weight="duotone" />,
    rag_data: <Database size={24} weight="duotone" />,
    relationships: <CirclesThreePlus size={24} weight="duotone" />
  };

  const domainLabels: Record<DomainType, string> = {
    concepts: 'Concepts',
    models: 'Models',
    trades: 'Trades',
    schemas: 'Schemas',
    training_data: 'Training Data',
    knowledge_base: 'Knowledge Base',
    code: 'Code Modules',
    journal: 'Journal Entries',
    charts: 'Charts',
    rag_data: 'RAG Data',
    relationships: 'Relationships'
  };

  const domainColors: Record<DomainType, string> = {
    concepts: 'text-green-400',
    models: 'text-blue-400',
    trades: 'text-red-400',
    schemas: 'text-yellow-400',
    training_data: 'text-purple-400',
    knowledge_base: 'text-orange-400',
    code: 'text-violet-400',
    journal: 'text-amber-400',
    charts: 'text-cyan-400',
    rag_data: 'text-teal-400',
    relationships: 'text-pink-400'
  };

  const quickActions = [
    { label: 'Explore Graph', icon: <Graph size={18} weight="duotone" />, tab: 'graph', description: 'Visualize knowledge connections' },
    { label: 'AI Chat', icon: <ChatsCircle size={18} weight="duotone" />, tab: 'chat', description: 'Ask questions about ICT' },
    { label: 'Semantic Search', icon: <Sparkle size={18} weight="duotone" />, tab: 'search', description: 'Find concepts by meaning' },
    { label: 'Patterns', icon: <Brain size={18} weight="duotone" />, tab: 'patterns', description: 'Discover trading patterns' },
    { label: 'Analytics', icon: <ChartLine size={18} weight="duotone" />, tab: 'analytics', description: 'Trade performance metrics' },
    { label: 'Research', icon: <BookOpenText size={18} weight="duotone" />, tab: 'research', description: '68+ source materials' },
  ];

  const hasData = stats.totalEntities > 0;

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-accent/5 to-card/50 border border-primary/20 p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs">v2.0</Badge>
            {hasData && <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20 text-xs">Knowledge Base Loaded</Badge>}
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">ICT Knowledge Engine</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl leading-relaxed">
            AI-powered knowledge graph for Inner Circle Trader methodology. Explore {stats.totalEntities} entities 
            connected through {stats.totalRelationships} relationships spanning concepts, models, trades, and more.
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-5 bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10">
              <Database size={22} className="text-primary" weight="duotone" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Entities</p>
              <p className="text-2xl font-semibold">{stats.totalEntities.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-card/50 backdrop-blur border-border/50 hover:border-accent/50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-accent/10">
              <CirclesThreePlus size={22} className="text-accent" weight="duotone" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Relationships</p>
              <p className="text-2xl font-semibold">{stats.totalRelationships.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-yellow-500/10">
              <Lightning size={22} className="text-yellow-400" weight="duotone" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Entity Types</p>
              <p className="text-2xl font-semibold">{Object.keys(stats.entitiesByType).filter(k => (stats.entitiesByType as Record<string, number>)[k] > 0).length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-purple-500/10">
              <Brain size={22} className="text-purple-400" weight="duotone" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Domains</p>
              <p className="text-2xl font-semibold">{Object.keys(stats.entitiesByDomain).filter(k => (stats.entitiesByDomain as Record<string, number>)[k] > 0).length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.tab}
              onClick={() => onNavigate?.(action.tab)}
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 border border-transparent hover:border-primary/20 transition-all group text-center"
            >
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                {action.icon}
              </div>
              <span className="text-sm font-medium group-hover:text-primary transition-colors">{action.label}</span>
              <span className="text-[10px] text-muted-foreground">{action.description}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Entities by Domain */}
      <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Knowledge Graph Breakdown</h2>
          {onNavigate && (
            <Button variant="ghost" size="sm" className="gap-1 text-xs text-muted-foreground hover:text-primary" onClick={() => onNavigate('explorer')}>
              View all <ArrowRight size={12} />
            </Button>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(Object.keys(stats.entitiesByDomain) as DomainType[])
            .filter(domain => (stats.entitiesByDomain[domain] || 0) > 0)
            .map((domain) => {
              const count = stats.entitiesByDomain[domain] || 0;
              return (
                <div key={domain} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors border border-transparent hover:border-border/50">
                  <div className={domainColors[domain]}>
                    {domainIcons[domain]}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{domainLabels[domain]}</p>
                    <p className="text-lg font-semibold">{count}</p>
                  </div>
                </div>
              );
          })}
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <ScrollArea className="h-[250px]">
          <div className="space-y-2">
            {stats.recentActivity.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <p className="text-muted-foreground">No recent processing activity</p>
                <p className="text-xs text-muted-foreground">Upload files or use the chat to generate activity</p>
              </div>
            ) : (
              stats.recentActivity.map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/20">
                  <Badge variant={log.status === 'completed' ? 'default' : log.status === 'error' ? 'destructive' : 'secondary'}>
                    {log.status}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-mono truncate">{log.filePath}</p>
                    <p className="text-xs text-muted-foreground mt-1">{log.message}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
