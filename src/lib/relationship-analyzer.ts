import type { Entity, Relationship, EntityType, RelationshipType } from './types';

export interface RelationshipPattern {
  id: string;
  type: 'chain' | 'hub' | 'cluster' | 'bridge';
  name: string;
  description: string;
  entities: Entity[];
  relationships: Relationship[];
  strength: number;
  insights: string[];
}

export interface ConceptPattern {
  concept: Entity;
  relatedModels: Entity[];
  relatedTrades: Entity[];
  usageFrequency: number;
  successRate?: number;
  commonPairings: Array<{ concept: Entity; count: number }>;
}

export async function analyzeRelationshipPatterns(
  entities: Entity[],
  relationships: Relationship[]
): Promise<RelationshipPattern[]> {
  const patterns: RelationshipPattern[] = [];

  const chains = detectConceptModelTradeChains(entities, relationships);
  patterns.push(...chains);

  const hubs = detectHubEntities(entities, relationships);
  patterns.push(...hubs);

  const clusters = detectClusters(entities, relationships);
  patterns.push(...clusters);

  const bridges = detectBridgeEntities(entities, relationships);
  patterns.push(...bridges);

  return patterns;
}

function detectConceptModelTradeChains(
  entities: Entity[],
  relationships: Relationship[]
): RelationshipPattern[] {
  const patterns: RelationshipPattern[] = [];
  const concepts = entities.filter(e => e.type === 'concept');

  for (const concept of concepts) {
    const modelsConnected = relationships
      .filter(r => 
        r.type === 'CONCEPT_USED_IN_MODEL' && 
        r.sourceId === concept.id
      )
      .map(r => entities.find(e => e.id === r.targetId))
      .filter(Boolean) as Entity[];

    for (const model of modelsConnected) {
      const tradesConnected = relationships
        .filter(r => 
          r.type === 'MODEL_PRODUCES_TRADE' && 
          r.sourceId === model.id
        )
        .map(r => entities.find(e => e.id === r.targetId))
        .filter(Boolean) as Entity[];

      if (tradesConnected.length > 0) {
        const chainEntities = [concept, model, ...tradesConnected];
        const chainRels = relationships.filter(r =>
          chainEntities.some(e => e.id === r.sourceId) &&
          chainEntities.some(e => e.id === r.targetId)
        );

        patterns.push({
          id: `chain-${concept.id}-${model.id}`,
          type: 'chain',
          name: `${concept.name} → ${model.name} Chain`,
          description: `Concept "${concept.name}" flows through model "${model.name}" to produce ${tradesConnected.length} trade(s)`,
          entities: chainEntities,
          relationships: chainRels,
          strength: tradesConnected.length / 10,
          insights: [
            `This concept is actively used in trading`,
            `Model "${model.name}" applies this concept ${tradesConnected.length} time(s)`,
            tradesConnected.length > 3 ? 'High-frequency pattern' : 'Emerging pattern'
          ]
        });
      }
    }
  }

  return patterns;
}

function detectHubEntities(
  entities: Entity[],
  relationships: Relationship[]
): RelationshipPattern[] {
  const patterns: RelationshipPattern[] = [];
  
  const connectionCounts = new Map<string, number>();
  relationships.forEach(r => {
    connectionCounts.set(r.sourceId, (connectionCounts.get(r.sourceId) || 0) + 1);
    connectionCounts.set(r.targetId, (connectionCounts.get(r.targetId) || 0) + 1);
  });

  const hubThreshold = Math.max(5, relationships.length / entities.length);
  
  for (const [entityId, count] of connectionCounts.entries()) {
    if (count >= hubThreshold) {
      const hubEntity = entities.find(e => e.id === entityId);
      if (!hubEntity) continue;

      const connectedRels = relationships.filter(
        r => r.sourceId === entityId || r.targetId === entityId
      );
      
      const connectedEntityIds = new Set<string>();
      connectedRels.forEach(r => {
        connectedEntityIds.add(r.sourceId);
        connectedEntityIds.add(r.targetId);
      });
      
      const connectedEntities = entities.filter(e => connectedEntityIds.has(e.id));

      patterns.push({
        id: `hub-${entityId}`,
        type: 'hub',
        name: `${hubEntity.name} Hub`,
        description: `"${hubEntity.name}" is a central ${hubEntity.type} connected to ${count} other entities`,
        entities: connectedEntities,
        relationships: connectedRels,
        strength: count / (entities.length * 0.5),
        insights: [
          `This ${hubEntity.type} is highly interconnected`,
          `Connected to ${connectedEntities.length} entities`,
          'Consider this a foundational element in your trading system'
        ]
      });
    }
  }

  return patterns;
}

