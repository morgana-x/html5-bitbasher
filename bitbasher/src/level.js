levels = [];
current_level = 0;
current_tiles = [];
current_tiles_render = [];
function level_load(index)
{
    current_tiles = [];
    current_tiles_render = [];
    current_level = index;
    rows = levels[current_level].lvl_layout.split("\n");
    columnWidth = rows[0].length;
    var i =0;
    
    var size = levels[current_level].lvl_tile_size;
    for (y=0;y<rows.length;y++)
    {
        current_tiles.push([]);
        current_tiles_render.push([]);
        for (x=0; x< columnWidth;x++)
        {
            //console.log(levels[current_level].lvl_layout[i]);
            var t = Number("0x"+ rows[y][x]);
            var tx = (t%levels[current_level].lvl_tile_width) * size;
            var ty = (t/levels[current_level].lvl_tile_height) *size;
            current_tiles_render[y].push([tx,ty]);
            current_tiles[y].push( rows[y][x] )//levels[current_level].lvl_layout[i]);
            //i++;
        }
    }
    entities = [];
    player_entity = null;
    player_entity = new Player(sprites[0]);
    entities.push(player_entity)
    levels[current_level].lvl_enemies.forEach(enemy => {
        var e = new Enemy(sprites[enemy[0]])
        e.x = enemy[1];
        e.y = enemy[2];
        entities.push(e);
    });
    if (player_entity != null)
    {
        player_entity.x = levels[current_level].lvl_spawn[0];
        player_entity.y = levels[current_level].lvl_spawn[1];
    }
}
function render_level(canvas,ctx)
{ 
    var tile = levels[current_level].lvl_tile; 
    var size = levels[current_level].lvl_tile_size;
    var sizex = (canvas.width/size);
    //console.log(sizex);
    var bottom = canvas.height-(current_tiles.length*sizex)
    for (var y =0; y<current_tiles.length;y++)
    {
        for (var x =0; x < current_tiles[0].length; x++)
        {
            //var t = Number("0x"+ current_tiles[y][x]);
            if (current_tiles[y][x] == 0) continue;
            //t= t-1;
            var tx = current_tiles_render[y][x][0]//(t/levels[current_level].lvl_tile_width) * size;
            var ty = current_tiles_render[y][x][1]//(t%levels[current_level].lvl_tile_height) *size;
            //console.log(tx);
            ctx.drawImage(tile, tx, ty, size, size, x*sizex,bottom +(y*sizex), sizex, sizex );
        }
    };
}