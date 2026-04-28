const config = require('./config')
const emailModule = require('./email')
const constModule = require('./const')
const grpc = require('@grpc/grpc-js')
const { v4: uuidv4 } = require('uuid')
const messageProto = require('./proto')
const redisModule = require('./redis')

async function GetVarifyCode(call, callback) {
    try {
        let queryRes = await redisModule.getValue(config.code_prefix + call.request.email)
        console.log("queryRes is ", queryRes)
        let uniqueId = queryRes
        if(queryRes === null) {
            uniqueId = uuidv4()
            if(uniqueId.length > 4) {
                uniqueId = uniqueId.substring(0, 4) // 截取前4位作为验证码
            }
            // 将验证码存储到redis中，并设置过期时间为600秒（10分钟）
            let setValue = await redisModule.setValue(config.code_prefix + call.request.email, uniqueId, 600)
            if(!setValue) { // 设置失败
                callback(null, { email: call.request.email, error: constModule.Errors.RedisErr})
                return
            }
        }
        console.log("uniqueId is ", uniqueId)
        let textStr = "您的验证码是：" + uniqueId + "，请三分钟内完成注册"

        // 发送邮件
        let mailOptions = {
            from: config.email_user, // 发送方邮箱地址
            to: call.request.email, // 接收方邮箱地址
            subject: '验证码', // 邮件主题
            text: textStr // 邮件内容
        }
        console.log("接收方邮箱地址：", call.request.email)

        // 返回的是Promise, await会等待Promise返回结果
        let sendRes = await emailModule.sendMail(mailOptions)
        if(!sendRes) { // 发送邮件失败
            callback(null, { email: call.request.email, error: constModule.Errors.Exception })
            return
        }
        // 发送邮件成功
        console.log("邮件发送结果: ", sendRes)
        callback(null, { email: call.request.email, error: constModule.Errors.Success })
    }
    catch (error) {
        console.log("发生异常，错误信息：", error)
        callback(null, { email: call.request.email, error: constModule.Errors.Exception })
    }
}


function main() {
    let server = new grpc.Server()
    server.addService(messageProto.VarifyService.service, {GetVarifyCode: GetVarifyCode})
    server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
        console.log("grpc server started...")
    })
}

// 启动main函数
main()