import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpenText, ArrowSquareOut, FilePdf, YoutubeLogo, FileDoc, FileText, Brain, Notebook, Lightning, Graph } from '@phosphor-icons/react';

interface SourceItem {
  title: string;
  type: 'pdf' | 'youtube' | 'markdown' | 'docx' | 'text';
  category: string;
  description?: string;
}

const NOTEBOOK_SOURCES: SourceItem[] = [
  // Core ICT Methodology
  { title: 'ICT Master Library', type: 'markdown', category: 'Core Methodology', description: 'Complete 10-part ICT trading methodology reference' },
  { title: 'ICT Knowledge Sources', type: 'markdown', category: 'Core Methodology', description: 'Curated learning path and source material index' },
  { title: 'ICT Learning System', type: 'markdown', category: 'Core Methodology', description: 'Structured curriculum for ICT methodology mastery' },
  { title: 'Concept Relationships YAML', type: 'text', category: 'Core Methodology', description: '713-line relationship graph between all ICT concepts' },
  
  // VEX AI Agent Architecture
  { title: 'VEX Agent Architecture Blueprint', type: 'pdf', category: 'AI Architecture', description: 'Complete system design for the autonomous trading agent' },
  { title: 'Knowledge Graph Schema Design', type: 'pdf', category: 'AI Architecture', description: 'Entity-relationship schema for ICT knowledge representation' },
  { title: 'Agent Skills Framework', type: 'markdown', category: 'AI Architecture', description: 'Modular skill system for AI agent capabilities' },
  { title: 'AI Graph Intelligence System', type: 'pdf', category: 'AI Architecture', description: 'Architectural blueprint for graph-based AI reasoning' },
  
  // Trading Models & Setups
  { title: 'Silver Bullet Model Documentation', type: 'markdown', category: 'Trading Models', description: 'Complete Silver Bullet setup rules and execution parameters' },
  { title: 'Model 12 Confluence Framework', type: 'pdf', category: 'Trading Models', description: 'OB + FVG + OTE triple confluence model' },
  { title: 'Killzone Trading Models', type: 'markdown', category: 'Trading Models', description: 'London, NY AM, NY PM session-specific execution frameworks' },
  { title: 'Turtle Soup Reversal Strategy', type: 'markdown', category: 'Trading Models', description: 'Liquidity sweep reversal pattern documentation' },
  
  // ICT YouTube Lectures
  { title: 'ICT Mentorship 2022 - Market Structure', type: 'youtube', category: 'Video Lectures', description: 'Break of Structure, Change of Character, Premium/Discount' },
  { title: 'ICT Mentorship 2022 - Order Blocks', type: 'youtube', category: 'Video Lectures', description: 'Institutional order flow and mitigation blocks' },
  { title: 'ICT Mentorship 2022 - Fair Value Gaps', type: 'youtube', category: 'Video Lectures', description: 'Imbalance identification and FVG trading' },
  { title: 'ICT Mentorship 2023 - Silver Bullet', type: 'youtube', category: 'Video Lectures', description: 'Time-based entry model with displacement requirements' },
  { title: 'ICT Twitter Spaces - AMD Model', type: 'youtube', category: 'Video Lectures', description: 'Accumulation, Manipulation, Distribution framework' },
  
  // Training Data & Journals
  { title: "Ashton's Trade Journal", type: 'docx', category: 'Training Data', description: 'Real trade execution log with annotations and grades' },
  { title: 'Connected Trades Dataset', type: 'text', category: 'Training Data', description: 'CSV export of trade entries with confluence scoring' },
  { title: 'Positive Training Examples', type: 'text', category: 'Training Data', description: 'Winning setups annotated with concept confluences' },
  { title: 'Negative Training Examples', type: 'text', category: 'Training Data', description: 'Failed setups with root cause analysis' },
  
  // Technical Implementation
  { title: 'Pre-Trade Checklist Validator', type: 'markdown', category: 'Technical', description: 'Automated validation rules for trade entry decisions' },
  { title: 'Confluence Scoring Algorithm', type: 'markdown', category: 'Technical', description: 'Weighted scoring system for setup quality grading' },
  { title: 'Causal Chain Definitions', type: 'markdown', category: 'Technical', description: 'Reversal, AMD, and HTF-to-LTF execution chains' },
  { title: 'Anti-Pattern Detection Rules', type: 'markdown', category: 'Technical', description: '10 common trading mistakes with detection logic' },
];

const CATEGORIES = ['All', 'Core Methodology', 'AI Architecture', 'Trading Models', 'Video Lectures', 'Training Data', 'Technical'];

const typeIcons: Record<string, React.ReactNode> = {
  pdf: <FilePdf size={16} weight="duotone" className="text-red-400" />,
  youtube: <YoutubeLogo size={16} weight="duotone" className="text-red-500" />,
  markdown: <FileText size={16} weight="duotone" className="text-blue-400" />,
  docx: <FileDoc size={16} weight="duotone" className="text-blue-500" />,
  text: <FileText size={16} weight="duotone" className="text-muted-foreground" />,
};

const typeLabels: Record<string, string> = {
  pdf: 'PDF',
  youtube: 'Video',
  markdown: 'Markdown',
  docx: 'Document',
  text: 'Text/CSV',
};

