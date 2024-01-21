/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'jsdom',
	moduleDirectories: ['node_modules'],
	setupFilesAfterEnv: ['<rootDir>/tests/client/setup-tests.ts'],
	maxWorkers: 8,
};
