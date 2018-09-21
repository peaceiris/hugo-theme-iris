$pointer = $('.pointer');
var trail = [];
var $trail = $('#trail');
var mouse = { X: 0, Y: 0 };

$('body').bind('touchmove', function (ev) {
  ev.preventDefault();
});

$(window).on('mousemove touchmove', function (e) {
  $pointer.offset({
    top: e.pageY,
    left: e.pageX });

  mouse.X = e.pageX + 4;
  mouse.Y = e.pageY + 4;
});

for (var i = 0; i < 12; i++) {
  trail.push({
    X: mouse.X,
    Y: mouse.Y });

}

function draw() {
  var x = mouse.X,
  y = mouse.Y;


  for (var _i = 0; _i < 12; _i++) {
    var nextDot = trail[_i + 1] || trail[0];
    trail[_i].X = x;
    trail[_i].Y = y;

    x += (nextDot.X - x) * .3;
    y += (nextDot.Y - y) * .3;
  }

  var dx = mouse.X - trail[1].X,
  dy = mouse.Y - trail[1].Y;


  var $gradient = $('#linear'),
  x1 = 0,
  y1 = 0,
  x2 = 0,
  y2 = 0;


  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0) {
      x2 = 1;
    } else {
      x1 = 1;
    }
  } else {
    if (dy > 0) {
      y2 = 1;
    } else {
      y1 = 1;
    }
  }

  $gradient.
  attr('x1', x1).
  attr('y1', y1).
  attr('x2', x2).
  attr('y2', y2);

  M = 'M ' + trail[11].X + ', ' + trail[11].Y + ' ';
  C = 'C ' + trail[6].X + ', ' + trail[6].Y + ' ' + trail[6].X + ', ' + trail[6].Y + ' ' + trail[5].X + ', ' + trail[5].Y + ' ';
  S = 'S ' + trail[2].X + ', ' + trail[2].Y + ' ' + trail[1].X + ', ' + trail[1].Y + ' ' + trail[1].X + ', ' + trail[1].Y + ' ' + mouse.X + ', ' + mouse.Y;
  $trail.attr('d', M + C + S);
}

function animate() {
  draw();
  requestAnimationFrame(animate);
}

animate();