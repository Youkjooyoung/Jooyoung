// /javascript/preview.js
(function(w, d, $) {
  'use strict'; if (!$) return;

  var selected = [];

  function keyOf(f) { return [f.name, f.size, f.lastModified].join('|'); }
  function merge(files) {
    var seen = {};
    for (var i = 0; i < selected.length; i++) seen[keyOf(selected[i])] = true;
    for (var j = 0; j < files.length; j++) {
      var f = files[j], k = keyOf(f);
      if (!seen[k]) { selected.push(f); seen[k] = true; }
    }
  }

  function render() {
    var $wrap = $('#preview-container'); if (!$wrap.length) return;
    $wrap.empty();

    selected.forEach(function(file, idx) {
      var $item = $('<div class="preview-item">');
      var $img = $('<img class="preview-img" alt="preview">');
      var $btn = $('<button type="button" class="preview-remove" title="삭제">✖</button>')
        .attr('data-idx', idx);

      var r = new FileReader();
      r.onload = function(e) { $img.attr('src', e.target.result); };
      r.readAsDataURL(file);

      $item.append($img, $btn);
      $wrap.append($item);
    });
  }

  $(function() {
    var $file = $('#uploadFiles'); if (!$file.length) return;

    $file.on('change', function(e) {
      var files = e.target.files || [];
      merge(files);
      render();
      this.value = ''; // 같은 파일 다시 선택 가능하게 초기화
    });

    $(d).on('click', '.preview-remove', function() {
      var idx = +$(this).attr('data-idx');
      if (idx >= 0 && idx < selected.length) {
        selected.splice(idx, 1);
        render();
      }
    });

    // 달력 아이콘 클릭 → date input focus/showPicker
    $(d).on('click', '.btn-calendar', function() {
      var $input = $('input[name="manuDate"]')[0];
      if ($input) {
        if ($input.showPicker) $input.showPicker();
        else $input.focus();
      }
    });
  });

  // 외부에서 선택 파일 가져오기
  w.AppPreview = { getFiles: function() { return selected.slice(); } };

})(window, document, window.jQuery);
