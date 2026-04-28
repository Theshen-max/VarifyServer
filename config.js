// 引入 dotenv 并自动加载 .env 文件中的变量到 process.env 中
require('dotenv').config();

// 获取config对象中的各个属性，并将其赋值给对应变量
const email_user = process.env.EMAIL_USER;
const email_pass = process.env.EMAIL_PASS;
const mysql_host = process.env.MYSQL_HOST;
const mysql_port = process.env.MYSQL_PORT;
const mysql_password = process.env.MYSQL_PASSWORD;
const redis_host = process.env.REDIS_HOST;
const redis_port = process.env.REDIS_PORT;
const redis_password = process.env.REDIS_PASSWORD;
const code_prefix = "code_"

// 导出配置
module.exports = {
    email_user,
    email_pass,
    mysql_host,
    mysql_port,
    mysql_password,
    redis_host,
    redis_port,
    redis_password,
    code_prefix
};