require('./assets/scss/index.scss'); //sass 연결

// const DOM = {
//   body: "#Body",
// };

// $(DOM.body).append('<p>Webpack</p>');
// $(DOM.body).addClass('__block');
// $(DOM.body).css('background-color', '#ffd200');

// document.addEventListener('DOMContentLoaded', function () {
//   console.log('test');
// });

(() => {
  let yOffset = 0; // window.pageYOffset 대신 쓸 변수
  let preScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이 값의 합
  let currentScene = 0; // 현재 활성화 된(눈 앞에 보고있는) 씬(scroll-section)

  // scroll scene에 대한 정보를 객체에 담는다
  const sceneInfo = [
    {
      // 0
      type: 'sticky', // sticky, normal 두가지 type을 갖는다.
      heightNum: 5, // 브라우저 높이의 5배로 scrollHeight를 setting
      scrollHeight: 0, // 각 구간의 스크롤 높이를 갖는 값
      objs: {
        container: document.querySelector('#scroll-section-0')
      }
    },
    {
      // 1
      type: 'normal',
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-1')
      }
    },
    {
      // 2
      type: 'sticky',
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-2')
      }
    },
    {
      // 3
      type: 'sticky',
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-3')
      }
    }
  ];

  // Layout setting function
  function setLayout() {
    // 각 스크롤 섹션의 height setting
    for (let i = 0; i < sceneInfo.length; i++) {
      sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
      sceneInfo[
        i
      ].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
    }

    yOffset = window.pageYOffset;

    let totalScrollHeight = 0;
    for (let i = 0; i < sceneInfo.length; i++) {
      totalScrollHeight += sceneInfo[i].scrollHeight;

      // 현재 스크롤 y offset 값과 같거나 커지면 반복문을 break하고 currentScene에 값을 넣어 줌
      if (totalScrollHeight >= yOffset) {
        currentScene = i;
        break;
      }
    }
  }

  // Scroll Calc
  function scrollLoop() {
    preScrollHeight = 0;
    for (let i = 0; i < currentScene; i++) {
      preScrollHeight += sceneInfo[i].scrollHeight;
    }

    if (yOffset > preScrollHeight + sceneInfo[currentScene].scrollHeight) {
      currentScene++;
      // document.body.setAttribute('id', `show-scene-${currentScene}`);
    }
    if (yOffset < preScrollHeight) {
      if (currentScene === 0) return; // 모바일에서 스크롤 바운드 때 -1 값으로 넘어갈 수도 있기 때문에 처리
      currentScene--;
      // document.body.setAttribute('id', `show-scene-${currentScene}`);
    }

    document.body.setAttribute('id', `show-scene-${currentScene}`);
  }

  window.addEventListener('scroll', () => {
    yOffset = window.pageYOffset;
    scrollLoop();
  });
  // window.addEventListener('DOMContentLoaded', setLayout); // DOM 만 읽어도 실행 됨
  window.addEventListener('load', setLayout); // 이미지까지 load 돼야 실행 됨
  window.addEventListener('resize', setLayout);

  setLayout();
})();
