import * as core from "@actions/core";
import * as exec from "@actions/exec";

async function main(): Promise<void> {
	core.info("Starting Assets Compilation...");

	exec.exec('yarn build')
		.then(() => core.info("Compilation done."))
		.catch((error) => core.setFailed(`Failed to compile assets: ${error}`));
}

export default main;
