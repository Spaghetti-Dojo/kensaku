import * as core from "@actions/core";
import * as exec from "@actions/exec";

async function main(): Promise<void> {
	const command = core.getInput("build-command");

	if (!command) {
		core.setFailed("Missing command. Aborting!");
	}

	core.info("Starting Assets Compilation...");

	exec.exec(command)
		.then(() => core.info("Compilation done."))
		.catch((error) => core.setFailed(`Failed to compile assets: ${error}`));
}

export default main;
