export interface Configuration {
	env: string;
	server: {
		port: number;
		mongoUrl: string;
	};
}
