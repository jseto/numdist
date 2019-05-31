import { h, Component } from "preact";

export interface NumberCollectorState {
	n: number;
	b: number;
	tempCollection: Pairs[];
	highCollection: Pairs[];
	lowCollection: Pairs[];
}

interface Pairs {
	n: number;
	b: number;
}

export class NumberCollector extends Component<{}, NumberCollectorState> {
	constructor() {
		super();
		this.setState({
			tempCollection:[],
			highCollection: [],
			lowCollection: []
		})
	}

	render() {
		const { n, b, tempCollection, highCollection, lowCollection } = {...this.state}
		return (
			<div onKeyDown={ e => this.command( e ) }>
				<label>Number</label>
				<input
					name="number"
					value={n}
					ref={ num => this.num = num }
					onInput={ e =>this.inputNumber( e ) }
					onKeyDown={ e => this.keyDown( e ) }/>
				<label>Price</label>
				<input
					name="price"
					value={b}
					ref={ price => this.price = price }
					onInput={ e => this.inputPrice( e ) }
					onKeyDown={ e => this.keyDown( e ) }/>
				<button onClick={ ()=>this.add() }>Add</button>
				<ul>
					{ tempCollection.map( item => { return (
							<li>
								{item.n} - {item.b }
								<a href="##" onClick={ ()=>this.deleteTempCollection( item ) }> X</a>
							</li>
						)})
					}
				</ul>
				<button onClick={ ()=>this.addToHigh() }>High</button>
				<button onClick={ ()=>this.addToLow() }>Low</button>
				<button onClick={ ()=>this.send() }>Send</button>
				<h2>High</h2>
				<ul>
					{ highCollection.map( item => <li>{item.n} - {item.b }</li> ) }
				</ul>
				<h2>Low</h2>
				<ul>
					{ lowCollection.map( item => <li>{item.n} - {item.b }</li> ) }
				</ul>
			</div>
		);
	}

  command( e: KeyboardEvent ) {
		if ( e.altKey ) {
			switch ( e.code ) {
				case 'KeyQ':
					this.addToHigh();
					console.log ( 'nice Alt+Q' );
					break;
				case 'KeyA':
					this.addToLow();
					console.log ( 'ugly Alt+A' );
					break;
				case 'KeyS':
					this.clear();
					console.log ( 'clear Alt+S' );
					break;
			}
		}
  }

  clear() {
    this.setState({
			n: null,
			b: null,
			tempCollection: [],
			highCollection: [],
			lowCollection: []
		})
  }

	send() {
		NumberCollector.postREST( 'api/number_collector/', {
			low: this.state.lowCollection,
			high: this.state.highCollection
		}).then( () =>	this.clear() );
	}

  addToLow(): void {
		this.setState((state: NumberCollectorState) => ({
			lowCollection: [ ...state.tempCollection ]
		}));
  }

  addToHigh(): void {
		this.setState((state: NumberCollectorState) => ({
			highCollection: [ ...state.tempCollection ]
		}));
  }

  keyDown( e: KeyboardEvent ) {
    if ( e.code.indexOf( 'Enter' ) >= 0 ) {
			if ( e.target['name'] === 'number' ) {
				this.price.focus();
			}
			else {
				this.add();
			}
		}
  }

  deleteTempCollection(item: Pairs) {
    this.setState((state: NumberCollectorState)=>{
			return {
				tempCollection: state.tempCollection.filter( i => !(i.b === item.b && i.n === item.n ))
			}
		});
  }

  add(): void {
		this.num.focus();
    this.setState(( state: NumberCollectorState ) => ({
			tempCollection: state.tempCollection.concat(
				{ n: this.state.n, b: this.state.b }
			),
			n: '',
			b: ''
		}));

  }

  inputPrice(e: Event): void {
		this.setState({ b: Number( e.target['value'] ) })
  }

	inputNumber(e: Event): void {
		this.setState({ n: Number( e.target['value'] ) })
  }

	static objectToQueryString( obj: Object ): string {
    return '?' + Object.keys(obj)
      .map( k => encodeURIComponent( k ) + '=' + encodeURIComponent( obj[ k ] ) )
      .join('&');
  }

	static processResponse( resp: Response, resolve: (value?: any[] | PromiseLike<any[]>) => void, reject: (reason?: any) => void ) {
		if ( resp.status > 300 ) {
			reject( resp.statusText );
		}
		else {
			resolve( resp.json() );
		}
	}

	static getREST( endpointCommand: string, queryObject: Object ) {
		let fullURL = NumberCollector.url + endpointCommand + NumberCollector.objectToQueryString( queryObject );
		return new Promise<any[]>( (resolve, reject) => {
			fetch( fullURL )
				.then( resp => this.processResponse( resp, resolve, reject ) )
				.catch( error => { throw( new Error( error.message ) ); } );
		});
	}

	static postREST( endpointCommand: string, dataObject: {} ) {
		let fullURL = NumberCollector.url + endpointCommand;
		return new Promise<any[]>( ( resolve, reject ) => {
			fetch( fullURL, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify( dataObject )
			})
			.then( resp => this.processResponse( resp, resolve, reject ) )
			.catch( error => { throw new Error( error.message ) } )
		});
	}

	private static url = '/api/number_collector/';
	private price: HTMLInputElement;
	private num: HTMLInputElement;
}
