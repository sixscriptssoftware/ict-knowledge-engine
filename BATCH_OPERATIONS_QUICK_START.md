# Batch Operations - Quick Start Guide

## What's New?

The Explorer view now supports **batch operations** - select multiple entities and manage them all at once!

## How to Use

### 1️⃣ Enter Selection Mode
Click the **"Select Multiple"** button in the Explorer toolbar (next to the Advanced Filters button)

### 2️⃣ Select Entities
- Click checkboxes on individual entities
- Or click **"Select All (N)"** to select all filtered entities

### 3️⃣ Perform Actions
Once entities are selected, a **floating action bar** appears at the bottom of the screen with three options:

#### 🔄 Reclassify
- Change domain and type for all selected entities
- Opens a dialog to choose new domain (e.g., Concepts, Models, Trades)
- Choose new type (e.g., concept, model, trade)
- Review list of affected entities
- Confirm to apply changes

#### 🗑️ Delete
- Permanently remove selected entities
- Also removes all associated relationships
- Shows warning dialog with full list
- **Cannot be undone** - use carefully!

#### ✖️ Clear
- Deselect all entities
- Clears selection without making changes

## Visual Indicators

✅ **Selected entities** have a glowing primary-colored border
✅ **Selection count badge** shows how many entities are selected
✅ **Checkboxes** appear on all entity cards in selection mode
✅ **Floating action bar** appears at bottom when selections exist

## Common Use Cases

### Fixing AI Misclassifications
1. Filter entities by domain: "all"
2. Enter selection mode
3. Check entities that were incorrectly classified
4. Click Reclassify
5. Set correct domain and type
6. Confirm

### Cleaning Up Test Data
1. Search for test entities (e.g., "test", "demo")
2. Enter selection mode
3. Select All filtered results
4. Click Delete
5. Confirm deletion

### Reorganizing by Type
1. Filter to show only "document" type
2. Enter selection mode
3. Select documents that should be concepts
4. Reclassify to "concepts" domain and "concept" type
5. Confirm

## Tips & Tricks

💡 **Use filters first** - Narrow down entities before selecting to work faster
💡 **Review carefully** - Always check the entity list in confirmation dialogs
💡 **Start small** - Test with a few entities before batch operations on hundreds
💡 **Exit mode** - Click "Exit Selection" when done to avoid accidental changes

## What Gets Updated?

### Reclassify Operation Updates:
- ✅ Entity domain
- ✅ Entity type
- ✅ Entity updatedAt timestamp
- ✅ All changes persist to database

### Delete Operation Removes:
- ✅ All selected entities
- ✅ All relationships where entity is source
- ✅ All relationships where entity is target
- ✅ Knowledge graph auto-updates

## Safety Features

🔒 **Confirmation dialogs** - All batch operations require explicit confirmation
🔒 **Entity lists** - See exactly what will be affected before confirming
🔒 **Toast notifications** - Clear feedback on what was changed
🔒 **Cascade deletes** - Relationships automatically cleaned up
🔒 **No accidental ops** - Action buttons only appear when entities selected

## Keyboard Shortcuts (Future)

Coming soon:
- `Shift + Click` - Select range
- `Ctrl/Cmd + A` - Select all
- `Escape` - Clear selection
- `Delete` - Batch delete

## Technical Details

**Persistence**: Changes save immediately via the KV store
**Atomicity**: All selected entities update in a single operation
**Relationships**: Cascade deletes ensure no orphaned relationships
**Performance**: Optimized for selections of 100+ entities

---

**Questions?** Check the full documentation in `BATCH_OPERATIONS_README.md`
