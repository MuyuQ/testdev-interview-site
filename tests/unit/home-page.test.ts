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

  it('should expose the beginner learning path in teaching order', () => {
    const { beginnerPath } = getHomePageData('/testdev-interview-site/')
    expect(beginnerPath).toHaveLength(8)
    expect(beginnerPath[0].slug).toBe('start-here')
    expect(beginnerPath[3].slug).toBe('pytest-first-test')
    expect(beginnerPath[7].slug).toBe('interview-expression-for-first-project')
  })

  it('should group all ten modules into four capability layers', () => {
    const { capabilityLayers } = getHomePageData('/testdev-interview-site/')
    expect(capabilityLayers).toHaveLength(4)
    expect(capabilityLayers.flatMap((layer) => layer.modules)).toHaveLength(10)
    expect(capabilityLayers[0].name).toBe('入门教学层')
  })
})
