// This uses ES module so will have to update all the modules so rather
// import { createClient } from 'redis';
const { createClient } = require('redis');

const client = createClient({
    username: 'default',
    password: 'ilVEaodiARRdJXIAJWBlhSGQdcUzuKVJ',
    socket: {
        host: 'redis-15351.c264.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 15351
    }
});

client.on('error', err => console.log('Redis Client Error', err));
async function connectRedis() {
    await client.connect();

}

connectRedis();
// This works with ES Module
// export default client;

module.exports = client;

// await client.set('foo', 'bar');
// const result = await client.get('foo');
// console.log(result)  // >>> bar

