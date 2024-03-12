import * as exec from "@actions/exec";
import * as core from "@actions/core";

export async function createArtifacts(): Promise<void> {
	return Promise.resolve()
		.then(() => core.startGroup("📦 Creating artifacts"))
		.then(() => exec.exec("yarn build"))
		.catch((result) => {
			if (result !== 0) throw new Error("Failed to build artifacts.");
			return result;
		})
		.finally(() => core.endGroup());
}
