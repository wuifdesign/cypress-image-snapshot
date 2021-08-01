/// <reference types="cypress" />
import { Runner } from 'mocha';
declare function reporter(runner: Runner): void;
export default reporter;
