import * as core from "@actions/core";

import { createGit } from "../create-git";

export async function pushAssets(): Promise<void> {
	const git = createGit();

	return Promise.resolve()
		.then(() => core.startGroup("🚀 Pushing Artifacts"))
		.then(() => git.add(["-f", "./build"]))
		.then(() => git.commit("🚀 Build Artifacts"))
		.then(() => git.push())
		.then((result) => {
			const messages = result.remoteMessages.all.join("\n");
			core.info(`Pushed artifacts with status: ${messages}`);
		})
		.finally(() => core.endGroup());
}
