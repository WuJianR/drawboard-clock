# Canvas

`<canvas>`是一个可以使用脚本（通常是JavaScript）来绘制图形的HTML元素，例如，它可以**用于绘制图表、制作图片构图或者制作简单的动画**。

本篇博客从一些就基础开始，描述了如何使用`<canvas>`元素来绘制2D图形。

## 一、设置canvas环境

### 1.1 `<canvas>`元素

`<canvas>`看起来和`<img>`元素很相像，与`<img>`的不同就是它没有`src`和`alt`属性，并且`<canvas>`元素需要结束标签`</canvas>`。

实际上，`<canvas>`标签只有两个属性`width`和`height`，这两个属性是可选的，当没有设置宽高时，`<canvas>`会**初始化宽度为300像素和高度为150像素**，另外`<canvas>`也可以使用`CSS`来定义宽高，但在绘制时图像会伸缩以适应它的框架尺寸：如果`CSS`的尺寸与初始化画布的比例不一致，它会出现扭曲。

注意：**如果你绘制出来的图像是扭曲的，尝试用`width`和`height`属性为`<canvas>`明确规定宽高，而不是使用`CSS`。**

### 1.2 渲染上下文context

`<canvas>`元素创造了一个固定大小的画布，它公开了一个或多个渲染上下文，其可以用来绘制和处理要展示的内容。

`<canvas>`起初是空白的，为了展示，首先脚本需要找到渲染上下文，然后在它的上面绘制，`<canvas>`元素有一个叫做**`getContext()`**的方法，这个方法用来获取渲染上下文和它的绘画功能，**`getContext()`**接受一个参数，即上下文的类型，对于2D图像而言，传`'2d'`即可。

下面我们来看一个实例：

~~~html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>canvas</title>
    <style>
        #canvas {
            border: 1px solid #000;
            /* 这里使用css定义canvas宽高经常会出现画出的图形被压缩的问题 可以删掉canvas dom元素上的宽高属性试试 */
            /* width: 150px;
            height: 150px; */
            position: relative;
            top: 150px;
            left: 50%;
            transform: translate(-50%);
        }
    </style>
</head>

<body>
    <canvas id="canvas" width="150" height="150">
        <!-- 如果当前浏览器不支持canvas，将会显示盒子内的内容作为兜底提示 -->
        current browoser not support canvas
    </canvas>
    <script>
        function draw () {
            // 拿到canvas的dom对象
            let canvas = document.getElementById('canvas');
            // 拿到canvas的上下文对象
            let ctx = canvas.getContext('2d');
            if(ctx) {  // 判断上下文对象是否存在 即检查支持性
                // canvas-supported code here
                ctx.fillStyle = 'rgba(200, 0, 0)';
                ctx.fillRect(10, 10, 50, 50);
                ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
                ctx.fillRect(30, 30, 50, 50);
            }else {
                // canvas-unsupported code here
                alert('当前浏览器不支持canvas')
                return
            }
        }
        draw()
    </script>
</body>

</html>
~~~

上面代码通过拿到`<canvas>`的dom对象，然后根据上下文是否存在来检查`canvas`的支持性以做不同处理，如果支持则进行绘制，不支持则给出提示【现今，所有主流浏览器都支持`canvas`】，上面代码运行结果如下：

![image-20231112143514937](C:\Users\22706\AppData\Roaming\Typora\typora-user-images\image-20231112143514937.png)



## 二、形状与路径的绘制

在开始画图之前，我们需要了解一下画布栅格以及坐标空间

![image-20231112144040747](C:\Users\22706\AppData\Roaming\Typora\typora-user-images\image-20231112144040747.png)

如上图所示，`<canvas>`元素默认被网格所覆盖，通过来说网格中的一个单元相当于canvas元素中的一像素，栅格的起点为左上角，坐标为(0,0)。所有元素的位置都相对于原点定位。

### 2.1 形状绘制

这里我们主要介绍一下矩形的绘制，`<canvas>`提供了三种方法绘制矩形：

- `fillRect(x, y, width, height)`绘制一个**填充**的矩形
- `strokeRect(x, y, width, height)`绘制一个矩形的**边框**
- `clearRect(x, y, width, height)`清除指定矩形区域，让清除部分完全**透明**

`x，y`分别表示矩形的起始点（即左上角的位置）相对于坐标轴原点的距离，`width`和`height`分别表示矩形的宽高。

实例如下：

~~~html
function draw () {
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    if(ctx) {  // 判断上下文对象是否存在 即检查支持性
        // canvas-supported code here
        ctx.fillRect(25, 25, 100, 100)  // 填充矩形
        ctx.clearRect(45, 45, 60, 60)  // 透明/空心矩形
        ctx.strokeRect(50, 50, 50, 50)  // 轮廓矩形
    }else {
        // canvas-unsupported code here
        alert('当前浏览器不支持canvas')
        return
    }
}
draw()
~~~

