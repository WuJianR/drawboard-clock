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

// 禁用右键，让鼠标无法通过右键打开控制台
document.addEventListener("contextmenu", (e) => {
  e.preventDefault(); // 阻止默认的右键菜单
});
// 禁用打开控制台
document.addEventListener("keydown", (e) => {
  if (
    e.code == "F12" || // 阻止默认的F12打开控制台操作
    (e.ctrlKey && e.code == "KeyF") || // 禁用F12之后 ctrl+f打开搜索后还能按f12 因此禁用ctrl+f 缺点是页面不能使用搜索功能了
    (e.ctrlKey && e.shiftKey && e.code == "KeyI") // 禁用ctrl+shift+I 打开控制台的组合键
  ) {
    e.preventDefault();
    return false;
  } else {
    return true; // 允许其他操作
  }
});
// 通过上面的禁用后键盘无法再打开控制台，但是可以点击浏览器的设置打开控制台，这里增加监听窗口大小变化来判断是否打开控制台
// window.addEventListener("resize", (e) => {
//   let threshold = 100;
//   // 窗口外部宽度-窗口内部宽超过100就判断窗口被打开了
//   let width = window.outerWidth - window.innerWidth > threshold;
//   let height = window.outerHeight - window.innerHeight > threshold;
//   if (width || height) {
//     alert("请不要打开控制台")
//   }
// });

// 打开控制台就debugger 但是容易被破解 打开控制台后在断点处右键选择一律不在此处暂停就破解了
setInterval(() => {
  debugger;
}, 100);

// 把图片转成canvas 这样就实现了打开控制台也不让下载图片
const mainbox = document.getElementById("main-box");
// img转canvas
const img2 = document.querySelector("img");
const canvas2 = document.createElement("canvas");
canvas2.width = img2.width;
canvas2.height = img2.height;
canvas2.style.position = "absolute";
canvas2.style.top = "50%";
canvas2.style.left = "50%";
canvas2.style.transform = "translate(-50%, -50%)";
canvas2.style.zIndex = "-1";
canvas2.style.objectFit = "cover";
const ctx2 = canvas2.getContext("2d");
ctx2.drawImage(img2, 0, 0, img2.width, img2.height);
// 将canvas插入到img前面，然后移除img
mainbox.insertBefore(canvas2, img2);
mainbox.removeChild(img2);

// 水印监听功能 水印dom被删除后重新生成
function mutationWatermark() {
  // 定义MutationObserver实例observe方法的配置对象
  const config = {
    childList: true, // 子节点的变化，例如节点添加或删除
    subtree: true, // 监听子树节点
    aributes: true, // 监听属性变化
    characterData: true, // 监听文本节点
  };
  // 拿到水印大盒子 并克隆一份备用 插入时使用
  let watermark = document.querySelector("#watermark");
  let _watermark = watermark.cloneNode(true);
  // 获取水印dom节点的父节点
  const p_watermark = watermark.parentNode;
  // 获取水印dom的后一个节点
  let referenceNode;
  [...p_watermark.children].forEach((item, index) => {
    if (item === watermark) {
      referenceNode = p_watermark.children[index + 1];
    }
  });
  // 创建MutationObserver实例
  const observer = new MutationObserver((mutationsList) => {
    // 拿到水印子盒子 并克隆一份备用 插入时使用
    const wm_child = watermark.getElementsByTagName("span")[0];
    const _wm_child = wm_child.cloneNode(true);
    // 遍历所有变化
    for (let mutation of mutationsList) {
      // 判断是否是水印的整个盒子div节点被删除
      if (
        mutation.target == mainbox &&
        mutation.type == "childList" &&
        mutation.removedNodes.length > 0
      ) {
        // 重新插入水印节点div到水印的后一个孩子前面
        p_watermark.insertBefore(_watermark, referenceNode);
        // 重新拿到watermark盒子
        watermark = document.querySelector("#watermark");
        _watermark = watermark.cloneNode(true);
      }
      // 判断是否是水印孩子span节点被删除
      if (
        mutation.target === watermark &&
        mutation.type === "childList" &&
        mutation.removedNodes.length > 0
      ) {
        // 重新插入水印节点
        watermark.appendChild(_wm_child);
      }
    }
  });
  // 监听目标节点
  observer.observe(mainbox, config);
}
addWatermark();
