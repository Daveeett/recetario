import { Request, Response, NextFunction } from 'express';
import { recipesService } from './recipes.service';

export class RecipesController {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = 1, limit = 12, category, difficulty } = req.query as Record<string, string>;
      const result = await recipesService.list({
        page: Number(page),
        limit: Number(limit),
        category,
        difficulty,
      });
      res.json({ success: true, ...result });
    } catch (err) { next(err); }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const recipe = await recipesService.getById(Number(req.params.id));
      res.json({ success: true, data: recipe });
    } catch (err) { next(err); }
  }

  async getImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { data, mime, filename } = await recipesService.getImage(Number(req.params.id));
      res.set({
        'Content-Type': mime,
        'Content-Length': data.length,
        'Cache-Control': 'public, max-age=86400',
        'Content-Disposition': `inline; filename="${filename}"`,
      });
      res.send(data);
    } catch (err) { next(err); }
  }

  async getByCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = 1, limit = 12 } = req.query as Record<string, string>;
      const result = await recipesService.list({
        page: Number(page),
        limit: Number(limit),
        category: req.params.slug,
      });
      res.json({ success: true, ...result });
    } catch (err) { next(err); }
  }

  async search(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { q, page = 1, limit = 12 } = req.query as Record<string, string>;
      if (!q || q.trim().length === 0) {
        res.json({ success: true, data: [], meta: { page: 1, limit: 12, total: 0, totalPages: 0 } });
        return;
      }
      const result = await recipesService.search(q, Number(page), Number(limit));
      res.json({ success: true, ...result });
    } catch (err) { next(err); }
  }

  async getRecommended(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const recipes = await recipesService.getRecommended(req.user!.sub);
      res.json({ success: true, data: recipes });
    } catch (err) { next(err); }
  }

  async getAllIngredients(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ingredients = await recipesService.getAllIngredients();
      res.json({ success: true, data: ingredients });
    } catch (err) { next(err); }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const recipe = await recipesService.create(req.body);
      res.status(201).json({ success: true, data: recipe });
    } catch (err) { next(err); }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const recipe = await recipesService.update(Number(req.params.id), req.body);
      res.json({ success: true, data: recipe });
    } catch (err) { next(err); }
  }

  async uploadImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, error: { message: 'No se recibió ninguna imagen', code: 'NO_FILE' } });
        return;
      }
      const result = await recipesService.uploadImage(Number(req.params.id), req.file);
      res.json({ success: true, data: result });
    } catch (err) { next(err); }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await recipesService.delete(Number(req.params.id));
      res.status(204).send();
    } catch (err) { next(err); }
  }
}

export const recipesController = new RecipesController();
