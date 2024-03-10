import { createGit } from "../create-git";

export async function pushAssets(): Promise<void> {
	const git = createGit();

	return git
		.add(['-f', './build'])
		.then(() => git.commit("🚀 Build Artifacts"))
		.then(() => git.push())
		.then(() => {});
}