function detectClusters(
  entities: Entity[],
  relationships: Relationship[]
): RelationshipPattern[] {
  const patterns: RelationshipPattern[] = [];
  
  const visited = new Set<string>();
  
  for (const entity of entities) {
    if (visited.has(entity.id)) continue;
    
    const cluster = new Set<string>([entity.id]);
    const queue = [entity.id];
    
    while (queue.length > 0) {
      const currentId = queue.shift()!;
      visited.add(currentId);
      
      const neighbors = relationships
        .filter(r => r.sourceId === currentId || r.targetId === currentId)
        .map(r => r.sourceId === currentId ? r.targetId : r.sourceId)
        .filter(id => !visited.has(id));
      
      neighbors.forEach(id => {
        if (!cluster.has(id) && cluster.size < 8) {
          cluster.add(id);
          queue.push(id);
        }
      });
    }
    
    if (cluster.size >= 3) {
      const clusterEntities = entities.filter(e => cluster.has(e.id));
      const clusterRels = relationships.filter(
        r => cluster.has(r.sourceId) && cluster.has(r.targetId)
      );
      
      const typeDistribution = clusterEntities.reduce((acc, e) => {
        acc[e.type] = (acc[e.type] || 0) + 1;
        return acc;
      }, {} as Record<EntityType, number>);
      
      const dominantType = Object.entries(typeDistribution)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'mixed';

      patterns.push({
        id: `cluster-${entity.id}`,
        type: 'cluster',
        name: `${dominantType.charAt(0).toUpperCase() + dominantType.slice(1)} Cluster`,
        description: `A group of ${cluster.size} closely related entities`,
        entities: clusterEntities,
        relationships: clusterRels,
        strength: clusterRels.length / (cluster.size * (cluster.size - 1) / 2),
        insights: [
          `Contains ${cluster.size} interconnected entities`,
          `Primarily ${dominantType} entities`,
          'These entities form a cohesive knowledge unit'
        ]
      });
    }
  }

  return patterns.slice(0, 5);
}

function detectBridgeEntities(
  entities: Entity[],
  relationships: Relationship[]
): RelationshipPattern[] {
  const patterns: RelationshipPattern[] = [];
  
  for (const entity of entities) {
    const connectedRels = relationships.filter(
      r => r.sourceId === entity.id || r.targetId === entity.id
    );
    
    if (connectedRels.length < 2) continue;
    
    const connectedEntityIds = new Set<string>();
    connectedRels.forEach(r => {
      if (r.sourceId !== entity.id) connectedEntityIds.add(r.sourceId);
      if (r.targetId !== entity.id) connectedEntityIds.add(r.targetId);
    });
    
    const connectedEntities = entities.filter(e => connectedEntityIds.has(e.id));
    
    const typeGroups = connectedEntities.reduce((acc, e) => {
      if (!acc[e.type]) acc[e.type] = [];
      acc[e.type].push(e);
      return acc;
    }, {} as Record<EntityType, Entity[]>);
    
    if (Object.keys(typeGroups).length >= 2) {
      patterns.push({
        id: `bridge-${entity.id}`,
        type: 'bridge',
        name: `${entity.name} Bridge`,
        description: `"${entity.name}" connects ${Object.keys(typeGroups).length} different types of entities`,
        entities: [entity, ...connectedEntities],
        relationships: connectedRels,
        strength: Object.keys(typeGroups).length / 5,
        insights: [
          `Bridges ${Object.keys(typeGroups).join(', ')} entities`,
          'Critical connection point in knowledge graph',
          'Removing this entity would fragment the graph'
        ]
      });
    }
  }

  return patterns.sort((a, b) => b.strength - a.strength).slice(0, 5);
}

