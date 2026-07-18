import { Request, Response, NextFunction } from 'express';
import { forumService } from './forum.service';

export class ForumController {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = 1, limit = 10, type = 'all', sort = 'newest' } = req.query as Record<string, string>;
      const result = await forumService.list({
        page: Number(page),
        limit: Number(limit),
        type,
        sort,
        userId: req.user?.sub,
      });
      res.json({ success: true, ...result });
    } catch (err) { next(err); }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const post = await forumService.getById(Number(req.params.id), req.user?.sub);
      res.json({ success: true, data: post });
    } catch (err) { next(err); }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const post = await forumService.create(req.user!.sub, req.body);
      res.status(201).json({ success: true, data: post });
    } catch (err) { next(err); }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const post = await forumService.update(Number(req.params.id), req.user!.sub, req.body);
      res.json({ success: true, data: post });
    } catch (err) { next(err); }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await forumService.delete(Number(req.params.id), req.user!.sub, req.user!.role);
      res.status(204).send();
    } catch (err) { next(err); }
  }

  async toggleLike(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await forumService.toggleLike(Number(req.params.id), req.user!.sub);
      res.json({ success: true, data: result });
    } catch (err) { next(err); }
  }
}

export const forumController = new ForumController();
