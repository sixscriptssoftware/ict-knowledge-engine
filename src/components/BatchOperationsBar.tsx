import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { 
  Trash, 
  ArrowsClockwise, 
  X, 
  CheckSquare, 
  SquaresFour,
  DownloadSimple 
} from '@phosphor-icons/react';
import type { Entity, DomainType, EntityType } from '@/lib/types';

interface BatchOperationsBarProps {
  selectedEntities: Entity[];
  onClearSelection: () => void;
  onReclassify: (entities: Entity[], domain: DomainType, type: EntityType) => void;
  onDelete: (entities: Entity[]) => void;
  onExport?: (entities: Entity[], format: 'json' | 'csv') => void;
}

export function BatchOperationsBar({ 
  selectedEntities, 
  onClearSelection,
  onReclassify,
  onDelete,
  onExport 
}: BatchOperationsBarProps) {
  const [showReclassifyDialog, setShowReclassifyDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [newDomain, setNewDomain] = useState<DomainType>('concepts');
  const [newType, setNewType] = useState<EntityType>('concept');
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');

  if (selectedEntities.length === 0) return null;

  const handleReclassify = () => {
    onReclassify(selectedEntities, newDomain, newType);
    setShowReclassifyDialog(false);
    onClearSelection();
  };

  const handleDelete = () => {
    onDelete(selectedEntities);
    setShowDeleteDialog(false);
    onClearSelection();
  };

  const handleExport = () => {
    if (onExport) {
      onExport(selectedEntities, exportFormat);
    }
    setShowExportDialog(false);
  };

  const domainOptions: { value: DomainType; label: string }[] = [
    { value: 'concepts', label: 'Concepts' },
    { value: 'models', label: 'Models' },
    { value: 'trades', label: 'Trades' },
    { value: 'schemas', label: 'Schemas' },
    { value: 'training_data', label: 'Training Data' },
    { value: 'knowledge_base', label: 'Knowledge Base' },
    { value: 'code', label: 'Code' },
    { value: 'journal', label: 'Journal' },
    { value: 'charts', label: 'Charts' },
    { value: 'rag_data', label: 'RAG Data' },
    { value: 'relationships', label: 'Relationships' }
  ];

  const typeOptions: { value: EntityType; label: string }[] = [
    { value: 'concept', label: 'Concept' },
    { value: 'model', label: 'Model' },
    { value: 'trade', label: 'Trade' },
    { value: 'schema', label: 'Schema' },
    { value: 'code_module', label: 'Code Module' },
    { value: 'document', label: 'Document' },
    { value: 'journal', label: 'Journal' },
    { value: 'training_data', label: 'Training Data' },
    { value: 'chart', label: 'Chart' }
  ];

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-card border-2 border-primary/50 rounded-xl shadow-2xl backdrop-blur-xl p-4 min-w-[500px]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckSquare size={24} className="text-primary" weight="fill" />
              <div>
                <div className="font-semibold flex items-center gap-2">
                  <span>{selectedEntities.length} Selected</span>
                  <Badge variant="secondary" className="text-xs">
                    Batch Mode
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {selectedEntities.length === 1 ? '1 entity' : `${selectedEntities.length} entities`} selected for batch operations
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowReclassifyDialog(true)}
                className="gap-2"
              >
                <ArrowsClockwise size={16} />
                Reclassify
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowExportDialog(true)}
                className="gap-2"
              >
                <DownloadSimple size={16} />
                Export
              </Button>
              
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
                className="gap-2"
              >
                <Trash size={16} />
                Delete
              </Button>

              <div className="w-px h-6 bg-border mx-1" />

              <Button
                variant="ghost"
                size="sm"
                onClick={onClearSelection}
                className="gap-2"
              >
                <X size={16} />
                Clear
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showReclassifyDialog} onOpenChange={setShowReclassifyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowsClockwise size={24} className="text-primary" />
              Reclassify Entities
            </DialogTitle>
            <DialogDescription>
              Reclassify {selectedEntities.length} {selectedEntities.length === 1 ? 'entity' : 'entities'} to a new domain and type.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>New Domain</Label>
              <Select value={newDomain} onValueChange={(v) => setNewDomain(v as DomainType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {domainOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>New Type</Label>
              <Select value={newType} onValueChange={(v) => setNewType(v as EntityType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg bg-muted/50 p-3 space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <SquaresFour size={16} />
                Selected Entities
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {selectedEntities.map((entity) => (
                  <div key={entity.id} className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-secondary">{entity.type}</span>
                    <span className="truncate">{entity.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReclassifyDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleReclassify} className="gap-2">
              <ArrowsClockwise size={16} />
              Reclassify {selectedEntities.length} {selectedEntities.length === 1 ? 'Entity' : 'Entities'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash size={24} />
              Delete Entities
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete {selectedEntities.length} {selectedEntities.length === 1 ? 'entity' : 'entities'} and all associated relationships.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-lg bg-destructive/10 border border-destructive/50 p-3 space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-destructive">
              <Trash size={16} />
              Entities to Delete
            </div>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {selectedEntities.map((entity) => (
                <div key={entity.id} className="text-sm flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded bg-secondary">{entity.type}</span>
                  <span className="truncate">{entity.name}</span>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} className="gap-2">
              <Trash size={16} />
              Delete {selectedEntities.length} {selectedEntities.length === 1 ? 'Entity' : 'Entities'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DownloadSimple size={24} className="text-primary" />
              Export Entities
            </DialogTitle>
            <DialogDescription>
              Export {selectedEntities.length} {selectedEntities.length === 1 ? 'entity' : 'entities'} to JSON or CSV format.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Export Format</Label>
              <Select value={exportFormat} onValueChange={(v) => setExportFormat(v as 'json' | 'csv')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {exportFormat === 'json' 
                  ? 'Export as JSON with full entity data including metadata and relationships.'
                  : 'Export as CSV with flattened entity data suitable for spreadsheet applications.'}
              </p>
            </div>

            <div className="rounded-lg bg-muted/50 p-3 space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <SquaresFour size={16} />
                Selected Entities
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {selectedEntities.map((entity) => (
                  <div key={entity.id} className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-secondary">{entity.type}</span>
                    <span className="truncate">{entity.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleExport} className="gap-2">
              <DownloadSimple size={16} />
              Export as {exportFormat.toUpperCase()}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