export function ResearchView() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredSources = selectedCategory === 'All'
    ? NOTEBOOK_SOURCES
    : NOTEBOOK_SOURCES.filter(s => s.category === selectedCategory);

  const categoryCounts = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = cat === 'All' ? NOTEBOOK_SOURCES.length : NOTEBOOK_SOURCES.filter(s => s.category === cat).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Research Hub</h1>
        <p className="text-muted-foreground mt-1">
          AI-powered research notebook with 68+ sources on ICT methodology and graph intelligence
        </p>
      </div>

      {/* NotebookLM Card */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 via-accent/5 to-card/50 backdrop-blur border-primary/20">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="p-4 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20">
            <Brain size={40} weight="duotone" className="text-primary" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">Architectural Blueprint for AI Graph Intelligence Systems</h2>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">NotebookLM</Badge>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A comprehensive Google NotebookLM workspace containing all source materials for the ICT Knowledge Engine. 
              Includes ICT methodology documentation, AI architecture blueprints, trading model specifications, 
              video lecture transcripts, real trade journal data, and technical implementation guides.
              Chat with the AI to explore connections across all sources.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Badge variant="secondary" className="text-xs">68 Sources</Badge>
              <Badge variant="secondary" className="text-xs">PDFs</Badge>
              <Badge variant="secondary" className="text-xs">YouTube Lectures</Badge>
              <Badge variant="secondary" className="text-xs">Markdown Docs</Badge>
              <Badge variant="secondary" className="text-xs">Trade Data</Badge>
              <Badge variant="secondary" className="text-xs">AI Chat</Badge>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button asChild className="gap-2">
              <a
                href="https://notebooklm.google.com/notebook/0c01de2c-bd21-4331-9caa-367bfa77a992"
                target="_blank"
                rel="noopener noreferrer"
              >
                <BookOpenText size={18} weight="duotone" />
                Open Notebook
                <ArrowSquareOut size={14} />
              </a>
            </Button>
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-card/50 backdrop-blur border-border/50 hover:border-primary/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/10">
              <FilePdf size={20} className="text-red-400" weight="duotone" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">PDF Documents</p>
              <p className="text-lg font-semibold">{NOTEBOOK_SOURCES.filter(s => s.type === 'pdf').length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-card/50 backdrop-blur border-border/50 hover:border-primary/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/10">
              <YoutubeLogo size={20} className="text-red-500" weight="duotone" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Video Lectures</p>
              <p className="text-lg font-semibold">{NOTEBOOK_SOURCES.filter(s => s.type === 'youtube').length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-card/50 backdrop-blur border-border/50 hover:border-primary/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <FileText size={20} className="text-blue-400" weight="duotone" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Markdown/Text</p>
              <p className="text-lg font-semibold">{NOTEBOOK_SOURCES.filter(s => s.type === 'markdown' || s.type === 'text').length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-card/50 backdrop-blur border-border/50 hover:border-primary/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <FileDoc size={20} className="text-blue-500" weight="duotone" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Documents</p>
              <p className="text-lg font-semibold">{NOTEBOOK_SOURCES.filter(s => s.type === 'docx').length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Key Research Topics */}
      <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
        <h2 className="text-xl font-semibold mb-4">Key Research Topics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-secondary/30 border border-border/50 space-y-2">
            <div className="flex items-center gap-2">
              <Notebook size={20} className="text-primary" weight="duotone" />
              <h3 className="font-medium">ICT Methodology</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Complete documentation of Fair Value Gaps, Order Blocks, Market Structure Shifts, 
              Displacement, Liquidity, Killzones, and all core ICT concepts with relationships mapped.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-secondary/30 border border-border/50 space-y-2">
            <div className="flex items-center gap-2">
              <Graph size={20} className="text-accent" weight="duotone" />
              <h3 className="font-medium">Knowledge Graph Architecture</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Entity-relationship schema design, semantic search implementation, 
              causal chain definitions, and graph-based AI reasoning systems for trading intelligence.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-secondary/30 border border-border/50 space-y-2">
            <div className="flex items-center gap-2">
              <Lightning size={20} className="text-yellow-400" weight="duotone" />
              <h3 className="font-medium">AI Agent Framework</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              VEX autonomous agent architecture, modular skill system, confluence scoring algorithms,
              pre-trade validation, and anti-pattern detection for automated trading decisions.
            </p>
          </div>
        </div>
      </Card>

      {/* Source Browser */}
      <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Source Materials</h2>
          <Badge variant="secondary">{filteredSources.length} sources</Badge>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                selectedCategory === cat
                  ? 'bg-primary/10 border-primary/30 text-primary font-medium'
                  : 'bg-secondary/30 border-border/50 text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
              }`}
            >
              {cat} ({categoryCounts[cat]})
            </button>
          ))}
        </div>

        <ScrollArea className="h-[400px]">
          <div className="space-y-2">
            {filteredSources.map((source, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors border border-transparent hover:border-border/50"
              >
                <div className="mt-0.5">{typeIcons[source.type]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{source.title}</p>
                    <Badge variant="outline" className="text-[10px] shrink-0">{typeLabels[source.type]}</Badge>
                  </div>
                  {source.description && (
                    <p className="text-xs text-muted-foreground mt-0.5">{source.description}</p>
                  )}
                </div>
                <Badge variant="secondary" className="text-[10px] shrink-0 bg-secondary/50">{source.category}</Badge>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
