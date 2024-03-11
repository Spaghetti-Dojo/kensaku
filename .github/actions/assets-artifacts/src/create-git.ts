import gitFactory, {SimpleGit} from 'simple-git'

let git: SimpleGit | null = null

// TODO Maybe inject the values.
export function createGit (): SimpleGit {

	if (git) {
		return git
	}

	const workingDirectory = process.cwd()

	// TODO How to add this to the environment?
	// @ts-ignore
	const token = `${process.env.GIT_TOKEN}`
	// @ts-ignore
	const userName = `${process.env.GIT_USER}`
	// @ts-ignore
	const userEmail = `${process.env.GIT_EMAIL}`

	try {
		git = gitFactory({baseDir: workingDirectory})

		git
		  ?.addConfig('user.name', userName)
		  ?.addConfig('user.email', userEmail)
		  ?.addConfig('advice.addIgnoredFile', 'false')
		  // ?.addConfig('http.https://github.com/', `AUTHORIZATION: bearer ${token}`)
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