输出如下：

![image-20231112150333434](C:\Users\22706\AppData\Roaming\Typora\typora-user-images\image-20231112150333434.png)

这里再介绍一下圆弧的绘制语法：`ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise)`

圆弧路径的圆心在`(x，y)`位置，半径为`radius`，根据`anticlockwise`默认为顺时针指定的方向从`startAngle`开始绘制，到`endAngle`结束。

`startAngle`：圆弧的起始点，x轴方向开始计算，单位以弧度表示。

`endAngle`：圆弧的终点，单位以弧度表示。

`anticlockwise`：可选的`Boolean`值，如果为`true`，逆时针制圆弧，反之，顺时针绘制，默认为`false`。

### 2.2 路径绘制

图形的基本元素是路径。路径是通过不同颜色和宽度的线段或曲线相连形成的不同形状的点的集合。一个路径，甚至一个子路径，都是闭合的。使用路径绘制图形需要一些额外的步骤。

1. 首先，你需要创建路径起始点
2. 然后使用画图命令去画出路径
3. 之后把路径封闭
4. 一旦路径生成，你就能通过描边或填充路径区域来渲染图形

以下是所要用到的函数：

`beginPath()`：新建一条路径，生成之后，图形绘制命令被指向到路径上生成路径。

`closePath()`：闭合路径之后图形绘制命令又重新指向到上下文中。

`stroke()`：通过线条来绘制图形轮廓。

`fill()`：通过填充路径的内容区域生成实心的图形。

`moveTo()`：移动笔触，将笔触移动到指定的坐标x以及y上，就类似手写笔记时将笔尖移动到A4纸上的某个位置，这个方法跟python的海龟作图一样。

**关于`beiginPath()`**：生成路径的第一步，本质上，路径是由很多子路径构成，这些子路径都是在一个列表中，所有的子路径（线，弧形，等等）构成图形，而每次**这个方法调用之后，列表清空重置，然后我们就可以重新绘制新的图形了**。

注意：前路径为空，即调用 `beginPath() `之后，或者 canvas 刚建的时候，第一条路径构造命令通常被视为是` moveTo()`，无论实际上是什么。出于这个原因，你几乎总是要在设置路径之后专门指定你的起始位置。

**关于closePath()**：非必需，这个方法会通过绘制一条从当前点到开始点的直线来闭合图形。如果图形是已经闭合了的，即当前点为开始点，该函数什么也不做。当调用`fill()`函数之后，形状会自动闭合，所以不需要调用此函数、

下面我们通过使用`canvas`绘制一个三角形来体会前面讲的函数：

~~~html
function draw() {
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    ctx.beginPath();  // 新建一条路径
    ctx.moveTo(75, 50);  // 将路径的起始点定在(75, 50)位置
    ctx.lineTo(100, 75);  // 从路径起始点到(100, 75)绘制一条线
    ctx.lineTo(75, 100);
    ctx.fill();  // 自动填充图形 如果图形没闭合会自动闭合
}
draw()
~~~

结果如下：

![image-20231112155102213](C:\Users\22706\AppData\Roaming\Typora\typora-user-images\image-20231112155102213.png)

### 2.3 绘制一个笑脸

下面，我们结合图形绘制和路径绘制实现一个简单的笑脸。

~~~html
function draw() {
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    ctx.beginPath();  // 开始绘制
    ctx.arc(75, 75, 50, 0, 2 * Math.PI)
    ctx.moveTo(110, 75)
    ctx.arc(75, 75, 35, 0, Math.PI)
    ctx.moveTo(65, 65)
    ctx.arc(60, 65, 5, 0, Math.PI * 2)
    ctx.moveTo(95, 65)
    ctx.arc(90, 65, 5, 0, Math.PI * 2)
    ctx.stroke();  // 展示线条
}
draw()
~~~

结果如下：

![image-20231112161523519](C:\Users\22706\AppData\Roaming\Typora\typora-user-images\image-20231112161523519.png)

## 三、使用样式和颜色

可配置颜色、透明度、线型样式、线型渐变、径向渐变、图案样式、阴影等。

