export function* product<T>(iterables: T[], repeat: number = 1): IterableIterator<T[]> {
  if (iterables.length === 0) {
    return
  }

  // Create an array to hold indices for each repeat
  const indices = Array(repeat).fill(0)
  const maxIndex = iterables.length

  while (true) {
    // Yield the current combination
    yield indices.map(i => iterables[i])

    // Find the rightmost array that has more elements left after the current element in that array
    let next = repeat - 1
    while (next >= 0 && indices[next] === maxIndex - 1) {
      next--
    }

    // All combinations have been generated
    if (next < 0) {
      return
    }

    // Increment this element
    indices[next]++

    // Set all right-hand elements to the same value
    for (let i = next + 1; i < repeat; i++) {
      indices[i] = indices[next]
    }
  }
}
