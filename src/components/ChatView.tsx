import { useState, useRef, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PaperPlaneRight, User, Brain, Trash, BookOpen, Target, ChartLine, Flask, Lightbulb } from '@phosphor-icons/react';
import { toast } from 'sonner';
import type { ChatMessage, Entity } from '@/lib/types';

interface ChatViewProps {
  entities: Entity[];
  onAskQuestion: (question: string) => Promise<{ answer: string; sources: Entity[] }>;
}

interface PromptCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  prompts: string[];
  description: string;
}

export function ChatView({ entities, onAskQuestion }: ChatViewProps) {
  const [messages, setMessages] = useKV<ChatMessage[]>('chat-history', []);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('concepts');
  const scrollRef = useRef<HTMLDivElement>(null);

  const safeMessages = messages || [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [safeMessages]);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages((currentMessages) => [...(currentMessages || []), userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { answer, sources } = await onAskQuestion(input);
      
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: answer,
        sources,
        timestamp: new Date().toISOString()
      };

      setMessages((currentMessages) => [...(currentMessages || []), assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your question.',
        timestamp: new Date().toISOString()
      };
      setMessages((currentMessages) => [...(currentMessages || []), errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([]);
    toast.success('Chat history cleared');
  };

  const promptCategories: PromptCategory[] = [
    {
      id: 'concepts',
      label: 'Concepts',
      icon: <BookOpen size={16} weight="duotone" />,
      description: 'Explore ICT concepts with precision and context',
      prompts: [
        "Define Fair Value Gap with bearish/bullish displacement examples.",
        "Explain Order Block formation and mitigation criteria in detail.",
        "What constitutes a valid Breaker Block vs regular Order Block?",
        "Detail the relationship between Displacement and Imbalance structures.",
        "Describe optimal trade entry zones within institutional reference points.",
        "Define Change of Character (CHoCH) vs Break of Structure (BOS) with price action examples.",
        "What makes a liquidity sweep valid for entry consideration?",
        "Explain the Market Structure Shift concept across multiple timeframes."
      ]
    },
    {
      id: 'models',
      label: 'Models',
      icon: <Target size={16} weight="duotone" />,
      description: 'Query trading models and execution frameworks',
      prompts: [
        "List the entry criteria and time windows for the Silver Bullet setup.",
        "Detail Model 12 requirements: OB + FVG + OTE confluence rules.",
        "What are the complete execution parameters for the Turtle Soup reversal?",
        "Explain the London Open Killzone trade model with displacement requirements.",
        "Show NY AM Session trade setup rules with institutional reference points.",
        "What confluence factors validate a Judas Swing entry signal?",
        "Detail the MMBM/MMSM model execution with PD array alignment.",
        "List Model 9 setup requirements and invalidation rules."
      ]
    },
    {
      id: 'trades',
      label: 'Trade Analysis',
      icon: <ChartLine size={16} weight="duotone" />,
      description: 'Filter and analyze trade execution data',
      prompts: [
        "Filter trades: OB + FVG confluence resulting in >2R returns.",
        "Show me high-probability A+ Setups from my training data.",
        "Which trades failed due to liquidity sweep invalidation?",
        "Compare win rates: London vs NY killzone executions.",
        "Show all Model 12 setups with OTE retracement confluence.",
        "List trades with displacement >20 pips preceding FVG entries.",
        "Filter negative examples: what were the root cause failures?",
        "Show trades where early entry resulted in stop loss hits.",
        "Which setups had 3+ PD array confluence and what was the outcome?"
      ]
    },
    {
      id: 'patterns',
      label: 'Patterns',
      icon: <Flask size={16} weight="duotone" />,
      description: 'Discover patterns and statistical insights',
      prompts: [
        "What displacement characteristics preceded my best FVG entries?",
        "Analyze common patterns in winning Silver Bullet executions.",
        "What time windows show highest win rate for London killzone entries?",
        "Compare liquidity sweep patterns: successful vs failed entries.",
        "Show correlation between OTE retracement depth and trade outcome.",
        "Which concept combinations appear most in A+ graded setups?",
        "Identify recurring failure patterns in negative training data.",
        "What confluence factors separate B setups from A+ setups statistically?"
      ]
    },
    {
      id: 'insights',
      label: 'Deep Insights',
      icon: <Lightbulb size={16} weight="duotone" />,
      description: 'Advanced analysis and strategic queries',
      prompts: [
        "What makes an institutional reference point high probability for reversals?",
        "Analyze the relationship between Market Structure and Order Flow alignment.",
        "How does multi-timeframe PD array confluence affect setup quality?",
        "What pre-entry conditions distinguish A+ setups from lower grades?",
        "Explain the sequence: liquidity grab → displacement → FVG → entry logic.",
        "How do session-specific characteristics affect setup performance?",
        "What role does volume/spread expansion play in displacement validation?",
        "Compare algorithmic behavior patterns: trending vs ranging market states."
      ]
    }
  ];

  const currentCategory = promptCategories.find(cat => cat.id === selectedCategory) || promptCategories[0];

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">AI Chat</h1>
          <p className="text-muted-foreground mt-1">Ask questions about your ICT knowledge base</p>
        </div>
        {safeMessages.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearHistory}
            className="gap-2"
          >
            <Trash size={16} />
            Clear History
          </Button>
        )}
      </div>

      {safeMessages.length === 0 && (
        <Card className="p-8 bg-card/50 backdrop-blur border-border/50 mb-4">
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20">
                <Brain size={32} weight="duotone" className="text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">ICT Knowledge Analysis</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Query concepts, filter trade setups, analyze patterns, and explore model relationships
                </p>
              </div>
            </div>

            <div>
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                <TabsList className="grid w-full grid-cols-5 mb-4">
                  {promptCategories.map((category) => (
                    <TabsTrigger 
                      key={category.id} 
                      value={category.id}
                      className="gap-1.5 text-xs"
                    >
                      {category.icon}
                      {category.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <div className="mb-4">
                  <p className="text-xs text-muted-foreground text-center">
                    {currentCategory.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto">
                  {currentCategory.prompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => setInput(prompt)}
                      className="p-3 text-left text-sm rounded-lg bg-secondary/30 hover:bg-secondary/50 hover:border-accent/30 transition-all border border-border/50 group"
                    >
                      <span className="group-hover:text-accent transition-colors">{prompt}</span>
                    </button>
                  ))}
                </div>
              </Tabs>
            </div>
          </div>
        </Card>
      )}

      <ScrollArea className="flex-1 mb-4" ref={scrollRef}>
        <div className="space-y-4 pr-4">
          {safeMessages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.role === 'assistant' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center">
                  <Brain size={20} weight="duotone" className="text-accent" />
                </div>
              )}
              <Card className={`max-w-[80%] p-4 ${
                message.role === 'user' 
                  ? 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20' 
                  : 'bg-card/50 backdrop-blur border-border/50'
              }`}>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border/50">
                    <p className="text-xs text-muted-foreground mb-2 font-medium">Sources:</p>
                    <div className="flex flex-wrap gap-2">
                      {message.sources.map((source) => (
                        <Badge 
                          key={source.id} 
                          variant="secondary" 
                          className="text-xs hover:bg-accent/10 hover:text-accent transition-colors cursor-default"
                        >
                          {source.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <span className="text-xs text-muted-foreground mt-2 block opacity-60">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </Card>
              {message.role === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                  <User size={20} weight="duotone" className="text-primary" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center">
                <Brain size={20} weight="duotone" className="text-accent animate-pulse" />
              </div>
              <Card className="p-4 bg-card/50 backdrop-blur border-border/50">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            placeholder="Ask about ICT concepts, filter trades, analyze patterns..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
            disabled={isLoading}
            className="flex-1"
          />
          <Button onClick={handleSubmit} disabled={!input.trim() || isLoading} className="gap-2">
            <PaperPlaneRight size={16} weight="bold" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Knowledge base: {entities.length} entities</span>
          {safeMessages.length > 0 && (
            <span>{safeMessages.length} messages in history</span>
          )}
        </div>
      </div>
    </div>
  );
}