api比较多，详细可看[MDN——使用样式和颜色](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Applying_styles_and_colors#%E6%B8%90%E5%8F%98_gradients)

## 四、绘制文本

`canvas`提供了两种方法来渲染文本：

1. `fillText(text, x, y, [, maxWidth])`：在指定的（x，y）位置填充指定的文本，绘制的最大宽度是可选的。
2. `strokeText(text, x, y, [, maxWidth])`：在指定的（x，y）位置绘制文本边框，绘制的最大宽度是可选的。

文本也可以通过一些样式属性来调整文本样式：

- `ctx.font = value`：这个属性和CSS的font属性相同语法，默认的字体是`10px sans-serif`
- `textAlign = value`：文本对齐选项，可选的值包括：`start`、`end`、`left`、`right`or`center`，默认值是`start`
- `textBaseline = value`：基线对齐选项，可选的值包括：`top`、`hanging`、`middle`、`alphabetic`、`ideographic`、`bottom`。默认值是`alphabetic`。
- `direction = value`：文本方向。可能的值包括：`ltr`，`rtl`，`inherit`。默认值是`inherit`。

下面我们看实例：

~~~html
function draw() {
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    ctx.font = '10px serif';
    ctx.fillText('Hello World', 0, 10);
    ctx.font = '30px serif';
    ctx.strokeText('Hello World', 0, 150);
    let text = ctx.measureText('Hello World');
    console.log(text.width);  // 165
}
draw()
~~~

结果如下：

![image-20231112194348330](C:\Users\22706\AppData\Roaming\Typora\typora-user-images\image-20231112194348330.png)

需要注意的是：**`canvas`绘制图形和路径往往是以左上角的位置为参考，而`canvas`使用`fillText()`和`strokeText()`设置文字位置时，是以文字左下角的位置为相对位置。**

上面的代码段中还使用了`measureText()`对象获取文本的更多细节，它将返回一个`TextMetrics`对象的宽度、所在像素，这些体现文本特性的属性，其中输出文本宽度可以使用`.width`。

## 五、使用图像

`canvas`更有意思的一项特性就是图像操作能力。可以**用于动态的图像合成或者作为图形的背景，以及游戏界面（Sprites）等等**。浏览器支持的任意格式的外部图片都可以使用，比如PNG、GIF或者JPEG。你甚至可以将同一个页面中其他`canvas`元素生成的图片作为图片源。

引入图形到`canvas`里需要以下**两步基本操作**：

1. 获得一个指向`HTMLImageElement`的对象或者另一个`canvas`元素的引用作为源，也可以通过提供一个URL的方式来使用图片。
2. 使用`drawImage()`函数将图片绘制到画布上。

**`drawImage()`函数的常规语法如下**：

`drawImage(image, dx, dy)`。

其中dx表示图片相对canvas左上角的x轴位置，dy表示图片相对canvas左上角的y轴位置。

更高阶的用法如缩放Scaling，切片Slicing，会在后面详细讲解。

### 5.1 图片源

`canvas`的API可以使用下面这些类型中的一个作为图片的源：

- `HTMLImageElement`：这种类型是由`Image()`函数构造出来的，或者任何的`<img>`元素。
- `HTMLVideoElement`：用一个HTML的`<video>`元素作为你的图片源，可以从视频中抓取当前帧作为一个图像。
- `HTMLCanvasElement`：可以使用另一个`<canvas>`元素作为你的图片源。
- `ImageBitmap`：这是一个高性能的位图，可以低延迟地绘制，它可以从上述的所有源以及其他几种源中生成。

### 5.2 获取页面内的图片

我们可以通过下列方法的一种来获得与`canvas`相同页面内的图片的引用：

- `document.images`集合
- `document.getElementsByTagName()`方法
- 如果你知道你想使用的指定图片的ID，你可以用`document.getElementById()`获得这个图片

也可以通过`new Image()`创建`<img>`元素，自定义图片。

下面我们来看实例：

~~~html
let img = new Image();
img.src = './canvas_drawimage2.jpg';
ctx.drawImage(img, 0, 0);
~~~

当脚本执行后，图片开始装载，若调用`drawImage`时，图片没装载完，那什么都不会发生（在一些旧浏览器中可能会抛出异常）。因此你应该用load事件来保证不会在加载完毕之前使用这个图片：

~~~html
let img = new Image();
img.onload = function () {
	// 执行drawImage语句
	ctx.drawImage(img, 0, 0);
}
img.src = './canvas_drawimage2.jpg';
~~~

结果如下：

![image-20231112210116676](C:\Users\22706\AppData\Roaming\Typora\typora-user-images\image-20231112210116676.png)

### 5.3 缩放Scaling

`drawImage()`的缩放用法比常规用法多了两个参数，语法如下：

~~~javascript
drawImage(image, x, y, width, height)
~~~

其中：

- `x, y`：表示图片位置
- `width, height`：表示图片缩放的大小

下面我们通过缩放功能实现在`canvas`上平铺图像：

~~~html
let img = new Image();
img.onload = function () {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 3; j++) {
			ctx.drawImage(frame, j * 50, i * 38, 50, 38);
    	}
    }
}
img.src = './canvas_drawimage2.jpg';
~~~

结果如下：

![image-20231112211818208](C:\Users\22706\AppData\Roaming\Typora\typora-user-images\image-20231112211818208.png)

### 5.4 切片Slicing

`drawImage()`的切片方法需要传递9个参数，除了第一个参数和常规方法和缩放方法一样，其他参数都不一样，下面我们来详细看看它的语法：

~~~javascript
drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
~~~

其余八个参数中，前4个定义图片源的切片位置和大小，后4个则是定义切片的目标显示位置和大小。

