// 首页数据测试
import { describe, expect, it } from 'vitest'
import { getHomePageData } from '../../src/lib/home-page'

describe('home page', () => {
  it('should expose beginner and interview entry links', () => {
    const { entryLinks } = getHomePageData('/testdev-interview-site/')
    expect(entryLinks).toHaveLength(2)
    expect(entryLinks[0].id).toBe('beginner')
    expect(entryLinks[1].id).toBe('interview')
  })
  it('should generate module links', () => {
    const { moduleLinks } = getHomePageData('/testdev-interview-site/')
    expect(moduleLinks.length).toBeGreaterThan(0)
  })
})