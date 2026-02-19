# Batch Operations Feature

## Overview

The Batch Operations feature enables users to efficiently manage multiple entities at once in the ICT Knowledge Engine. Instead of manually editing or deleting entities one-by-one, users can select multiple items and apply changes in bulk.

## Key Features

### 1. Multi-Select Mode

- **Toggle Selection Mode**: Click the "Select Multiple" button in the Explorer toolbar to enter batch selection mode
- **Checkbox Interface**: Each entity card displays a checkbox when in selection mode
- **Visual Feedback**: Selected entities are highlighted with a primary-colored border and ring effect
- **Selection Count**: A badge displays the current selection count in the bottom-right of the view

### 2. Selection Controls

- **Individual Selection**: Click any entity checkbox to toggle selection
- **Select All Filtered**: Click "Select All (N)" button to select all currently visible/filtered entities
- **Clear Selection**: Click "Clear" button or exit selection mode to deselect all

### 3. Batch Reclassification

**Purpose**: Change the domain and/or type classification for multiple entities simultaneously

**How to Use**:
1. Enter selection mode and select entities to reclassify
2. Click the "Reclassify" button in the floating action bar
3. Choose new domain (e.g., "Concepts", "Models", "Trades")
4. Choose new type (e.g., "concept", "model", "trade")
5. Review the list of entities that will be affected
6. Confirm to apply changes

**Use Cases**:
- Correcting AI misclassifications in bulk
- Reorganizing entities after refining your taxonomy
- Moving training data to the appropriate domain
- Batch-converting documents to concepts

### 4. Batch Deletion

**Purpose**: Permanently remove multiple entities and their relationships at once

**How to Use**:
1. Enter selection mode and select entities to delete
2. Click the "Delete" button in the floating action bar
3. Review the list of entities that will be permanently removed
4. Confirm to delete (this action cannot be undone)

**What Gets Deleted**:
- All selected entities are permanently removed
- All relationships where the entity is the source or target are deleted
- The knowledge graph is automatically updated to reflect removals

**Use Cases**:
- Removing duplicate or erroneous entities
- Clearing out test data
- Cleaning up failed imports
- Removing outdated information

## UI Components

### BatchOperationsBar

A floating action bar that appears at the bottom of the screen when entities are selected:

**Location**: Fixed at bottom center of screen
**Appearance**: Card with primary border, backdrop blur, and shadow
**Actions**:
- **Reclassify** (with ArrowsClockwise icon)
- **Delete** (with Trash icon, destructive variant)
- **Clear** (with X icon, removes all selections)

### Reclassify Dialog

**Title**: "Reclassify Entities"
**Description**: Shows count of entities to be reclassified
**Controls**:
- Domain selector dropdown
- Type selector dropdown
- List of selected entities with current type badges
**Actions**: Cancel, Reclassify

### Delete Dialog

**Title**: "Delete Entities" (in destructive color)
**Description**: Warning that action cannot be undone
**Warning Box**: Destructive-themed panel listing all entities to be deleted
**Actions**: Cancel, Delete

## Implementation Details

### State Management

The Explorer view uses React hooks to manage batch operations:

```typescript
const [selectionMode, setSelectionMode] = useState(false);
const [selectedEntityIds, setSelectedEntityIds] = useState<Set<string>>(new Set());
```

### Key Functions

**toggleSelectionMode()**: Enters/exits selection mode and clears selections when exiting

**toggleEntitySelection(entityId)**: Adds/removes an entity from the selection set

**selectAllFiltered()**: Selects all entities matching current filters

**clearSelection()**: Removes all selections

**handleBatchReclassify(entities, domain, type)**: Updates domain and type for all selected entities

**handleBatchDelete(entities)**: Removes all selected entities and their relationships

### Data Flow

1. **Selection**: User selects entities → IDs stored in Set → UI updates with visual feedback
2. **Action**: User clicks Reclassify/Delete → Dialog opens with entity list
3. **Confirmation**: User confirms → App.tsx handler called with entity array
4. **Update**: Handler uses functional setState to update KV store
5. **Feedback**: Toast notification confirms operation → Selection cleared → UI refreshes

### Persistence

All batch operations update the `useKV` hooks in App.tsx:

- **Reclassify**: Updates `entities` array by mapping over and modifying matching IDs
- **Delete**: Filters out deleted entities from both `entities` and `relationships` arrays
- Changes persist automatically via the KV store

## Best Practices

### For Users

1. **Use Filters First**: Narrow down entities with search and filters before selecting
2. **Review Carefully**: Always review the entity list in confirmation dialogs
3. **Start Small**: Test batch operations on a few entities before selecting hundreds
4. **Clear Selection**: Exit selection mode when done to avoid accidental operations

### For Developers

1. **Atomic Updates**: Use functional setState to ensure data consistency
2. **Cascade Deletes**: Always remove relationships when deleting entities
3. **User Feedback**: Show clear toast messages with operation counts
4. **Prevent Errors**: Disable action buttons when no entities are selected
5. **Visual States**: Use distinct styling for selected vs unselected entities

## Edge Cases Handled

✅ **Empty Selection**: Action buttons disabled when nothing selected
✅ **Filter Changes**: Selection persists when filters change
✅ **Select All Filtered**: Only selects visible entities, not entire database
✅ **Cascade Delete**: Relationships auto-removed when entities deleted
✅ **Orphaned Entities**: Entities without relationships can still be deleted
✅ **Mode Switching**: Selection cleared when exiting selection mode

## Future Enhancements

Potential improvements for future iterations:

- **Undo/Redo**: Allow reverting recent batch operations
- **Batch Export**: Export selected entities as JSON/CSV
- **Batch Tagging**: Add/remove tags from multiple entities
- **Selection History**: Remember recent selections
- **Smart Selection**: "Select all concepts", "Select all invalid trades"
- **Preview Changes**: Show before/after comparison for reclassifications
- **Batch Merge**: Combine duplicate entities
- **Permission Checks**: Restrict batch operations to owners only

## Keyboard Shortcuts (Future)

Planned keyboard shortcuts for power users:

- `Shift + Click`: Select range between last selected and clicked entity
- `Ctrl/Cmd + A`: Select all filtered entities
- `Escape`: Clear selection and exit selection mode
- `Delete/Backspace`: Trigger batch delete for selected entities
- `Ctrl/Cmd + D`: Deselect all

## Related Components

- **ExplorerView.tsx**: Main view with selection interface
- **BatchOperationsBar.tsx**: Floating action bar component
- **App.tsx**: Handles batch operation logic and state updates
- **EntityDetailDialog.tsx**: Can be enhanced to support batch editing in detail view

## Testing Checklist

- [ ] Selection mode toggles on/off
- [ ] Checkboxes appear in selection mode
- [ ] Individual entity selection works
- [ ] Select All selects only filtered entities
- [ ] Clear button removes all selections
- [ ] Reclassify dialog opens with correct entity count
- [ ] Reclassify updates all selected entities
- [ ] Reclassify shows success toast
- [ ] Delete dialog shows warning message
- [ ] Delete removes entities from database
- [ ] Delete removes associated relationships
- [ ] Delete shows success toast
- [ ] Selection cleared after operations
- [ ] Visual feedback (borders, rings) works correctly
- [ ] Action bar appears only when entities selected
- [ ] Operations work with 1 entity selected
- [ ] Operations work with 100+ entities selected
