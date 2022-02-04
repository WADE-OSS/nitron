/*!
 * Nitron.js v0.0.5
 * (c) 2022 WADE Open Source Software and Nitron Team.
 * Released under the MIT License.
 */
class NitronDOM {
    constructor() {};
    render(HTML, queryinsertion) {
      if(HTML.includes('<>')){
        HTML = HTML.replace('<>', '<div>');
      }
      // var DOMName = 'Google'
      // HTML = HTML.replace(new RegExp(`<${DOMName} ?\\/>`,"g"),`<dom-${DOMName.toLowerCase()}></dom-${DOMName.toLowerCase()}>`)

      // var word = "Q";
      // console.log(word[0] === word[0].toUpperCase());
      
      queryinsertion.innerHTML = HTML;
    };
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
}
const nitronDOM = new NitronDOM();

class Nitron {
  constructor() {};
  component(elementName, ComponentOptions){
    var Name = "";
    if(elementName.includes('-')){
      Name = elementName
    }else{
      Name = `dom-${elementName}`
    }
    customElements.define(`${Name}`, class extends HTMLElement {
      connectedCallback() {
        if (ComponentOptions.return) {
          if (this.getAttributeNames()) {
            const AttrNames = this.getAttributeNames();
            var optionsreturn = ComponentOptions.return;
            AttrNames.forEach(attr => {
              let val = this.getAttribute(attr);
              optionsreturn = optionsreturn.replace(new RegExp(`\{\{ ?${attr} ?\}\}`,"g"), val);
            });
            this.outerHTML = optionsreturn;
          } else {
            this.outerHTML = ComponentOptions.return
          }
        }
      }
    });
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

function styles(style="") {
  const name = nitron.randomClassName()
  nitron.style(`.${name}`,style)
  if(style.style){
    nitron.style(`.${name}`,style.style)
  };
  if(style.type){
    Object.keys(style.type).forEach(x =>
      nitron.style(`.${name}:${x}`,style.type[x])
    )
  };
  if(style.media){
    var mediaquery = window.matchMedia(`screen and (${style.media.size})`);

    if (mediaquery.matches) {
      nitron.style(`.${name}`,style.media.style);
      if(style.media.type){
        Object.keys(style.media.type).forEach(x =>
          nitron.style(`.${name}:${x}`,style.media.type[x])
        )
      };
    }

    mediaquery.addListener((a) => {
      if(a.matches === true){
         nitron.style(`.${name}`,style.media.style)
        if(style.media.type){
          Object.keys(style.media.type).forEach(x =>
            nitron.style(`.${name}:${x}`,style.media.type[x])
          )
        }
      }else{
        if(style.style){
          nitron.style(`.${name}`,style.style)
          if(style.type){
            Object.keys(style.type).forEach(x =>
              nitron.style(`.${name}:${x}`,style.type[x])
            )
          };
        };
      }
    });
  };
  return name
};

const nitron = new Nitron();
  
var placeholders = function (template, data) {'use strict';
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