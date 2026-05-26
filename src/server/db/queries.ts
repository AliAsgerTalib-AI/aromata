import Database from 'better-sqlite3';
import { Trial, TrialVersion } from './schema';

export class TrialQueries {
  constructor(private db: Database.Database) {}

  createTrial(trial: Trial): void {
    const stmt = this.db.prepare(`
      INSERT INTO trials (id, userId, name, intent, baseFragrance, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      trial.id,
      trial.userId,
      trial.name,
      trial.intent || null,
      trial.baseFragrance ? JSON.stringify(trial.baseFragrance) : null,
      trial.createdAt,
      trial.updatedAt
    );
  }

  getTrial(trialId: string): Trial | null {
    const stmt = this.db.prepare('SELECT * FROM trials WHERE id = ?');
    const row = stmt.get(trialId) as any;
    if (!row) return null;
    return {
      ...row,
      baseFragrance: row.baseFragrance ? JSON.parse(row.baseFragrance) : undefined
    };
  }

  getUserTrials(userId: string): Trial[] {
    const stmt = this.db.prepare('SELECT * FROM trials WHERE userId = ? ORDER BY updatedAt DESC');
    const rows = stmt.all(userId) as any[];
    return rows.map(row => ({
      ...row,
      baseFragrance: row.baseFragrance ? JSON.parse(row.baseFragrance) : undefined
    }));
  }

  updateTrial(trialId: string, updates: Partial<Trial>): void {
    const current = this.getTrial(trialId);
    if (!current) throw new Error('Trial not found');

    const updated = { ...current, ...updates, updatedAt: Date.now() };
    const stmt = this.db.prepare(`
      UPDATE trials SET name = ?, intent = ?, baseFragrance = ?, updatedAt = ? WHERE id = ?
    `);
    stmt.run(
      updated.name,
      updated.intent || null,
      updated.baseFragrance ? JSON.stringify(updated.baseFragrance) : null,
      updated.updatedAt,
      trialId
    );
  }

  deleteTrial(trialId: string): void {
    this.db.prepare('DELETE FROM trial_versions WHERE trialId = ?').run(trialId);
    this.db.prepare('DELETE FROM trials WHERE id = ?').run(trialId);
  }

  createVersion(version: TrialVersion): void {
    const stmt = this.db.prepare(`
      INSERT INTO trial_versions (id, trialId, composition, analysis, snapshotName, isDraft, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      version.id,
      version.trialId,
      JSON.stringify(version.composition),
      JSON.stringify(version.analysis),
      version.snapshotName,
      version.isDraft ? 1 : 0,
      version.createdAt
    );
  }

  getVersions(trialId: string): TrialVersion[] {
    const stmt = this.db.prepare(
      'SELECT * FROM trial_versions WHERE trialId = ? ORDER BY createdAt DESC'
    );
    const rows = stmt.all(trialId) as any[];
    return rows.map(row => ({
      id: row.id,
      trialId: row.trialId,
      composition: JSON.parse(row.composition),
      analysis: JSON.parse(row.analysis),
      snapshotName: row.snapshotName,
      isDraft: row.isDraft === 1,
      createdAt: row.createdAt
    }));
  }

  updateVersion(versionId: string, updates: Partial<TrialVersion>): void {
    const stmt = this.db.prepare(`
      UPDATE trial_versions SET snapshotName = ?, isDraft = ? WHERE id = ?
    `);
    stmt.run(
      updates.snapshotName,
      updates.isDraft ? 1 : 0,
      versionId
    );
  }

  deleteVersion(versionId: string): void {
    this.db.prepare('DELETE FROM trial_versions WHERE id = ?').run(versionId);
  }
}
