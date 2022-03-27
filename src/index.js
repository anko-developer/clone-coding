require('./assets/scss/index.scss');

// const DOM = {
//   body: "#Body",
// };

// $(DOM.body).append('<p>Webpack</p>');
// $(DOM.body).addClass('__block');
// $(DOM.body).css('background-color', '#ffd200');

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
        messageA: document.querySelector('#scroll-section-0 .main-message.a'),
        messageB: document.querySelector('#scroll-section-0 .main-message.b'),
        messageC: document.querySelector('#scroll-section-0 .main-message.c'),
        messageD: document.querySelector('#scroll-section-0 .main-message.d'),
        canvas: document.querySelector('#video-canvas-0'),
        context: document.querySelector('#video-canvas-0').getContext('2d'),
        videoImages: []
      },
      values: {
        videoImageCount: 300, // 이미지 갯수
        imageSequence: [0, 299], // image sequence는 0번부터 299번까지
        canvas_opacity: [1, 0, { start: 0.9, end: 1 }],
        // message에 어떤 값을 줄 것인지 설정
        // 시작과 끝나는 opacity 값을 넣어주었다, 객체 start, end는 비율로 넣었기 때문에 소숫점으로 처리
        messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }], // 0.1 ~ 0.2 에 나타나고
				messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
				messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
				messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
				messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
				messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
				messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
				messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
				messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }], // 0.25 ~ 0.3 에서 사라진다
				messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
				messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
				messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
				messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
				messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],
				messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],
				messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }]
      }
    },
    {
      type: 'normal',
      // heightNum: 5, // type normal에서는 필요없어서 주석 처리
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-1'),
        content: document.querySelector('#scroll-section-1 .description')
      }
    },
    {
      type: 'sticky',
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-2'),
        messageA: document.querySelector('#scroll-section-2 .a'),
        messageB: document.querySelector('#scroll-section-2 .b'),
        messageC: document.querySelector('#scroll-section-2 .c'),
        pinB: document.querySelector('#scroll-section-2 .b .pin'),
        pinC: document.querySelector('#scroll-section-2 .c .pin'),
        canvas: document.querySelector('#video-canvas-1'),
        context: document.querySelector('#video-canvas-1').getContext('2d'),
        videoImages: []
      },
      values: {
        videoImageCount: 960, // 이미지 갯수
        imageSequence: [0, 959], // image sequence는 0번부터 959번까지
        canvas_opacity_in: [0, 1, { start: 0, end: 0.1 }],
        canvas_opacity_out: [1, 0, { start: 0.95, end: 1 }],
        messageA_translateY_in: [20, 0, { start: 0.15, end: 0.2 }],
        messageB_translateY_in: [30, 0, { start: 0.5, end: 0.55 }],
        messageC_translateY_in: [30, 0, { start: 0.72, end: 0.77 }],
        messageA_opacity_in: [0, 1, { start: 0.15, end: 0.2 }],
        messageB_opacity_in: [0, 1, { start: 0.5, end: 0.55 }],
        messageC_opacity_in: [0, 1, { start: 0.72, end: 0.77 }],
        messageA_translateY_out: [0, -20, { start: 0.3, end: 0.35 }],
        messageB_translateY_out: [0, -20, { start: 0.58, end: 0.63 }],
        messageC_translateY_out: [0, -20, { start: 0.85, end: 0.9 }],
        messageA_opacity_out: [1, 0, { start: 0.3, end: 0.35 }],
        messageB_opacity_out: [1, 0, { start: 0.58, end: 0.63 }],
        messageC_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
        pinB_scaleY: [0.5, 1, { start: 0.5, end: 0.55 }],
        pinC_scaleY: [0.5, 1, { start: 0.72, end: 0.77 }],
        pinB_opacity_in: [0, 1, { start: 0.5, end: 0.55 }],
        pinC_opacity_in: [0, 1, { start: 0.72, end: 0.77 }],
        pinB_opacity_out: [1, 0, { start: 0.58, end: 0.63 }],
        pinC_opacity_out: [1, 0, { start: 0.85, end: 0.9 }]
      }
    },
    {
      type: 'sticky',
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-3'),
        canvasCaption: document.querySelector('.canvas-caption'),
        canvas: document.querySelector('.image-blend-canvas'),
        context: document.querySelector('.image-blend-canvas').getContext('2d'),
        imagesPath: [
          './assets/images/blend-image-1.jpg',
          './assets/images/blend-image-2.jpg'
        ],
        images: []
      },
      values: {
        // 미리 정할 수 없는 값들이기 때문에 초기 값은 0으로 셋팅
        rect1X: [ 0, 0, { start: 0, end: 0 } ],
        rect2X: [ 0, 0, { start: 0, end: 0 } ],
        blendHeight: [ 0, 0, { start: 0, end: 0 } ],
        canvas_scale: [ 0, 0, { start: 0, end: 0 } ],
        canvasCaption_opacity: [0, 1, { start: 0, end: 0 }],
        canvasCaption_translateY: [20, 0, { start: 0, end: 0 }],
        // 박스의 애니메이션이 시작되는 지점의 Y의 위치
        rectStartY: 0
      }
    }
  ];

  // canvas image setting
  function setCanvasImages() {
    let imgElem;
    for (let i = 0; i < sceneInfo[0].values.videoImageCount; i++) {
      imgElem = document.createElement('img');
      imgElem.src = `./assets/video/001/IMG_${6726 + i}.JPG`;
      sceneInfo[0].objs.videoImages.push(imgElem);
    }

    let imgElem2;
    for (let i = 0; i < sceneInfo[2].values.videoImageCount; i++) {
      imgElem2 = document.createElement('img');
      imgElem2.src = `./assets/video/002/IMG_${7027 + i}.JPG`;
      sceneInfo[2].objs.videoImages.push(imgElem2);
    }

    let imgElem3;
    for (let i = 0; i < sceneInfo[3].objs.imagesPath.length; i++) {
      imgElem3 = document.createElement('img');
      imgElem3.src = sceneInfo[3].objs.imagesPath[i];
      sceneInfo[3].objs.images.push(imgElem3);
    }
  }

  setCanvasImages();

  function checkMenu() {
    if (yOffset > 44) {
      document.body.classList.add('local-nav-sticky');
    } else {
      document.body.classList.remove('local-nav-sticky');
    }
  }

  // Layout setting
  function setLayout() {
    // 각 스크롤 섹션의 height setting
    for (let i = 0; i < sceneInfo.length; i++) {
      if (sceneInfo[i].type === 'sticky') {
        sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
      } else if (sceneInfo[i].type === 'normal') {
        sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
      }

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

    // 원래 캔버스의 height 나누기 window.innerHeight 를 하면
    // 1080 대비 윈도우 창 높이의 비율을 계산
    const heightRatio = window.innerHeight / 1080;
    sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
    sceneInfo[2].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
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
        let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
        objs.context.drawImage(objs.videoImages[sequence], 0, 0); // canvas에 image들을 x:0, y:0 좌표로 넣어 줄 것이다.
        objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);

        if (scrollRatio <= 0.22) {
					// in
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
				}

				if (scrollRatio <= 0.42) {
					// in
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
				}

				if (scrollRatio <= 0.62) {
					// in
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
				}

				if (scrollRatio <= 0.82) {
					// in
					objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);
					objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);
					objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_out, currentYOffset)}%, 0)`;
				}
        
        break;
      case 2:
        let sequence2 = Math.round(calcValues(values.imageSequence, currentYOffset));
        objs.context.drawImage(objs.videoImages[sequence2], 0, 0); // canvas에 image들을 x:0, y:0 좌표로 넣어 줄 것이다.

        if (scrollRatio <= 0.5) {
          // in
          objs.canvas.style.opacity = calcValues(values.canvas_opacity_in, currentYOffset);
        } else {
          // out
          objs.canvas.style.opacity = calcValues(values.canvas_opacity_out, currentYOffset);
        }

        if (scrollRatio <= 0.25) {
          // in
          objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
          objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
        } else {
          // out
          objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
          objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
        }

        if (scrollRatio <= 0.57) {
          // in
          objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
          objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
          objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
        } else {
          // out
          objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
          objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
          objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
        }

        if (scrollRatio <= 0.83) {
          // in
          objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
          objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
          objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
        } else {
          // out
          objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
          objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
          objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
        }

        // 3번 currentScene으로 가기 전에 미리 canvas를 그려주기 위해 case 3 소스를 복사해서 가져왔음
        // 스크롤 값이 0.9(90% 위치)쯤 도달 했을 때 처리 해줄 것임
        if (scrollRatio > 0.9) {
          const objs = sceneInfo[3].objs;
          const values = sceneInfo[3].values;
          const widthRatio = window.innerWidth / objs.canvas.width;
          const heightRatio = window.innerHeight / objs.canvas.height;
          let canvasScaleRatio;
          
          if (widthRatio <= heightRatio) {
            canvasScaleRatio = heightRatio;
          } else {
            canvasScaleRatio = widthRatio;
          }

          objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
          objs.context.fillStyle = '#fff';
          objs.context.drawImage(objs.images[0], 0, 0);

          const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio; 
          const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;

          const whiteRectWidth = recalculatedInnerWidth * 0.15;
          values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2;
          values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
          values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth;
          values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

          objs.context.fillRect(
            parseInt(values.rect1X[0]),
            0,
            parseInt(whiteRectWidth),
            objs.canvas.height
          );
          objs.context.fillRect(
            parseInt(values.rect2X[0]),
            0,
            parseInt(whiteRectWidth),
            objs.canvas.height
          );
        }

        break;
      case 3:
        let step = 0;
        // width/height 모두 꽉 차게 하기 위해서 여기서 setting(계산 필요)
        const widthRatio = window.innerWidth / objs.canvas.width;
        const heightRatio = window.innerHeight / objs.canvas.height;
        let canvasScaleRatio;
        
        // 가로 세로 중 사이즈가 더 큰 것으로 비율을 잡음
        if (widthRatio <= heightRatio) {
          // 캔버스보다 브라우저 창이 홀쭉한 경우
          canvasScaleRatio = heightRatio;
        } else {
          // 캔버스보다 브라우저 창이 납작한 경우
          canvasScaleRatio = widthRatio;
        }

        objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
        objs.context.fillStyle = '#fff';
        objs.context.drawImage(objs.images[0], 0, 0);

        // 캔버스 사이즈에 맞춰 다시 계산된 innerWidth와 innerHeight
        // window.innerWidth는 브라우저의 스크롤 바 width 값까지 계산하기 때문에 
        // document.body.offsetWidth 로 계산 해줬음
        const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio; 
        const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;

        // 요소의 위치 값을 얻을 수 있는 함수 getBoundingClientRect를 사용하면 쉽지만, 
        // 빠르게 스크롤 값이 바뀔 때 일시적으로 값이 바뀌기 때문에 사용하지 않았다.
        if (!values.rectStartY) {
          // 알아두기) 부모 요소의 position 이 static이 아닌 값이 되면 부모 기준으로 offsetTop 값을 잡을 수 있다.
          // objs.canvas.style.transform = `scale(${canvasScaleRatio})`; 이렇게 계산 된 scale 값에 맞춰서 offsetTop 값을 다시 구해줘야 한다.
          values.rectStartY = objs.canvas.offsetTop + (objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2;
          
          values.rect1X[2].start = (window.innerHeight / 2) / scrollHeight;
					values.rect2X[2].start = (window.innerHeight / 2) / scrollHeight;
					values.rect1X[2].end = values.rectStartY / scrollHeight;
					values.rect2X[2].end = values.rectStartY / scrollHeight;
        }

        const whiteRectWidth = recalculatedInnerWidth * 0.15; // 다시 계산 된 width에 0.15배로 비율 잡아준 것임, 디자인에 따라 바꿔주면 됨
        values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2; // 원래 캔버스 width에서 다시 계산 된 width를 뺀 값에서 2로 나눠 줌
        values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
        values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth;
        values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

        // 좌우 흰색 박스 그리기
        // fillRect는 canvas에서 사각형으로 그리는 함수 (x 좌표값, y 좌표값, width, height)
				objs.context.fillRect(
					parseInt(calcValues(values.rect1X, currentYOffset)),
					0,
					parseInt(whiteRectWidth),
					objs.canvas.height
				);
				objs.context.fillRect(
					parseInt(calcValues(values.rect2X, currentYOffset)),
					0,
					parseInt(whiteRectWidth),
					objs.canvas.height
        );
        
        if (scrollRatio < values.rect1X[2].end) {
          // step 1: 캔버스 닿기 전
          step = 1;

          objs.canvas.classList.remove('sticky');
        } else {
          // step 2: 캔버스 닿은 후 이미지 블렌딩
          step = 2;

          // 이미지 블렌드
          values.blendHeight[0] = 0; // 시작 height
          values.blendHeight[1] = objs.canvas.height; // 목표 height는 첫번째 canvas height 만큼
          values.blendHeight[2].start = values.rect1X[2].end; // 이미지 블렌드의 시작점은 첫번째 canvas의 end 지점이다
          values.blendHeight[2].end = values.blendHeight[2].start + 0.2; // start 지점으로 부터 20% 동안 처리
          
          const blendHeight = calcValues(values.blendHeight, currentYOffset);

          // drawImage arguments 순서
          // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
          objs.context.drawImage(objs.images[1], 
            0, objs.canvas.height - blendHeight, objs.canvas.width, blendHeight,
            0, objs.canvas.height - blendHeight, objs.canvas.width, blendHeight
          );

          objs.canvas.classList.add('sticky');
          objs.canvas.style.top = `${-(objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2}px`;

          // 이미지 블렌드가 end 지점에 닿았을 때 
          if (scrollRatio > values.blendHeight[2].end) {
            values.canvas_scale[0] = canvasScaleRatio; // 해상도에 따라 적용됐던 scale 값을 가져 와서 초기 값으로 셋팅
            values.canvas_scale[1] = document.body.offsetWidth / (1.5 * objs.canvas.width);
            values.canvas_scale[2].start = values.blendHeight[2].end;
            values.canvas_scale[2].end = values.canvas_scale[2].start + 0.2; // start 지점으로 부터 20% 값으로 end 지점을 적용

            objs.canvas.style.transform = `scale(${calcValues(values.canvas_scale, currentYOffset)})`;
            objs.canvas.style.marginTop = 0;
          }

          // 위에서 values.canvas_scale[2].end 값을 셋팅해 준 후 0 보다 커졌을 때 동작하도록
          // scale end 지점에 도달했을 때 실행
          if (scrollRatio > values.canvas_scale[2].end && values.canvas_scale[2].end > 0) {
            objs.canvas.classList.remove('sticky');

            // values.blendHeight[2].end = values.blendHeight[2].start + 0.2;
            // values.canvas_scale[2].end = values.canvas_scale[2].start + 0.2;
            // 이렇게 위에서 총 두번의 20% 스크롤 값을 지정해줬었기 때문에 0.4(40%) 값을 준 것임
            objs.canvas.style.marginTop = `${scrollHeight * 0.4}px`; 

            values.canvasCaption_opacity[2].start = values.canvas_scale[2].end;
            values.canvasCaption_opacity[2].end = values.canvasCaption_opacity[2].start + 0.1; // start 지점으로 부터 0.1(10%)
            values.canvasCaption_translateY[2].start = values.canvasCaption_opacity[2].start;
            values.canvasCaption_translateY[2].end = values.canvasCaption_opacity[2].end;
            objs.canvasCaption.style.opacity = calcValues(values.canvasCaption_opacity, currentYOffset);
            objs.canvasCaption.style.transform = `translate3d(0, ${calcValues(values.canvasCaption_translateY, currentYOffset)}%, 0)`;
          }
        }
        
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
    checkMenu();
  });
  // window.addEventListener('DOMContentLoaded', setLayout); // DOM 만 읽어도 실행 됨
  window.addEventListener('load', () => { // 이미지까지 load 돼야 실행 됨, 우리는 이미지 크기가 컨텐츠에 영향을 미치니까 load로 사용
    setLayout();
    sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0); // 로드했을 때 첫 이미지만 로드 시켜줄 거기 때문에 videoImages[0]으로 
  }); 
  window.addEventListener('resize', setLayout);

  setLayout();
})();