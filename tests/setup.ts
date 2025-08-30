import { jest } from '@jest/globals';

// Mock environment variables
process.env.USE_MOCK_DATA = 'true';
process.env.NODE_ENV = 'test';

// Global test timeout
jest.setTimeout(10000);

// Mock console methods to reduce noise in test output
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};