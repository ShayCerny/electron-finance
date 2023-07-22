interface Transaction {
	name: string;
	amount: number;
	expense?: boolean;
	debt?: boolean;
	owed?: number;
}
