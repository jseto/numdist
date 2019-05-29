/// <reference path="../types/enzyme.d.ts"/>

import 'jest-enzyme';
import * as Enzyme from 'enzyme';
import { Adapter } from 'enzyme-adapter-preact-pure';
import * as preact from 'preact';
import { mount as EnzymeMount, shallow as EnzymeShallow, render as EnzymeRender } from '../types/enzyme';

Enzyme.configure({ adapter: new Adapter });

declare global {
	var h: typeof preact.h;
	// var preact: typeof _preact;

	var shallow: typeof EnzymeShallow;
	var mount: typeof EnzymeMount;
	var render: typeof EnzymeRender;
}
global[ 'mount' ] = Enzyme.mount;
global[ 'shallow' ] = Enzyme.shallow;
global[ 'render' ] = Enzyme.render;

global[ 'h' ] = preact.h;
// global.preact = _preact;
