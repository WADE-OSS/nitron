/*!
 * Nitron.js v0.0.1
 * (c) 2022 WADE Open Source Software and Nitron Team.
 * Released under the MIT License.
 */
class NitronDOM {
  constructor() {};
  render(code, queryinsertion) {
    queryinsertion.innerHTML = code;
  };
}
const nitronDOM = new NitronDOM();

class Nitron {
  constructor() {};
  renderXML(url,get) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
           if (xmlhttp.status == 200) {
                document.querySelector(get).innerHTML = xmlhttp.responseText;
           }
           else if (xmlhttp.status == 400) {
              alert('There was an error 400');
           }
           else {
               alert('something else other than 200 was returned');
           }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  };
  ClassName(classname, classnamelist){
    document.querySelector(classname).classList = classnamelist
  };
  randomClassName() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'
    const stringLength = 8
    let randomstring = ''
    for (let i = 0; i < stringLength; i++) {
      const rnum = Math.floor(Math.random() * chars.length)
      randomstring += chars.substring(rnum, rnum + 1)
    }
    return randomstring
  };
  style(selector, style) {
    if (!document.styleSheets) return;
    if (document.getElementsByTagName('head').length == 0) return;
  
    var styleSheet,mediaType;
  
    if (document.styleSheets.length > 0) {
      for (var i = 0, l = document.styleSheets.length; i < l; i++) {
        if (document.styleSheets[i].disabled)
          continue;
        var media = document.styleSheets[i].media;
        mediaType = typeof media;
  
        if (mediaType === 'string') {
          if (media === '' || (media.indexOf('screen') !== -1)) {
            styleSheet = document.styleSheets[i];
          }
        }
        else if (mediaType=='object') {
          if (media.mediaText === '' || (media.mediaText.indexOf('screen') !== -1)) {
            styleSheet = document.styleSheets[i];
          }
        }
  
        if (typeof styleSheet !== 'undefined')
          break;
      }
    }
    if (typeof styleSheet === 'undefined') {
      var styleSheetElement = document.createElement('style');
      document.getElementsByTagName('head')[0].appendChild(styleSheetElement);
  
      for (i = 0; i < document.styleSheets.length; i++) {
        if (document.styleSheets[i].disabled) {
          continue;
        }
        styleSheet = document.styleSheets[i];
      }
  
      mediaType = typeof styleSheet.media;
    }
  
    if (mediaType === 'string') {
      for (var i = 0, l = styleSheet.rules.length; i < l; i++) {
        if(styleSheet.rules[i].selectorText && styleSheet.rules[i].selectorText.toLowerCase()==selector.toLowerCase()) {
          styleSheet.rules[i].style.cssText = style;
          return;
        }
      }
      styleSheet.addRule(selector,style);
    }
    else if (mediaType === 'object') {
      var styleSheetLength = (styleSheet.cssRules) ? styleSheet.cssRules.length : 0;
      for (var i = 0; i < styleSheetLength; i++) {
        if (styleSheet.cssRules[i].selectorText && styleSheet.cssRules[i].selectorText.toLowerCase() == selector.toLowerCase()) {
          styleSheet.cssRules[i].style.cssText = style;
          return;
        }
      }
      styleSheet.insertRule(selector + '{' + style + '}', styleSheetLength);
    }
  };
};
function styles(style) {
  const name = nitron.randomClassName()
  nitron.style(`.${name}`,style)
  return name
};
class mediaclass {
  constructor() {};
  styles(style) {
    const name = nitron.randomClassName()
    if (matchMedia(`screen and (min-width: ${style.size})`).matches) {
      nitron.style(`.${name}`,style.style)
    } else {
      nitron.style(`.${name}`,style.media)
    }
    return name;
  };
}
const media = new mediaclass();
const nitron = new Nitron();

var placeholders = function (template, data) {
  'use strict';
  template = typeof (template) === 'function' ? template() : template;
  if (['string', 'number'].indexOf(typeof template) === -1) throw 'NitronDOM : please provide a valid template!';
  if (!data) return template;
  template = template.replace(/\{\{([^}]+)\}\}/g, function (match) {
    match = match.slice(2, -2);
    var sub = match.split('.');

    if (sub.length > 1) {
      var temp = data;

      sub.forEach(function (item) {
        var item = item.trim();
        if (!temp[item]) {
          temp = '{{' + match.trim() + '}}';
          return;
        }
        temp = temp[item];
      });
      return temp;
    }
    else {
      if (!data[match.trim()]) return '{{' + match.trim() + '}}';
      return data[match.trim()];
    }
  });
  return template;
};