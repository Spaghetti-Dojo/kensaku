import * as exec from "@actions/exec";

export async function pushAssets(): Promise<void> {
	return _exec('git add -f ./build')
	  .then(() => _exec('git commit -m "🚀 Build Artifacts"'))
	  .then(() => _exec('git push'))
	  .then(() => {})
}

async function _exec(command: string): Promise<number> {
	return exec.exec(command).
	  then(result => {
		if (result !== 0) throw new Error(`Failed to execute command: ${command}`);
		return result;
	})
}
