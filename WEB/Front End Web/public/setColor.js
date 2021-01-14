/* 배경전환 메소드를 갖은 객체 */
var colorToggle = {
    setBackgroundColor:function (color) {
        document.querySelector('body').style.backgroundColor = color
    },
    setColor:function (color) {
        document.querySelector('body').style.color = color
    },
    setLinkColor:function (color) {
        a = document.querySelectorAll('a')
        for(i=0; i<a.length; i++) {
            a[i].style.color = color
        }
    }
}
 /* 배경전환 함수 */
function backgroundColorToggle() {
    if(document.querySelector('#btn1').value === '검은배경') {
        colorToggle.setBackgroundColor('black')
        colorToggle.setColor('white')
        colorToggle.setLinkColor('white')
        this.value = '하얀배경'
    } else if(document.querySelector('#btn1').value === '하얀배경') {
        colorToggle.setBackgroundColor('white')
        colorToggle.setColor('black')
        colorToggle.setLinkColor('black')
        this.value = '검은배경'
    }
}

/* 엘리먼트에 이벤트를 추가 */
document.getElementById("btn1").addEventListener("click", backgroundColorToggle, false)