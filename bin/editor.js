// Generated by CoffeeScript 1.10.0
(function() {
  var callbackWithCanvas, lastChart, lastSource, update;

  lastSource = '';

  lastChart = null;

  update = function() {
    var source, svg;
    source = $('#source').val().replace(/\s+$/, '');
    if ($('#grid').prop('checked')) {
      source += "\n@grid on\n";
    }
    if (lastSource === source) {
      return;
    }
    lastSource = source;
    lastChart = new TimingChart();
    svg = lastChart.parse(source);
    return $('#result').html(svg);
  };

  callbackWithCanvas = function(f) {
    var canvas, img;
    canvas = document.createElement('canvas');
    canvas.width = lastChart.width;
    canvas.height = lastChart.height;
    img = new Image();
    img.onload = function() {
      var ctx;
      ctx = canvas.getContext("2d");
      ctx.fillStyle = $('#background').val();
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      return f(canvas);
    };
    return img.src = "data:image/svg+xml;base64," + btoa(lastChart.svg);
  };

  $(function() {
    setInterval(update, 100);
    $('#grid').on('click', function() {
      return update();
    });
    $('#as_svg').on('click', function() {
      var blob;
      update();
      blob = new Blob([lastChart.svg], {
        type: "image/svg+xml"
      });
      return saveAs(blob, 'timing-chart.svg');
    });
    $('#as_png').on('click', function() {
      update();
      return callbackWithCanvas(function(canvas) {
        return canvas.toBlob(function(blob) {
          return saveAs(blob, "timing-chart.png");
        });
      });
    });
    return $('#for_copy').on('click', function() {
      var textarea;
      $('#images>*').remove();
      update();
      $('#images').append($('<h2>').html('SVG Source'));
      textarea = $('<textarea cols="60" rows="3">').val(lastChart.svg);
      $('#images').append(textarea);
      textarea.focus();
      textarea.select();
      $('#images').append($('<h2>').html('PNG Image'));
      return callbackWithCanvas(function(canvas) {
        return $('#images').append($('<img>').attr('src', canvas.toDataURL()));
      });
    });
  });

}).call(this);
