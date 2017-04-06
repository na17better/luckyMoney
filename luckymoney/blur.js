/*
* @Author: dell
* @Date:   2017-03-28 20:50:53
* @Last Modified by:   dell
* @Last Modified time: 2017-03-29 00:19:47
*/

'use strict';
var canvasWidth=window.innerWidth;
var canvasHeight=window.innerHeight;

var canvas=document.getElementById("canvas");
var cxt=canvas.getContext("2d");

canvas.width=canvasWidth;
canvas.height=canvasHeight;

var image=new Image();
var radius=70;
var clippingRegion={x:-1,y:-1,r:radius}/*把剪辑区域设置成为一个对象,在draw中使用 剪辑区域*/
var leftMargin=0,topMargin=0

image.src="image.png";
image.onload=function(e)
{
	$("#blur-div").css("width",canvasWidth+'px');
	$("#blur-div").css("height",canvasHeight+'px');

	$("#blur-image").css("width",image.width+'px');
	$("#blur-image").css("height",image.height+'px');

	leftMargin=(image.width-canvas.width)/2;
	topMargin=(image.height-canvas.height)/2;

	$("#blur-image").css("top",String(-topMargin)+'px');
	$("#blur-image").css("left",String(-leftMargin)+'px');

	initCanvas();
}

function initCanvas()
{
	var theleft=leftMargin<0?-leftMargin:0;
	var thetop=topMargin<0?-topMargin:0;
	/*reset后的第一次是给它归位*/
	clippingRegion={x:Math.random()*(canvas.width-2*radius-2*theleft)+radius+theleft,
					y:Math.random()*(canvas.height-2*radius-2*thetop)+radius+thetop,r:radius};
	draw(image,clippingRegion);
}

function setClippingRegion(ClippingRegion)
{
	cxt.beginPath();
	cxt.arc(clippingRegion.x,clippingRegion.y,clippingRegion.r,0,Math.PI*2,false);
	cxt.clip();

}

function draw(image)/*复制原图到canvas*/
{
	cxt.clearRect(0,0,canvas.width,canvas.height);

	cxt.save();
	setClippingRegion(clippingRegion);
	cxt.drawImage(image, Math.max(leftMargin,0), Math.max(topMargin,0),
		Math.min(canvas.width,image.width),Math.min(canvas.height,image.height),
		leftMargin<0?-leftMargin:0,topMargin<0?-topMargin:0,
		Math.min(canvas.width,image.width),Math.min(canvas.height,image.height));
	cxt.restore();
}

function reset()
{
	initCanvas();
}

function show()/*完全显示清晰的图像，之前是由剪辑区域控制的，这里控制剪辑区域，半径为sqrt(800^2+700^2)*/
{

	var theAnimation=setInterval(function(){
		//clippingRegion.r=Math.ceil(Math.sqrt(Math.pow(canvas.width,2)+Math.pow(canvas.height,2)));
		console.log("animation");
		clippingRegion.r+=20;
		if(clippingRegion.r>2*Math.max(canvas.width,canvas.height))
		{
			clearInterval(theAnimation);
		}
		draw(image,clippingRegion);
	}, 30);
}

/*禁止默认的图像滑动事件好像有点问题*/
canvas.addEventListener('touchstart', function(e)
{
	e.preventDefault();
});
