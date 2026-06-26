import db from '../config/database';
import { Media } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const MediaModel = {
  async create(
    userId: string,
    filename: string,
    originalName: string,
    mimetype: string,
    size: number,
    filepath: string,
    title?: string,
    description?: string,
    tags?: string[],
    category?: string,
    duration?: number,
    width?: number,
    height?: number
  ): Promise<Media> {
    const id = uuidv4();
    
    const media = await db.one(
      `INSERT INTO media (id, user_id, filename, original_name, mimetype, size, filepath, title, description, tags, category, duration, width, height, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), NOW())
       RETURNING *`,
      [id, userId, filename, originalName, mimetype, size, filepath, title, description, tags ? JSON.stringify(tags) : null, category, duration, width, height]
    );

    return {
      id: media.id,
      userId: media.user_id,
      filename: media.filename,
      originalName: media.original_name,
      mimetype: media.mimetype,
      size: media.size,
      filepath: media.filepath,
      title: media.title,
      description: media.description,
      tags: media.tags ? JSON.parse(media.tags) : [],
      category: media.category,
      duration: media.duration,
      width: media.width,
      height: media.height,
      createdAt: media.created_at,
      updatedAt: media.updated_at,
    };
  },

  async findByUserId(userId: string, limit: number = 50, offset: number = 0): Promise<Media[]> {
    try {
      const medias = await db.any(
        `SELECT * FROM media WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
      );

      return medias.map(m => ({
        id: m.id,
        userId: m.user_id,
        filename: m.filename,
        originalName: m.original_name,
        mimetype: m.mimetype,
        size: m.size,
        filepath: m.filepath,
        title: m.title,
        description: m.description,
        tags: m.tags ? JSON.parse(m.tags) : [],
        category: m.category,
        duration: m.duration,
        width: m.width,
        height: m.height,
        createdAt: m.created_at,
        updatedAt: m.updated_at,
      }));
    } catch (error) {
      return [];
    }
  },

  async findById(id: string, userId: string): Promise<Media | null> {
    try {
      const media = await db.oneOrNone(
        'SELECT * FROM media WHERE id = $1 AND user_id = $2',
        [id, userId]
      );

      if (!media) return null;

      return {
        id: media.id,
        userId: media.user_id,
        filename: media.filename,
        originalName: media.original_name,
        mimetype: media.mimetype,
        size: media.size,
        filepath: media.filepath,
        title: media.title,
        description: media.description,
        tags: media.tags ? JSON.parse(media.tags) : [],
        category: media.category,
        duration: media.duration,
        width: media.width,
        height: media.height,
        createdAt: media.created_at,
        updatedAt: media.updated_at,
      };
    } catch (error) {
      return null;
    }
  },

  async update(
    id: string,
    userId: string,
    title?: string,
    description?: string,
    tags?: string[],
    category?: string
  ): Promise<Media | null> {
    try {
      const media = await db.oneOrNone(
        `UPDATE media 
         SET title = COALESCE($3, title), 
             description = COALESCE($4, description), 
             tags = COALESCE($5, tags), 
             category = COALESCE($6, category),
             updated_at = NOW()
         WHERE id = $1 AND user_id = $2
         RETURNING *`,
        [id, userId, title, description, tags ? JSON.stringify(tags) : null, category]
      );

      if (!media) return null;

      return {
        id: media.id,
        userId: media.user_id,
        filename: media.filename,
        originalName: media.original_name,
        mimetype: media.mimetype,
        size: media.size,
        filepath: media.filepath,
        title: media.title,
        description: media.description,
        tags: media.tags ? JSON.parse(media.tags) : [],
        category: media.category,
        duration: media.duration,
        width: media.width,
        height: media.height,
        createdAt: media.created_at,
        updatedAt: media.updated_at,
      };
    } catch (error) {
      return null;
    }
  },

  async delete(id: string, userId: string): Promise<boolean> {
    try {
      await db.none(
        'DELETE FROM media WHERE id = $1 AND user_id = $2',
        [id, userId]
      );
      return true;
    } catch (error) {
      return false;
    }
  },

  async search(
    userId: string,
    query: string,
    category?: string,
    mimeType?: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<Media[]> {
    try {
      let sql = 'SELECT * FROM media WHERE user_id = $1 AND (title ILIKE $2 OR description ILIKE $2 OR tags::text ILIKE $2)';
      const params: any[] = [userId, `%${query}%`];

      if (category) {
        params.push(category);
        sql += ` AND category = $${params.length}`;
      }

      if (mimeType) {
        params.push(`${mimeType}%`);
        sql += ` AND mimetype LIKE $${params.length}`;
      }

      params.push(limit);
      params.push(offset);
      sql += ` ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`;

      const medias = await db.any(sql, params);

      return medias.map(m => ({
        id: m.id,
        userId: m.user_id,
        filename: m.filename,
        originalName: m.original_name,
        mimetype: m.mimetype,
        size: m.size,
        filepath: m.filepath,
        title: m.title,
        description: m.description,
        tags: m.tags ? JSON.parse(m.tags) : [],
        category: m.category,
        duration: m.duration,
        width: m.width,
        height: m.height,
        createdAt: m.created_at,
        updatedAt: m.updated_at,
      }));
    } catch (error) {
      return [];
    }
  },
};
