
const baseUrl = "https://m.gongzicp.com"

//搜索
const search = (key) => {
  let response = GET(`${baseUrl}/novel/searchNovelOnlyByName?keyword=${encodeURI(key)}&searchType=1&finishType=0&novelType=0&sortType=1&page=1`,{headers:
     [ "X-Requested-With: XMLHttpRequest"]
  })
  let array = []
  let $ = JSON.parse(response)
  $.data.list.forEach((list) => {
    array.push({
      name: list.novel_name.replace(/<span class=\"searchCode\">/g,"").replace(/<\/span>/g,""),
      author: list.novel_author,
      cover: list.novel_cover,
      detail: `${baseUrl}/novel-${list.novel_id}.html?id=${list.novel_id}`,
    })
  })
  return JSON.stringify(array)
}

//详情
const detail = (url) => {
  let response = GET(url,{headers:["User-Agent:Mozilla/5.0 (Linux; Android 10; Redmi K30) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.105 Mobile Safari/537.36"]})
  let $ = HTML.parse(response)
  let book = {
    summary: $('.intraductionParagraph').text(),
    status: $('.novelTypeLabel').text(),
    category: $('.labelsBox').text().replace("--"," "),
    words: $('.numberBox>span:nth-child(3)').text().replace("字",""),
    update: $('.seeListBox > a').text(),
    lastChapter: $('.chapterName').text(),
    catalog: `${baseUrl}/novel/chapterList/id/${url.query("id")}`
  }
  return JSON.stringify(book)
}

const catalog = (url) => {
  let response = GET(url,{headers:
     [ "User-Agent: Mozilla/5.0 (Linux; Android 10; Redmi K30) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.105 Mobile Safari/537.36"]
  })
  let $ = HTML.parse(response)
  let array = []
  $(".novelModel").forEach((chapter) => {
    let $= HTML.parse(chapter)
      array.push({
        name: $(".eclipes1:not(.boxbottom)").text(),
        url: "https://m.gongzicp.com/read-"+$("a").attr("onclick").match(/\d+-\d+/)[0]+".html",
        vip: $("img")&& $("img").length>0?true:false
     
    })
  })
  return JSON.stringify(array)
}


//章节
const chapter = (url) => {
  let response = GET(url,{headers:
     ["User-Agent:Mozilla/5.0 (Linux; Android 10; Redmi K30) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.105 Mobile Safari/537.36",`referer:${url}`]
  })

  let $ = HTML.parse(response)
 // VIP章节未购买返回403和自动订阅地址
  if ((/订阅本章（ 0点）/).test($(".subThisChapter"))) throw JSON.stringify({
    code: 403,
    message: url
  })
  //VIP章节已购买
 return $(".novelInner")

}

//个人中心
const profile = () => {
  let response = GET("https://m.gongzicp.com/user/index?user_id=",{headers:["X-Requested-With:XMLHttpRequest"]})
  let $ = JSON.parse(response).data
  return JSON.stringify({
    url: `https://m.gongzicp.com/user/index`,
    nickname: $.nick_name,
    recharge: 'https://m.gongzicp.com/user/topUp',
    balance: [
          {
        name: '等级',
        coin: $.level_number
      },
      {
        name: '玉佩',
        coin: $.gold2
      },
      {
        name: '海星',
        coin: $.nation_code
      }
    ],
    extra: [
      {
        name: '自动签到',
        type: 'permission',
        method: 'sign',
        times: 'day' 
      },
      {
        name: '书架',
        type: 'books',
        method: 'bookshelf'
      }
    ]
  })
}
const bookshelf = (page) => {
  let response = GET(`https://m.gongzicp.com/bookShelf/shelfList?sort_key=3&sort_flag=2&status=0&page=${page+1}&novel_name=&did=0`,{headers:["X-Requested-With:XMLHttpRequest"]})  
  let books = JSON.parse(response).data.novel.list.map(book => ({
    name: book.novel_name,
    author: book.novel_author,
    cover: book.novel_cover,
    detail: `https://m.gongzicp.com/novel-${book.novel_id}.html?id=${book.novel_id}`
  }))
  return JSON.stringify(books)
}

//签到
const sign = () => {
  let res= POST('https://m.gongzicp.com/user/sign',"",{headers:
     [ "X-Requested-With: XMLHttpRequest"]
  })
  let $ = JSON.parse(res)
  return $.msg=="您已签到"
}
const rank = (title, category, page) => {
  d=2
  if(title==5||title==10||title==12){d=5}
  let url=`https://m.gongzicp.com/home/ranking?&t=${category}&r=${title}&d=${d}&p=${page+1}`
  let response = GET(url,{headers:
      ["X-Requested-With: XMLHttpRequest"]
  })
  let $ = JSON.parse(response)
  let array = []
  $.data.forEach((item) => {
    array.push({
      name: item.novel_name,
      author: item.novel_author,
      cover: item.novel_cover,
      detail: `https://m.gongzicp.com/novel-${item.novel_id}.html?id=${item.novel_id}`,
    })
  })
  return JSON.stringify(array)
 }
 const ranks=[{"title":{"key":"1","value":"畅销榜"},"categories":[{"key":"75","value":"全部"},{"key":"3","value":"古代"},{"key":"1","value":"现代"},{"key":"4","value":"幻想"},{"key":"6","value":"悬疑"},{"key":"66","value":"短佩"},{"key":"9","value":"架空"},{"key":"73","value":"无CP"},{"key":"17","value":"百合"}]},{"title":{"key":"2","value":"上架榜"},"categories":[{"key":"75","value":"全部"},{"key":"3","value":"古代"},{"key":"1","value":"现代"},{"key":"4","value":"幻想"},{"key":"6","value":"悬疑"},{"key":"66","value":"短佩"},{"key":"9","value":"架空"},{"key":"73","value":"无CP"},{"key":"17","value":"百合"}]},{"title":{"key":"3","value":"风云榜"},"categories":[{"key":"75","value":"全部"},{"key":"3","value":"古代"},{"key":"1","value":"现代"},{"key":"4","value":"幻想"},{"key":"6","value":"悬疑"},{"key":"66","value":"短佩"},{"key":"9","value":"架空"},{"key":"73","value":"无CP"},{"key":"17","value":"百合"}]},{"title":{"key":"4","value":"热读榜"},"categories":[{"key":"75","value":"全部"},{"key":"3","value":"古代"},{"key":"1","value":"现代"},{"key":"4","value":"幻想"},{"key":"6","value":"悬疑"},{"key":"66","value":"短佩"},{"key":"9","value":"架空"},{"key":"73","value":"无CP"},{"key":"17","value":"百合"}]},{"title":{"key":"5","value":"完结榜"},"categories":[{"key":"75","value":"全部"},{"key":"3","value":"古代"},{"key":"1","value":"现代"},{"key":"4","value":"幻想"},{"key":"6","value":"悬疑"},{"key":"66","value":"短佩"},{"key":"9","value":"架空"},{"key":"73","value":"无CP"},{"key":"17","value":"百合"}]},{"title":{"key":"6","value":"人气榜"},"categories":[{"key":"75","value":"全部"},{"key":"3","value":"古代"},{"key":"1","value":"现代"},{"key":"4","value":"幻想"},{"key":"6","value":"悬疑"},{"key":"66","value":"短佩"},{"key":"9","value":"架空"},{"key":"73","value":"无CP"},{"key":"17","value":"百合"}]},{"title":{"key":"7","value":"新书榜"},"categories":[{"key":"75","value":"全部"},{"key":"3","value":"古代"},{"key":"1","value":"现代"},{"key":"4","value":"幻想"},{"key":"6","value":"悬疑"},{"key":"66","value":"短佩"},{"key":"9","value":"架空"},{"key":"73","value":"无CP"},{"key":"17","value":"百合"}]},{"title":{"key":"8","value":"新人榜"},"categories":[{"key":"75","value":"全部"},{"key":"3","value":"古代"},{"key":"1","value":"现代"},{"key":"4","value":"幻想"},{"key":"6","value":"悬疑"},{"key":"66","value":"短佩"},{"key":"9","value":"架空"},{"key":"73","value":"无CP"},{"key":"17","value":"百合"}]},{"title":{"key":"9","value":"萌新榜"},"categories":[{"key":"75","value":"全部"},{"key":"3","value":"古代"},{"key":"1","value":"现代"},{"key":"4","value":"幻想"},{"key":"6","value":"悬疑"},{"key":"66","value":"短佩"},{"key":"9","value":"架空"},{"key":"73","value":"无CP"},{"key":"17","value":"百合"}]},{"title":{"key":"10","value":"打赏榜"},"categories":[{"key":"75","value":"全部"},{"key":"3","value":"古代"},{"key":"1","value":"现代"},{"key":"4","value":"幻想"},{"key":"6","value":"悬疑"},{"key":"66","value":"短佩"},{"key":"9","value":"架空"},{"key":"73","value":"无CP"},{"key":"17","value":"百合"}]} ,{"title":{"key":"12","value":"勤奋榜"},"categories":[{"key":"75","value":"全部"},{"key":"3","value":"古代"},{"key":"1","value":"现代"},{"key":"4","value":"幻想"},{"key":"6","value":"悬疑"},{"key":"66","value":"短佩"},{"key":"9","value":"架空"},{"key":"73","value":"无CP"},{"key":"17","value":"百合"}]}]
 var bookSource = JSON.stringify({
  name: "长佩文学",
  url: "m.gongzicp.com",
  version: 100,
  authorization: "https://m.gongzicp.com/login/signIn",
  cookies: [".gongzicp.com"],
  ranks: ranks
})
