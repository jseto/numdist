import * as fs from "fs"

interface Pairs {
	n: number;
	b: number;
}

export class MockData {
	private lowNumber: number[];
	private highNumber: number[];

	constructor() {
		this.lowNumber = [];
		this.highNumber = [];
		this.readData();
	}

	close() {
  }

	response( fullURL: string, opts?: any, verbose: boolean = false ) {
		if ( verbose ) console.info( '\x1b[36mfetch mock call: ', fullURL, opts, '\x1b[0m' );

		let urlObj = new URL( fullURL, 'http://localhost' );
		let params = {};
		urlObj.searchParams.forEach(( value, key )=>{
			params[ key ] = value;
		});

		if ( opts === undefined || opts.method === 'GET' ) {
			return {
				low: this.lowNumber,
				high: this.highNumber
			}
		}

		if ( opts.method === 'POST' ) {
			const obj = JSON.parse( opts.body );
			console.log(obj)

			let low: Pairs[] = obj.low;
			let high: Pairs[] = obj.high;

			low.forEach( item => this.lowNumber[ item.n ] += item.b );
			high.forEach( item => this.highNumber[ item.n ] += item.b );
			this.writeData();
			return [];
		}

		if ( opts.method === 'DELETE' ) {
			// return this.mockDELETE( table, params );
		}
	}

	writeData() {
		let dir = 'out/';
		if ( !fs.existsSync( dir ) ) {
    	fs.mkdirSync( dir );
		}
		fs.writeFileSync( dir + 'data.dat', JSON.stringify({
			low: this.lowNumber,
		 	high: this.highNumber
		}));
	}

	readData() {
		let dir = 'out/';
		try {
			let data = JSON.parse( fs.readFileSync( dir + 'data.dat' ).toString() );
			this.lowNumber = data.low;
			this.highNumber = data.high;
			console.log( 'High --->', this.highNumber );
			console.log( 'Low ---->', this.lowNumber );
		}
		catch(e){
			console.error('initial data not found', e );
			for ( let i = 0; i<100; ++i ) {
				this.lowNumber[i]=0;
				this.highNumber[i]=0;
			}
		}
	}

}
