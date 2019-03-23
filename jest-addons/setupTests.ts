import 'jest-enzyme';
import 'jest-environment-enzyme';
import * as Enzyme from 'enzyme';
import { Adapter } from 'enzyme-adapter-preact-pure';
import * as preact from 'preact';

Enzyme.configure({ adapter: new Adapter });

declare global {
	var h: typeof preact.h;
}
global.mount = Enzyme.mount;
global.shallow = Enzyme.shallow;
global.render = Enzyme.render;

global.h = preact.h;
