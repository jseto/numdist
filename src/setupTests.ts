import 'jest-enzyme';
import * as Enzyme from 'enzyme';
import { Adapter } from 'enzyme-adapter-preact-pure';

Enzyme.configure({ adapter: new Adapter });
