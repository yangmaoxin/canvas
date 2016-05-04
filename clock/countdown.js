//画布的宽和高
var WINDOW_WIDTH = document.body.clientWidth;
var WINDOW_HEIGHT = document.body.clientHeight;
//每个小圆的半径
var RADIUS = 8;
//数字距离画布的上边距
var MARGIN_TOP = 60;
//数字距离画布的左边距
var MARGIN_LEFT = 30;

//显示的分钟数
var curShowTimeSeconds = 0;
//存储小球的数组
var balls = [];
//小球的颜色
const colors = ["#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"];

window.onload = function(){
	//屏幕自适应
	//可见区域宽度
    WINDOW_WIDTH = document.documentElement.clientWidth;
    WINDOW_HEIGHT = document.documentElement.clientHeight;

    //左右边距共边距为1/5
    MARGIN_LEFT = Math.round(WINDOW_WIDTH /10);
    //画布宽4/5 共108个小球
    RADIUS = Math.round(WINDOW_WIDTH * 4 / 5 / 108)-1

    MARGIN_TOP = Math.round(WINDOW_HEIGHT /5);


	var canvas = document.getElementById("canvas");
	var cantext = canvas.getContext("2d");

	canvas.width = WINDOW_WIDTH;
	canvas.height = WINDOW_HEIGHT;

	curShowTimeSeconds = getCurrentShowTimeSeconds();

	//绘制画布
	//render(cantext);
	setInterval(function(){
		render(cantext);
		update();
	}, 50);
}

//计算现在的时间
function getCurrentShowTimeSeconds(){
	var curTime = new Date();
	var ret = curTime.getHours() *3600 +curTime.getMinutes()*60 + curTime.getSeconds();
	return ret;
}
function update(){
	var nextShowTimeSeconds = getCurrentShowTimeSeconds();

	var nextHours = parseInt(nextShowTimeSeconds/3600);
	var nextMinutes = parseInt((nextShowTimeSeconds - nextHours*3600)/60);
	var nextSeconds = nextShowTimeSeconds%60;

	var curHours = parseInt(curShowTimeSeconds/3600);
	var curMinutes = parseInt((curShowTimeSeconds - curHours*3600)/60);
	var curSeconds = curShowTimeSeconds%60;

    if( nextSeconds != curSeconds ){
    	// 如果当前小时的十位数和下一个改变的小时的十位数不同时
        if( parseInt(curHours/10) != parseInt(nextHours/10) ){
        	//增加小球（传入小球的十位数的位置以及当时的小时的十位数）
            addBalls( MARGIN_LEFT + 0 , MARGIN_TOP , parseInt(curHours/10) );
        }
        // 小时的个位数
        if( parseInt(curHours%10) != parseInt(nextHours%10) ){
            addBalls( MARGIN_LEFT + 15*(RADIUS+1) , MARGIN_TOP , parseInt(curHours/10) );
        }
        // 分钟的十位数
        if( parseInt(curMinutes/10) != parseInt(nextMinutes/10) ){
            addBalls( MARGIN_LEFT + 39*(RADIUS+1) , MARGIN_TOP , parseInt(curMinutes/10) );
        }
        // 分钟的个数数
        if( parseInt(curMinutes%10) != parseInt(nextMinutes%10) ){
            addBalls( MARGIN_LEFT + 54*(RADIUS+1) , MARGIN_TOP , parseInt(curMinutes%10) );
        }
        // 秒钟的十位数
        if( parseInt(curSeconds/10) != parseInt(nextSeconds/10) ){
            addBalls( MARGIN_LEFT + 78*(RADIUS+1) , MARGIN_TOP , parseInt(curSeconds/10) );
        }
        // 秒钟的个位数
        if( parseInt(curSeconds%10) != parseInt(nextSeconds%10) ){
            addBalls( MARGIN_LEFT + 93*(RADIUS+1) , MARGIN_TOP , parseInt(nextSeconds%10) );
        }

        curShowTimeSeconds = nextShowTimeSeconds;
    }
    updateBalls();
    //测试有多少个小球掉落
    console.log(balls.length);
}

