/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type StatusType = 'pending' | 'in_progress' | 'completed';

export interface GutItem {
  id: string;
  equipment: string;
  area: string;
  description: string;
  gravity: number; // 1 to 5
  urgency: number; // 1 to 5
  tendency: number; // 1 to 5
  score: number; // gravity * urgency * tendency
  status: StatusType;
  createdAt: string;
  assignedTo?: string;
  notes?: string;
}

export type GutScoreRange = 'high' | 'medium' | 'low' | 'all';

export interface GutLevelExplanation {
  level: number;
  label: string;
  gravityDesc: string;
  urgencyDesc: string;
  tendencyDesc: string;
  color: string;
}
