import { h, Component } from "preact";

export interface AppProps {
  name: string;
}

interface AppState {
  name: string;
}

export class App extends Component<AppState> {

	constructor(props: AppProps) {
    super(props);

    this.state = { name: props.name };
  }

	stringToWrite() {
		return 'Hello world';
	}

  componentDidMount() {
    setTimeout(() => {
      this.setState({name: this.stringToWrite()});
    }, 2000);
  }
  render(props: AppProps, state: AppState) {
    return <h1>Hello props: {props.name} state: {state.name}</h1>;
  }
}
