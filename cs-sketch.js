// cs-sketch.js; P5 key animation fcns.  // CF p5js.org/reference
// Time-stamp: <2020-02-17 19:15:08 Chuck Siska>

// ============================================================ Mods ====
// to 2020-02-10 16:42:24: add btns.
// to 2020-02-09 16:55:21: add btn onclick exported fn
// to 2020-02-10 17:22:23: log btn onclick

// Make global g_canvas JS 'object': a key-value 'dictionary'.
var g_canvas; // JS Global var, w canvas size info.
var g_frame_cnt; // Setup a P5 display-frame counter, to do anim
var g_frame_mod; // Update ever 'mod' frames.
var g_stop; // Go by default.
var g_cnv;   // To hold a P5 canvas.
var g_button; // btn
var g_button2; // btn
var g_plot_locations; // manually chosen plot locations
var g_step = 0; //step counter
var g_day = 1; //day counter
var g_plants = []; //array of plants()
var g_total_harvest = 0;

var g_l4job = { id:1 }; // Put Lisp stuff for JS-to-access in ob; id to make ob.
var g_nature = {id:2};

function save_image( ) // btn
{
    save('myCanvas-' + g_frame_cnt +  '.jpg');
}

function setup() // P5 Setup Fcn
{
    g_canvas = { cell_size:20, wid:40, hgt:40 }; // 40x40 grid, cell size 20px
    g_frame_cnt = 0; // initialize frame count
    g_frame_mod = 10; // update frams for drawing
    g_stop = 0; // set stop # of frames

    let sz = g_canvas.cell_size;
    let width = sz * g_canvas.wid;  // Our 'canvas' uses cells of given size, not 1x1.
    let height = sz * g_canvas.hgt;
    g_cnv = createCanvas( width, height );  // Make a P5 canvas.
    draw_farm('black'); // call draw grid function
    create_plants();
    for (var i = 0; i < g_plants.length; i++) {
      g_plants[i].show()
    }

}

// define Bots
class Bot {
  constructor(dir, x, y, color) {
    this.dir = dir;
    this.x = x;
    this.y = y;
    this.color = color;
    this.fruit = 0;
    this.plots = 20;
    this.water = 0;
    this.fertilizer = 0;
    this.isWatering = false;
    this.isPlotting = false;
    this.isHarvesting = false;
    this.needsSupplies = false;
  }

  needsSupplies() {
    return (this.plots == 0 && this.water == 0 && this.fertilizer == 0)
  }

  reStock() {
    this.plots = 20;
    this.water = 20;
    this.fertilizer = 5;
    this.needsSupplies = false;
  }
}

var g_fz1 = new Bot(0, 17, 19, 'white'); // Dir is 0..7 clock, w 0 up.
var g_fz2 = new Bot(2, 19, 19, 'orange');
var g_fz3 = new Bot(4, 18, 19, 'teal' );
var g_fz4 = new Bot(6, 16, 19, 'purple');
//var g_box = { t:1, hgt:47, l:1, wid:63 }; // Box in which bot can move.
var g_barn = { x:20, y:20, smudge_pots:3};

class Nature {
  constructor() {
    this.day = g_day;
    this.clouds = false; // if false; sky is clear.
    this.rain = false;
    this.wind = false;
    this.wind_dir = 0; // 0 = N; 1 = E; 2 = S; 3 = W;
  }

  reset() {
    this.clouds = false; // if false; sky is clear.
    this.rain = false;
    this.wind = false;
    this.wind_dir = 0; // 0 = N; 1 = E; 2 = S; 3 = W;
  }

  print() {
    var str;
    if(this.clouds) {str = "Cloudy";}
    else {str = "Clear";}
    console.log("\nRunning Nature:")
    console.log("Sky: ", str)

    if(this.rain) {str = "Yes";}
    else {str = "No";}
    console.log("Rain: ", str)

    if(this.wind) {
      console.log("Wind: Yes")
      var direction;
      if (this.wind_dir == 0) { direction = "North" }
      else if (this.wind_dir == 1) { direction = "East"}
      else if (this.wind_dir == 2) { direction = "South"}
      else {direction = "West"}
      console.log("Wind direction: ", direction)
      }
    else {console.log("Wind: No")}
    console.log("Effects: ")
    if(this.clouds) {console.log("All plants growth halted for the day")}
    if (this.rain) {console.log("All plants water level incremented by one")}
    else {console.log("All plants water level deremented by one.")}
    console.log("End nature\n")
  }
}

var nature = new Nature();

function csjs_get_pixel_color_sum( rx, ry )
{
    let acolors = get( rx, ry ); // Get pixel color [RGBA] array.
    let sum = acolors[ 0 ] + acolors[ 1 ] + acolors[ 2 ]; // Sum RGB.
    //dbg console.log( "color_sum = " + sum );
    return sum;
}