切片是做图片合成的强大工具。假设有一张包含了所有元素的图像，那么你可以用这个方法来合成一个完整图像。例如，你想画一张图表，而手上有一个包含所有必需的文字的 PNG 文件，那么你可以很轻易的根据实际数据的需要来改变最终显示的图表。这方法的另一个好处就是你不需要单独装载每一个图像。

下面我们来实现用另一张图片来替换前面章节的相框内的犀牛头。

~~~html
<body>
    <canvas id="canvas" width="300" height="300">
        <!-- 如果当前浏览器不支持canvas，将会显示盒子内的内容作为兜底提示 -->
        current browoser not support canvas
    </canvas>
    <div style="display: none;">
        <img id="source" src="./img22_min.png" width="132" height="150" alt="资源">
        <img id="frame" src="./canvas_drawimage2.jpg" width="190" height="190" alt="相框">
    </div>
    <script>
        function draw() {
            // 获取canvas元素
            const canvas = document.getElementById('canvas');
            // 获取绘图环境
            const ctx = canvas.getContext('2d');
            // 获取图片元素
            const source = document.getElementById('source');
            const frame = document.getElementById('frame');
            // 绘制相框
            ctx.drawImage(frame, 0, 0);
            // 绘制图片
            ctx.drawImage(source, 10, 10, 250, 120, 52, 43, 124, 102);
        }
        draw();
    </script>
</body>
~~~

结果如下：

![image-20231112215832714](C:\Users\22706\AppData\Roaming\Typora\typora-user-images\image-20231112215832714.png)

### 5.5 控制图像的缩放行为

过度缩放图像可能会导致图像模糊或像素化。你可以通过使用绘图环境的[`imageSmoothingEnabled`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/imageSmoothingEnabled)属性来控制是否在缩放图像时使用平滑算法。默认值为`true`，即启用平滑缩放。你也可以像这样禁用此功能：

~~~javascript
ctx.mozImageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;
~~~

## 六、状态的保存与恢复

在了解变形之前，我们先了解两个你在开始绘制复杂图形时必不可少的方法。

- `save()`：保存画布（canvas）的所有状态
- `restore()`：`save`和`restore`方法是用来保存和恢复`canvas`状态的，都没有参数。

`canvas`的状态就是当前画面应用的所有样式和变形的一个快照。

`canvas`状态存储在栈中，每当`save()`方法被调用后，当前的状态就被推送到栈中保存。一个绘画状态包括：

- 当前应用的变形（即移动，旋转和缩放）
- 以及下面这些属性：`strokeStyle`,`fillStyle`,`globalAppha`,`lineWidth`,`lineCap`...
- 当前的裁剪路径（clipping path）

你可以调用任意次`save`方法。每一次调用`restore`方法，上一个保存的状态就从栈中弹出，所有设定都恢复。

下面我们看实例：

~~~html
function draw() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    // 使用默认状态画一个矩形 背景色是黑色的
    ctx.fillRect(0, 0, 150, 150)
    ctx.save()  // 保存默认状态

    ctx.fillStyle = '#ff0000'
    // 使用新状态绘制一个矩形 背景色红色
    ctx.fillRect(15, 15, 120, 120)
    ctx.save()  // 保存新状态
    ctx.fillStyle = '#0000ff'
    ctx.globalAlpha = 0.5
    // 使用新状态绘制一个矩形 背景色蓝色 透明度0.5
    ctx.fillRect(30, 30, 90, 90)
    // 恢复到之前保存的状态 根据栈后进先出原则 弹出的状态应该是红色背景的状态
    ctx.restore()
    ctx.fillRect(45, 45, 60, 60)
    // 再次弹出的应该是默认状态
    ctx.restore()
    ctx.fillRect(60, 60, 30, 30)
}
draw();
~~~

上面这段代码实现了两次保存状态，第一次是默认状态，第二次是红色背景状态，在`restore()`恢复状态时，根据栈后进先出原则，第一次恢复弹出的状态是红色背景状态，第二次弹窗的是默认状态，结果展示如下：

![image-20231114120329084](C:\Users\22706\AppData\Roaming\Typora\typora-user-images\image-20231114120329084.png)

## 七、变形 Transformations

`canvas`的变形和`css`的变形比较类似，变形可以将`canvas`原点移动到另一点、对网格进行旋转和缩放。

这里主要讲解**移动 Translating**、**旋转 Rotating**、**缩放 Scaling**，有关**变形Transforms**的内容建议查看[MDN——Transformations](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Transformations)。

### 7.1 移动 Translating

使用`translate(x, y)`方法实现移动`canvas`和它的原点到一个不同的位置。

其中`x`表示左右偏移量，`y`表示上下偏移量。

**在做变形之前先保存状态是一个良好的习惯，大多数情况下，调用`restore`方法比手动恢复原先的状态要简单得多**。又，如果你是在一个循环中做位移但没有保存和恢复`canvas`的状态，很可能到最后会发现怎么有些东西不见了，那是因为它很可能已经超出`canvas`范围以外了。

