import * as core from "@actions/core";
import { createGit } from "../create-git";

type Data = Map<string, any>;

export async function moveTags(): Promise<void> {
	const data = new Map();

	return retrieveTags(data).then(createTemporaryBranch).then(toggleTags).then(removeTemporaryBranch);
}

async function retrieveTags(data: Map<string, any>): Promise<Data> {
	const git = createGit();

	return git
		.tags(["--contains"])
		.then((tags) => tags.all)
		.then((tags) => {
			core.info(`Retrieved tags: ${tags.join("\n")}`);
			return data.set("tags", tags);
		})
		.then(assertTags);
}

async function assertTags(data: Data): Promise<Data> {
	const tags = data.get("tags");
	if (!tags || tags.length === 0) {
		throw new Error("No tags found. Skipping tags handling.");
	}
	return Promise.resolve(data);
}

async function createTemporaryBranch(data: Map<string, any>): Promise<Data> {
	const git = createGit();

	return git
		.revparse(["--short", "HEAD"])
		.then((currentHash) => `ci-tag-${currentHash}`)
		.then((branchName) => {
			data.set("branchName", branchName);
			core.info(`Branch ${branchName} created successfully.`);
			return branchName;
		})
		.then((branchName) => {
			git.checkoutLocalBranch(branchName);
			return branchName;
		})
		.then((branchName) => git.push(["-u", "origin", branchName]))
		.then(() => data);
}

async function toggleTags(data: Data): Promise<Data> {
	return removeTags(data).then(createTags);
}

async function removeTags(data: Data): Promise<Data> {
	const git = createGit();
	const tags = data.get("tags");

	core.info("Removing Existing Tags.");

	return git.tag(["-d", ...tags]).then(() => {
		core.info("Tags removed successfully.");
		return data;
	});
}

async function createTags(data: Data): Promise<Data> {
	const git = createGit();
	const tags: string[] = data.get("tags");

	core.info(`Creating Tags: ${tags}.`);

	return Promise.all(tags.map(async (tag) => git.addTag(tag)))
		.then(() => git.pushTags())
		.then(() => {
			core.info("Tags created successfully.");
			return data;
		});
}

async function removeTemporaryBranch(data: Data): Promise<void> {
	const git = createGit();
	const branchName = data.get("branchName");
	core.info(`Removing branch: ${branchName}.`);

	return git
		.checkout("--detach")
		.then(() => git.deleteLocalBranch(branchName))
		.then(() => git.push(["--delete", "origin", branchName]))
		.then(() => {});
}
