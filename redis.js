const ConfigModule = require('./config')
const Redis = require('ioredis')

// 创建Redis客户端
const redisClient = new Redis({
    host: ConfigModule.redis_host, // Redis服务器地址
    port: ConfigModule.redis_port, // Redis服务器端口
    password: ConfigModule.redis_password // Redis服务器密码
})

// 监听Redis客户端的错误事件
redisClient.on('error', (err) => {
    console.error('Redis连接错误:', err)
    redisClient.quit() // 关闭Redis连接
})


// 根据key获取value
async function getValue(key) {
    try {
        const value = await redisClient.get(key) // 使用异步操作获取Redis中键值key对应的value
        if(value === null) {
            console.log('Redis中未找到键值:', key)
            return null
        }
        return value
    }
    catch(error) {
        console.error('获取Redis值时发生错误:', error)
        return null
    }
}

// 查询redis中是否存在key
async function queryKey(key) {
    try {
        const result = await redisClient.exists(key) // 使用异步操作查询Redis中是否存在键值key
        if(result === 0) {
            console.log('result:<' + result + '> Redis中不存在键值:', key)
            return null
        }
        console.log('result:<' + result + '> Redis中存在键值:', key)
        return result
    } 
    catch (error) {
        console.error('查询Redis键时发生错误:', error)
        return null
    }
}

// 设置key-value对，并设置过期时间（单位：秒）
async function setValue(key, value, expireTime) {
    try {
        // 设置键和值
        await redisClient.set(key, value)
        // 设置过期时间 (以秒为单位)
        await redisClient.expire(key, expireTime)
        return true
    }
    catch (error) {
        console.error('设置Redis值时发生错误:', error)
        return false
    }
}

// 退出函数
function quit() {
    redisClient.quit() // 关闭Redis连接
}

module.exports = { getValue, queryKey, setValue, quit }