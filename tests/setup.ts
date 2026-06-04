// 测试设置文件
import { vi, afterEach } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Mock window.location
const locationMock = {
  href: 'http://localhost:4321/testdev-interview-site/',
  origin: 'http://localhost:4321',
  pathname: '/testdev-interview-site/',
  search: '',
  hash: '',
};

Object.defineProperty(global, 'location', {
  value: locationMock,
  writable: true,
});

// 清理函数
afterEach(() => {
  localStorageMock.clear();
  vi.clearAllMocks();
});