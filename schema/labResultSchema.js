const labResultSchema = {
	version: 0,
	title: "Lab result",
	primaryKey: {
		key: "id",
		fields: ["patient_id", "clinic_no", "testcode", "collectiontime"],
		separator: "-",
	},
	type: "object",
	properties: {
		id: {
			type: "string",
			maxLength: 100,
		},
		clinic_no: {
			type: "string",
		},
		barcode: {
			type: "string",
		},
		patient_id: {
			type: "string",
		},
		patient_name: {
			type: "string",
		},
		dob: {
			type: "string",
		},
		gender: {
			type: "string",
		},
		collectiondate: {
			type: "string",
		},
		collectiontime: {
			type: "string",
		},
		testcode: {
			type: "string",
		},
		testname: {
			type: "string",
		},
		result: {
			type: "string",
		},
		unit: {
			type: "string",
		},
		refrangelow: {
			type: "string",
		},
		refrangehigh: {
			type: "string",
		},
		note: {
			type: "string",
		},
		nonespecrefs: {
			type: "string",
		},
	},
	required: ["patient_id", "clinic_no", "testcode", "collectiontime"],
};

export default labResultSchema;
