// zyy 2018-5-6

// 同步的 request 库；
const request = require("sync-request")
// 可以说缓存的网页通过选择器选择；
const cheerio = require("cheerio")
// 读写文件；
const fs = require("fs")

const log = console.log.bind(console)

// 创建一个 类 ，创建实例以保存数据；
class Book {
    constructor() {
        this.id = 0
        this.bookTitle0 = ''
        this.bookTitle1 = ''
        this.country = ''
        this.author = ''
        this.rating = 0
        this.plnums = 0
        this.quote = ''
        this.coverUrl = ''
    }
}

// 根据 url 请求网页，并保存；
const cachedUrl = (url, path) => {
    // 判断当前文件是否存在
    // 存在就读取缓存
    let exist = fs.existsSync(path)
    log('网页已缓存', exist)
    if (exist) {
        log('in if')
        let data = fs.readFileSync(path)
        return data
    } else {
        // 用 GET 方法获取 url 链接的内容
        let r = request('GET', url)
        let body = r.getBody('utf-8')
        // 写入缓存
        fs.writeFileSync(path, body)
        return body
    }
}

// 0.中国的作家没有国籍了，加上，统一格式；
const addCountry = (str) => {
    let author = str
    if (author[14] != ' ') {
        author = '\n                [中国]' + author
    }
    log(author)
    return author
}

// top250 简介页面作者国籍数据；
const takeoutAuthor = (url, str) => {
    let bookTitle0 = str
    let path = 'douban_book_html_0/' + bookTitle0 + '.html'
    if (url != 'https://book.douban.com/subject/4886245/' && url !='https://book.douban.com/subject/4166819/' && url != 'https://book.douban.com/subject/1059336/') {
        let data = cachedUrl(url, path)
        let htmlDom = cheerio.load(data)
        let a = htmlDom('#info').find('a')[0]
        let aDom = cheerio.load(a)
        let author = aDom('a').text()
        log(bookTitle0)
        return author
    } else {
        return '/n               [中国]/n           韩寒'
    }
}

// 获得网页块，选取目标tag；
const bookInfoFromTable = (obj, id) => {
    let table = cheerio.load(obj)
    let book = new Book()
    // book id
    book.id = id

    // 书名 & 原书名（别名）
    let contentDiv = table('.pl2')
    let bt = contentDiv.find('a').text()
    let cbt = bt.split('\n\n')[0].slice(17)
    book.bookTitle0 = cbt
    let bt1 = contentDiv.find('span').text()
    if (bt1[1] == ':') {
        book.bookTitle1 = ''
    } else {
        book.bookTitle1 = bt1
    }

    // 作者 & 作者国籍
    let authorUrl = contentDiv.find('a').attr('href')
    let htmlName = book.bookTitle0
    let authorXxx = takeoutAuthor(authorUrl, htmlName)
    let wholeAuthor = addCountry(authorXxx)
    let country = wholeAuthor.split(']')[0].slice(18)
    let author = wholeAuthor.split(']')[1].slice(13)
    book.country = country
    book.author = author

    // 评分 & 评论数
    let rating = Number(table('.star').find('.rating_nums').text())
    book.rating = rating
    let plnums = table('.star').find('.pl').text()
    let cPlnums = Number(plnums.split('人评价')[0].slice(1))
    book.plnums = cPlnums

    // 引言
    // 通过加 id 找出没有引言的，然后排除掉。
    if (book.id == 155 || book.id == 189 || book.id == 201 || book.id == 216 || book.id == 217 || book.id == 228 || book.id == 241) {
        let quote = ''
        book.quote = quote
    } else {
        let quote = table('.quote').text()
        let cQuote = quote.split('\n')[1].slice(18)
        book.quote = cQuote
    }

    // 封面 url
    let coverUrl = table('img').attr('src')
    book.coverUrl = coverUrl

    return book
}

// 从 网址 到 数据；
const booksFromUrl = (url) => {
    let id = Number(url.split('=')[1])
    // 根据网址给缓存起名字
    // https://book.douban.com/top250?start=0
    // douban_book_start=0.html test result
    let path = 'douban_book_html/' + url.split('?')[1] + '.html'
    let data = cachedUrl(url, path)
    let htmlDom = cheerio.load(data)
    let tables = htmlDom('.article').find('table')
    let books = []
    for (let i = 0; i < tables.length; i++) {
        id = id + 1
        let book = bookInfoFromTable(tables[i], id)
        books.push(book)
    }
    return books
}

const saveBook = (books) => {
    let str = JSON.stringify(books, null, 2)
    // 把 json 格式字符串写入到 文件 中
    let path = './doubanBooks.json'
    fs.writeFileSync(path, str)
}

const downloadCovers = (books) => {
    // 使用 request 库来下载图片
    let request = require('request')
    for (let i = 0; i < books.length; i++) {
        let b = books[i]
        let url = b.coverUrl
        // 保存图片的路径
        let path = 'bookCovers/' + b.bookTitle0 + '.jpg'
        // 下载并且保存图片的方法
        request(url).pipe(fs.createWriteStream(path))
    }
}

// 判断 url 改变规律，生成多页的 url ，获取到所有的网页
const takeoutUrl = (url) => {
    let urlBody = url.split('=')[0]
    let urlArr = []
    for (let i = 0; i < 10; i++) {
        let completeUrl = urlBody + '=' + String(i * 25)
        urlArr.push(completeUrl)
    }
    return urlArr
}

// 主函数 唯一入口
const __main = () => {
    let books = []
    let url = 'https://book.douban.com/top250?start=0'
    let urls = takeoutUrl(url)
    for (let i = 0; i < urls.length; i++) {
        let book25 = booksFromUrl(urls[i])
        books = [...books, ...book25]
        // books = books.concat(book25)
    }
    saveBook(books)
    downloadCovers(books)
}

__main()
