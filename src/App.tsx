import { useState, useEffect, useRef } from 'react';
import { useKV } from '@github/spark/hooks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { Database, Tree, Upload, ChatsCircle, Graph, Brain, GraduationCap, Sparkle, MagicWand, Lightning, ChartLine } from '@phosphor-icons/react';
import { DashboardView } from '@/components/DashboardView';
import { ExplorerView } from '@/components/ExplorerView';
import { UploadView } from '@/components/UploadView';
import { ChatView } from '@/components/ChatView';
import { GraphView } from '@/components/GraphView';
import { PatternsView } from '@/components/PatternsView';
import { TrainingView } from '@/components/TrainingView';
import { SemanticSearchView } from '@/components/SemanticSearchView';
import { RecommendationsView } from '@/components/RecommendationsView';
import { SkillsView } from '@/components/SkillsView';
import { AnalyticsView } from '@/components/AnalyticsView';
import { EntityDetailDialog } from '@/components/EntityDetailDialog';
import { processFile } from '@/lib/ai-processor';
import { generateDemoData } from '@/lib/demo-data';
import { createAIGraphInternal } from '@/lib/schema';
import type { Entity, Relationship, Upload as UploadType, FileProcessingLog, DatabaseStats, DomainType, EntityType } from '@/lib/types';