export async function analyzeConceptPatterns(
  entities: Entity[],
  relationships: Relationship[]
): Promise<ConceptPattern[]> {
  const concepts = entities.filter(e => e.type === 'concept');
  const models = entities.filter(e => e.type === 'model');
  const trades = entities.filter(e => e.type === 'trade');

  const patterns: ConceptPattern[] = [];

  for (const concept of concepts) {
    const relatedModels = relationships
      .filter(r => 
        r.type === 'CONCEPT_USED_IN_MODEL' && r.sourceId === concept.id
      )
      .map(r => models.find(m => m.id === r.targetId))
      .filter(Boolean) as Entity[];

    const modelIds = new Set(relatedModels.map(m => m.id));
    const relatedTrades = relationships
      .filter(r => 
        r.type === 'MODEL_PRODUCES_TRADE' && modelIds.has(r.sourceId)
      )
      .map(r => trades.find(t => t.id === r.targetId))
      .filter(Boolean) as Entity[];

    const directTrades = relationships
      .filter(r => 
        r.type === 'TRADE_USES_CONCEPT' && r.targetId === concept.id
      )
      .map(r => trades.find(t => t.id === r.sourceId))
      .filter(Boolean) as Entity[];

    const allRelatedTrades = [...relatedTrades, ...directTrades];

    const successfulTrades = allRelatedTrades.filter(
      t => t.metadata?.result === 'win' || t.metadata?.meta?.example_type === 'positive'
    );
    
    const successRate = allRelatedTrades.length > 0
      ? successfulTrades.length / allRelatedTrades.length
      : undefined;

    const coOccurringConcepts = relationships
      .filter(r => r.type === 'CONCEPT_RELATED_TO' && r.sourceId === concept.id)
      .map(r => concepts.find(c => c.id === r.targetId))
      .filter(Boolean) as Entity[];

    const commonPairings = coOccurringConcepts.map(c => ({
      concept: c,
      count: relationships.filter(r => 
        (r.sourceId === concept.id && r.targetId === c.id) ||
        (r.targetId === concept.id && r.sourceId === c.id)
      ).length
    }));

    patterns.push({
      concept,
      relatedModels,
      relatedTrades: allRelatedTrades,
      usageFrequency: allRelatedTrades.length,
      successRate,
      commonPairings
    });
  }

  return patterns.sort((a, b) => b.usageFrequency - a.usageFrequency);
}

export async function generatePatternInsights(
  patterns: RelationshipPattern[],
  conceptPatterns: ConceptPattern[]
): Promise<string> {
  const prompt = window.spark.llmPrompt`You are an ICT trading methodology expert analyzing knowledge graph patterns.

I've detected the following relationship patterns in the trading knowledge base:

${JSON.stringify(patterns.map(p => ({
  type: p.type,
  name: p.name,
  description: p.description,
  entityCount: p.entities.length,
  relationshipCount: p.relationships.length,
  strength: p.strength
})), null, 2)}

And the following concept usage patterns:

${JSON.stringify(conceptPatterns.slice(0, 10).map(cp => ({
  concept: cp.concept.name,
  usedInModels: cp.relatedModels.length,
  usedInTrades: cp.relatedTrades.length,
  successRate: cp.successRate,
  commonPairings: cp.commonPairings.slice(0, 3).map(p => p.concept.name)
})), null, 2)}

Provide a detailed analysis covering:
1. **Most Significant Patterns**: Which patterns are most important and why
2. **Concept Effectiveness**: Which concepts show high success rates and should be prioritized
3. **Knowledge Gaps**: What relationships or patterns are missing that would improve the trading system
4. **Recommendations**: Specific actionable insights for improving the trading methodology

Format your response as markdown with clear sections.`;

  const response = await window.spark.llm(prompt, 'gpt-4o');
  return response;
}
