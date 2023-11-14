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
