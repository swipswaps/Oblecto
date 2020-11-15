import { EventEmitter } from 'events';

export default class MediaIndexer extends EventEmitter {
    constructor(oblecto) {
        super();

        this.oblecto = oblecto;
    }

}
