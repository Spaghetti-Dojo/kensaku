import * as exec from "@actions/exec";
import * as core from "@actions/core";

export async function createArtifacts(): Promise<void> {
	return exec
		.exec("yarn build")
		.then((result) => {
			core.info("Artifacts created successfully.");
			return result;
		})
		.then((result) => {
			if (result !== 0) throw new Error("Failed to build artifacts.");
		});
}
