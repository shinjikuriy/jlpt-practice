import { nanoid } from 'nanoid';

export function generateId(): string {
  return nanoid(21); // 21文字のIDを生成（衝突確率を考慮）
} 