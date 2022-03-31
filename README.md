# CloneCoding() {

_Hi, introduce the repository._

> Apple Clone Coding
> ([anko-developer](https://github.com/anko-developer))

## Table of Contents

1. [Clean Coding](#clean-coding)
1. [Repo Name](#repository-name)
1. [requestAnimationFrame](#requestAnimationFrame)

## Clean Coding

- **Important**: 아래 3가지는 반드시 지켜야 할 것들 이라고 생각한다.

  ```
  DRY 하게, (Don`t Repeat Yourself),
  계속 반복되어지는 것을 피하자.
  KISS 하게, (Keep It Simple, Stupid),
  코드는 심플하고 멍청하게.
  YAGNI 하게, (You Ain`t Gonna Need It),
  깨끗하게, 변경이 쉽게, 유지보수 용이하게 (O)
  필요하지 않는 기능, 사용하지 않는 기능, 지나치게 미래지향적 (X)
  ```

## Repository Name

- 소문자를 사용해라 (use lower case)
- 대시(-)를 사용해라 (use dashes)
- 명확하게 작성해라 (be specific)
- 일관성있게 작성해라 (be consistent)

## requestAnimationFrame
> animation에는 부드러운 감속 패턴을 사용

- requestAnimationFrame: 1초에 60프레임을 그려준다.
- cancelAnimationFrame: 계속 반복되고 있는 requestAnimationFrame를 정지 시킨다.

```javascript
const box = document.querySelector('.box');
let acc = 0.1
let delayedYOffset = 0;
let rafId;
let rafState;

window.addEventListener('scroll', () => {
  if (!rafState) {
    rafId = requestAnimationFrame(loop);
    rafState = true;
  }
});

function loop() {
  delayedYOffset = delayedYOffset + (window.pageYOffset - delayedYOffset) * acc;
  box.style.width = `${delatedYOffset}px`;
  console.log('loop');

  rafId = requestAnimationFrame(loop);

  if (Math.abs(window.pageYOffset - delayedYOffset) < 1) {
    cancelAnimationFrame(rafId);
    rafState = false;
  }
}
```

**[⬆ back to top](#table-of-contents)**

# };
