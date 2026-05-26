import express from 'express';
import { v4 as uuid } from 'uuid';
import { BlendingService } from './service';
import { TrialQueries } from '../db/queries';
import { GoogleGenAI } from '@google/genai';

export function createBlendingRouter(
  db: TrialQueries,
  ai: GoogleGenAI
): express.Router {
  const router = express.Router();
  const service = new BlendingService(db, ai);
  const analysisLimit = require('express-rate-limit')({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: 'Too many blending requests. Please try again later.'
  });

  // POST /api/blending/trials
  router.post('/trials', analysisLimit, (req: express.Request, res: express.Response) => {
    try {
      const { name, intent, baseFragrance } = req.body;
      if (!name) return res.status(400).json({ error: 'Trial name required' });

      const trial = {
        id: uuid(),
        userId: 'user-123', // TODO: Extract from session
        name,
        intent: intent || '',
        baseFragrance: baseFragrance || undefined,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      db.createTrial(trial);

      // Create initial draft version
      const version = {
        id: uuid(),
        trialId: trial.id,
        composition: { compounds: [] },
        analysis: {},
        snapshotName: 'Draft',
        isDraft: true,
        createdAt: Date.now()
      };
      db.createVersion(version);

      res.json(trial);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/blending/analyze
  router.post('/analyze', analysisLimit, async (req: express.Request, res: express.Response) => {
    try {
      const { trialId, composition } = req.body;
      if (!composition?.compounds) {
        return res.status(400).json({ error: 'Composition required' });
      }

      const analysis = await service.analyzeComposition(composition.compounds);
      res.json({ analysis });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/blending/guidance
  router.post('/guidance', analysisLimit, async (req: express.Request, res: express.Response) => {
    try {
      const { composition, analysis, type, intent } = req.body;
      if (!composition?.compounds || !analysis) {
        return res.status(400).json({ error: 'Composition and analysis required' });
      }

      const guidance = await service.getGuidance(
        composition.compounds,
        analysis,
        type,
        intent
      );
      res.json(guidance);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/blending/versions/{trialId}/save
  router.post('/versions/:trialId/save', analysisLimit, (req: express.Request, res: express.Response) => {
    try {
      const { trialId } = req.params;
      const { composition, analysis, snapshotName } = req.body;

      const version = {
        id: uuid(),
        trialId,
        composition,
        analysis,
        snapshotName: snapshotName || `v${Date.now()}`,
        isDraft: false,
        createdAt: Date.now()
      };

      db.createVersion(version);
      res.json(version);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/blending/trials/{trialId}
  router.get('/trials/:trialId', (req: express.Request, res: express.Response) => {
    try {
      const trial = db.getTrial(req.params.trialId);
      if (!trial) return res.status(404).json({ error: 'Trial not found' });

      const versions = db.getVersions(req.params.trialId);
      res.json({ trial, versions });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/blending/trials
  router.get('/trials', (req: express.Request, res: express.Response) => {
    try {
      const trials = db.getUserTrials('user-123'); // TODO: Extract from session
      res.json({ trials });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // DELETE /api/blending/versions/{versionId}
  router.delete('/versions/:versionId', (req: express.Request, res: express.Response) => {
    try {
      db.deleteVersion(req.params.versionId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}