function App() {
  const [entities, setEntities] = useKV<Entity[]>('ict-entities', []);
  const [relationships, setRelationships] = useKV<Relationship[]>('ict-relationships', []);
  const [uploads, setUploads] = useKV<UploadType[]>('ict-uploads', []);
  const [logs, setLogs] = useKV<FileProcessingLog[]>('ict-logs', []);
  const [chatMessages, setChatMessages] = useKV<import('@/lib/types').ChatMessage[]>('chat-history', []);
  
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const aiGraphRef = useRef(createAIGraphInternal());
  const sessionIdRef = useRef(`session-${Date.now()}`);

  const safeEntities = entities || [];
  const safeRelationships = relationships || [];
  const safeUploads = uploads || [];
  const safeLogs = logs || [];
  const safeChatMessages = chatMessages || [];

  useEffect(() => {
    if (safeEntities.length > 0 || safeRelationships.length > 0) {
      aiGraphRef.current.buildFromEntities(safeEntities, safeRelationships).catch(console.error);
    }
  }, [safeEntities, safeRelationships]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const cleared = aiGraphRef.current.clearExpiredSessions();
      if (cleared > 0) {
        console.log(`Cleared ${cleared} expired AI session(s)`);
      }
    }, 60 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleFileUpload = async (files: FileList) => {
    const uploadId = `upload-${Date.now()}`;
    const fileArray = Array.from(files);
    
    const upload: UploadType = {
      id: uploadId,
      type: 'file',
      name: `${fileArray.length} file${fileArray.length > 1 ? 's' : ''}`,
      source: 'local',
      fileCount: fileArray.length,
      processedCount: 0,
      status: 'processing',
      startedAt: new Date().toISOString(),
      errors: []
    };

    setUploads((currentUploads) => [upload, ...(currentUploads || [])]);
    toast.success(`Processing ${fileArray.length} files...`);

    const allNewEntities: Entity[] = [];
    const allNewRelationships: Relationship[] = [];

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      
      try {
        const result = await processFile(file, uploadId);
        
        setLogs((currentLogs) => [result.log, ...(currentLogs || [])]);
        
        allNewEntities.push(...result.entities);
        allNewRelationships.push(...result.relationships);

        setUploads((currentUploads) => 
          (currentUploads || []).map(u => 
            u.id === uploadId 
              ? { ...u, processedCount: i + 1 }
              : u
          )
        );
      } catch (error) {
        setLogs((currentLogs) => [{
          id: `log-${Date.now()}-${Math.random()}`,
          uploadId,
          filePath: file.name,
          fileType: file.name.split('.').pop() || '',
          status: 'error',
          message: `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          entitiesCreated: 0,
          timestamp: new Date().toISOString()
        }, ...(currentLogs || [])]);
      }
    }

    setEntities((currentEntities) => [...allNewEntities, ...(currentEntities || [])]);
    setRelationships((currentRelationships) => [...allNewRelationships, ...(currentRelationships || [])]);

    setUploads((currentUploads) => 
      (currentUploads || []).map(u => 
        u.id === uploadId 
          ? { ...u, status: 'completed' as const, completedAt: new Date().toISOString() }
          : u
      )
    );

    toast.success(`Successfully processed ${fileArray.length} files`, {
      description: `Extracted ${allNewEntities.length} entities and ${allNewRelationships.length} relationships`
    });
  };

  const handleRepoUpload = async (url: string) => {
    toast.info('GitHub repository ingestion is a demo feature', {
      description: 'In a full implementation, this would clone and process the entire repo.'
    });

    const uploadId = `upload-${Date.now()}`;
    const upload: UploadType = {
      id: uploadId,
      type: 'repo',
      name: url.split('/').pop() || 'repository',
      source: url,
      fileCount: 0,
      processedCount: 0,
      status: 'completed',
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      errors: []
    };

    setUploads((currentUploads) => [upload, ...(currentUploads || [])]);
  };

  const handleDemoLoad = () => {
    const { entities: demoEntities, relationships: demoRelationships } = generateDemoData();
    
    setEntities((currentEntities) => [...demoEntities, ...(currentEntities || [])]);
    setRelationships((currentRelationships) => [...demoRelationships, ...(currentRelationships || [])]);

    const uploadId = `demo-upload-${Date.now()}`;
    const upload: UploadType = {
      id: uploadId,
      type: 'folder',
      name: 'ICT Demo Dataset',
      source: 'demo',
      fileCount: 36,
      processedCount: 36,
      status: 'completed',
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      errors: []
    };

    setUploads((currentUploads) => [upload, ...(currentUploads || [])]);

    const demoLogs: FileProcessingLog[] = [
      {
        id: `log-${Date.now()}-1`,
        uploadId,
        filePath: 'knowledge_base/ICT_MASTER_LIBRARY.md',
        fileType: 'md',
        status: 'completed',
        message: '✅ Parsed ICT_MASTER_LIBRARY.md → 1 entities extracted',
        entitiesCreated: 1,
        timestamp: new Date().toISOString()
      },
      {
        id: `log-${Date.now()}-2`,
        uploadId,
        filePath: 'knowledge_base/concepts/fair_value_gap.md',
        fileType: 'md',
        status: 'completed',
        message: '✅ Parsed fair_value_gap.md → 1 entities extracted',
        entitiesCreated: 1,
        timestamp: new Date().toISOString()
      },
      {
        id: `log-${Date.now()}-3`,
        uploadId,
        filePath: 'knowledge_base/models/silver_bullet.md',
        fileType: 'md',
        status: 'completed',
        message: '✅ Parsed silver_bullet.md → 1 entities extracted',
        entitiesCreated: 1,
        timestamp: new Date().toISOString()
      },
      {
        id: `log-${Date.now()}-4`,
        uploadId,
        filePath: 'data/training/positive/2026-01-20_LON_EURUSD_OBFVG_001.json',
        fileType: 'json',
        status: 'completed',
        message: '✅ Parsed 2026-01-20_LON_EURUSD_OBFVG_001.json → 1 entities extracted',
        entitiesCreated: 1,
        timestamp: new Date().toISOString()
      },
      {
        id: `log-${Date.now()}-5`,
        uploadId,
        filePath: 'data/training/negative/2026-01-18_NY_GBPUSD_FAIL_001.json',
        fileType: 'json',
        status: 'completed',
        message: '✅ Parsed 2026-01-18_NY_GBPUSD_FAIL_001.json → 1 entities extracted',
        entitiesCreated: 1,
        timestamp: new Date().toISOString()
      },
      {
        id: `log-${Date.now()}-6`,
        uploadId,
        filePath: 'src/ict_agent/detectors/fvg.py',
        fileType: 'py',
        status: 'completed',
        message: '✅ Parsed fvg.py → 1 entities extracted',
        entitiesCreated: 1,
        timestamp: new Date().toISOString()
      }
    ];

    setLogs((currentLogs) => [...demoLogs, ...(currentLogs || [])]);

    toast.success('Demo ICT data loaded successfully!', {
      description: `Loaded ${demoEntities.length} entities and ${demoRelationships.length} relationships`
    });

    setActiveTab('dashboard');
  };

  const handleEntitySelect = (entity: Entity) => {
    setSelectedEntity(entity);
    setDetailDialogOpen(true);
  };

  const handleBatchReclassify = (entitiesToReclassify: Entity[], newDomain: DomainType, newType: EntityType) => {
    const entityIds = new Set(entitiesToReclassify.map(e => e.id));
    
    setEntities((currentEntities) => 
      (currentEntities || []).map(entity => {
        if (entityIds.has(entity.id)) {
          return {
            ...entity,
            domain: newDomain,
            type: newType,
            updatedAt: new Date().toISOString()
          };
        }
        return entity;
      })
    );

    toast.success(`Reclassified ${entitiesToReclassify.length} entities`, {
      description: `Updated to ${newDomain} / ${newType}`
    });
  };

  const handleBatchDelete = (entitiesToDelete: Entity[]) => {
    const entityIds = new Set(entitiesToDelete.map(e => e.id));
    
    setEntities((currentEntities) => 
      (currentEntities || []).filter(entity => !entityIds.has(entity.id))
    );

    setRelationships((currentRelationships) =>
      (currentRelationships || []).filter(rel => 
        !entityIds.has(rel.sourceId) && !entityIds.has(rel.targetId)
      )
    );

    toast.success(`Deleted ${entitiesToDelete.length} entities`, {
      description: 'All associated relationships removed'
    });
  };

  const handleAskQuestion = async (question: string): Promise<{ answer: string; sources: Entity[] }> => {
    const sessionId = sessionIdRef.current;
    const aiGraph = aiGraphRef.current;
    
    aiGraph.createOrUpdateSession(sessionId, safeChatMessages, safeEntities);
    const session = aiGraph.getSession(sessionId);
    
    if (session) {
      const logicFlow = aiGraph.buildLogicFlow(question, session);
      console.log('Logic Flow:', logicFlow);
    }

    const semanticResults = await aiGraph.semanticSearch(question, 20);
    console.log('Semantic Search Results:', semanticResults.map(r => ({ name: r.node.name, similarity: r.similarity })));

    const conceptEntities = semanticResults
      .filter(r => r.node.type === 'concept' && r.similarity > 0.5)
      .slice(0, 15)
      .map(r => safeEntities.find(e => e.id === r.node.id))
      .filter((e): e is Entity => e !== undefined);
    
    const modelEntities = semanticResults
      .filter(r => r.node.type === 'model' && r.similarity > 0.5)
      .slice(0, 10)
      .map(r => safeEntities.find(e => e.id === r.node.id))
      .filter((e): e is Entity => e !== undefined);
    
    const tradeEntities = semanticResults
      .filter(r => r.node.type === 'trade' && r.similarity > 0.5)
      .slice(0, 10)
      .map(r => safeEntities.find(e => e.id === r.node.id))
      .filter((e): e is Entity => e !== undefined);
    
    const enrichmentContext = Array.from({ length: Math.min(3, safeEntities.length) }, (_, i) => {
      const entity = safeEntities[i];
      if (entity.content && entity.type === 'document') {
        const enrichment = aiGraph.enrichFromMarkdown(entity.name, entity.content);
        return {
          concepts: enrichment.extractedConcepts,
          relationships: enrichment.extractedRelationships.length,
          complexity: enrichment.metadata.technicalComplexity
        };
      }
      return null;
    }).filter(Boolean);

    const prompt = window.spark.llmPrompt`You are an ICT (Inner Circle Trader) methodology expert. Answer technical questions with precision and depth using semantic search results.

Question: ${question}

Semantically Relevant Knowledge (sorted by similarity):

Most Relevant Concepts (similarity > 0.5):
${JSON.stringify(conceptEntities.map(e => ({
  name: e.name,
  description: e.description,
  domain: e.domain
})), null, 2)}

Most Relevant Models:
${JSON.stringify(modelEntities.map(e => ({
  name: e.name,
  description: e.description,
  domain: e.domain
})), null, 2)}

Most Relevant Trades:
${JSON.stringify(tradeEntities.map(e => ({
  name: e.name,
  description: e.description,
  metadata: e.metadata
})), null, 2)}

Relevant Relationships:
${JSON.stringify(safeRelationships.slice(0, 30).map(r => ({
  type: r.type,
  from: safeEntities.find(e => e.id === r.sourceId)?.name,
  to: safeEntities.find(e => e.id === r.targetId)?.name
})), null, 2)}

${session ? `
Session Context:
- Conversation Topic: ${session.context.conversationTopic || 'general'}
- Intent: ${session.reasoning.lastInference || 'unknown'}
- Referenced Concepts: ${Array.from(session.context.referencedConcepts.keys()).join(', ')}
- Confidence: ${(session.reasoning.confidenceScore * 100).toFixed(0)}%
` : ''}

${enrichmentContext.length > 0 ? `
Document Enrichment:
${JSON.stringify(enrichmentContext, null, 2)}
` : ''}

Instructions:
- Prioritize information from entities with high semantic similarity to the question
- For concept definitions: Provide precise ICT terminology with bearish/bullish context
- For trade filters: Query the actual trade data and provide specific results with metrics
- For model questions: Detail entry criteria, time windows, confluence requirements
- For pattern analysis: Reference specific relationships and training data
- Always cite entity names when referencing knowledge base items
- Use technical ICT language (displacement, liquidity sweep, OTE, killzones, etc.)`;

    const answer = await window.spark.llm(prompt, 'gpt-4o');

    const relevantSources = semanticResults
      .slice(0, 10)
      .map(r => safeEntities.find(e => e.id === r.node.id))
      .filter((e): e is Entity => e !== undefined)
      .filter(e => 
        answer.toLowerCase().includes(e.name.toLowerCase()) ||
        (e.description && answer.toLowerCase().includes(e.description.toLowerCase().slice(0, 20)))
      )
      .slice(0, 5);

    return { answer, sources: relevantSources };
  };

  const stats: DatabaseStats = {
    totalEntities: safeEntities.length,
    totalRelationships: safeRelationships.length,
    totalUploads: safeUploads.length,
    entitiesByType: safeEntities.reduce((acc, e) => {
      acc[e.type] = (acc[e.type] || 0) + 1;
      return acc;
    }, {} as Record<EntityType, number>),
    entitiesByDomain: safeEntities.reduce((acc, e) => {
      acc[e.domain] = (acc[e.domain] || 0) + 1;
      return acc;
    }, {} as Record<DomainType, number>),
    recentActivity: safeLogs.slice(0, 10)
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/50 bg-card/30 backdrop-blur">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Database size={28} className="text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">ICT Knowledge Engine</h1>
              <p className="text-xs text-muted-foreground">AI-Powered Structured Database</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="dashboard" className="gap-2">
              <Database size={16} />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="explorer" className="gap-2">
              <Tree size={16} />
              Explorer
            </TabsTrigger>
            <TabsTrigger value="search" className="gap-2">
              <Sparkle size={16} />
              Search
            </TabsTrigger>
            <TabsTrigger value="graph" className="gap-2">
              <Graph size={16} />
              Graph
            </TabsTrigger>
            <TabsTrigger value="patterns" className="gap-2">
              <Brain size={16} />
              Patterns
            </TabsTrigger>
            <TabsTrigger value="training" className="gap-2">
              <GraduationCap size={16} />
              Training
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="gap-2">
              <MagicWand size={16} />
              Recommendations
            </TabsTrigger>
            <TabsTrigger value="skills" className="gap-2">
              <Lightning size={16} />
              Skills
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <ChartLine size={16} />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="upload" className="gap-2">
              <Upload size={16} />
              Upload
            </TabsTrigger>
            <TabsTrigger value="chat" className="gap-2">
              <ChatsCircle size={16} />
              Chat
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DashboardView stats={stats} />
          </TabsContent>

          <TabsContent value="explorer">
            <ExplorerView 
              entities={safeEntities} 
              onEntitySelect={handleEntitySelect}
              onBatchReclassify={handleBatchReclassify}
              onBatchDelete={handleBatchDelete}
            />
          </TabsContent>

          <TabsContent value="search">
            <SemanticSearchView
              entities={safeEntities}
              aiGraph={aiGraphRef.current}
              onEntitySelect={handleEntitySelect}
            />
          </TabsContent>

          <TabsContent value="graph">
            <GraphView 
              entities={safeEntities}
              relationships={safeRelationships}
              onEntitySelect={handleEntitySelect}
            />
          </TabsContent>

          <TabsContent value="patterns">
            <PatternsView
              entities={safeEntities}
              relationships={safeRelationships}
              onEntitySelect={handleEntitySelect}
            />
          </TabsContent>

          <TabsContent value="training">
            <TrainingView
              entities={safeEntities}
              relationships={safeRelationships}
              onEntitySelect={handleEntitySelect}
            />
          </TabsContent>

          <TabsContent value="recommendations">
            <RecommendationsView
              entities={safeEntities}
              relationships={safeRelationships}
              aiGraph={aiGraphRef.current}
              onEntitySelect={handleEntitySelect}
            />
          </TabsContent>

          <TabsContent value="skills">
            <SkillsView
              entities={safeEntities}
              relationships={safeRelationships}
              aiGraph={aiGraphRef.current}
              onEntitySelect={handleEntitySelect}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsView
              entities={safeEntities}
            />
          </TabsContent>

          <TabsContent value="upload">
            <UploadView
              uploads={safeUploads}
              logs={safeLogs}
              onFileUpload={handleFileUpload}
              onRepoUpload={handleRepoUpload}
              onDemoLoad={handleDemoLoad}
            />
          </TabsContent>

          <TabsContent value="chat">
            <ChatView
              entities={safeEntities}
              onAskQuestion={handleAskQuestion}
            />
          </TabsContent>
        </Tabs>
      </main>

      <EntityDetailDialog
        entity={selectedEntity}
        relationships={safeRelationships}
        allEntities={safeEntities}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        onEntityClick={handleEntitySelect}
      />

      <Toaster position="top-right" />
    </div>
  );
}

export default App;