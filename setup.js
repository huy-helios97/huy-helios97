//Khai báo biến
var ctx;
var map;
var openSet = [], closedSet = [];
var start = {
    x:1, 
    y:1, 
    f:0, 
    g:0
}; 

var neighbours;
var path;

function findNeighbour( array, n ) { // tìm trong mảng array có phần tử n hay không?
    var a;
    for( var i = 0; i < array.length; i++ ) {
        a = array[i]; //tron open hoặc closedSet
        if( n.x === a.x && n.y === a.y ) return i;
    }
    return -1;
}

function addNeighbours( current ) {
    var p;
    
    for(var i = 0; i < neighbours.length; i++) {
        var n = {
            x: current.x + neighbours[i].x, 
            y: current.y + neighbours[i].y, 
            g: 0, 
            h: 0, 
            part: {
                x:current.x, 
                y:current.y
            }
        };
        if( map[n.x][n.y] == 1 || findNeighbour( closedSet, n ) > -1 ) continue; //map[n.x][n.y] là có vật cản
        n.g = current.g + neighbours[i].c; 
        n.h = Math.abs( goal.x - n.x ) + Math.abs( goal.y - n.y );
        //n là object
        p = findNeighbour( openSet, n );
        if( p > -1 && openSet[p].g + openSet[p].h <= n.g + n.h ) continue;
        openSet.push( n );
    }
    openSet.sort( function( a, b ) {
            console.log(( a.g + a.h ) - ( b.g + b.h ));
            return ( a.g + a.h ) - ( b.g + b.h ); 
            
        }    
    );
}

function createPath() {
    path = [];
    var a, b;
    a = closedSet.pop();
    path.push( a );
    while( closedSet.length ) {
        b = closedSet.pop();
        if( b.x != a.part.x || b.y != a.part.y ) continue;
        a = b; 
        path.push( a );
    }
}

function solveMap() {
    drawMap();
    if( openSet.length < 1 ) {
        document.body.appendChild( document.createElement( "p" ) ).innerHTML = "Impossible!";
        return;
    }
    //Nút hiện tại lấy nút đầu tiên trong OpenSet
    var current = openSet.splice( 0, 1 )[0];
    //Push nút hiện tại vào ClosedSet
    closedSet.push( current );
    if( current.x == goal.x && current.y == goal.y ) {
        createPath(); 
        drawMap();
        return;
    }
    addNeighbours( current );
    requestAnimationFrame( solveMap );
}

function drawMap() {
    var i;
    var j;

    
    ctx.fillStyle = "#ee6"; 
    ctx.fillRect( 0, 0, 200, 200 );
    // for(j = 0; j < 100; j++) {
    //     for(i = 0; i < 100; i++) {
    //         ctx.fillStyle = "#ee6"; 
    //         ctx.strokeRect(i*4, j*4, 4, 4);
    //     }
    // }
    
    for(j = 0; j < mh; j++) {
        for(i = 0; i < mw; i++) {  
            switch( map[i][j] ) {
                case 0: continue;
                case 1: ctx.fillStyle = "#990"; break;
                // case 2: ctx.fillStyle = "#090"; break;
                // case 3: ctx.fillStyle = "#900"; break;
            }
            ctx.fillRect( i, j, 1, 1 );
        }
    }

    var a;
    if( path.length ) {
        var txt = "DONE!" + "<br/>" + "Path: " + ( path.length - 1 ) + "<br />[";
        for( var i = path.length - 1; i > -1; i-- ) {
            a = path[i];
            ctx.fillStyle = "#999";
            ctx.fillRect( a.x, a.y, 1, 1 );
            txt += "(" + a.x + ", " + a.y + ") ";
        }
        document.body.appendChild( document.createElement( "p" ) ).innerHTML = txt + "]";
        return;
    }

    for( var i = 0; i < openSet.length; i++ ) {
        a = openSet[i];
        ctx.fillStyle = "#909";
        ctx.fillRect( a.x, a.y, 1, 1 );
    }
    
    for( var i = 0; i < closedSet.length; i++ ) {
        a = closedSet[i];
        ctx.fillStyle = "#009";
        ctx.fillRect( a.x, a.y, 1, 1 );
    }
}

function createMap() {
    map = new Array( mw );
    for( var i = 0; i < mw; i++ ) {
        map[i] = new Array( mh );
        for( var j = 0; j < mh; j++ ) {
            if( !i || !j || i == mw - 1 || j == mh - 1) map[i][j] = 1;
            else {
                if( Math.random() < .2 ) map[i][j] = 1;
                else map[i][j] = 0;
            }
            //if(map[98][98] == 1) map[98][98] == 0;
        }
    }
}

function init() {
    var x = document.getElementById("number1").value;
    var y = document.getElementById("number2").value;

    document.getElementById("canvas").setAttribute("width",x);
    document.getElementById("canvas").setAttribute("height",y);

    // this.

    wid = x;
    hei = y;

    mw = Math.round(x*1/6);
    mh = Math.round(y*1/6);

    goal = {
        x: mw-2, 
        y: mh-2, 
        f:0,
        g:0
    };

    neighbours = [
        {x:1, y:0, c:1}, {x:-1, y:0, c:1}, {x:0, y:1, c:1}, {x:0, y:-1, c:1}, 
        {x:1, y:1, c:1.4}, {x:1, y:-1, c:1.4}, {x:-1, y:1, c:1.4}, {x:-1, y:-1, c:1.4}
    ];
    path = [];
    ctx = canvas.getContext("2d");
    ctx.scale( 6, 6 ); 
    ctx.strokeStyle = "#FF0000";
    createMap();
    openSet.push( start );
    solveMap();
    var canvas1 = document.getElementById("canvas");

    canvas1.addEventListener("click", function (evt) {
        var mousePos = getMousePos(canvas1, evt);
        alert(Math.round(mousePos.x*1/6) + ',' + Math.round(mousePos.y*1/6)); 
    }, false);

    //Get Mouse Position
    function getMousePos(canvas1, evt) {
        var rect = canvas1.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }
}

function hide() {

    var el1 = document.getElementById("number1");
    var el2 = document.getElementById("number2");
    var el3 = document.getElementById("bt");

        el1.style.display = 'none';
        el2.style.display = 'none';
        el3.style.display = 'none';
}