下面我们看实例：

~~~html
function draw() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            // 保存默认状态
            ctx.save()
            // 改变填充颜色
            ctx.fillStyle = 'rgb(' + 80 * i + ',' + 80 * j + ', 255)'
            // 移动原点
            ctx.translate(10 + 50 * j, 10 + 50 * i)
            ctx.fillRect(0, 0, 30, 30)
            // 恢复默认状态
            ctx.restore()
		}
	}
}
draw();
~~~

上面的代码段使用循环实现了通过`tranlate()`改变原点位置，从而绘制不同颜色的矩形，结果如下：

![image-20231114123501804](C:\Users\22706\AppData\Roaming\Typora\typora-user-images\image-20231114123501804.png)

### 7.2 旋转 Rotating

使用`rotate(angle)`方法实现旋转`canvas`，这个方法只接收一个参数：旋转的角度（angle），它是顺时针方向的，以弧度为单位的值，并且是以原点为中心旋转`canvas`。

旋转的中心始终是`canvas`的原点，如果要改变它，我们需要用到`translate(x, y)`方法。

下面我们看实例：

~~~html
function draw() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.save()
    ctx.fillStyle = '#88f';
    ctx.fillRect(10, 10, 60, 60);
    // 绕默认原点旋转
    ctx.rotate(Math.PI / 180 * 25);
    ctx.fillStyle = '#f88';
    ctx.fillRect(10, 10, 60, 60);
    ctx.restore();

    ctx.fillStyle = '#8f8'
    ctx.fillRect(80, 10, 60, 60);
    ctx.translate(110, 40)
    // 改变原点 绕新的原点旋转  这里就相当于设置了一个旋转用的圆心
    ctx.rotate(Math.PI / 180 * 45);
    ctx.translate(-110, -40)
    ctx.fillStyle = '#88f';
    ctx.fillRect(80, 10, 60, 60);
}
draw();
~~~

上面的代码段实现了矩形绕默认原点旋转以及绕通过`translate(x, y)`新设置的原点旋转，结果如下：

![image-20231114150049391](C:\Users\22706\AppData\Roaming\Typora\typora-user-images\image-20231114150049391.png)

### 7.3 缩放 Scaling

使用`scale(x, y)`实现缩放，我们用它来增减图形在`canvas`中的像素数目，对形状，位图进行缩小或者放大。

`scale`方法可以缩放画布的水平和垂直的单位。两个参数都是实数，可以为负数，`x`为水平缩放因子，`y`为垂直缩放因子，如果比1小，会缩放图形，如果比1大会放大图形。默认值为1，为实际大小。

画布初始情况下，是以左上角坐标为原点的第一象限。**如果参数为负实数，相当于以 x 或 y 轴作为对称轴镜像反转**（例如，使用`translate(0,canvas.height); scale(1,-1);` 以 y 轴作为对称轴镜像反转，就可得到著名的笛卡尔坐标系，左下角为原点）。

默认情况下，`canvas` 的 1 个单位为 1 个像素。举例说，如果我们设置缩放因子是 0.5，1 个单位就变成对应 0.5 个像素，这样绘制出来的形状就会是原先的一半。同理，设置为 2.0 时，1 个单位就对应变成了 2 像素，绘制的结果就是图形放大了 2 倍

下面我们看案例：

~~~html
function draw() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.save()
    // 参照矩阵
    ctx.fillRect(1, 10, 10, 10)
    // 设置缩放因子x为10 y为3 则canvas的一个单位[默认是一个像素]就会变成x方向上10像素，y方向上3像素
    ctx.scale(10, 3)
    // 因此第二个矩形相对于为缩放前的canvas的参数应该是(10, 30, 100, 30)
    ctx.fillRect(1, 10, 10, 10)

    ctx.restore()
    ctx.font = '20px serif'
    ctx.save()
    // 参照文字
    ctx.fillText('canvas', 80, 80)
    // 水平镜像
    ctx.scale(-1, 1)
    ctx.fillText('canvas', -80, 100)
    ctx.restore()
    // 垂直镜像
    ctx.scale(1, -1)
    ctx.fillText('canvas', 80, -120)
}
draw();
~~~

上面代码段画了一个初识盒子并按照x方向10倍、y方向3倍缩放盒子，以及实现了文字的水平镜像和垂直镜像，结果如下：

![image-20231114152900430](C:\Users\22706\AppData\Roaming\Typora\typora-user-images\image-20231114152900430.png)

## 八、综合案例：画板

接下来，我们结合前面章节所学的知识，使用原生html和js实现一个画板，画板要具有保存图片、清除画板、设置画笔粗细功能。

结果界面展示：

![image-20231114202426309](C:\Users\22706\AppData\Roaming\Typora\typora-user-images\image-20231114202426309.png)

功能演示：

