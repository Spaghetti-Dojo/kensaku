import gitFactory, {SimpleGit} from 'simple-git'

let git: SimpleGit | null = null

export function createGit (): SimpleGit {
	if (git) {
		return git
	}

	const workingDirectory = process.cwd()
	// @ts-ignore
	const userName = `${process.env.GIT_USER}`
	// @ts-ignore
	const userEmail = `${process.env.GIT_EMAIL}`

	try {
		bailIfFalsy(userName, 'Git user name is empty.');
		bailIfFalsy(userEmail, 'Git user email is empty.');

		git = gitFactory({baseDir: workingDirectory})

		git
		  ?.addConfig('user.name', userName)
		  ?.addConfig('user.email', userEmail)
		  ?.addConfig('advice.addIgnoredFile', 'false')
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

export function bailIfFalsy(value: boolean | string | number | unknown[], message: string): void {
	if ((Array.isArray(value) && value.length <= 0) || !value) {
		throw new Error(message || 'Unknown error')
	}
}
