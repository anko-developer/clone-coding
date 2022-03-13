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
  let enterNewScene = false; // 새로운 scene이 시작된 순간 true

  // scroll scene에 대한 정보를 객체에 담는다
  const sceneInfo = [
    {
      // 0
      type: 'sticky', // sticky, normal 두가지 type을 갖는다.
      heightNum: 5, // 브라우저 높이의 5배로 scrollHeight를 setting
      scrollHeight: 0, // 각 구간의 스크롤 높이를 갖는 값
      objs: {
        // html dom 객체
        container: document.querySelector('#scroll-section-0'),
        messageA: document.querySelector('#scroll-section-0 .main-message--a'),
        messageB: document.querySelector('#scroll-section-0 .main-message--b'),
        messageC: document.querySelector('#scroll-section-0 .main-message--c'),
        messageD: document.querySelector('#scroll-section-0 .main-message--d')
      },
      values: {
        // message에 어떤 값을 줄 것인지 설정
        // 시작과 끝나는 opacity 값을 넣어주었다, 객체 start, end는 비율로 넣었기 때문에 소숫점으로 처리
        messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }], // 0.1 ~ 0.2 에 나타나고
        // messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
        messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
        messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }], // 0.25 ~ 0.3 에서 사라진다
        messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
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
      sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
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

    document.body.setAttribute('id', `show-scene-${currentScene}`);
  }

  /**
   * sceneInfo array의 values를 control
   * @param values - sceneInfo array의 values
   * @param currentYOffset - window.pageYOffset - 활성된 이전 scene들의 총 height 값을 빼주면 활성된 scene에서 얼마나 스크롤 됐는지 계산 됨
   */
  function calcValues(values, currentYOffset) {
    let returnValue;
    // 현재 활성화된 scene에서 스크롤이 얼마나 진행 됐는지 비율로 계산
    const scrollRatio = currentYOffset / sceneInfo[currentScene].scrollHeight;
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    
    // start와 end 시점이 있는 경우 분기처리
    if (values.length === 3) { // values 
      const partScrollStart = values[2].start * scrollHeight;
      const partScrollEnd = values[2].end * scrollHeight;
      const partScrollHeight = partScrollEnd - partScrollStart;

      if (currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {
        returnValue = (currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];
      } else if (currentYOffset < partScrollStart) {
        returnValue = values[0];
      } else if (currentYOffset > partScrollEnd) {
        returnValue = values[1];
      }
    } else {
      // 현재 씬의 전체 범위에서 지금 스크롤 된 비율을 계산
      returnValue = scrollRatio * (values[1] - values[0]) + values[0];
    }

    return returnValue;
  }

  // scoll animation
  function playAnimation() {
    const objs = sceneInfo[currentScene].objs;
    const values = sceneInfo[currentScene].values;
    const currentYOffset = yOffset - preScrollHeight; // window.pageYOffset - 활성된 이전 scene들의 총 height 값을 빼주면 활성된 scene에서 얼마나 스크롤 됐는지 계산 됨
    const scrollHeight = sceneInfo[currentScene].scrollHeight; // 현재 씬의 scrollHeight
    const scrollRatio = currentYOffset / scrollHeight;

    switch (currentScene) {
      case 0:
        let messageA_opacity_in = calcValues(values.messageA_opacity_in, currentYOffset);
        let messageA_opacity_out = calcValues(values.messageA_opacity_out, currentYOffset);
        let messageA_translateY_in = calcValues(values.messageA_translateY_in, currentYOffset);
        let messageA_translateY_out = calcValues(values.messageA_translateY_out, currentYOffset);
        if (scrollRatio <= 0.22) {
          // in
          objs.messageA.style.opacity = messageA_opacity_in;
          objs.messageA.style.transform = `translateY(${messageA_translateY_in}%)`;
        } else {
          // out
          objs.messageA.style.opacity = messageA_opacity_out;
          objs.messageA.style.transform = `translateY(${messageA_translateY_out}%)`;
        }
        
        break;
      case 1:
        // console.log('1');
        break;
      case 2:
        // console.log('2');
        break;
      case 3:
        // console.log('3');
        break;
    }
  }

  // Scroll 활성 scene calc
  function scrollLoop() {
    enterNewScene = false;
    preScrollHeight = 0;
    for (let i = 0; i < currentScene; i++) {
      preScrollHeight += sceneInfo[i].scrollHeight;
    }

    if (yOffset > preScrollHeight + sceneInfo[currentScene].scrollHeight) {
      enterNewScene = true;
      currentScene++;
      document.body.setAttribute('id', `show-scene-${currentScene}`);
    }

    if (yOffset < preScrollHeight) {
      enterNewScene = true;
      if (currentScene === 0) return; // 모바일에서 스크롤 바운드 때 -1 값으로 넘어갈 수도 있기 때문에 처리
      currentScene--;
      document.body.setAttribute('id', `show-scene-${currentScene}`);
    }

    // scene이 바뀌는 순간에 enterNewScene에 true 값을 위에서 넣어줬고, 그때만큼은 여기서 함수를 종료(return) 시켜줘서 playAnimation()이 실행 안되게 처리
    if (enterNewScene) return;

    playAnimation();
  }

  window.addEventListener('scroll', () => {
    yOffset = window.pageYOffset;
    scrollLoop();
  });
  // window.addEventListener('DOMContentLoaded', setLayout); // DOM 만 읽어도 실행 됨
  window.addEventListener('load', setLayout); // 이미지까지 load 돼야 실행 됨, 우리는 이미지 크기가 컨텐츠에 영향을 미치니까 load로 사용
  window.addEventListener('resize', setLayout);

  setLayout();
})();