![画板结果演示gif](D:\upgrade\canvas\result\drawboard\画板结果演示gif.gif)

保存的图片展示：

![image-20231114202449624](C:\Users\22706\AppData\Roaming\Typora\typora-user-images\image-20231114202449624.png)

下面我们看代码：

`drawBoard.html`

~~~html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>canvas</title>
    <style>
        * {
            padding: 0;
            margin: 0;
            box-sizing: border-box;
        }

        .main-box {
            width: 100%;
            height: 100vh;
            position: relative;
            overflow: hidden;
            user-select: none;
            .bgc {
                z-index: -1;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                object-fit: cover;
            }

            .operate-box {
                height: 32px;
                line-height: 30px;
                display: flex;
                /* column-gap: 20px; */
                padding-left: 10px;
                font-size: 20px;
                background-color: rgba(255, 255, 255, .9);

                .title {
                    font-weight: 600;
                    padding: 0 10px;
                    margin-right: 20px;
                }

                .btn {
                    cursor: pointer;
                    padding: 0 5px;
                }

                .btn:hover {
                    background-color: rgba(204, 204, 204, 0.8);
                }
            }

            .canvas-box {
                position: absolute;
                top: calc(50% + 16px);
                left: 50%;
                transform: translate(-50%, -50%);
                border-radius: 10px;
                background-color: #fff;
                padding: 10px;
                box-shadow: 4px 5px 10px rgba(0, 0, 0, .7);
            }
        }

        .dialog {
            width: 100vw;
            height: 100vh;
            position: absolute;
            top: 0;
            z-index: 2;
            display: none;
            /* 文字无法选中 */
            user-select: none;

            .setting-box {
                width: 400px;
                height: 290px;
                position: relative;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                border: 1px solid #ccc;
                border-radius: 10px;
                padding: 10px;
                display: flex;
                flex-direction: column;
                background-color: #fff;

                .header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    font-size: 20px;

                    .close {
                        width: 24px;
                        height: 24px;
                        cursor: pointer;
                    }
                }

                .content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    flex: 1;

                    .item {
                        width: 100%;
                        display: flex;
                        align-items: center;

                        .item-name {
                            width: 80px;
                            text-align: right;
                            font-size: 18px;
                        }

                        .item-value {
                            display: flex;
                            align-items: center;

                            .sub,
                            .add {
                                font-size: 26px;
                                height: 20px;
                                line-height: 18px;
                                cursor: pointer;
                            }

                            .sub {
                                margin: 0 6px 0 10px;
                            }

                            .add {
                                margin: 0 10px 0 6px;
                            }

                            .progress-box {
                                height: 20px;
                                display: flex;
                                align-items: center;
                                width: 180px;
                                cursor: pointer;
                                .horizontal-line {
                                    position: relative;
                                    width: 100%;
                                    height: 4px;
                                    border: 1px solid #000;

                                    .vertical-line {
                                        position: absolute;
                                        top: 50%;

                                        transform: translateY(-50%);
                                        height: 20px;
                                        width: 4px;
                                        background-color: #000;
                                        border: 1px solid #000;
                                    }
                                }
                            }

                        }
                    }
                }

                .footer {
                    display: flex;
                    align-items: center;
                    padding: 0 100px;
                    justify-content: space-between;
                    font-size: 20px;

                    .setting-confirm,
                    .setting-reset {
                        text-align: center;
                        width: 60px;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        cursor: pointer;
                    }
                }
            }
        }
    </style>
</head>

<body>
    <div class="main-box">
        <!-- 背景图 -->
        <img class="bgc" src="./bgc_1.jpg" alt="">
        <!-- 操作栏 -->
        <div class="operate-box">
            <div class="title">这是一块画板</div>
            <div class="btn" id="setting">设置</div>
            <div class="btn" id="clear">清除</div>
            <div class="btn" id="save">保存</div>
        </div>
        <div class="canvas-box">
            <!-- 画布 -->
            <canvas id="canvas">
                <!-- 如果当前浏览器不支持canvas，将会显示盒子内的内容作为兜底提示 -->
                current browoser not support canvas
            </canvas>
        </div>
    </div>
    <div class="dialog" id="dialog">
        <div class="setting-box">
            <div class="header">
                <div class="theme">设置</div>
                <img class="close" id="close" src="./close_icon.png" alt="关闭按钮"></img>
            </div>
            <div class="content">
                <div class="item">
                    <div class="item-name">线粗:</div>
                    <div class="item-value">
                        <div class="sub" id="sub">-</div>
                        <div class="progress-box" id="line">
                            <div class="horizontal-line">
                                <div class="vertical-line" id="progress">
                                </div>
                            </div>
                        </div>
                        <div class="add" id="add">+</div>
                        <div class="value" id="line_width_value"></div>
                    </div>
                </div>
            </div>
            <div class="footer">
                <div class="setting-confirm" id="setting_save">保存</div>
                <div class="setting-reset" id="setting_reset">重置</div>
            </div>
        </div>
    </div>

    <script src="./drawBoard.js"></script>
