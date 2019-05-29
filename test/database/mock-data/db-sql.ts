import * as Sql from "sql.js";
import * as jsonData from "./db.json"
import * as fs from "fs"
import * as uuid from "uuid/v4"

export class MockData {
	static tablePrefix = 'prefix_';
	readonly testDataTable = MockData.tablePrefix + 'mock_data_test_data';
	private _db: Sql.Database;
  private _insertStatement: string[];

	constructor() {
		this._db = new Sql.Database();
		this._insertStatement = [];

		let sqlArr = [
			'CREATE TABLE IF NOT EXISTS ',
			this.testDataTable,
			' ( ',
			'id integer primary key, ', // NOT NULL AUTO INCREMENT, ',
			'name varchar(255), ',
			'salary int(10), ',
			'born datetime, ',
			'isHired tinyint(1), ',
			'token varchar(255) ',
			');'
		];
		this._db.run( sqlArr.join('') );
		this.fillData( this.testDataTable );
	}

	close() {
    this._db.close();
  }

	response( fullURL: string, opts?: any, verbose: boolean = false ) {
		if ( verbose ) console.info( '\x1b[36mfetch mock call: ', fullURL, opts, '\x1b[0m' );

		let urlObj = new URL( fullURL, 'http://localhost' );
		let p = urlObj.pathname;
		let table = p.slice( p.lastIndexOf( '/', p.length - 2 ) + 1, p.length - 1 );
		let params = {};
		urlObj.searchParams.forEach(( value, key )=>{
			params[ key ] = value;
		});

		if ( p.indexOf( '/locales/' ) >=0 ) {
			return fs.readFileSync( '.' + p, 'utf8' );
		}

		if ( opts === undefined || opts.method === 'GET' ) {
			return this.mockGET( table, params );
		}

		if ( opts.method === 'POST' ) {
			const obj = JSON.parse( opts.body );
			if ( this.mockGET(table, { id: obj.id } ).length ) {
				return this.mockPUT( table, obj );
			}
			else{
				return this.mockPOST( table, obj );
			}
		}

		if ( opts.method === 'PUT' ) {
			return this.mockPUT( table, JSON.parse( opts.body ) );
		}

		if ( opts.method === 'DELETE' ) {
			return this.mockDELETE( table, params );
		}
	}

	private mockPOST( table: string, dataObject:any ) {
		let data = [];
		data.push( dataObject );

		this.insert( MockData.tablePrefix + table, data );
		let resp = this._db.exec( 'select last_insert_rowid();' );
		let lastRowId = resp[0].values[0][0];
		if ( lastRowId ) return this.query( MockData.tablePrefix + table, this.buildWhereArray( { id: lastRowId } ), false );
		else return [];
	}

	private mockPUT( table: string, dataObject:any ) {
		let searchObj = {id: dataObject.id};
		delete dataObject.id;
		delete dataObject.token;
		return this.update( MockData.tablePrefix + table, dataObject, this.buildWhereArray( searchObj ) );
	}

	private mockGET( endpoint: string, params: {} ): any {
		switch ( endpoint ) {
			default:
				return this.query( MockData.tablePrefix + endpoint, this.buildWhereArray( params ) );
		}
	}

	mockDELETE( endpoint: string, params: {} ) {
  	return this.deleteRows( MockData.tablePrefix + endpoint, this.buildWhereArray( params ) );
  }

	private buildWhereArray( params: {} ): string[] {
		let whereArr: string[] = [];
		for ( let key in params ) {
			whereArr.push( key + '= "' + params[ key ] + '"' );
		}
		return whereArr;
	}

  private query( table: string, whereArr: string[], removeToken: boolean = true ) {
		let sqlStr = 'SELECT * FROM ' + table;
		if ( whereArr.length ) {
			sqlStr += ' WHERE ' + whereArr.join( ' AND ' );
		}

		let resp = [];
		let s = this._db.prepare( sqlStr );
		while (s.step()) {
		  resp.push( s.getAsObject() );
		}
		s.free();

		if ( removeToken ) {
			resp.forEach((row)=> delete row.token );
		}
		return resp;
	}

	private fillData( table: string ) {
		this.insert( table, jsonData[ table ] );
	}

	private insert( tableName: string, data: any[] ) {
		if ( !data ) return;

		let keys = [];
		for ( var key in data[0] ) {
			keys.push( key );
		};

		let elements = [];
		data.forEach( (element )=>{
			let values = [];
			keys.forEach( (key)=>{
				values.push( element[ key ]? '"' + element[ key ] + '"' : 'null' );
			});
			values.push( '"' + uuid() + '"' );
			elements.push( '(' + values.join(',') + ')' );
		});
		keys.push( 'token' );

		let sqlStr = 'INSERT INTO ' + tableName +' ( ' + keys.join(', ') + ' ) ' + 'VALUES ' + elements.join(',') + ';'
		this._insertStatement.push( sqlStr );
		this._db.run( sqlStr );
	}

	private update( table: string, data:{}, whereArr: string[] ) {
		let sqlStr = 'UPDATE ' + table + ' SET ';

		let sqlCols = []
		for( let key in data ) {
			sqlCols.push( key + ' = ' + ( typeof data[ key ] === 'string'? '"' + data[ key ] + '"' : '' + data[ key ] ) );
		}
		if ( whereArr.length ) {
			sqlStr += sqlCols.join(',') + ' WHERE ' + whereArr.join( ' AND ');
			this._db.run( sqlStr );
			return true;
		}
		else return false;
	}

	private deleteRows( table: string, whereArr: string[] ) {
		let sqlStr = 'DELETE FROM ' + table;
		if ( whereArr.length ) {
			sqlStr += ' WHERE ' + whereArr.join( ' AND ' );
			this._db.run( sqlStr );
			return true;
		}
		else return false;
	}

	exportDatabase() {
		let data = this._db.export();
		let buffer = Buffer.from(data);
		let dir = 'out/';
		if ( !fs.existsSync( dir ) ) {
    	fs.mkdirSync( dir );
		}
		fs.writeFileSync( dir + 'filename.sqlite', buffer );
		fs.writeFileSync( dir + 'filename.sql', this._insertStatement.join('\n') );
	}
}

if (typeof module !== 'undefined' && module.exports) {
	new MockData().exportDatabase();
}
