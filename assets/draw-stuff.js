// draw_grid( r stroke )
//
// Draws a grid of evenly spaced lines given the canvas and cell dimensions
// Only draws major lines at a constant spacing designated when the canvas
// is initialized

function draw_farm( rfill )
{
    // define vars from canvas attributes
    let sz = g_canvas.cell_size;
    let width = g_canvas.wid*sz;
    let height = g_canvas.hgt*sz
    background(rfill)

    // draw grid lines
    stroke( 'white' );
    for ( var ix = 0; ix < width; ix += sz )
    {
        let line_wgt = 1;
        strokeWeight( line_wgt );
        line( ix, 0, ix, height );
    }
    for ( var iy = 0; iy < height; iy += sz )
    {
        let line_wgt = 1;
        strokeWeight( line_wgt );
        line( 0, iy, width, iy );
    }

    // draw river and bridge cells
    strokeWeight(0);
    fill('blue')
    for(var i = 1; i <= 15; i++) {
      var xpos = (i);
      var ypos = (16 - i);
      // draw inside the grid lines:
      // shift over 0.5px, decrease h and w by 1.25px
      rect(xpos*sz + 0.5, ypos*sz + 0.5, sz - 1.25, sz - 1.25)
    }
    for(var i = 1; i <= 14; i++) {
      var xpos = (i);
      var ypos = (15 - i);
      // draw inside the grid lines:
      // shift over 0.5px, decrease h and w by 1.25px
      rect(xpos*sz + 0.5, ypos*sz + 0.5, sz - 1.25, sz - 1.25)
    }
    // bridges
    fill(rfill)
    rect(5*sz + 0.5, 10*sz + 0.5, sz - 1.25, sz - 1.25)
    rect(6*sz + 0.5, 10*sz + 0.5, sz - 1.25, sz - 1.25)
    rect(11*sz + 0.5, 5*sz + 0.5, sz - 1.25, sz - 1.25)
    rect(10*sz + 0.5, 5*sz + 0.5, sz - 1.25, sz - 1.25)

    // draw mine cave-in
    // black rectangle first
    stroke(0);
    fill('black');
    rect(14*sz + 0.5, 11*sz + 0.5, 5*sz - 1, 4*sz - 1);
    // now some fancy yellow caution lines
    stroke('yellow')
    strokeWeight(1)
    //line(26*sz , 15.5*sz, 26.5*sz, 17*sz)
    for(var i = 0; i <= 3; i++) {
      line(14*sz , (11+i)*sz, 19*sz, (12+i)*sz)
    }
    //line(29.5*sz , 14*sz, 30*sz, 15.5*sz)

    // draw barn location
    stroke(255);
    strokeWeight(1)
    fill('red')
    rect(19*sz + 0.5, 19*sz + 0.5, sz - 1.25, sz - 1.25)

}
