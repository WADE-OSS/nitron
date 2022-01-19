var data = {
  hi:"Hello, world!",
  info:{
    hi:'"많은 프로그래밍 언어 서적에서 맨 처음 소개하는 예제. Hello, world!를 출력하는 것이 프로그래밍 언어를 배우는 첫 번째 단계로 일종의 암묵적인 룰이 되었다/'
  }
};

const element = function (){
return `
    <h1>{{ hi }}</h1>
    <h2>{{ info.hi }}</h2>
`};

nitronDOM.render(placeholders(element,data),document.getElementById("root"));
