index:
	@node -e '\
	import { glob } from "node:fs/promises";\
	const files = await glob("src/**/*.ts", { exclude: ["src/index.ts"] });\
	for await (const file of files) { console.log(`export * from "./` + file.slice(4, -3) + `"`)};\
	' > src/index.ts
	yarn format src/index.ts

.PHONY: $(MAKECMDGOALS)
