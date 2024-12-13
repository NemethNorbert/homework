import { useMemo } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

const paginationModel = { page: 0, pageSize: 10 };

export default function DataTable({ data }: { data: object[] }) {
	const columns: GridColDef[] = useMemo(() => {
		if (data.length === 0) return [];
		return Object.keys(data[0])
			.filter((key) => !key.startsWith("_"))
			.map((key) => {
				return { field: key, headerName: key, width: 130 };
			});
	}, [data]);

	return (
		<Paper sx={{ maxheight: "80vh", width: "100%" }}>
			<DataGrid
				rows={data}
				columns={columns}
				initialState={{ pagination: { paginationModel } }}
				pageSizeOptions={[5, 10]}
				sx={{ border: 0 }}
			/>
		</Paper>
	);
}