//更新小球的运动效果
function updateBalls(){
    for( var i = 0 ; i < balls.length ; i ++ ){
        balls[i].x += balls[i].vx;
        balls[i].y += balls[i].vy;
        balls[i].vy += balls[i].g;
		//下边碰撞
		if( balls[i].y >= WINDOW_HEIGHT - RADIUS){
			balls[i].y = WINDOW_HEIGHT-RADIUS;
			balls[i].vy = -balls[i].vy*0.7;
		}
		//右边碰撞
		// if( balls[i].x >= WINDOW_WIDTH - RADIUS){
		// 	balls[i].x = WINDOW_WIDTH - RADIUS;
		// 	balls[i].vx = -balls[i].vx*0.7;
		// }
		//左边碰撞
		// if( balls[i].x <= RADIUS){
		// 	balls[i].x = RADIUS;
		// 	balls[i].vx = -balls[i].vx*0.75;
		// }
    }

    //移除掉出画布的小球
	 var cnt = 0
	    for( var i = 0 ; i < balls.length ; i ++ ){
	    	 if( balls[i].x + RADIUS > 0 && balls[i].x -RADIUS < WINDOW_WIDTH ){
	            balls[cnt++] = balls[i]
	        }
	    }
	       
	    while( balls.length > Math.min(300,cnt) ){ //取300和cnt的最小值
	        balls.pop();
	    }
}

//添加小球
function addBalls( x , y , num ){

    for( var i = 0  ; i < digit[num].length ; i ++ ){ //行
        for( var j = 0  ; j < digit[num][i].length ; j ++ ){ //列
            if( digit[num][i][j] == 1 ){
                var aBall = {
                    x:x+j*2*(RADIUS+1)+(RADIUS+1),
                    y:y+i*2*(RADIUS+1)+(RADIUS+1),
                    g:1.5+Math.random(),
                    //速度为 +4|-4
                    vx:Math.pow( -1 , Math.ceil( Math.random()*1000 ) ) * 4,
                    vy:-5,
                    //小球的颜色
                    color: colors[ Math.floor( Math.random()*colors.length ) ]
                }

                balls.push( aBall )
            }        	
        }    	
    }


}

//绘制时间
function render(cxt){ 

	//刷新画布
	cxt.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);

	var hours = parseInt(curShowTimeSeconds/3600);
	var minutes = parseInt((curShowTimeSeconds - hours*3600)/60);
	var seconds = curShowTimeSeconds%60;

	renderDigit(MARGIN_LEFT,MARGIN_TOP,parseInt(hours/10),cxt);
	renderDigit(MARGIN_LEFT+15*(RADIUS+1),MARGIN_TOP,parseInt(hours%10),cxt);
	renderDigit(MARGIN_LEFT+30*(RADIUS+1),MARGIN_TOP,10,cxt);
    renderDigit(MARGIN_LEFT+39*(RADIUS+1),MARGIN_TOP,parseInt(minutes/10),cxt);
    renderDigit(MARGIN_LEFT+54*(RADIUS+1),MARGIN_TOP,parseInt(minutes%10),cxt);
    renderDigit(MARGIN_LEFT+69*(RADIUS+1),MARGIN_TOP,10,cxt);
    renderDigit(MARGIN_LEFT+78*(RADIUS+1),MARGIN_TOP,parseInt(seconds/10),cxt);
    renderDigit(MARGIN_LEFT+93*(RADIUS+1),MARGIN_TOP,parseInt(seconds%10),cxt);

    //绘制小球
    for( var i = 0 ; i < balls.length ; i ++ ){
    cxt.fillStyle=balls[i].color;

    cxt.beginPath();
    cxt.arc( balls[i].x , balls[i].y , RADIUS , 0 , 2*Math.PI , true );
    cxt.closePath();

    cxt.fill();
	}
}

//绘制每一个数字 第一个小圆圆心的x，第一个小圆圆心的y，要绘制的数字,画布
function renderDigit(x,y,num,cxt){
	cxt.fillStyle = "#0088cc";
	for (var i=0;i<digit[num].length;i++){ //行
		for(var j=0;j<digit[num][i].length;j++){ //列
			if(digit[num][i][j] == 1){
				cxt.beginPath();
				cxt.arc(x+j*2*(RADIUS+1)+(RADIUS+1),y+i*2*(RADIUS+1)+(RADIUS+1),RADIUS,0,2*Math.PI);
				cxt.closePath();

				cxt.fill();
			}
		}
	}
		
			
}