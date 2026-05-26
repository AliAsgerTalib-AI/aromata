import express from 'express';
import { GoogleGenAI } from '@google/genai';
import { EducationService } from './service';
import { LEARNING_PATHS } from './learningPaths';

export function createEducationRouter(ai: GoogleGenAI): express.Router {
  const router = express.Router();
  const service = new EducationService(ai);

  // Case Studies
  router.get('/case-studies', (req, res) => {
    try {
      const difficulty = req.query.difficulty as string;
      const framework = req.query.framework as string;

      let cases = service.getAllCaseStudies();

      if (difficulty) {
        cases = service.getCaseStudiesByDifficulty(difficulty as any);
      }

      if (framework) {
        cases = service.getCaseStudiesByFramework(framework);
      }

      res.json({ cases });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/case-studies/:id', (req, res) => {
    try {
      const caseStudy = service.getCaseStudy(req.params.id);
      if (!caseStudy) {
        return res.status(404).json({ error: 'Case study not found' });
      }
      res.json(caseStudy);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Frameworks
  router.get('/frameworks', (req, res) => {
    try {
      const frameworks = service.getAllFrameworks();
      res.json({ frameworks });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/frameworks/:id', (req, res) => {
    try {
      const framework = service.getFramework(req.params.id);
      if (!framework) {
        return res.status(404).json({ error: 'Framework not found' });
      }
      res.json(framework);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Learning Paths
  router.get('/paths', (req, res) => {
    try {
      const skillLevel = req.query.skillLevel as string;
      let paths = Object.values(LEARNING_PATHS);

      if (skillLevel) {
        paths = paths.filter(p => p.skillLevel === skillLevel);
      }

      res.json({ paths });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/paths/:id', (req, res) => {
    try {
      const path = LEARNING_PATHS[req.params.id];
      if (!path) {
        return res.status(404).json({ error: 'Path not found' });
      }
      res.json(path);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Comparison
  router.get('/compare', async (req, res) => {
    try {
      const frag1 = req.query.frag1 as string;
      const frag2 = req.query.frag2 as string;

      if (!frag1 || !frag2) {
        return res.status(400).json({ error: 'Both frag1 and frag2 required' });
      }

      const comparison = await service.compareFragrances(frag1, frag2);
      res.json(comparison);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Framework evaluation (for "try it yourself" exercises)
  router.post('/evaluate-composition', async (req, res) => {
    try {
      const { compounds, frameworkId } = req.body;

      if (!compounds || !frameworkId) {
        return res.status(400).json({ error: 'compounds and frameworkId required' });
      }

      const evaluation = await service.evaluateCompositionForFramework(compounds, frameworkId);
      res.json({ evaluation });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}
