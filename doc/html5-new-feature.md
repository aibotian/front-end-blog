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
<input autofocus>

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
<form action="" method="post">
    <label for="username">Create a Username: </label>
    <input type="text" name="username" id="username" placeholder="4 <> 10" pattern="[A-Za-z]{4,10}" autofocus required>
    <button type="submit">Go </button>
</form>

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
<div id="myDiv" data-custom-attr="My Value"> Bla Bla </div>
CSS中使用：
<style>
h1:hover:after {
content: attr(data-hover-response);
color: black;
position: absolute;
left: 0;
}
</style>
<h1 data-hover-response="I Said Don’t Touch Me!"> Don’t Touch Me </h1>

20. Output元素

<output>元素用来显示计算结果，也有一个和label一样的for属性

21. 用Range Input来创建滑块

HTML5引用的range类型可以创建滑块，它接受min, max, step和value属性
可以使用css的:before和:after来显示min和max的值

<input type="range" name="range" min="0" max="10" step="1" value="">
input[type=range]:before { content: attr(min); padding-right: 5px;
}
input[type=range]:after { content: attr(max); padding-left: 5px;}

咳咳，关于语义化面试总是被问到借鉴一下好的总结：
一. 语义化背景
讲到语义化，我们首先来聊聊html语义化的背景，HTML结构语义化，是最近几年才提出来的，以前的html结构，都是一堆的没有语义的冷冰冰的标签。最泛滥的就是div+css,以前的页面，你一打来就是一堆的div+css, 为了改变这种这种状况，开发者们和官方提出了让HTML结构语义化的概念，并且官方w3c，也在HTML5给出了几个新的语义化的标签。

二. 什么是语义化？语义化之后会给文档带来什么效果呢？、

1. 首先、语义化，故名思意，就是你写的HTml结构，是用相对应的有一定语义的英文字母（标签）表示的，标记的，因为HTML本身就是标记语言。不仅对自己来说，容易阅读，书写。别人看你的代码和结构也容易理解，甚至对一些不是做网页开发的人来说，也容易阅读。那么，我们以后再开发的过程中，一定要注意了，尽量使用官方的有语义的标签，不要再使用一堆无意义的标签去堆你的结构。怎么知道，自己的页面结构是否语义化，那就要看你的HTML结构，在去掉CSS样式表之后，是否，依然能很好的呈现内容的结构，代码结构。也就是说，脱掉css的外衣，依然头是头，脚是脚。赤裸裸的完整的一篇文档。这也就是，语义化之后文档的效果。
2. 其次、其实语义化，也无非就是自己在使用标签的时候多使用有英文语义的标签，比如

三.为什么要语义化？烦不烦啊，，，
据说啊，是因为一下几点？

（1）、为了在没有css代码时，也能呈现很好的内容结构，代码结构，以至于达到没有编程基础的非技术人员，也能看懂一二。（其实，就是为了不穿CSS外衣，裸奔依然好看）。

（2）、提高用户体验，比如：title，alt用于解释名词和图片信息。

（3）、利于SEO，语义化能和搜索引擎建立良好的联系，有利于爬虫抓取更多的有效信息。爬虫依赖于标签来确定上下文和各个关键字的权重。

（4）、方便其他设备解析（如屏幕阅读器、盲人阅读器、移动设备）以语义的方式来渲染网页。

（5）、便于团队开发和维护，语义化更具可读性，如果遵循W3C标准的团队都遵循这个标准，可以减少差异化，利于规范化。

四.基于此，在写页面结构时，我们应该注意什么呢？

（1）、尽可能少的使用没有语义的div和span元素。

（2）、在对语义要求不明显时，技能使用div也能使用p,那就使用p，以为p默认有上下边距，可以兼容特殊终端。

（2）、不要使用纯样式标签，如：b、font、u等，改用css设置。

（4）、需要强调的文本，可以包含在strong或者em标签中（浏览器预设样式，能用CSS指定就不用他们），strong默认样式是加粗（不要用b，因为没语义），em是斜体（不用i同b）；

（5）、使用表格时，标题要用caption，表头用thead，主体部分用tbody包围，尾部用tfoot包围。表头和一般单元格要区分开，表头标题用th，内容单元格用td；

