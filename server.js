var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if(!port){
  console.log('请指定端口号好不啦？\nnode server.js 8888 这样不会吗？')
  process.exit(1)
}

var server = http.createServer(function(request, response){
  var parsedUrl = url.parse(request.url, true)
  var pathWithQuery = request.url 
  var queryString = ''
  if(pathWithQuery.indexOf('?') >= 0){ queryString = pathWithQuery.substring(pathWithQuery.indexOf('?')) }
  var path = parsedUrl.pathname
  var query = parsedUrl.query
  var method = request.method

  /******** 从这里开始看，上面不要看 ************/

  console.log('有个傻子发请求过来啦！路径（带查询参数）为：' + pathWithQuery)

  response.statusCode = 200
  // 默认首页，否则访问路径
  const filePath = path === '/' ? '/index.html' : path
  // 拿到点的下标
  const index = filePath.lastIndexOf('.')
  // 拿到后缀，从而知道请求的文件类型
  const suffix = filePath.substring(index)
  // 利用哈希表映射，根据后缀映射对应格式
  const fileTypes = {
    '.html':'text/html',
    '.css':'text/css',
    '.js':'text/javascript',
    '.png':'image/png',
    '.jpg':'image/jpeg'
  }
  response.setHeader('Content-Type', 
    `${fileTypes[suffix] || 'text/html'};charset=utf-8`)//'text/html'用于解决访问路径不存在时
  let content 
  // 解决访问路径不存在的情况
  try{
    content = fs.readFileSync(`./public${filePath}`)
  }catch(error){
    content = '文件不存在'
    response.statusCode = 404
  }
  response.write(content)
  response.end()

  /******** 代码结束，下面不要看 ************/
})

server.listen(port)
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)