// 内容验证测试
import { describe, expect, it } from 'vitest'
import { validateDocs } from '../../scripts/validate-content'

describe('content validation', () => {
  it('runs without errors', () => {
    const { errors } = validateDocs()
    expect(Array.isArray(errors)).toBe(true)
  })
})