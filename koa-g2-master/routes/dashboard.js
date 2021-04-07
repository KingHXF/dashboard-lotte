const router = require('koa-router')()
const {query} = require('../utils/query')
const mysql = require('mysql')

const countDataCache = {}

function checkCache(key) {
    const item = countDataCache[key]
    if (item && new Date().getTime() - item.date.getTime() < 12 * 1000) {
        return item.data
    }
}

function pushCache(key, res) {
    countDataCache[key] = {
        data: res,
        date: new Date()
    }
}

router.prefix('/dashboard')

// router.get('/device-card', async (ctx, next) => {
//     const params = ctx.query
//     let sql = 'select * from device_card as card where `card`.type_name = \'笔记本\''
//     if (params.name != null && params.name.length > 0) {
//         params.name = `%${params.name}%`
//         sql += `and \`card\`.device_type like ?`
//     }
//     try {
//         const res = await query(sql, [params.name])
//         ctx.body = res
//     } catch (e) {
//         ctx.statusCode = 500
//         ctx.body = e
//     }
// })
//
// router.get('/count-rep-fault-status', async (ctx, next) => {
//     let sql = 'select fault_status ,count(fault_status) as number from rep_fault as fault GROUP BY `fault`.fault_status'
//     try {
//         const res = await query(sql)
//         ctx.body = res
//     } catch (e) {
//         ctx.statusCode = 500
//         ctx.body = e
//     }
// })
//设备总数
router.get('/deviceCard-count', async (ctx, next) => {
    const key = 'deviceCard-count'
    const cache = checkCache(key)
    if (cache) {
        ctx.body = cache
        return
    }
    let sql = 'select count(*) from device_card'
    try {
        const res = await query(sql)
        pushCache(key, res)
        ctx.body = res
    } catch (e) {
        ctx.statusCode = 500
        ctx.body = e
    }
})
//设备按部门分布-总数
router.get('/department-count', async (ctx, next) => {
    const key='department-count'
    const cache = checkCache(key)
    if (cache) {
        ctx.body = cache
        return
    }
    let sql = 'select count(*),dept_name from device_card  where length(dept_code)=6 group by dept_code'
    try {
        const res = await query(sql)
        pushCache(key, res)
        ctx.body = res
    } catch (e) {
        ctx.statusCode = 500
        ctx.body = e
    }
})



// 各部门异常次数统计（按部门分）
router.get('/department-fault-count', async (ctx, next) => {
    const key = 'department-fault-count'
    const cache = checkCache(key)
    if (cache) {
        ctx.body = cache
        return
    }
    let sql = 'select `fault`.dept_name as departmentName, count(`fault`.dept_name) as number from rep_fault as fault WHERE `fault`.dept_name like \'五金制造%\' GROUP BY `fault`.dept_name'
    try {
        const res = await query(sql)
        pushCache(key, res)
        ctx.body = res
    } catch (e) {
        ctx.statusCode = 500
        ctx.body = e
    }
})

// 异常处理进度
router.get('/progress-count', async (ctx, next) => {
    const key = 'progress-count'
    const cache = checkCache(key)
    if (cache) {
        ctx.body = cache
        return
    }
    let completeNumber
    let waitNumber
    // 完成单
    let sql = 'select count(*) as completeNumber from rep_fault as fault WHERE `fault`.dept_name like \'五金制造%\' and (`fault`.fault_status = 50 or `fault`.fault_status = 110)'
    try {
        const res = await query(sql)
        completeNumber = res[0].completeNumber
    } catch (e) {
        ctx.statusCode = 500
        ctx.body = e
        return
    }
    sql = 'select count(*) as waitNumber from rep_fault as fault WHERE `fault`.dept_name like \'五金制造%\' and `fault`.fault_status != 50 and `fault`.fault_status != 110'
    try {
        const res = await query(sql)
        waitNumber = res[0].waitNumber
    } catch (e) {
        ctx.statusCode = 500
        ctx.body = e
        return
    }
    const body = {
        completeNumber,
        waitNumber
    }
    pushCache(key, body)
    ctx.body = body
})


// 每日异常处理次数（本周内的）
router.get('/week-every-day-dispose', async (ctx, next) => {
    const key = 'week-every-day-dispose'
    const cache = checkCache(key)
    if (cache) {
        ctx.body = cache
        return
    }
    let sql = 'select date, count(`temoFrom`.date) as completeNumber from (select DATE(complete_date) as date from rep_fault WHERE DATE_SUB(CURDATE(), INTERVAL 7 DAY) <= DATE(complete_date)) as temoFrom GROUP BY `temoFrom`.date'
    try {
        const res = await query(sql)
        pushCache(key, res)
        ctx.body = res
    } catch (e) {
        ctx.statusCode = 500
        ctx.body = e
    }
})

// 每日异常数据，表格
router.get('/get-rep-fault', async (ctx, next) => {
    const key = 'get-rep-fault'
    const cache = checkCache(key)
    if (cache) {
        ctx.body = cache
        return
    }
    let sql = 'select * from rep_fault as fault ORDER BY add_date DESC limit 0, 30'
    try {
        const res = await query(sql)
        pushCache(key, res)
        ctx.body = res
    } catch (e) {
        ctx.statusCode = 500
        ctx.body = e
    }
})

module.exports = router
