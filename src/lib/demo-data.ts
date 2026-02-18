/**
 * Demo Data Generator
 * 
 * Returns the complete ICT knowledge database for the application.
 * All data is sourced from the ict-database module which contains
 * production-grade ICT knowledge extracted from sixscripts-ai/train-ict.
 */

import type { Entity, Relationship } from './types';
import { ICT_FULL_DATABASE } from './ict-database';

export function generateDemoData(): { entities: Entity[]; relationships: Relationship[] } {
  return {
    entities: ICT_FULL_DATABASE.entities,
    relationships: ICT_FULL_DATABASE.relationships
  };
}
