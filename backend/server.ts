import express = require( 'express' );
import cors = require( 'cors' );
import {MockData} from '../test/database/mock-data/db-sql'

// Create a new express application instance
const app: express.Application = express();

const data = new MockData();

app.use( express.json() );
app.use( cors() );

app.use( express.static( 'dist/frontend' ) )

app.get('/api/*', ( req, res ) => {
	const resp = data.response( req.url, { method:'GET' } )
	console.info( 'GET: ', resp );
	if ( typeof resp == 'number' ){
		res.sendStatus( resp );
	}
	res.send(resp);
});


app.post('/api/*', ( req, res )=>{
	console.info( 'POST: ', req.body );
	const resp = data.response( req.url, {
		method:'POST',
		body: JSON.stringify(req.body)
 	})
  res.send(resp);
});

app.delete('/api/*', ( req, res )=>{
	const resp = data.response( req.url, { method:'DELETE' } )
	console.info( 'DELETE: ', resp );
	res.send(resp);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.info('Rest server listening on port ' + PORT );
});