</body>

</html>
~~~

`drawBoard.js`

~~~javascript
let canvasWidth = window.innerWidth * 0.8;
let canvasHeight = window.innerHeight * 0.88;

// 拿到画板、重置按钮、保存按钮的dom元素
let canvas = document.getElementById("canvas");
let clear = document.getElementById("clear");
let save = document.getElementById("save");
// 设置相关数据
let setting = document.getElementById("setting"); // 设置按钮dom元素
let close = document.getElementById("close"); // 关闭设置按钮dom元素
let line_width_value = document.getElementById("line_width_value"); // 当前值dom元素
let add = document.getElementById("add"); // 加按钮dom元素
let sub = document.getElementById("sub"); // 减按钮dom元素
let line = document.getElementById("line"); // 进度线dom元素
let progress = document.getElementById("progress"); // 进度线标签dom元素
let setting_save = document.getElementById("setting_save"); // 保存按钮dom元素
let setting_reset = document.getElementById("setting_reset"); // 重置按钮dom元素
let defaultConfig = {
  // 默认设置数据
  lineWidth: 3,
};

let tempConfig = {
  // 临时存的设置数据
  lineWidth: defaultConfig.lineWidth,
};
// 初始化画板宽高
canvas.width = canvasWidth;
canvas.height = canvasHeight;

// 监听窗口大小变化 实现canvas大小自适应
window.addEventListener("resize", () => {
  canvasWidth = window.innerWidth * 0.9;
  canvasHeight = window.innerHeight * 0.88;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
});

let startTag = false; // 开始绘画的标识 鼠标按下设为true 鼠标弹起设为false
let ctx = canvas.getContext("2d");

// 初始化
ctx.lineWidth = defaultConfig.lineWidth; // 初始化canvas路径宽度
line_width_value.innerText = ctx.lineWidth;
progress.style.left = (ctx.lineWidth / 10) * 100 + "%";
ctx.fillStyle = "#fff"; // 初始化canvas背景色
ctx.fillRect(0, 0, canvasWidth, canvasHeight); // 填个矩形 避免下载下来的图片背景是镂空的
// 监听鼠标按下事件
canvas.addEventListener("mousedown", (e) => {
  // 新建一条路径
  ctx.beginPath();
  // 设置路径原点为鼠标按下出
  ctx.moveTo(e.offsetX, e.offsetY);
  startTag = true;
});

// 监听鼠标移动事件
canvas.addEventListener("mousemove", (e) => {
  if (!startTag) return;
  // 生成路径
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke(); // 绘制当前或已经存在的路径的方法 也就是让路径看得到 默认是黑色的
});

canvas.addEventListener("mouseup", (e) => {
  ctx.closePath();
  startTag = false;
});

// 清除事件
clear.onclick = () => {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
};

// 保存图片事件
save.onclick = () => {
  let img = canvas.toDataURL("image/jpg");
  let a = document.createElement("a");
  a.href = img;
  a.download = "画板.png";
  a.target = "_blank"; // a标签的属性target _blank表示在新标签页打开
  a.click();
};

// 控制设置弹窗的显示
setting.onclick = () => {
  dialog.style.display = "block";
};
// 控制设置弹窗的隐藏
close.onclick = () => {
  ctx.lineWidth = tempConfig.lineWidth;
  line_width_value.innerText = ctx.lineWidth;
  progress.style.left = (ctx.lineWidth / 10) * 100 + "%";
  dialog.style.display = "none";
};

// +
add.onclick = () => {
  if (ctx.lineWidth < 10) {
    ctx.lineWidth = ctx.lineWidth + 1;
    line_width_value.innerText = ctx.lineWidth;
    progress.style.left = (ctx.lineWidth / 10) * 100 + "%";
  }
};

// -
sub.onclick = () => {
  if (ctx.lineWidth > 1) {
    ctx.lineWidth = ctx.lineWidth - 1;
    line_width_value.innerText = ctx.lineWidth;
    progress.style.left = (ctx.lineWidth / 10) * 100 + "%";
  }
};

// 重置 恢复默认数据
setting_reset.onclick = () => {
  ctx.lineWidth = defaultConfig.lineWidth;
  line_width_value.innerText = ctx.lineWidth;
  progress.style.left = (ctx.lineWidth / 10) * 100 + "%";
};

// 保存 设置数据
setting_save.onclick = () => {
  tempConfig.lineWidth = ctx.lineWidth;
  dialog.style.display = "none";
};

// 点击进度条更改值
line.addEventListener("click", (e) => {
  ctx.lineWidth = ((e.offsetX / 180) * 10).toFixed()
    ? ((e.offsetX / 180) * 10).toFixed()
    : 1;
  line_width_value.innerText = ctx.lineWidth;
  progress.style.left = (ctx.lineWidth / 10) * 100 + "%";
});

