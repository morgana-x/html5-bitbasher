//const input_bar_default = [0,0];
var input= [0,0,0];//[0,0,0,0];
var inputindex = 0;
var bps = 220//250; // beat per second in milliseconds
var nextInput = performance.now();
var timeFreeze = false;
var timeFreezeActions = [];
var timeFreezeActionText = "";
var timeFast = false;
function tick_input()
{
    if (performance.now() < nextInput) return
        
    nextInput = performance.now() + (!timeFreeze && timeFast ? bps/4:bps);

    if (inputindex >= 0)
        inputindex--;
    if (inputindex == -1)
        inputindex = input.length+1;
    if (inputindex != 0) return;
    timeFast = false;
        // call input thing here
    game_input(input);
    
    for (var i=0;i<input.length;i++)
        input[i] = 0;

    if (timeFreeze || timeFreezeActions.length <= 0) return;
    for (var i=0;i<input.length;i++)
        input[i] = timeFreezeActions[0][i];
    timeFreezeActions.splice(0,1);
    console.log(timeFreezeActions);
    timeFast = true;
    console.log(input);
    console.log("Doing time action?");
    
        
}

function toggle_timefreeze()
{
    if (!timeFreeze && timeFreezeActions.length > 0) return;
    timeFreeze = !timeFreeze;
    timeFreezeActionText = "";

}
function array_clone(arr)
{
    var copy = []
    for (i = 0; i < arr.length; i++) {
        copy[i] = arr[i];
      }
    return copy;
}
function game_input(inp)
{
    
    var num = 0;
    for (var i=inp.length-1; i>= 0;i--)
        num += (inp[i]*Math.pow(2, inp.length-1-i));
    if (num == 7)
    {
        toggle_timefreeze()
        return;
    }
    if (timeFreeze)
    {
        if (num  == 0) return;
        timeFreezeActions.push(array_clone(inp));
        inp.forEach(a =>{timeFreezeActionText +=a});
        return;
    }
    switch(num)
    {
        case 0:

            break;
        case 4: //100
            console.log("Input 1")
            player_entity.anim(6);
            player_entity.jump(1);
            break;
        case 1: //001
            console.log("Input 1")
            player_entity.anim(7);
            player_entity.right(4);
            break;
        case 2: //010
            player_entity.anim(7);
            player_entity.left(4);
            break;
        case 6:
            player_entity.anim(6);
            player_entity.jump(1);
            player_entity.left(4);
            break;
        case 5:
            player_entity.anim(6);
            player_entity.jump(1);
            player_entity.right(4);
            break;

    }
}

function game_input_detect(e)
{
    if (inputindex>0 && inputindex <= input.length)
        input[inputindex-1]=1;
}
document.addEventListener("keydown", game_input_detect,true);
document.addEventListener("click", game_input_detect,true);