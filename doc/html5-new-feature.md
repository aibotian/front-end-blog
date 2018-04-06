1. 尽管使用`<!DOCTYPE html>`,即使浏览器不懂也会按照标准模式解析

2. `figure`元素
  用`<figure>`和`<figcaption>`,来语义化的表示带标题图片
```html
    <figure>
        <img src="path/to/image" alt="About image" />
        <figcaption>
            <p>This is an image of something interesting. </p>
        </figcaption>
    </figure>
```

3. 重新定义的`<small>`

  `<small>`已经被重新定义了，现在被用来表示小的排版，如网站底部的版权声明

4. 去掉`link`和`script`标签里的`type`属性

5. 加引号和/

  HTML5没有严格的要求属性必须加引号，闭合不闭合，但是建议加上引号和闭合标签

6. 让你的内容可编辑，只需要加一个contenteditable属性

7. Email Inputs

  如果我们给Input的type设置为email，浏览器就会验证这个输入是否是email类型，当然不能只依赖前端的校验，后端也得有相应的校验

8. Placeholders

  这个input属性的意义就是不必通过javascript来做placeholder的效果了

9. Local Storage

  使用Local Storage可以永久存储大的数据片段在客户端（除非主动删除），目前大部分浏览器已经支持，在使用之前可以检测一下window.localStorage是否存在

10. 新增语义化标签
  `header, footer, article, section, nav, menu, hgroup {
      display: block;
  }`

  不幸的是IE会忽略这些样式，可以像下面这样fix:
  `
  document.createElement("article");
  document.createElement("footer");
  document.createElement("header");
  document.createElement("hgroup");
  document.createElement("nav");  
  document.createElement("menu");
  `
11. Required属性

  required属性定义了一个input是否是必须的，你可以像下面这样声明
  `<input type="text" name="someInput" required>`

或者
`<input type="text" name="someInput" required="required">`

12. Autofocus属性

  正如它的词义，就是聚焦到输入框里面
  `<input autofocus>`

13. Audio、video支持

  HTML5提供了<audio>标签，你不需要再按照第三方插件来渲染音频，大多数现代浏览器提供了对于HTML5 Audio的支持，不过目前仍旧需要提供一些兼容处理，如

  `<audio autoplay="autoplay" controls="controls">
      <source src="file.ogg" /><!–FF–>
      <source src="file.mp3" /><!–Webkit–>
      <a href="file.mp3">Download this file.</a>
  </audio>`

  `
  <video controls preload>
      <source src="cohagenPhoneCall.ogv" type="video/ogg; codecs=’vorbis, theora’" />
      <source src="cohagenPhoneCall.mp4" type="video/mp4; ’codecs=’avc1.42E01E, mp4a.40.2′" />
      <p> Your browser is old. <a href="cohagenPhoneCall.mp4">Download this video instead.</a> </p>
  </video>
  `

14. 预加载视频

  preload属性就像它的字面意思那么简单，你需要决定是否需要在页面加载的时候去预加载视频
  `<video preload>`

15. 显示视频控制

`<video preload controls>`

16. 正则表达式

  由于pattern属性，我们可以在你的markup里面直接使用正则表达式了
  `<form action="" method="post">
      <label for="username">Create a Username: </label>
      <input type="text" name="username" id="username" placeholder="4 <> 10" pattern="[A-Za-z]{4,10}" autofocus required>
      <button type="submit">Go </button>
  </form>`

17. 检测属性支持

  除了Modernizr之外我们还可以通过javascript简单地检测一些属性是否支持，如：
  <script>
  if (!’pattern’ in document.createElement(’input’) ) {
  // do client/server side validation
  }
  </script>

18. Mark元素

  把<mark>元素看做是高亮的作用，当我选择一段文字的时候，javascript对于HTML的markup效果应该是这样的：
  `<h3> Search Results </h3>
  <p> They were interrupted, just after Quato said, <mark>"Open your Mind"</mark>. </p>`

19. 自定义data属性
  `<div id="myDiv" data-custom-attr="My Value"> Bla Bla </div>`
  CSS中使用：
  `
  <style>
  h1:hover:after {
  content: attr(data-hover-response);
  color: black;
  position: absolute;
  left: 0;
  }
  </style>
  <h1 data-hover-response="I Said Don’t Touch Me!"> Don’t Touch Me </h1>
  `
20. Output元素

  <output>元素用来显示计算结果，也有一个和label一样的for属性

21. 用Range Input来创建滑块

  HTML5引用的range类型可以创建滑块，它接受min, max, step和value属性
  可以使用css的:before和:after来显示min和max的值

  `<input type="range" name="range" min="0" max="10" step="1" value="">
  input[type=range]:before { content: attr(min); padding-right: 5px;
  }
  input[type=range]:after { content: attr(max); padding-left: 5px;}`

