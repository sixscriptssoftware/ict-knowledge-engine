import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { MagnifyingGlass, Funnel, CheckSquare, Square } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { getEntityTypeIcon } from '@/lib/ai-processor';
import { BatchOperationsBar } from '@/components/BatchOperationsBar';
import { exportEntities } from '@/lib/export-utils';
import { toast } from 'sonner';
import type { Entity, DomainType, EntityType } from '@/lib/types';

interface ExplorerViewProps {
  entities: Entity[];
  onEntitySelect: (entity: Entity) => void;
  onBatchReclassify?: (entities: Entity[], domain: DomainType, type: EntityType) => void;
  onBatchDelete?: (entities: Entity[]) => void;
}

export function ExplorerView({ entities, onEntitySelect, onBatchReclassify, onBatchDelete }: ExplorerViewProps) {
  const [search, setSearch] = useState('');
  const [filterDomain, setFilterDomain] = useState<DomainType | 'all'>('all');
  const [filterType, setFilterType] = useState<EntityType | 'all'>('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  const [minRiskReward, setMinRiskReward] = useState<number[]>([0]);
  const [maxRiskReward, setMaxRiskReward] = useState<number[]>([10]);
  const [minQualityGrade, setMinQualityGrade] = useState<number[]>([0]);
  const [filterTradeResult, setFilterTradeResult] = useState<'all' | 'win' | 'loss'>('all');
  
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedEntityIds, setSelectedEntityIds] = useState<Set<string>>(new Set());

  const calculateRR = (entity: Entity): number | null => {
    if (entity.type !== 'trade') return null;
    
    const entry = entity.metadata?.execution?.entry_price || entity.metadata?.entry;
    const stop = entity.metadata?.execution?.stop_loss || entity.metadata?.stop;
    const target = entity.metadata?.execution?.target || entity.metadata?.target;
    
    if (!entry || !stop || !target) return null;
    
    const risk = Math.abs(entry - stop);
    const reward = Math.abs(target - entry);
    
    if (risk === 0) return null;
    return reward / risk;
  };

  const getQualityGrade = (entity: Entity): number | null => {
    if (entity.type !== 'trade') return null;
    
    return entity.metadata?.setup?.quality_grade || 
           entity.metadata?.quality_grade || 
           entity.metadata?.grade || 
           null;
  };

  const getTradeResult = (entity: Entity): 'win' | 'loss' | null => {
    if (entity.type !== 'trade') return null;
    
    const result = entity.metadata?.execution?.result || 
                   entity.metadata?.result ||
                   entity.metadata?.meta?.example_type;
    
    if (result === 'WIN' || result === 'win' || result === 'positive') return 'win';
    if (result === 'LOSS' || result === 'loss' || result === 'negative') return 'loss';
    return null;
  };

  const filtered = entities.filter(entity => {
    const matchesSearch = entity.name.toLowerCase().includes(search.toLowerCase()) ||
                         entity.description?.toLowerCase().includes(search.toLowerCase());
    const matchesDomain = filterDomain === 'all' || entity.domain === filterDomain;
    const matchesType = filterType === 'all' || entity.type === filterType;
    
    if (!matchesSearch || !matchesDomain || !matchesType) return false;
    
    if (entity.type === 'trade' && showAdvancedFilters) {
      const rr = calculateRR(entity);
      if (rr !== null) {
        if (rr < minRiskReward[0] || rr > maxRiskReward[0]) return false;
      }
      
      const grade = getQualityGrade(entity);
      if (grade !== null && grade < minQualityGrade[0]) return false;
      
      const result = getTradeResult(entity);
      if (filterTradeResult !== 'all' && result !== filterTradeResult) return false;
    }
    
    return true;
  });

  const groupedByDomain = filtered.reduce((acc, entity) => {
    if (!acc[entity.domain]) acc[entity.domain] = [];
    acc[entity.domain].push(entity);
    return acc;
  }, {} as Record<DomainType, Entity[]>);

  const resetAdvancedFilters = () => {
    setMinRiskReward([0]);
    setMaxRiskReward([10]);
    setMinQualityGrade([0]);
    setFilterTradeResult('all');
  };

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    if (selectionMode) {
      setSelectedEntityIds(new Set());
    }
  };

  const toggleEntitySelection = (entityId: string) => {
    const newSelected = new Set(selectedEntityIds);
    if (newSelected.has(entityId)) {
      newSelected.delete(entityId);
    } else {
      newSelected.add(entityId);
    }
    setSelectedEntityIds(newSelected);
  };

  const selectAllFiltered = () => {
    const allFilteredIds = new Set(filtered.map(e => e.id));
    setSelectedEntityIds(allFilteredIds);
  };

  const clearSelection = () => {
    setSelectedEntityIds(new Set());
  };

  const selectedEntities = entities.filter(e => selectedEntityIds.has(e.id));

  const handleBatchReclassify = (entities: Entity[], domain: DomainType, type: EntityType) => {
    if (onBatchReclassify) {
      onBatchReclassify(entities, domain, type);
    }
  };

  const handleBatchDelete = (entities: Entity[]) => {
    if (onBatchDelete) {
      onBatchDelete(entities);
    }
  };

  const handleBatchExport = (entities: Entity[], format: 'json' | 'csv') => {
    try {
      exportEntities(entities, format);
      toast.success(`Exported ${entities.length} entities as ${format.toUpperCase()}`, {
        description: `Downloaded ${entities.length} ${entities.length === 1 ? 'entity' : 'entities'} to your device`
      });
    } catch (error) {
      toast.error('Export failed', {
        description: error instanceof Error ? error.message : 'Failed to export entities'
      });
    }
  };

  const handleEntityClick = (entity: Entity) => {
    if (selectionMode) {
      toggleEntitySelection(entity.id);
    } else {
      onEntitySelect(entity);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Explorer</h1>
        <p className="text-muted-foreground mt-1">Browse and search all entities</p>
      </div>

      <Card className="p-4 bg-card/50 backdrop-blur border-border/50">
        <div className="flex gap-2 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search entities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={filterDomain} onValueChange={(v) => setFilterDomain(v as DomainType | 'all')}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by domain" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Domains</SelectItem>
              <SelectItem value="concepts">Concepts</SelectItem>
              <SelectItem value="models">Models</SelectItem>
              <SelectItem value="trades">Trades</SelectItem>
              <SelectItem value="schemas">Schemas</SelectItem>
              <SelectItem value="code">Code</SelectItem>
              <SelectItem value="knowledge_base">Knowledge Base</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterType} onValueChange={(v) => setFilterType(v as EntityType | 'all')}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="concept">Concept</SelectItem>
              <SelectItem value="model">Model</SelectItem>
              <SelectItem value="trade">Trade</SelectItem>
              <SelectItem value="schema">Schema</SelectItem>
              <SelectItem value="code_module">Code Module</SelectItem>
              <SelectItem value="document">Document</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant={showAdvancedFilters ? 'default' : 'outline'}
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="gap-2"
          >
            <Funnel size={16} />
            Advanced
          </Button>
          <div className="w-px h-8 bg-border" />
          <Button
            variant={selectionMode ? 'default' : 'outline'}
            onClick={toggleSelectionMode}
            className="gap-2"
          >
            <CheckSquare size={16} />
            {selectionMode ? 'Exit Selection' : 'Select Multiple'}
          </Button>
          {selectionMode && filtered.length > 0 && (
            <Button
              variant="outline"
              onClick={selectAllFiltered}
              className="gap-2"
            >
              Select All ({filtered.length})
            </Button>
          )}
        </div>

        {showAdvancedFilters && (
          <div className="mt-4 pt-4 border-t border-border/50 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Min Risk:Reward Ratio</Label>
                <div className="flex items-center gap-3">
                  <Slider
                    value={minRiskReward}
                    onValueChange={setMinRiskReward}
                    min={0}
                    max={10}
                    step={0.5}
                    className="flex-1"
                  />
                  <span className="text-sm font-mono min-w-[3ch]">{minRiskReward[0].toFixed(1)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Max Risk:Reward Ratio</Label>
                <div className="flex items-center gap-3">
                  <Slider
                    value={maxRiskReward}
                    onValueChange={setMaxRiskReward}
                    min={0}
                    max={10}
                    step={0.5}
                    className="flex-1"
                  />
                  <span className="text-sm font-mono min-w-[3ch]">{maxRiskReward[0].toFixed(1)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Min Quality Grade</Label>
                <div className="flex items-center gap-3">
                  <Slider
                    value={minQualityGrade}
                    onValueChange={setMinQualityGrade}
                    min={0}
                    max={10}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm font-mono min-w-[3ch]">{minQualityGrade[0]}/10</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Trade Result</Label>
                <Select value={filterTradeResult} onValueChange={(v) => setFilterTradeResult(v as 'all' | 'win' | 'loss')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Results</SelectItem>
                    <SelectItem value="win">Wins Only</SelectItem>
                    <SelectItem value="loss">Losses Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="ghost"
                  onClick={resetAdvancedFilters}
                  className="w-full"
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {filtered.length} of {entities.length} entities
        </div>
        {selectionMode && selectedEntityIds.size > 0 && (
          <Badge variant="secondary" className="gap-2">
            <CheckSquare size={14} />
            {selectedEntityIds.size} selected
          </Badge>
        )}
      </div>

      <ScrollArea className="h-[calc(100vh-320px)]">
        <div className="space-y-6">
          {Object.keys(groupedByDomain).length === 0 ? (
            <Card className="p-12 text-center bg-card/50">
              <MagnifyingGlass size={48} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No entities found</p>
            </Card>
          ) : (
            Object.entries(groupedByDomain).map(([domain, domainEntities]) => (
              <div key={domain}>
                <h3 className="text-lg font-semibold mb-3 capitalize">{domain.replace('_', ' ')}</h3>
                <div className="grid gap-3">
                  {domainEntities.map((entity) => {
                    const rr = calculateRR(entity);
                    const grade = getQualityGrade(entity);
                    const result = getTradeResult(entity);
                    
                    const isSelected = selectedEntityIds.has(entity.id);
                    
                    return (
                      <Card
                        key={entity.id}
                        className={`p-4 bg-card/50 backdrop-blur border-border/50 transition-all cursor-pointer ${
                          isSelected 
                            ? 'border-primary ring-2 ring-primary/20' 
                            : 'hover:border-primary/50 hover:scale-[1.01]'
                        }`}
                        onClick={() => handleEntityClick(entity)}
                      >
                        <div className="flex items-start gap-3">
                          {selectionMode && (
                            <div className="pt-1" onClick={(e) => e.stopPropagation()}>
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => toggleEntitySelection(entity.id)}
                              />
                            </div>
                          )}
                          <span className="text-2xl">{getEntityTypeIcon(entity.type)}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-semibold">{entity.name}</h4>
                              <Badge variant="secondary" className="text-xs">
                                {entity.type}
                              </Badge>
                              {entity.validationStatus === 'valid' && (
                                <Badge className="text-xs bg-primary/20 text-primary">VALID</Badge>
                              )}
                              {entity.validationStatus === 'invalid' && (
                                <Badge variant="destructive" className="text-xs">INVALID</Badge>
                              )}
                              {rr !== null && (
                                <Badge variant="outline" className="text-xs font-mono">
                                  RR: {rr.toFixed(2)}
                                </Badge>
                              )}
                              {grade !== null && (
                                <Badge variant="outline" className="text-xs">
                                  Grade: {grade}/10
                                </Badge>
                              )}
                              {result && (
                                <Badge variant={result === 'win' ? 'default' : 'destructive'} className="text-xs">
                                  {result.toUpperCase()}
                                </Badge>
                              )}
                            </div>
                            {entity.description && (
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {entity.description}
                              </p>
                            )}
                            <div className="flex gap-2 mt-2 flex-wrap">
                              {entity.tags.slice(0, 3).map((tag) => (
                                <span key={tag} className="text-xs px-2 py-0.5 rounded-md bg-secondary/50">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      <BatchOperationsBar
        selectedEntities={selectedEntities}
        onClearSelection={clearSelection}
        onReclassify={handleBatchReclassify}
        onDelete={handleBatchDelete}
        onExport={handleBatchExport}
      />
    </div>
  );
}
