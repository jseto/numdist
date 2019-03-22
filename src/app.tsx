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
  componentDidMount() {
    setTimeout(() => {
      // let state: AppState = <AppState>(this).state;
      // state.name = "Preact's componentDidMount worked as expected";
      this.setState({name: "Hello world"});
    }, 2000);
  }
  render(props: AppProps, state: AppState) {
    return <h1>Hello props: {props.name} state: {state.name}</h1>;
  }
}
