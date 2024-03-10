//import * as core from '@actions/core'
import gitFactory, {SimpleGit} from 'simple-git'

let git: SimpleGit | null = null

// TODO Maybe inject the values.
export function createGit (): SimpleGit {

	if (git) {
		return git
	}

	const workingDirectory = process.cwd()
	// @ts-ignore
	// TODO How to add this to the environment?
	const token = process.env.GITHUB_TOKEN

	// const userName = core.getInput('user-name')
	// const userEmail = core.getInput('user-email')

	try {
		git = gitFactory({baseDir: workingDirectory})

		git
		  ?.addConfig('advice.addIgnoredFile', 'false')
		  ?.addConfig('http.https://github.com/.extraheader', `AUTHORIZATION: bearer ${token}`)
	} catch (e: any) {
		console.warn(`Warning: ${e.message ?? e}`)
	}

	assertGit(git)

	return git
}

function assertGit(git: unknown): asserts git is SimpleGit {
	if (!git) {
		throw new Error('Git is not initialized.')
	}
}
