const redis = require('redis');

const redisClient = redis.createClient({
    url: 'redis://default:ZJGSbbHBxRpelTfkGRIzKJ0HgjKLiGOH@redis-14102.c340.ap-northeast-2-1.ec2.redns.redis-cloud.com:14102'

});

redisClient.connect().catch(console.error);

redisClient.on('error', (err) => console.error('Redis 에러:', err));
redisClient.on('connect', () => console.log('Redis 연결 성공!'));

module.exports = redisClient;