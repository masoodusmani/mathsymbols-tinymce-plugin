var plugin = editor => {
  // Config:
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const elementClassName = 'tinymce-mathText';
  const mathMarkSymbolStart = '\\(';
  const mathMarkSymbolEnd = '\\)';
  let targetFrame;

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  editor.addButton('mathSymbols', {
    text: false,
    image:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJ' +
      'lYWR5ccllPAAAAQJJREFUeNpi/P//PwMlgImBQkCxASxgU5iwmmMBxCX4NP/79y+EBY+8PBCfAuIucr2gB8RHyA0DBSBWA+LzSIZtQcLR6AbsgOJ' +
      'YKN8YiC8B8XcoHyS+Eoh9gPgakjq4AR5A3AbEBlC+FRAfRHJRKRDvBuJ4aMDvw+aFM0CsBcQiUPoMVFwSavsEIDYEYiMgvozNgG9AfA6Ic6D0N6j' +
      '4FKh3IqAaWYF4O65A3AvEXlAaBmRBzoYmeVOoAVLwLICUFxiBmA+Ir0K9wQvEgkBcBhW7Cg2DjUC8CKQWpJcRTDAywgwAuWgSNNCYoQHGAhVngqr' +
      '5C8S/gfgPUO8nxgHPjQABBgBsa0S64vNBPgAAAABJRU5ErkJggg==',
    tooltip: 'Math Symbols',
    onclick: () => {
      openMathTextEditor(undefined, function(e) {
        // Insert content when the window form is submitted
        var value = e.data.title.trim();
        var element = tinymce.activeEditor.dom.create(
          'span',
          { class: elementClassName },
          getMathText(value)
        );

        editor.selection.setNode(element);
        /* editor.selection.setNode(
          tinymce.activeEditor.dom.create('span', null, '&#32;&nbsp;')
        ); */
      });
    }
  });

  editor.on('click', function(e) {
    if (e.target.className === elementClassName) {
      var element = e.target;
      const start =
        element.innerHTML.indexOf(mathMarkSymbolStart) +
        mathMarkSymbolStart.length;
      const end =
        element.innerHTML.indexOf(mathMarkSymbolEnd) - mathMarkSymbolEnd.length;

      var currentValue = element.innerHTML.substr(start, end);
      openMathTextEditor(currentValue, function(e) {
        // Insert content when the window form is submitted
        var value = e.data.title.trim();
        element.innerHTML = getMathText(value);
      });
    }
  });

  // Functions:
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  var openMathTextEditor = function(prevValue, submit) {
    prevValue = prevValue || '';

    // Open window
    editor.windowManager.open({
      title: 'mathSymbols plugin',
      width: 600,
      height: 300,
      body: [
        {
          type: 'container',
          html:
            '<p style="font-size: 14px">Use AsciiMath syntax: <a href="http://asciimath.org/#syntax" ' +
            'target="_blank">http://asciimath.org/#syntax</a></p>'
        },
        {
          type: 'textbox',
          name: 'title',
          label: 'Math content:',
          value: prevValue,
          onKeyUp: function(e) {
            var value = this.value().trim();

            if (value != prevValue) {
              UpdateMath(value, document.getElementById('MathTextOutput'));
              prevValue = value;
            }
          }
        },
        {
          type: 'container',
          html: '<iframe id="MathTextOutput" style="height: 200px"></iframe>',
          height: 200
        }
      ],
      onsubmit(e) {
        const MathJax = target.contentWindow.MathJax;
        const frame = document.getElementById('tinymce_ifr');

        // Insert content when the window form is submitted
        submit(e);
      }
    });

    // Adding Iframe - render the Math Text preview section.
    const target = document.getElementById('MathTextOutput');
    targetFrame =
      target.contentWindow ||
      (target.contentDocument.document || target.contentDocument);

    targetFrame.document.open();
    const html =
      '<!DOCTYPE html>' +
      '<html><head>' +
      '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.10.0-rc.1/dist/katex.min.css" integrity="sha384-D+9gmBxUQogRLqvARvNLmA9hS2x//eK1FhVb9PiU86gmcrBrJAQT8okdJ4LMp2uv" crossorigin="anonymous">' +
      '<script src="https://cdn.jsdelivr.net/npm/katex@0.10.0-rc.1/dist/katex.min.js" integrity="sha384-483A6DwYfKeDa0Q52fJmxFXkcPCFfnXMoXblOkJ4JcA8zATN6Tm78UNL72AKk+0O" crossorigin="anonymous"></script>' +
      '</script><style>html, body{font-size: 30px;}</style>' +
      '</head><div id="math"></div>' +
      "<script>katex.render('" +
      prevValue +
      "', document.getElementById('math'), { throwOnError: false })</script>" +
      '</html>';
    targetFrame.document.write(html);
    targetFrame.document.close();
  };

  // Update text and rerender the Math image.
  const UpdateMath = function(TeX, target) {
    // const MathJax = target.contentWindow.MathJax;
    const katex = target.contentWindow.katex;

    const mathWrapper = target.contentDocument.getElementById('math');

    // mathWrapper.style.visibility = 'hidden';
    mathWrapper.innerHTML = '';

    const el = document.createElement('span');
    el.className = 'math-text';
    el.innerHTML = katex.renderToString(TeX, { throwOnError: false });

    mathWrapper.appendChild(el);
    // katex.render(TeX, el, { throwOnError: false });
  };
  const getMathText = function(value) {
    return value ? mathMarkSymbolStart + value + mathMarkSymbolEnd : value;
  };
};

export default plugin;
