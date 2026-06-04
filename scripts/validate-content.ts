// 内容验证脚本
import { readdirSync, readFileSync, statSync } from 'fs'
import { join, relative } from 'path'
import matter from 'gray-matter'

const DOCS_DIR = join(process.cwd(), 'src/content/docs')
const beginnerRequiredSections = ['## 你会学到什么', '## 为什么要学', '## 前置知识', '## 核心概念', '## 最小示例', '## 手把手练习', '## 检查标准', '## 常见错误', '## 面试怎么说', '## 下一步']

function walkDir(dir) {
  const results = []
  for (const item of readdirSync(dir)) {
    const f = join(dir, item)
    if (statSync(f).isDirectory()) results.push(...walkDir(f))
    else results.push(f)
  }
  return results
}

export function validateDocs() {
  const errors = []
  const warnings = []
  for (const file of walkDir(DOCS_DIR)) {
    if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue
    const { data, content: body } = matter(readFileSync(file, 'utf-8'))
    const rel = relative(DOCS_DIR, file)
    if (data.category === 'beginner-course') {
      for (const s of beginnerRequiredSections) {
        if (!body.includes(s)) errors.push(rel + ': missing section "' + s + '"')
      }
    }
    if (body.length < 500) warnings.push(rel + ': short content (' + body.length + ' chars)')
  }
  return { errors, warnings }
}

if (process.argv[1] && process.argv[1].includes('validate-content')) {
  const { errors, warnings } = validateDocs()
  for (const w of warnings) console.warn('WARN:', w)
  for (const e of errors) console.error('ERROR:', e)
  if (errors.length > 0) process.exit(1)
  console.log('Validation passed!')
}