function draw_update()  // Update our display.
{

    //console.log(g_fz1.x, g_fz1.y)
    //console.log(g_fz2.x, g_fz2.y)
    //console.log(g_fz3.x, g_fz3.y)
    //console.log(g_fz4.x, g_fz4.y)
    g_l4job.draw_fn( );
    for (var i = 0; i < g_plants.length; i++) {
      g_plants[i].show()
    }
}

function draw()  // P5 Frame Re-draw Fcn, Called for Every Frame.
{
    ++g_frame_cnt;
    if (0 == g_frame_cnt % g_frame_mod)
    {
        g_step = (g_step + 1) % 41;
        document.getElementById("stepCounter").innerHTML = g_step;
        document.getElementById("totalHarvest").innerHTML = g_total_harvest;
        if (g_step == 0) {
          g_nature.run_nature();
          ++g_day;
         }
        document.getElementById("dayCounter").innerHTML = g_day;
        if (!g_stop) { draw_update();}
      }
}

//PLANTS
// water level:
// 1 = brown
// 2 = yellow
// 3 = green
class Plant {

  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.waterLevel = 3;
    this.fruitingState = 0; // 1 = flowering; 2 = green fruit; 3 = red fruit
    this.hasSeed = false;
    this.hasFert = false;
    this.tobeVisited = false
    this.visited = false
  }

  dead() {
    this.waterLevel = 3;
    this.fruitingState = 0; // 1 = flowering; 2 = green fruit; 3 = red fruit
    this.hasSeed = false;
    this.hasFert = false;
    this.tobeVisited = false
    this.visited = false
  }

  show() {
    let sz = g_canvas.cell_size;

    if (!this.visited) {
      stroke('green')
      fill('black')
      strokeWeight(2)
    } else if (this.visited && this.fruitingState == 1) {
      stroke('green')
      fill('pink')
      strokeWeight(2)
    } else if (this.visited && this.fruitingState == 2) {
      stroke('green')
      fill(color('#0f0'))
      strokeWeight(2)
    } else if (this.visited && this.fruitingState >= 3 && this.fruitingState <= 5) {
      stroke('green')
      fill('red')
      strokeWeight(2)
    } else if (this.visited && this.fruitingState >= 6) {
      stroke('green')
      fill('black')
      strokeWeight(2)
      this.dead()
    } else if (this.visited && this.waterLevel == 3) {
      stroke('green')
      fill('green')
      strokeWeight(2)
    } else if (this.visited && this.waterLevel == 2) {
      stroke('green')
      fill('yellow')
      strokeWeight(2)
    } else if (this.visited && this.waterLevel == 1) {
      stroke('green')
      fill('brown')
      strokeWeight(2)
    } else if (this.visited && this.waterLevel == 0) {
      stroke('green')
      fill('black')
      strokeWeight(2)
    }
    rect(this.x*sz+0.5, this.y*sz+0.5, sz-1.25, sz-1.25);
  }

  markVisited() {this.visited == true}
  incWater() {
    if (this.visited && this.waterLevel < 3) {
      this.waterLevel += 1;
    }
  }
  decWater() {
    if (this.visited && this.waterLevel > 0) {
      this.waterLevel -= 1;
    }
  }
}

function create_plants() {

  var plot_locations = [[4, 2], [23, 2], [30, 4], [31, 7], [26, 7], [22, 7], [11, 7],
                   [8, 10], [31, 10], [22, 10], [25, 13], [13, 14], [9, 13],
                   [10, 16], [5, 16], [25, 16], [38, 16], [31, 15], [34, 19], [28, 18],
                   [25, 19], [13, 18], [10, 19], [4, 20], [7, 22], [7, 38], [13, 22],
                   [25, 38], [28, 22], [31, 38], [4, 36], [3, 25], [10, 36], [16, 25],
                   [19, 37], [22, 25], [25, 25], [28, 25], [34, 25], [5, 28], [8, 28],
                   [14, 28], [19, 28], [19, 22], [22, 28], [28, 28], [32, 28], [38, 28],
                   [4, 31], [10, 31], [16, 31], [22, 31], [28, 31], [34, 31], [7, 34],
                   [13, 34], [19, 34], [25, 34], [31, 34]];

  for (var i = 0; i < plot_locations.length; i++) {
    temp_plant = new Plant(plot_locations[i][0], plot_locations[i][1]);
    g_plants.push(temp_plant);
  }
}

function checkHarvest() {
  for (var i = 0; i < g_plants.length; ++i) {
    if (g_plants[i].fruitingState >= 3) {return true}
  }
  return false;
}
