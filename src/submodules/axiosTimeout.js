import WarnExtendableError from '../lib/errors/WarnExtendableError';
import axios from 'axios';

export default function (...args) {
    return new Promise(function(resolve, reject) {
        let timedout = false;
        let timeout = setTimeout(() => {
            timedout = true;

            reject(new WarnExtendableError(`Timeout expired for ${args[0].url}`));
        }, 10000);


        axios(...args).then(response => {
            if (timedout) return;

            clearTimeout(timeout);

            resolve(response);
        }).catch(err =>{
            clearTimeout(timeout);
            reject(err);
        });
    });
}
