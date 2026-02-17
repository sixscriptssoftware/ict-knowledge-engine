import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowsClockwise, MagnifyingGlassMinus, MagnifyingGlassPlus, Target } from '@phosphor-icons/react';
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
  const [selectedTypes, setSelectedTypes] = useState<EntityType[]>([]);
  const [zoom, setZoom] = useState(1);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [focusedNode, setFocusedNode] = useState<GraphNode | null>(null);

  const filteredEntities = selectedTypes.length > 0
    ? entities.filter(e => selectedTypes.includes(e.type))
    : entities;

  const filteredRelationships = relationships.filter(r => 
    filteredEntities.some(e => e.id === r.sourceId) &&
    filteredEntities.some(e => e.id === r.targetId)
  );

  const getConnectedNodeIds = (nodeId: string): Set<string> => {
    const connected = new Set<string>();
    connected.add(nodeId);
    filteredRelationships.forEach(rel => {
      if (rel.sourceId === nodeId) connected.add(rel.targetId);
      if (rel.targetId === nodeId) connected.add(rel.sourceId);
    });
    return connected;
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
      .force('collision', d3.forceCollide().radius(40));

    const g = svg.append('g');

    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        setZoom(event.transform.k);
      });

    svg.call(zoomBehavior);

    const link = g.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#35354a')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 2)
      .attr('class', 'graph-link');

    const linkLabels = g.append('g')
      .selectAll('text')
      .data(links)
      .join('text')
      .attr('font-size', 10)
      .attr('fill', '#65657a')
      .attr('text-anchor', 'middle')
      .attr('dy', -5)
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
      .text(d => {
        const maxLength = 20;
        return d.name.length > maxLength ? d.name.substring(0, maxLength) + '...' : d.name;
      });

    const updateFocusMode = (focusNodeId: string | null) => {
      if (focusNodeId) {
        const connected = getConnectedNodeIds(focusNodeId);
        
        node.each(function(d) {
          const isConnected = connected.has(d.id);
          d3.select(this)
            .select('circle')
            .transition()
            .duration(300)
            .attr('opacity', isConnected ? 0.9 : 0.2)
            .attr('r', d.id === focusNodeId ? 35 : 30);
          
          d3.select(this)
            .select('text')
            .transition()
            .duration(300)
            .attr('opacity', isConnected ? 1 : 0.3);
        });
        
        link.each(function(l) {
          const sourceId = typeof l.source === 'string' ? l.source : l.source.id;
          const targetId = typeof l.target === 'string' ? l.target : l.target.id;
          const isConnected = (sourceId === focusNodeId || targetId === focusNodeId);
          
          d3.select(this)
            .transition()
            .duration(300)
            .attr('stroke-opacity', isConnected ? 0.8 : 0.1)
            .attr('stroke-width', isConnected ? 3 : 2);
        });
        
        linkLabels.each(function(l) {
          const sourceId = typeof l.source === 'string' ? l.source : l.source.id;
          const targetId = typeof l.target === 'string' ? l.target : l.target.id;
          const isConnected = (sourceId === focusNodeId || targetId === focusNodeId);
          
          d3.select(this)
            .transition()
            .duration(300)
            .attr('opacity', isConnected ? 1 : 0);
        });
      } else {
        node.selectAll('circle')
          .transition()
          .duration(300)
          .attr('opacity', 0.9)
          .attr('r', 30);
        
        node.selectAll('text')
          .transition()
          .duration(300)
          .attr('opacity', 1);
        
        link
          .transition()
          .duration(300)
          .attr('stroke-opacity', 0.6)
          .attr('stroke-width', 2);
        
        linkLabels
          .transition()
          .duration(300)
          .attr('opacity', 1);
      }
    };

    node.on('click', (event, d) => {
      if (event.shiftKey) {
        if (focusedNode?.id === d.id) {
          setFocusedNode(null);
          updateFocusMode(null);
        } else {
          setFocusedNode(d);
          updateFocusMode(d.id);
        }
      } else {
        onEntitySelect(d.entity);
      }
    })
    .on('mouseenter', (event, d) => {
      setHoveredNode(d);
      if (!focusedNode) {
        d3.select(event.currentTarget)
          .select('circle')
          .transition()
          .duration(200)
          .attr('r', 40)
          .attr('stroke-width', 5);
      }
    })
    .on('mouseleave', (event, d) => {
      setHoveredNode(null);
      if (!focusedNode) {
        d3.select(event.currentTarget)
          .select('circle')
          .transition()
          .duration(200)
          .attr('r', 30)
          .attr('stroke-width', 3);
      }
    });

    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as GraphNode).x ?? 0)
        .attr('y1', d => (d.source as GraphNode).y ?? 0)
        .attr('x2', d => (d.target as GraphNode).x ?? 0)
        .attr('y2', d => (d.target as GraphNode).y ?? 0);

      linkLabels
        .attr('x', d => ((d.source as GraphNode).x! + (d.target as GraphNode).x!) / 2)
        .attr('y', d => ((d.source as GraphNode).y! + (d.target as GraphNode).y!) / 2);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    if (focusedNode) {
      updateFocusMode(focusedNode.id);
    }

    return () => {
      simulation.stop();
    };
  }, [filteredEntities, filteredRelationships, onEntitySelect, focusedNode]);

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
            className="absolute top-4 left-4 bg-accent/95 border border-accent rounded-lg p-4 max-w-xs backdrop-blur-sm shadow-xl"
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
                onClick={() => {
                  setFocusedNode(null);
                }}
              >
                Clear
              </Button>
            </div>
            <h4 className="font-semibold text-sm mb-1 text-accent-foreground">{focusedNode.name}</h4>
            <p className="text-xs text-accent-foreground/80 mb-3">
              Showing connections to this entity
            </p>
            <div className="pt-3 border-t border-accent-foreground/20">
              <p className="text-xs text-accent-foreground/70">
                {(() => {
                  const connected = getConnectedNodeIds(focusedNode.id);
                  return `${connected.size - 1} connected entities`;
                })()}
              </p>
            </div>
          </div>
        )}

        {filteredEntities.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">No entities to display</p>
              <p className="text-sm text-muted-foreground">
                {selectedTypes.length > 0 ? 'Try adjusting your filters' : 'Load demo data to explore the knowledge graph'}
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
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
