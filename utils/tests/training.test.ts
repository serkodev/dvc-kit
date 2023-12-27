import { expect, it } from 'vitest'
import { findShortestCombination } from '../training'

it('findShortestCombination', () => {
  expect(findShortestCombination(1)).toMatchInlineSnapshot(`null`)
  expect(findShortestCombination(2)).toMatchInlineSnapshot(`null`)
  expect(findShortestCombination(3)).toMatchInlineSnapshot(`
    [
      3,
    ]
  `)
  expect(findShortestCombination(4)).toMatchInlineSnapshot(`null`)
  expect(findShortestCombination(5)).toMatchInlineSnapshot(`
    [
      5,
    ]
  `)
  expect(findShortestCombination(6)).toMatchInlineSnapshot(`
    [
      3,
      3,
    ]
  `)
  expect(findShortestCombination(7)).toMatchInlineSnapshot(`null`)
  expect(findShortestCombination(8)).toMatchInlineSnapshot(`
    [
      5,
      3,
    ]
  `)
  expect(findShortestCombination(9)).toMatchInlineSnapshot(`
    [
      9,
    ]
  `)
})
