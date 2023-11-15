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
    let y = Math.cos((Math.PI / 6) * (i + 1)) * 180 * -1; // 注意 这里一定要乘以负一
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
