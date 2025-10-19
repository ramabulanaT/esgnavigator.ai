import type { Config } from 'jest';
const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  moduleFileExtensions: ['ts','tsx','js','jsx','json'],
  transform: { '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: { esModuleInterop: true } }] }
};
export default config;
