import * as core from '@actions/core'
import {createArtifacts} from './tasks/create-artifacts'
import {moveTags} from './tasks/move-tags'

async function main(): Promise<void> {
	Promise.resolve()
	  .then(createArtifacts)
	  .then(moveTags)

	  .catch(error => core.setFailed(`Failed to create and push artifacts: ${error}`))
}

export default main;
