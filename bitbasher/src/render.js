const canvas = document.getElementById("render_canvas");

const ctx = canvas.getContext('2d');
const c = ctx;
canvas.width = innerWidth;
canvas.height = innerHeight;

function render_input_bar()
{
    var barNum = input.length+2;
    var barWidth = canvas.width/15;
    var fontSize =  Math.floor( barWidth);
    var barGap = 5;
    var posX = (canvas.width/2) - ((barWidth*barNum)/2)
    var posY = (canvas.height/1.15) - (barWidth/2)
    for(var i=0;i<barNum;i++)
    {
        c.fillStyle=  inputindex == (i) ? 'white' : 'gray';
        var x=  posX + (i * (barWidth+barGap))
        c.fillRect(x, posY, barWidth, barWidth);
        if(i < 1 || i >= input.length+1) continue;
        c.fillStyle='black';
        c.font =+ fontSize+ "px serif";
        c.fillText(input[i-1] ,x+fontSize/4, posY + fontSize/1.25 );
    }
}
function render_ents(scale=1)
{
    entities.forEach(ent => {
        //console.log(ent);
        ent.draw(ctx, canvas);
    });
}
var bgImg = document.getElementById("bg10");
function render(){
	c.clearRect(0,0,canvas.width,canvas.height)
    c.fillStyle = 'black';
    c.fillRect(0,0, canvas.width, canvas.height);
    c.fillStyle = 'white';
    c.drawImage( bgImg, 0,0, canvas.width,canvas.height );
    render_level(canvas,c);
    if (timeFreeze)
    {
        c.fillStyle="rgb(0,0,0,0.5)"
        c.fillRect(0,0,canvas.width,canvas.height);
    }
    render_ents(1);
    if (timeFreeze)
    {
	c.font = "48px serif";
	c.fillStyle = 'gray';
	c.fillText("TimeFreeze: " + timeFreezeActionText, 10, 50);
    }
    render_input_bar();
}