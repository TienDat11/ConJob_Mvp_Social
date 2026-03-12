import { expect, beforeEach, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  cleanup();
});


describe('Vitest Setup', () => {
  it('test framework is configured correctly', () => {
    expect(document).toBeDefined();
    expect(expect).toBeDefined();
  });
});
