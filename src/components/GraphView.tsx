import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowsClockwise, MagnifyingGlassMinus, MagnifyingGlassPlus, Target, Path, Play, Pause } from '@phosphor-icons/react';
import type { Entity, Relationship, EntityType, RelationshipType } from '@/lib/types';

interface GraphViewProps {
  entities: Entity[];
  relationships: Relationship[];
  onEntitySelect: (entity: Entity) => void;
}

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  type: EntityType;
  name: string;
  entity: Entity;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
  type: RelationshipType;
}

const entityColors: Record<EntityType, string> = {
  concept: '#00ff88',
  model: '#00d4ff',
  trade: '#ff3366',
  schema: '#ffd700',
  code_module: '#9d4edd',
  document: '#ff6b35',
  journal: '#fb8500',
  training_data: '#06ffa5',
  chart: '#4cc9f0'
};

const entityLabels: Record<EntityType, string> = {
  concept: 'Concept',
  model: 'Model',
  trade: 'Trade',
  schema: 'Schema',
  code_module: 'Code',
  document: 'Document',
  journal: 'Journal',
  training_data: 'Training',
  chart: 'Chart'
};

export function GraphView({ entities, relationships, onEntitySelect }: GraphViewProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const animationFrameRef = useRef<number>();
  
  const [selectedTypes, setSelectedTypes] = useState<EntityType[]>([]);
  const [zoom, setZoom] = useState(1);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [focusedNode, setFocusedNode] = useState<GraphNode | null>(null);
  const [showChainOnly, setShowChainOnly] = useState(false);
  const [animateFlow, setAnimateFlow] = useState(true);

  const getChainEntitiesAndRelationships = () => {
    const conceptIds = new Set(entities.filter(e => e.type === 'concept').map(e => e.id));
    const modelIds = new Set(entities.filter(e => e.type === 'model').map(e => e.id));
    const tradeIds = new Set(entities.filter(e => e.type === 'trade').map(e => e.id));

    const conceptToModelRels = relationships.filter(r => 
      (r.type === 'CONCEPT_USED_IN_MODEL' && conceptIds.has(r.sourceId) && modelIds.has(r.targetId)) ||
      (r.type === 'TRADE_USES_CONCEPT' && conceptIds.has(r.targetId) && modelIds.has(r.sourceId))
    );

    const modelToTradeRels = relationships.filter(r => 
      r.type === 'MODEL_PRODUCES_TRADE' && modelIds.has(r.sourceId) && tradeIds.has(r.targetId)
    );

    const conceptsInChain = new Set<string>();
    const modelsInChain = new Set<string>();
    const tradesInChain = new Set<string>();

    modelToTradeRels.forEach(rel => {
      const modelId = rel.sourceId;
      const tradeId = rel.targetId;
      
      const hasConceptConnection = conceptToModelRels.some(cRel => 
        cRel.targetId === modelId || cRel.sourceId === modelId
      );

      if (hasConceptConnection) {
        modelsInChain.add(modelId);
        tradesInChain.add(tradeId);
        
        conceptToModelRels.forEach(cRel => {
          if (cRel.targetId === modelId) {
            conceptsInChain.add(cRel.sourceId);
          } else if (cRel.sourceId === modelId) {
            conceptsInChain.add(cRel.targetId);
          }
        });
      }
    });

    const chainEntityIds = new Set([...conceptsInChain, ...modelsInChain, ...tradesInChain]);
    const chainEntities = entities.filter(e => chainEntityIds.has(e.id));
    const chainRelationships = relationships.filter(r => 
      chainEntityIds.has(r.sourceId) && chainEntityIds.has(r.targetId)
    );

    return { chainEntities, chainRelationships };
  };

  let filteredEntities = selectedTypes.length > 0
    ? entities.filter(e => selectedTypes.includes(e.type))
    : entities;

  let filteredRelationships = relationships.filter(r => 
    filteredEntities.some(e => e.id === r.sourceId) &&
    filteredEntities.some(e => e.id === r.targetId)
  );

  if (showChainOnly) {
    const { chainEntities, chainRelationships } = getChainEntitiesAndRelationships();
    filteredEntities = chainEntities;
    filteredRelationships = chainRelationships;
  }

  const getConnectedNodeIds = (nodeId: string): Set<string> => {
    const connected = new Set<string>();
    connected.add(nodeId);
    filteredRelationships.forEach(rel => {
      if (rel.sourceId === nodeId) connected.add(rel.targetId);
      if (rel.targetId === nodeId) connected.add(rel.sourceId);
    });
    return connected;
  };

  const getPathNodes = (startNodeId: string, maxDepth: number = 3): Set<string> => {
    const visited = new Set<string>();
    const queue: Array<{id: string; depth: number}> = [{id: startNodeId, depth: 0}];
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current.depth > maxDepth || visited.has(current.id)) continue;
      
      visited.add(current.id);
      
      filteredRelationships.forEach(rel => {
        if (rel.sourceId === current.id && !visited.has(rel.targetId)) {
          queue.push({id: rel.targetId, depth: current.depth + 1});
        }
        if (rel.targetId === current.id && !visited.has(rel.sourceId)) {
          queue.push({id: rel.sourceId, depth: current.depth + 1});
        }
      });
    }
    
    return visited;
  };

  const getPathEdges = (nodeIds: Set<string>): Set<string> => {
    const pathEdges = new Set<string>();
    filteredRelationships.forEach(rel => {
      if (nodeIds.has(rel.sourceId) && nodeIds.has(rel.targetId)) {
        pathEdges.add(`${rel.sourceId}-${rel.targetId}`);
      }
    });
    return pathEdges;
  };

  useEffect(() => {
    if (!svgRef.current || filteredEntities.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const nodes: GraphNode[] = filteredEntities.map(e => ({
      id: e.id,
      type: e.type,
      name: e.name,
      entity: e
    }));

    const links: GraphLink[] = filteredRelationships.map(r => ({
      source: r.sourceId,
      target: r.targetId,
      type: r.type
    }));

    const simulation = d3.forceSimulation<GraphNode>(nodes)
      .force('link', d3.forceLink<GraphNode, GraphLink>(links)
        .id(d => d.id)
        .distance(150))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(40))
      .alphaDecay(0.02);

    const g = svg.append('g');

    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        setZoom(event.transform.k);
      });

    svg.call(zoomBehavior);

    const defs = g.append('defs');
    
    defs.append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 35)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#35354a');

    defs.append('marker')
      .attr('id', 'arrowhead-flow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 35)
      .attr('refY', 0)
      .attr('markerWidth', 7)
      .attr('markerHeight', 7)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#00ff88');

    const linkGroup = g.append('g');

    const link = linkGroup
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#35354a')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 2)
      .attr('class', 'graph-link')
      .attr('marker-end', 'url(#arrowhead)');

    const flowPaths = linkGroup
      .selectAll('circle.flow-particle')
      .data(links.filter(l => {
        const sourceId = typeof l.source === 'string' ? l.source : l.source.id;
        const targetId = typeof l.target === 'string' ? l.target : l.target.id;
        const source = nodes.find(n => n.id === sourceId);
        const target = nodes.find(n => n.id === targetId);
        if (!source || !target) return false;
        return (source.type === 'concept' && target.type === 'model') ||
               (source.type === 'model' && target.type === 'trade') ||
               (l.type === 'CONCEPT_USED_IN_MODEL' || l.type === 'MODEL_PRODUCES_TRADE');
      }))
      .join('circle')
      .attr('class', 'flow-particle')
      .attr('r', 4)
      .attr('fill', d => {
        const sourceId = typeof d.source === 'string' ? d.source : d.source.id;
        const source = nodes.find(n => n.id === sourceId);
        return source?.type === 'concept' ? '#00ff88' : '#00d4ff';
      })
      .attr('opacity', 0)
      .style('pointer-events', 'none');

    const linkLabels = g.append('g')
      .selectAll('text')
      .data(links)
      .join('text')
      .attr('font-size', 10)
      .attr('fill', '#65657a')
      .attr('text-anchor', 'middle')
      .attr('dy', -5)
      .attr('pointer-events', 'none')
      .text(d => {
        const typeMap: Record<RelationshipType, string> = {
          'CONCEPT_USED_IN_MODEL': 'used in',
          'MODEL_PRODUCES_TRADE': 'produces',
          'CONCEPT_RELATED_TO': 'related',
          'CONCEPT_DETECTED_BY': 'detected by',
          'TRADE_USES_CONCEPT': 'uses',
          'SCHEMA_VALIDATES': 'validates',
          'DOCUMENT_DEFINES': 'defines',
          'CONCEPT_PREREQUISITE': 'requires'
        };
        return typeMap[d.type] || '';
      });

    const animateFlowParticles = () => {
      if (!animateFlow) {
        flowPaths.attr('opacity', 0);
        return;
      }

      const duration = 2000;
      const startTime = Date.now();

      const animate = () => {
        if (!animateFlow) {
          flowPaths.attr('opacity', 0);
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }
          return;
        }

        const elapsed = Date.now() - startTime;
        const progress = (elapsed % duration) / duration;

        flowPaths.each(function(d) {
          const source = d.source as GraphNode;
          const target = d.target as GraphNode;
          
          if (!source.x || !source.y || !target.x || !target.y) return;

          const x = source.x + (target.x - source.x) * progress;
          const y = source.y + (target.y - source.y) * progress;

          const fadeIn = progress < 0.1 ? progress / 0.1 : 1;
          const fadeOut = progress > 0.9 ? (1 - progress) / 0.1 : 1;
          const opacity = Math.min(fadeIn, fadeOut) * 0.8;

          d3.select(this)
            .attr('cx', x)
            .attr('cy', y)
            .attr('opacity', opacity);
        });

        animationFrameRef.current = requestAnimationFrame(animate);
      };

      animate();
    };

    const drag = d3.drag<SVGGElement, GraphNode>()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    const node = g.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('cursor', 'pointer')
      .call(drag as any);

    node.append('circle')
      .attr('r', 30)
      .attr('fill', d => entityColors[d.type])
      .attr('stroke', d => d3.color(entityColors[d.type])?.brighter(0.5)?.toString() || entityColors[d.type])
      .attr('stroke-width', 3)
      .attr('opacity', 0.9);

    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', 50)
      .attr('font-size', 12)
      .attr('font-weight', 500)
      .attr('fill', '#e0e0e0')
      .attr('pointer-events', 'none')
      .text(d => {
        const maxLength = 20;
        return d.name.length > maxLength ? d.name.substring(0, maxLength) + '...' : d.name;
      });

    const updateFocusMode = (focusNodeId: string | null) => {
      if (focusNodeId) {
        const pathNodes = getPathNodes(focusNodeId);
        const pathEdges = getPathEdges(pathNodes);
        
        node.each(function(d) {
          const isInPath = pathNodes.has(d.id);
          const isFocused = d.id === focusNodeId;
          d3.select(this)
            .select('circle')
            .attr('opacity', isInPath ? 0.9 : 0.2)
            .attr('r', isFocused ? 35 : 30);
          
          d3.select(this)
            .select('text')
            .attr('opacity', isInPath ? 1 : 0.3);
        });
        
        link.each(function(l) {
          const sourceId = typeof l.source === 'string' ? l.source : l.source.id;
          const targetId = typeof l.target === 'string' ? l.target : l.target.id;
          const edgeKey = `${sourceId}-${targetId}`;
          const isInPath = pathEdges.has(edgeKey);
          
          d3.select(this)
            .attr('stroke-opacity', isInPath ? 0.8 : 0.1)
            .attr('stroke-width', isInPath ? 3 : 2)
            .attr('stroke', isInPath ? '#00ff88' : '#35354a');
        });
        
        linkLabels.each(function(l) {
          const sourceId = typeof l.source === 'string' ? l.source : l.source.id;
          const targetId = typeof l.target === 'string' ? l.target : l.target.id;
          const edgeKey = `${sourceId}-${targetId}`;
          const isInPath = pathEdges.has(edgeKey);
          
          d3.select(this)
            .attr('opacity', isInPath ? 1 : 0);
        });
      } else {
        node.selectAll('circle')
          .attr('opacity', 0.9)
          .attr('r', 30);
        
        node.selectAll('text')
          .attr('opacity', 1);
        
        link
          .attr('stroke-opacity', 0.6)
          .attr('stroke-width', 2)
          .attr('stroke', '#35354a');
        
        linkLabels
          .attr('opacity', 1);
      }
    };

    node.on('click', (event, d) => {
      event.stopPropagation();
      if (event.shiftKey) {
        if (focusedNode?.id === d.id) {
          setFocusedNode(null);
        } else {
          setFocusedNode(d);
        }
      } else {
        onEntitySelect(d.entity);
      }
    })
    .on('mouseenter', (event, d) => {
      if (!focusedNode) {
        setHoveredNode(d);
        d3.select(event.currentTarget)
          .select('circle')
          .transition()
          .duration(200)
          .attr('r', 35)
          .attr('stroke-width', 5);
      }
    })
    .on('mouseleave', (event) => {
      if (!focusedNode) {
        setHoveredNode(null);
        d3.select(event.currentTarget)
          .select('circle')
          .transition()
          .duration(200)
          .attr('r', 30)
          .attr('stroke-width', 3);
      }
    });

    let tickCount = 0;
    simulation.on('tick', () => {
      tickCount++;
      
      link
        .attr('x1', d => (d.source as GraphNode).x ?? 0)
        .attr('y1', d => (d.source as GraphNode).y ?? 0)
        .attr('x2', d => (d.target as GraphNode).x ?? 0)
        .attr('y2', d => (d.target as GraphNode).y ?? 0);

      linkLabels
        .attr('x', d => ((d.source as GraphNode).x! + (d.target as GraphNode).x!) / 2)
        .attr('y', d => ((d.source as GraphNode).y! + (d.target as GraphNode).y!) / 2);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
      
      if (tickCount > 300) {
        simulation.stop();
      }
    });

    if (focusedNode) {
      updateFocusMode(focusedNode.id);
    }

    animateFlowParticles();

    return () => {
      simulation.stop();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [filteredEntities, filteredRelationships, onEntitySelect, focusedNode, animateFlow]);

  const handleReset = () => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition()
      .duration(750)
      .call(
        d3.zoom<SVGSVGElement, unknown>().transform as any,
        d3.zoomIdentity
      );
    setZoom(1);
  };

  const handleZoomIn = () => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition()
      .duration(300)
      .call(
        d3.zoom<SVGSVGElement, unknown>().scaleBy as any,
        1.3
      );
  };

  const handleZoomOut = () => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition()
      .duration(300)
      .call(
        d3.zoom<SVGSVGElement, unknown>().scaleBy as any,
        0.7
      );
  };

  const handleTypeFilter = (type: EntityType) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const uniqueTypes = Array.from(new Set(entities.map(e => e.type)));

  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-12rem)]">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          {uniqueTypes.map(type => (
            <Badge
              key={type}
              variant={selectedTypes.includes(type) ? 'default' : 'outline'}
              className="cursor-pointer transition-all"
              style={{
                backgroundColor: selectedTypes.includes(type) ? entityColors[type] : 'transparent',
                borderColor: entityColors[type],
                color: selectedTypes.includes(type) ? '#0f0f1a' : entityColors[type]
              }}
              onClick={() => handleTypeFilter(type)}
            >
              {entityLabels[type]}
            </Badge>
          ))}
          {selectedTypes.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedTypes([])}
              className="text-xs"
            >
              Clear filters
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card/50 border border-border">
            <Label htmlFor="animate-flow" className="text-xs cursor-pointer">
              Animate Flow
            </Label>
            <Switch
              id="animate-flow"
              checked={animateFlow}
              onCheckedChange={setAnimateFlow}
            />
          </div>

          <Button
            variant={showChainOnly ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowChainOnly(!showChainOnly)}
            className="gap-2"
          >
            <Path size={16} />
            {showChainOnly ? 'Chain View' : 'All Entities'}
          </Button>
          
          <span className="text-xs text-muted-foreground">
            {filteredEntities.length} nodes · {filteredRelationships.length} edges
          </span>
          
          <div className="flex items-center gap-1 border border-border rounded-lg p-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleZoomOut}
            >
              <MagnifyingGlassMinus size={16} />
            </Button>
            <span className="text-xs text-muted-foreground w-12 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleZoomIn}
            >
              <MagnifyingGlassPlus size={16} />
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="gap-2"
          >
            <Target size={16} />
            Reset View
          </Button>
        </div>
      </div>

      <Card className="flex-1 relative overflow-hidden bg-card/50 border-border/50">
        <svg
          ref={svgRef}
          className="w-full h-full"
          style={{ background: 'radial-gradient(circle at center, oklch(0.18 0.02 264) 0%, oklch(0.15 0.02 264) 100%)' }}
        />

        {hoveredNode && !focusedNode && (
          <div 
            className="absolute top-4 left-4 bg-card/95 border border-border rounded-lg p-4 max-w-xs backdrop-blur-sm shadow-xl"
          >
            <div className="flex items-center gap-2 mb-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entityColors[hoveredNode.type] }}
              />
              <Badge variant="outline" className="text-xs">
                {entityLabels[hoveredNode.type]}
              </Badge>
            </div>
            <h4 className="font-semibold text-sm mb-1">{hoveredNode.name}</h4>
            {hoveredNode.entity.description && (
              <p className="text-xs text-muted-foreground line-clamp-3">
                {hoveredNode.entity.description}
              </p>
            )}
            <div className="mt-3 pt-3 border-t border-border/50">
              <p className="text-xs text-muted-foreground">
                Click to view details • Shift+Click to focus
              </p>
            </div>
          </div>
        )}

        {focusedNode && (
          <div 
            className="absolute top-4 left-4 bg-accent/95 border border-accent rounded-lg p-4 max-w-sm backdrop-blur-sm shadow-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entityColors[focusedNode.type] }}
                />
                <Badge variant="outline" className="text-xs bg-accent-foreground/10">
                  {entityLabels[focusedNode.type]}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => setFocusedNode(null)}
              >
                Clear
              </Button>
            </div>
            <h4 className="font-semibold text-sm mb-1 text-accent-foreground">{focusedNode.name}</h4>
            <p className="text-xs text-accent-foreground/80 mb-3">
              Showing full connection path (up to 3 degrees)
            </p>
            <div className="pt-3 border-t border-accent-foreground/20 space-y-2">
              <p className="text-xs text-accent-foreground/70">
                {(() => {
                  const pathNodes = getPathNodes(focusedNode.id);
                  const pathEdges = getPathEdges(pathNodes);
                  return `${pathNodes.size} entities in path • ${pathEdges.size} connections`;
                })()}
              </p>
              {(() => {
                const pathNodes = getPathNodes(focusedNode.id);
                const nodesByType = filteredEntities
                  .filter(e => pathNodes.has(e.id) && e.id !== focusedNode.id)
                  .reduce((acc, e) => {
                    if (!acc[e.type]) acc[e.type] = [];
                    acc[e.type].push(e.name);
                    return acc;
                  }, {} as Record<EntityType, string[]>);
                
                return Object.entries(nodesByType).length > 0 ? (
                  <div className="space-y-1">
                    {Object.entries(nodesByType).map(([type, names]) => (
                      <div key={type} className="flex items-start gap-2">
                        <div 
                          className="w-2 h-2 rounded-full mt-1 flex-shrink-0"
                          style={{ backgroundColor: entityColors[type as EntityType] }}
                        />
                        <span className="text-xs text-accent-foreground/70">
                          {names.length} {entityLabels[type as EntityType]}{names.length > 1 ? 's' : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : null;
              })()}
            </div>
          </div>
        )}

        {filteredEntities.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">No entities to display</p>
              <p className="text-sm text-muted-foreground">
                {showChainOnly 
                  ? 'No complete concept→model→trade chains found'
                  : selectedTypes.length > 0 
                    ? 'Try adjusting your filters' 
                    : 'Load demo data to explore the knowledge graph'}
              </p>
            </div>
          </div>
        )}
      </Card>

      <Card className="bg-card/30 border-border/50 p-4">
        <div className="flex items-start gap-6">
          <div>
            <h4 className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Legend</h4>
            <div className="flex flex-wrap gap-3">
              {Object.entries(entityLabels).map(([type, label]) => (
                <div key={type} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entityColors[type as EntityType] }}
                  />
                  <span className="text-xs text-foreground/80">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Controls</h4>
            <ul className="text-xs text-foreground/70 space-y-1">
              <li>• Drag nodes to reposition</li>
              <li>• Scroll or pinch to zoom</li>
              <li>• Click node to view details</li>
              <li>• <span className="font-semibold text-accent">Shift+Click</span> node to focus connections</li>
              <li>• Click badges to filter by type</li>
              <li>• <span className="font-semibold text-accent">Chain View</span> shows only concept→model→trade paths</li>
              <li>• <span className="font-semibold text-primary">Animate Flow</span> highlights the data flow from concepts to trades</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
