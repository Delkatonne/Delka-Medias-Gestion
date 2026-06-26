import { Request, Response } from 'express';
import { MediaModel } from '../models/Media';
import { deleteFile } from '../services/uploadService';
import path from 'path';

export const uploadMedia = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { title, description, tags, category } = req.body;

    const media = await MediaModel.create(
      req.user.userId,
      req.file.filename,
      req.file.originalname,
      req.file.mimetype,
      req.file.size,
      req.file.path,
      title,
      description,
      tags ? JSON.parse(tags) : [],
      category
    );

    return res.status(201).json({
      message: 'Media uploaded successfully',
      media,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMedias = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const medias = await MediaModel.findByUserId(req.user.userId, limit, offset);

    return res.json({
      medias,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Get medias error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMedia = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const media = await MediaModel.findById(req.params.id, req.user.userId);
    if (!media) {
      return res.status(404).json({ message: 'Media not found' });
    }

    return res.json(media);
  } catch (error) {
    console.error('Get media error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateMedia = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { title, description, tags, category } = req.body;

    const media = await MediaModel.update(
      req.params.id,
      req.user.userId,
      title,
      description,
      tags ? JSON.parse(tags) : undefined,
      category
    );

    if (!media) {
      return res.status(404).json({ message: 'Media not found' });
    }

    return res.json({
      message: 'Media updated successfully',
      media,
    });
  } catch (error) {
    console.error('Update media error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteMedia = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const media = await MediaModel.findById(req.params.id, req.user.userId);
    if (!media) {
      return res.status(404).json({ message: 'Media not found' });
    }

    // Supprimer le fichier
    deleteFile(media.filepath);

    // Supprimer la base de données
    await MediaModel.delete(req.params.id, req.user.userId);

    return res.json({ message: 'Media deleted successfully' });
  } catch (error) {
    console.error('Delete media error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const searchMedia = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { query, category, mimeType } = req.query;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    if (!query) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }

    const medias = await MediaModel.search(
      req.user.userId,
      query as string,
      category as string,
      mimeType as string,
      limit,
      offset
    );

    return res.json({
      medias,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Search media error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const downloadMedia = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const media = await MediaModel.findById(req.params.id, req.user.userId);
    if (!media) {
      return res.status(404).json({ message: 'Media not found' });
    }

    res.download(media.filepath, media.originalName);
  } catch (error) {
    console.error('Download media error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