~~~

代码上传github了：[canvas实现画板](https://github.com/WuJianR/canvas_drawBoard)，欢迎大家光临我的空间！

## 九、综合案例：时钟

下面我们再实现一个案例——时钟

界面展示如下：

![image-20231115130747288](C:\Users\22706\AppData\Roaming\Typora\typora-user-images\image-20231115130747288.png)

效果展示如下：

![clock结果演示gif](D:\upgrade\canvas\result\clock\clock结果演示gif.gif)

下面我们看代码：

`clock.html`

~~~html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>clock</title>
    <style>
        * {
            margin: 0;
            padding: 0;
        }

        .main-box {
            width: 100%;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;

            #canvas {
                border: 1px solid #000;
            }
        }
    </style>
</head>

<body>
    <div class="main-box">
        <canvas id="canvas" width="600" height="600"></canvas>
    </div>
    <script src="./clock.js"></script>
</body>

</html>
~~~

`clock.js`

~~~javascript
/**
 * window.requestAnimationFrame()告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画
 * 该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行
 */
let animate = (time) => {
  let now = new Date();
  let hour = now.getHours();
  let minus = now.getMinutes();
  let second = now.getSeconds();
  hour = hour % 12;
  let ctx = document.getElementById("canvas").getContext("2d");
  ctx.clearRect(0, 0, 600, 600);
  // 保存默认状态
  ctx.save();
  ctx.lineWidth = 10;
  // 画个圆
  ctx.beginPath();
  ctx.arc(300, 300, 250, 0, Math.PI * 2);
  ctx.stroke();
  // 画完圆后恢复到默认状态
  ctx.restore();
  // 画小时数字
  ctx.save();
  ctx.lineWidth = 2;
  ctx.translate(300, 300);
  ctx.beginPath();
  ctx.font = "48px serif";
  for (let i = 0; i < 12; i++) {
    let x = Math.sin((Math.PI / 6) * (i + 1)) * 180;
    let y = Math.cos((Math.PI / 6) * (i + 1)) * 180 * -1;  // 注意 这里一定要乘以负一
    // console.log(x, "x", y, "y");
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeText((i + 1).toString(), x, y);
  }
  ctx.restore();
  // 保存默认状态
  ctx.save();
  // canvas初始化：原点移到canvas中心，旋转-90度，因为默认选择是从左上角原点y轴方向开始旋转的
  ctx.translate(300, 300);
  ctx.rotate(-Math.PI / 2);
  ctx.lineCap = "round";

  // 画小时刻度
  // 保存初始化
  ctx.save();
  ctx.lineWidth = 8;
  ctx.beginPath();
  for (let i = 0; i < 12; i++) {
    ctx.rotate((Math.PI / 180) * 30);
    ctx.moveTo(210, 0);
    ctx.lineTo(250, 0);
    ctx.stroke();
  }
  ctx.restore();

  // 画分钟刻度
  ctx.save();
  ctx.lineWidth = 4;
  ctx.beginPath();
  for (let i = 0; i < 60; i++) {
    ctx.rotate((Math.PI / 180) * 6);
    ctx.moveTo(230, 0);
    ctx.lineTo(250, 0);
    ctx.stroke();
  }
  ctx.restore();

  // 画时针
  ctx.save();
  ctx.beginPath();
  ctx.lineWidth = 20;
  ctx.rotate((Math.PI / 6) * (hour + minus / 60 + second / 3600));
  ctx.moveTo(-60, 0);
  ctx.lineTo(140, 0);
  ctx.stroke();
  ctx.restore();

  // 画分针
  ctx.save();
  ctx.beginPath();
  ctx.lineWidth = 14;
  ctx.rotate((Math.PI / 30) * (minus + second / 60));
  ctx.moveTo(-60, 0);
  ctx.lineTo(190, 0);
  ctx.stroke();
  ctx.restore();

  // 画秒针
  ctx.save();
  ctx.beginPath();
  ctx.lineWidth = 10;
  ctx.rotate((Math.PI / 30) * second);
  ctx.moveTo(-60, 0);
  ctx.lineTo(220, 0);
  ctx.strokeStyle = "#f00";
  ctx.stroke();
  ctx.restore();

  // 画圆心
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = "#f00";
  ctx.arc(0, 0, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.restore();
  window.requestAnimationFrame(animate);
};

window.requestAnimationFrame(animate);
~~~

需要注意的是：

1. 在修改默认状态前一定要先`save`状态
2. 每画一部分内容记得`restore`状态，并且使用`beiginPath`重新开始绘制，否则画出的结果将会出现奇怪的内容，比如页面无限闪动、偏移等问题

源码同样上传了github:[canvas实现clock](https://github.com/WuJianR/drawboard-clock)。欢迎访问！

## 十、更多内容

以上是我所介绍的`canvas`所有基础内容。

更多内容建议查看[MDN——canvas教程](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial)。
