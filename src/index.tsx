import { h, render } from "preact";
import { NumberCollector } from "./number-collector";

render(<NumberCollector />, document.getElementsByTagName( 'NumberCollector').item(0) );
