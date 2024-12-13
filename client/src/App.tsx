import React, { useState } from "react";
import { Container, IconButton, Paper, TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { csv } from "./utils/Parser";
import DataTable from "./components/DataTable";

type Inputs = {
	file: File;
};

function App() {
	const [file, setFile] = useState<File>();

	const queryClient = useQueryClient();

	const { isPending, error, data } = useQuery({
		queryKey: ["labResults"],
		queryFn: () =>
			fetch("http://localhost:8000/labResults").then((res) => res.json()),
	});

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setFile(e.target.files[0]);
		}
	};

	const { control, handleSubmit } = useForm<Inputs>();

	const onSubmit: SubmitHandler<Inputs> = async () => {
		if (file?.type === "text/plain") {
			const reader = new FileReader();

			reader.onload = function (e) {
				if (typeof e?.target?.result === "string") {
					let rows = e.target.result.split("\r\n");
					let lines: string[][] = [];
					for (const row of rows) {
						let line = csv.parseCsvLine(row, "|");
						if (line) lines.push(line);
					}
					mutation.mutate(csv.parseCsvLines(lines));
				}
			};

			reader.readAsText(file);
		}
	};

	const mutation = useMutation({
		mutationFn: (data: {}[]) => {
			return fetch("http://localhost:8000/api/v1/add", {
				method: "POST",
				body: JSON.stringify(data),
				headers: {
					"Content-type": "application/json; charset=UTF-8",
				},
			});
		},
		onSuccess: (resp) =>
			resp.json().then((data) => {
				if (data.error.length > 0) {
					alert(
						"Some files were not imported, with status code: " +
							data.error[0].status
					);
				}

				queryClient.invalidateQueries({ queryKey: ["labResults"] });
			}),
		onError: (error) => {
			alert("Error importing files: " + error.message);
		},
	});

	return (
		<>
			<Container maxWidth="sm" sx={{ marginTop: "2rem" }}>
				<h1>Import Lab Results</h1>
				<form onSubmit={handleSubmit(onSubmit)}>
					<Grid container>
						<Grid size={8}>
							<Controller
								name="file"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										type="file"
										onChange={handleFileChange}
									/>
								)}
							/>
						</Grid>
						<Grid size={4}>
							<IconButton
								sx={{ marginTop: "0.5rem" }}
								color="primary"
								type="submit"
							>
								<FileUploadIcon />
							</IconButton>
						</Grid>
					</Grid>
				</form>
			</Container>
			<Container maxWidth="lg" sx={{ marginTop: "2rem" }}>
				<Paper>
					{isPending && <p>Loading...</p>}
					{error && <p>Error: {error.message}</p>}
					{data?.docs && <DataTable data={data.docs} />}
				</Paper>
			</Container>
		</>
	);
}

export default App;
