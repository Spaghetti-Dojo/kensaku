---
title: Logging
layout: post
nav_order: 7
---

The project make use of some WordPress Actions in contexts where the logic flow might fail for some reason, for instance
when there's a REST request that fails to be processed. In these cases, the project will fire an action.

The logging is part of an additional Modularity module called _Logging_. This module only boot when the env is set in
debugging mode.

The client part of the module consist in a simple file hooking in those actions and writing the logs to the console.

For instance, below you can see an example of one of the actions error logging.

```ts
addAction(
	'wp-entities-search.on-change-entities.error',
	'wp-entities-search/wp-on-change-entities.error',
	(error) => {
		console.error(
			`Composite Entities by Kind - on Change Entities: ${
				new Error(error).message
			}`
		);
	}
);
```

Obviously the actions fired by the code are not solely for logging, you can use them however you want.
