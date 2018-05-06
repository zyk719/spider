/*
分析 豆瓣图书 Top250；
    按国家分开，看比例；
    进 top250 最多的作者；
    找出评论最多的一本书；
    找出评分最高的书；
*/

const fs = require('fs')

const log = console.log.bind(console)

// 读取文件 './spider/doubanBooks.json' 的内容;
const getData = () => {
    let path = './doubanBooks.json'
    let dataJson = fs.readFileSync(path)
    let data = JSON.parse(dataJson)
    log(data.length)
    return data
}

// 查看：同一个 key 有几个不同的 value；
// arr 是 []，里面有对象；
const keyValues = (arr, key) => {
    let l = arr
    let setName = key + 'Set'
    setName = new Set()
    for (let i = 0; i < l.length; i++) {
        setName.add(l[i][key])
    }
    return setName
}

// 一个 相同 value 的 key 出现的次数
const keyNums = (s, arr, key) => {
    let l = []
    for (let c of s) {
        let obj = {}
        let nums = 0
        for (let i = 0; i < arr.length; i++) {
            if (arr[i][key] == c) {
                nums++
            }
        }
        obj[c] = nums
        l.push(obj)
    }
    return l
}




// 进入 top250 的作家的国籍有哪些
const countries = (arr) => {
    let key = 'country'
    let l = arr
    let c = keyValues(l, key)
    return c
}

// 进入 top250 的国家作品数
const ratioOfCountry = () => {
    let data = getData()
    let countrySet = countries(data)
    let ratioOfC = keyNums(countrySet, data, 'country')
    log(ratioOfC)
    return ratioOfC
}



// 日本作家的书籍
// 一个 相同 value 的 key 出现的内容
const keyContent = (arr, key) => {
    let l = []
    for (let i = 0; i < arr.length; i++) {
        let obj = {}
        if (arr[i]['country'] == key) {
            obj['作者'] = arr[i]['author']
            obj['书名'] = arr[i]['bookTitle0']
        }
        if (obj['作者'] != undefined) {
            l.push(obj)
        }
    }
    log(l)
    return l
}

const japanbooks = () => {
    let data = getData()
    let jBooks = keyContent(data, '日')
}


const __main = () => {
    ratioOfCountry()
    japanbooks()
}

__main()

`
[ { '美': 25 },
  { '法': 10 },
  { '中国': 149 },
  { '日': 27 },
  { '捷克': 1 },
  { '哥伦比亚': 3 },
  { '英': 22 },
  { '挪威': 1 },
  { '加拿大': 1 },
  { '巴西': 1 },
  { '奥地利': 1 },
  { '苏联': 1 },
  { '丹麦': 1 },
  { '以色列': 1 },
  { '澳': 2 },
  { '德': 2 },
  { '意': 1 },
  { '印度': 1 } ]
  `

  `
  [ { '作者': '东野圭吾', '书名': '解忧杂货店' },
    { '作者': '东野圭吾', '书名': '白夜行' },
    { '作者': '村上春树', '书名': '挪威的森林' },
    { '作者': '东野圭吾', '书名': '嫌疑人X的献身' },
    { '作者': '东野圭吾', '书名': '白夜行' },
    { '作者': '村上春树', '书名': '1Q84 BOOK 1' },
    { '作者': '东野圭吾', '书名': '恶意' },
    { '作者': '东野圭吾', '书名': '放学后' },
    { '作者': '青山七惠', '书名': '一个人的好天气' },
    { '作者': '村上春树', '书名': '海边的卡夫卡' },
    { '作者': '黑柳彻子', '书名': '窗边的小豆豆' },
    { '作者': '村上春树', '书名': '1Q84 BOOK 2' },
    { '作者': '岩井俊二', '书名': '情书' },
    { '作者': '村上春树', '书名': '挪威的森林' },
    { '作者': '村上春树', '书名': '当我谈跑步时我谈些什么' },
    { '作者': '井上雄彦', '书名': '灌篮高手31' },
    { '作者': '东野圭吾', '书名': '嫌疑人X的献身' },
    { '作者': '村上春树', '书名': '且听风吟' },
    { '作者': '东野圭吾', '书名': '幻夜' },
    { '作者': '高木直子', '书名': '一個人住第5年' },
    { '作者': '村上春树', '书名': '1Q84 BOOK 3' },
    { '作者': '岩井俊二', '书名': '关于莉莉周的一切' },
    { '作者': '藤子·F·不二雄', '书名': '机器猫哆啦A梦23' },
    { '作者': '东野圭吾', '书名': '嫌疑人X的献身' },
    { '作者': '尾田荣一郎', '书名': '海贼王' },
    { '作者': '川端康成', '书名': '伊豆的舞女' },
    { '作者': '村上春树', '书名': '世界尽头与冷酷仙境' } ]
    `
