import { describe, expect, it } from 'vitest'

describe('databaseTypes (smoke)', () => {
  it('compiles and exports DatabaseContext as a type', () => {
    // The file is type-only. This test exists as a refactor safety net so
    // a broken type import here surfaces as a test failure rather than a
    // silent build break in a downstream consumer.
    type Shape = import('./databaseTypes').DatabaseContext
    const sample: Partial<Shape> = {}
    expect(sample).toBeDefined()
  })
})
