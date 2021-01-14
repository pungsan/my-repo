var http = require('http')
var fs = require('fs')
var url = require('url')
var qs = require('querystring')
var path = require('path')
var sanitizeHtml = require('sanitize-html')
var template = require('./lib/template.js')


var app = http.createServer(function (request, response) {
  var _url = request.url
  var queryData = url.parse(_url, true).query
  var pathname = url.parse(_url, true).pathname
  console.log(queryData.id)
  if (pathname === '/') {
    if (queryData.id === undefined) {
      fs.readdir('./data', function (err, filelist) {
        var title = 'Welcome'
        var description = 'Hello Node.JS'
        var list = template.list(filelist)
        var control = `
          <form action="/create">
            <input type="submit" value="작성하기">
          </form>
        `
        var html = template.html(title, list, description, control)
        response.writeHead(200);
        response.end(html)
      })
    } else {
      var filteredId = path.parse(queryData.id).base
      fs.readdir('./data', function (err, filelist) {
        fs.readFile(`data/${filteredId}`, 'utf8', function (err, data) {
          var title = filteredId
          var description = data
          var sanitizedTitle = sanitizeHtml(title)
          var sanitizedDescription = sanitizeHtml(description, {
            allowedTags : ['iframe', 'div'],
            allowedAttributes : {
              'iframe' : ['src', 'allow', 'width', 'height', 'frameborder']
            }
          })
          var list = template.list(filelist)
          var control = `
            <form action="/create">
              <input type="submit" value="작성하기">
            </form>
            <form action="/update" method="POST">
              <input type="hidden" name="title" value="${title}">
              <input type="submit" value="수정하기">
            </form>
            <form action="/delete" method="POST">
              <input type="hidden" name="title" value="${title}">
              <input type="submit" value="삭제하기">
            </form>
          `
          var html = template.html(sanitizedTitle, list, sanitizedDescription, control)
          response.writeHead(200);
          response.end(html)
        })
      })
    }
  } else if(pathname === '/create') {
    fs.readdir('./data', function (err, filelist) {
      var title = 'WEB - create'
      var description = `
        <form action="/create_process" method="POST">
          <p>
            <input type="text" name="title" placeholder="title">
          </p>
          <p>
            <textarea name="description" cols="30" rows="10" placeholder="description"></textarea>
          </p>
          <p>
            <input type="submit" value="확인">
          </p>
        </form> 
      `
      var list = template.list(filelist)
      var control = ``
      var html = template.html(title, list, description, control)
      response.writeHead(200);
      response.end(html)
    })
  } else if(pathname === '/create_process') {
    var body = ''
    request.on('data', function(data) {
      body += data
    })
    request.on('end', function() {
      var post = qs.parse(body)
      var title = post.title
      var description = post.description
      fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
        response.writeHead(302, {Location : `/?id=${title}`});
        response.end('success')
      })
    })
  } else if(pathname === '/update') {
    var body = ''
    request.on('data', function(data) {
      body += data
    })
    request.on('end', function() {
      var post = qs.parse(body)
      fs.readdir('./data', function (err, filelist) {
        fs.readFile(`data/${post.title}`, 'utf8', function (err, data) {
          var title = post.title
          var description = `
            <form action="/update_process" method="POST">
              <input type="hidden" name="ex_title" value=${title}>
              <p>
                <input type="text" name="title" value="${title}" placeholder="title">
              </p>
              <p>
                <textarea name="description" cols="30" rows="10" placeholder="description">${data}</textarea>
              </p>
              <p>
                <input type="submit" value="확인">
              </p>
            </form>        
          `
          var list = template.list(filelist)
          var control = ``
          var html = template.html(title, list, description, control)
          response.writeHead(200);
          response.end(html)
        })
      })
    })
  } else if(pathname === '/update_process') {
    var body = ''
    request.on('data', function(data) {
      body += data
    })
    request.on('end', function() {
      var post = qs.parse(body)
      var ex_title = post.ex_title
      var title = post.title
      var description = post.description
      fs.rename(`data/${ex_title}`, `data/${title}`, function() {
        fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
          response.writeHead(302, {Location : `/?id=${title}`});
          response.end('success')
        })
      })
    })  
  } else if(pathname === '/delete') {
    var body = ''
    request.on('data', function(data) {
      body += data
    })
    request.on('end', function() {
      var post = qs.parse(body)
      var title = post.title
      fs.unlink(`data/${title}`, function(err) {
        response.writeHead(302, {Location : `/`});
        response.end('success')
      })
    })
  } else {
    response.writeHead(404);
    response.end('Not found')
  }
});
app.listen(3000)