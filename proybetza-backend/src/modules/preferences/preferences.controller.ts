import { Request, Response, NextFunction } from 'express';
import { preferencesService } from './preferences.service';

export class PreferencesController {
  async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const prefs = await preferencesService.get(req.user!.sub);
      res.json({ success: true, data: prefs });
    } catch (err) { next(err); }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const prefs = await preferencesService.update(req.user!.sub, req.body);
      res.json({ success: true, data: prefs });
    } catch (err) { next(err); }
  }

  async toggleFavorite(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { ingredient } = req.body as { ingredient: string };
      const prefs = await preferencesService.toggleFavorite(req.user!.sub, ingredient);
      res.json({ success: true, data: prefs });
    } catch (err) { next(err); }
  }

  async toggleAllergen(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { ingredient } = req.body as { ingredient: string };
      const prefs = await preferencesService.toggleAllergen(req.user!.sub, ingredient);
      res.json({ success: true, data: prefs });
    } catch (err) { next(err); }
  }

  async toggleIntolerance(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { intolerance } = req.body as { intolerance: string };
      const prefs = await preferencesService.toggleIntolerance(req.user!.sub, intolerance);
      res.json({ success: true, data: prefs });
    } catch (err) { next(err); }
  }
}

export const preferencesController = new PreferencesController();
