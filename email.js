// 导入模块
const nodemailer = require('nodemailer');
const config_module = require('./config')

/*
 * 创建发送邮箱的代理
 */

let transporter = nodemailer.createTransport({
    host: "smtp.qq.com",
    port: 465,
    secure: true,
    auth: {
        user: config_module.email_user, // 发送方邮箱地址
        pass: config_module.email_pass  // 邮箱授权码
    }
})


/*
 * 定义发送邮件的函数，JS的Promise相当于std::promise + std::future + continuations，提供了更为简洁的语法糖
*/

function sendMail(_mailOptions) {
    // 返回一个Promise对象，Promise对象的状态由resolve和reject函数控制，
    // resolve函数用于将Promise对象的状态设置为fulfilled，并传递一个值；
    // reject函数用于将Promise对象的状态设置为rejected，并传递一个错误对象
    // (类似std::promise::set_value和std::promise::set_exception, JS换成了自定义可调用对象)
    return new Promise((resolve, reject) => {
        // Promise会直接执行传入的函数
        transporter.sendMail(_mailOptions, (error, info) => {
            if(error) {
                console.log("邮件发送失败，错误信息：", error)
                reject(error) // std::set_exception(error)
            }
            else {
                console.log("邮件发送成功，信息：", info.response)
                resolve(info.response) // std::set_value(info.response)
            }
        })
    })
}

module.exports.sendMail = sendMail