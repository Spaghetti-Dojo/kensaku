import * as core from "@actions/core";

import { createGit } from "../create-git";

export async function pushAssets(): Promise<void> {
	const git = createGit();

	return Promise.resolve()
		.then(() => core.startGroup("🚀 Pushing Artifacts"))
		.then(() => git.add(["-f", "./build"]))
		.then(() => git.commit("🚀 Build Artifacts"))
		.then((commitResult) => {
			const numberOfChanges = commitResult.summary.changes;
			core.info(`Committed changes: ${numberOfChanges}`);
			return numberOfChanges > 0 ? git.push() : null;
		})
		.then((result) => {
			const messages = result?.remoteMessages.all.join("\n");
			messages && core.info(`Pushed artifacts with result: ${messages}`);
		})
		.finally(() => core.endGroup());
}
