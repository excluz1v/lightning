(() => {

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');//возвращает контекст рисования на холсте
    console.log(innerWidth)
    let w = canvas.width = innerWidth;// приравниваем область кэнвас ширине и высоте окна браузера
    let h = canvas.height = innerHeight;
    let canvasColor = '#232332'; // задний фон области кэнвас
    let maxlength = 5000; // максимальная длинна разряда
    let stepLength = 2;
    let maxOffset = 4; // максим разброс
    let TWO_PI = 2 * Math.PI

    let mx = 0;// хранение координат мыши
    let my = 0; // хранение координат мыши
    let toggle = 0; // перем для переключения окружностей
    let circles = [];
    let circlesCount = 3; // количество кругов

    class Circle {
        constructor(x, y) {
            this.x = x || Math.random() * w;
            this.y = y || Math.random() * h;
        }
        draw(x, y) { // отрисока окружности в определ. месте
            this.x = x || this.x;
            this.y = y || this.y;

            ctx.lineWidth = 1.5; // ширина линии контура
            ctx.fillStyle = 'write';// цвет точки
            ctx.strokeStyle = 'red'; // контур

            ctx.beginPath(); // начинает контур
            ctx.arc(this.x, this.y, 6/*radius*/, 0, TWO_PI/*градусы*/); // создание контура окружности, начальная точка задается клавией или рандомно
            ctx.closePath();
            ctx.fill(); /*залитие*/

            ctx.beginPath();
            ctx.arc(this.x, this.y, 16, 0, TWO_PI);
            ctx.closePath();
            ctx.stroke()
        }
    }

    function createLightning() {
        for (let a = 0; a < circles.length; a++) {//линия от окружности к окружности//
            for (b = a + 1; b < circles.length; b++) { // а+1 позволяет избегать повторных проверок, не будет проведена повторно линия
                let dist = getDistance(circles[a], circles[b]); // расстояние из функции get distance
                let chance = dist / maxlength;// шанс на разряд увеличивается чем меньше расстояние м/у точками
                if (chance > Math.random()) continue;
                let otherColor = chance * 255
                let stepsCount = dist / stepLength; //делим линию на отрезки
                let sx = circles[a].x; // стартовая точка
                let sy = circles[a].y;
                ctx.lineWidth = 2.5; // отрисовка линии
                ctx.strokeStyle = `rgb(0,255, ${otherColor}`;//отрисовка линии другим цветом в зависимости от расстояния
                ctx.beginPath();
                ctx.moveTo(circles[a].x, circles[a].y);

                // ctx.lineTo(circles[b].x, circles[b].y);
                for (let j = stepsCount; j > 1; j--) {  //продолжение линии пока шагов больше 1
                    let pathLenght = getDistance(circles[a], { x: sx, y: sy })
                    let offset = Math.sin(pathLenght / dist /*число от 0 до 1*/ * Math.PI)/*число от 0 до П*/ * maxOffset;  /*чем ближе к началу тем меньше смещение*/

                    sx += (circles[b].x - sx) / j /*увеличение линии*/ + Math.random() * offset * 2 - offset/*смещение*/;
                    sy += (circles[b].y - sy) / j + Math.random() * offset * 2 - offset;
                    ctx.lineTo(sx, sy)
                }
                ctx.stroke()
            }
        }
    }

    function getDistance(a, b) { // ограницение длины разряда
        return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2))
    }
    canvas.onmousemove = e => { //фун-ция обновляет координаты мыши
        mx = e.x/*определение мыши в окне просмотра*/ - canvas.getBoundingClientRect().x;
        my = e.y - canvas.getBoundingClientRect().y;
    }

    window.onkeydown = () => {
        toggle == circles.length - 1 ? toggle = 0 : toggle++
    }

    function init() { //добавление кэнвас на страницу
        canvas.style.background = canvasColor;
        document.querySelector('body').appendChild(canvas);
        for (i = 0; i < circlesCount; i++) { //добавление нескольких окружн
            circles.push(new Circle());
        }
    }
    function loop() { //отрисовка объекорв и анимаций с помощью рекурсивной функции
        ctx.clearRect(0, 0, w, h); // очистка области внутри кэнвас
        createLightning();
        requestAnimationFrame(loop); // зацикливание функции
        circles.map(i => { i == circles[toggle] ? i.draw(mx, my) : i.draw() })
    }
    loop()
    init();
})()

