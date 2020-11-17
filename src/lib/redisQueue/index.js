import redis from 'redis';

import logger from '../../submodules/logger';
import {promisify} from 'util';


export default class RedisQueue {
    constructor(oblecto) {
        this.oblecto = oblecto;

        this.jobs = {};
        this.workers = [];

        this.stop = false;

        this.redisClient = redis.createClient({
            host: this.oblecto.config.queue.host
        });
    }

    startWorkers() {
        for (let i = 0; i < this.oblecto.config.queue.concurrency; i++) {
            logger.log('INFO', 'Setting up redis queue worker');
            this.workers[i] = this.queueWorker();
        }
    }

    close () {
        this.stop = true;
    }

    async queueWorker () {
        const lpop = promisify(this.redisClient.lpop).bind(this.redisClient);

        while (!this.stop) {
            const queueItemSerialized = await lpop('queue:oblectoMaster');
            if (!queueItemSerialized) continue;

            const job = JSON.parse(queueItemSerialized);

            if (!this.jobs[job.id]) continue;

            try {
                console.log(`Running job ${job.id}`);
                await this.jobs[job.id](job.attr);
                console.log(`Finished job ${job.id}`);
            } catch (e) {
                logger.log(e);
            }
        }
    }

    /**
     *  Define a new job
     * @param {string} id
     * @param {function} job
     */
    addJob (id, job) {
        logger.log('INFO', 'New queue item has been registered:', id);

        this.jobs[id] = job;
    }

    /**
     *  Add a job to the end of the queue
     * @param {string} id
     * @param {object} job
     */
    queueJob(id, attr) {
        const job = {id, attr};
        this.redisClient.rpush('queue:oblectoMaster', JSON.stringify(job));
    }

    lowPriorityJob(id, attr) {
        const job = {id, attr};

        this.redisClient.rpush('queue:oblectoMaster', JSON.stringify(job));
    }



    /**
     *  Add a job to the front of the queue
     * @param {string} id
     * @param {object} job
     */
    pushJob(id, attr) {
        const job = {id, attr};

        this.redisClient.rpush('queue:oblectoMaster', JSON.stringify(job));
    }
}
