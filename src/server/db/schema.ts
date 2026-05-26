import { Database } from 'better-sqlite3';

export interface Trial {
  id: string;
  userId: string;
  name: string;
  intent: string;
  baseFragrance?: { brand: string; name: string };
  createdAt: number;
  updatedAt: number;
}

export interface TrialVersion {
  id: string;
  trialId: string;
  composition: {
    compounds: Array<{
      name: string;
      percentage: number;
    }>;
  };
  analysis: any; // EnhancedFragranceAnalysis
  snapshotName: string;
  isDraft: boolean;
  createdAt: number;
}

export function initializeDatabase(db: Database): void {
  // Create trials table
  db.exec(`
    CREATE TABLE IF NOT EXISTS trials (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      name TEXT NOT NULL,
      intent TEXT,
      baseFragrance TEXT,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    )
  `);

  // Create versions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS trial_versions (
      id TEXT PRIMARY KEY,
      trialId TEXT NOT NULL REFERENCES trials(id),
      composition TEXT NOT NULL,
      analysis TEXT NOT NULL,
      snapshotName TEXT NOT NULL,
      isDraft INTEGER NOT NULL DEFAULT 0,
      createdAt INTEGER NOT NULL,
      FOREIGN KEY (trialId) REFERENCES trials(id)
    )
  `);

  // Create index for faster queries
  db.exec(`CREATE INDEX IF NOT EXISTS idx_trial_user ON trials(userId)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_version_trial ON trial_versions(trialId)`);
}
