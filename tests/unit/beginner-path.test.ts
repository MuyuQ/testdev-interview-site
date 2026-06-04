// 新手路径数据单元测试
import { describe, expect, it } from 'vitest';
import {
  beginnerPath,
  getBeginnerLessonBySlug,
  getNextBeginnerLesson,
  getTotalMinutes,
} from '../../src/lib/beginner-path';

describe('beginner path', () => {
  it('defines exactly eight ordered beginner lessons', () => {
    expect(beginnerPath.lessons.map((lesson) => lesson.slug)).toEqual([
      'start-here',
      'testdev-role-map',
      'python-testing-minimum',
      'pytest-first-test',
      'http-api-basics',
      'pytest-api-first-case',
      'mock-login-mini-project',
      'interview-expression-for-first-project',
    ]);
  });

  it('finds lessons by slug', () => {
    expect(getBeginnerLessonBySlug('pytest-first-test')).toMatchObject({
      slug: 'pytest-first-test',
      day: 4,
    });
  });

  it('returns the next lesson', () => {
    expect(getNextBeginnerLesson('pytest-first-test')).toMatchObject({
      slug: 'http-api-basics',
      day: 5,
    });
  });

  it('returns undefined after the final lesson', () => {
    expect(
      getNextBeginnerLesson('interview-expression-for-first-project')
    ).toBeUndefined();
  });

  it('returns undefined for unknown slug', () => {
    expect(getBeginnerLessonBySlug('unknown-slug')).toBeUndefined();
  });

  it('calculates total minutes correctly', () => {
    const total = getTotalMinutes();
    expect(total).toBeGreaterThan(0);
    expect(total).toBe(410); // 25+35+50+50+55+60+90+45
  });

  it('has valid path metadata', () => {
    expect(beginnerPath.id).toBe('beginner-7-day-api');
    expect(beginnerPath.title).toContain('7 天');
    expect(beginnerPath.audience).toBeTruthy();
  });
});