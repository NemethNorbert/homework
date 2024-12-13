import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";

import cors from "cors";
import { createRxDatabase, addRxPlugin } from "rxdb";
import { getRxStorageMemory } from "rxdb/plugins/storage-memory";
import { RxDBJsonDumpPlugin } from "rxdb/plugins/json-dump";
import labResultSchema from "./schema/labResultSchema";

dotenv.config();
addRxPlugin(RxDBJsonDumpPlugin);

async function startServer() {
	const myDatabase = await createRxDatabase({
		name: "myLittleDB",
		storage: getRxStorageMemory(),
	});
	const myCollections = await myDatabase.addCollections({
		labResult: {
			schema: labResultSchema,
		},
	});
	const app: Express = express();

	app.use(express.json());
	app.use(cors());

	app.get("/labResults", (req: Request, res: Response) => {
		myCollections.labResult.exportJSON().then((json) => {
			res.send(json);
		});
	});

	app.post("/api/v1/add", async (req: Request, res: Response) => {
		const result = await myCollections.labResult.bulkInsert(req.body);
		res.send(result);
	});

	const port = process.env.PORT || 8000;

	app.listen(port, () => {
		console.log(`Example app listening on port ${port}`);
	});
}

startServer();
